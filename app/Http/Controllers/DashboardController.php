<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\BalanceCalculatorService;
use App\Services\SavingsService;
use App\Services\ActivityLogService;
use App\Data\CoupleResource;
use App\Data\GoalResource;
use App\Data\ActivityResource;
use App\Models\SavingsGoal;
use App\Models\ChecklistItem;
use App\Services\FinancialSummaryService;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct(
        private BalanceCalculatorService $balanceService,
        private SavingsService $savingsService,
        private ActivityLogService $activityService,
        private FinancialSummaryService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // At this point, middleware has already guaranteed a couple exists and is active.
        $couple = $user->couple;
        
        // 1. Couple Resource
        $coupleData = CoupleResource::make($couple, $user);

        // 2. Countdown data
        $countdown = [
            'days' => null,
            'date' => null,
            'message' => 'Set your wedding date',
        ];
        
        if ($couple->wedding_date) {
            $days = Carbon::now()->startOfDay()->diffInDays($couple->wedding_date->startOfDay(), false);
            
            $countdown['date'] = $couple->wedding_date->translatedFormat('l, j F Y');
            $countdown['days'] = $days;
            
            if ($days > 0) {
                $countdown['message'] = "Days to go!";
            } elseif ($days === 0) {
                $countdown['message'] = "Today is the day! 💍";
            } else {
                $countdown['message'] = "You're married! Congratulations 🎉";
            }
        }

        // 3. Balance Summary
        $balanceData = $this->balanceService->getBalanceSummary($couple, $user);

        // 4. Savings Summary
        $savingsSummary = $this->savingsService->getFundSummary($couple, $user);

        // 5. Top Goals (up to 3)
        $topGoalsData = [];
        if (class_exists(SavingsGoal::class)) {
            $goals = SavingsGoal::with('contributions')
                ->where('couple_id', $couple->id)
                ->where('status', 'active')
                ->get()
                ->sortByDesc(function ($goal) {
                    return $goal->target_amount_cents > 0 
                        ? ($goal->currentAmountCents() / $goal->target_amount_cents)
                        : 0;
                })
                ->take(3)
                ->values();
            
            $topGoalsData = $goals->map(fn($g) => GoalResource::make($g))->toArray();
        }

        // 6. Recent Activity
        $recentActivity = $this->activityService->getRecent($couple, 8)
            ->map(fn($a) => ActivityResource::make($a))
            ->toArray();

        // 7. Checklist Summary
        $checklistSummary = [
            'total' => 0,
            'completed' => 0,
            'overdue' => 0,
            'pct' => 0,
        ];
        
        if (class_exists(ChecklistItem::class)) {
            $items = ChecklistItem::where('couple_id', $couple->id)->get();
            $total = $items->count();
            
            if ($total > 0) {
                $completed = $items->where('status', 'done')->count();
                $overdue = $items->where('status', 'todo')
                                 ->filter(fn($i) => $i->due_date && $i->due_date->isPast())
                                 ->count();
                
                $checklistSummary = [
                    'total' => $total,
                    'completed' => $completed,
                    'overdue' => $overdue,
                    'pct' => round(($completed / $total) * 100, 1),
                ];
            }
        }

        $thisMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();
        $thisMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $thisMonth);
        $lastMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $lastMonth);

        $vsLastMonthPct = 0;
        if ($lastMonthSummary['total_income_cents'] > 0) {
            $diff = $thisMonthSummary['total_income_cents'] - $lastMonthSummary['total_income_cents'];
            $vsLastMonthPct = round(($diff / $lastMonthSummary['total_income_cents']) * 100, 1);
        } elseif ($thisMonthSummary['total_income_cents'] > 0) {
            $vsLastMonthPct = 100;
        }

        // 8. Active Shared Expense Groups
        $activeSharedGroups = [];
        if (class_exists(\App\Models\SharedExpenseGroup::class)) {
            $groups = \App\Models\SharedExpenseGroup::withSum('sharedExpenses', 'amount_cents')
                ->where('couple_id', $couple->id)
                ->where('status', 'active')
                ->orderByDesc('created_at')
                ->get();
            $activeSharedGroups = $groups->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
                'icon' => $g->icon,
                'color' => $g->color,
                'status' => $g->status,
                'description' => $g->description,
                'total_amount_cents' => (int) $g->shared_expenses_sum_amount_cents,
            ])->toArray();
        }

        return Inertia::render('Dashboard', [
            'couple' => $coupleData,
            'countdown' => $countdown,
            'active_shared_groups' => $activeSharedGroups,
            'balance' => $balanceData,
            'savings_summary' => $savingsSummary,
            'top_goals' => $topGoalsData,
            'recent_activity' => $recentActivity,
            'checklist_summary' => $checklistSummary,
            'financial_summary' => [
                'total_income_this_month_cents' => $thisMonthSummary['total_income_cents'],
                'total_expenses_this_month_cents' => $thisMonthSummary['total_expenses_cents'],
                'shared_share_this_month_cents' => $thisMonthSummary['shared_share_cents'],
                'net_cashflow_cents' => $thisMonthSummary['net_cashflow_cents'],
                'savings_rate_pct' => $thisMonthSummary['savings_rate_pct'],
                'vs_last_month_pct' => $vsLastMonthPct,
            ],
        ]);
    }
}
