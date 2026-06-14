<?php

namespace App\Services;

use App\Models\User;
use App\Models\Couple;
use App\Models\PersonalIncome;
use App\Models\PersonalExpense;
use App\Models\SharedExpense;
use App\Enums\IncomeSource;
use Carbon\Carbon;

class FinancialSummaryService
{
    /**
     * Get income vs expense summary for a user for a given month.
     */
    public function getMonthlySummary(User $user, Couple $couple, Carbon $month): array
    {
        $startOfMonth = $month->copy()->startOfMonth();
        $endOfMonth   = $month->copy()->endOfMonth();

        $totalIncome = PersonalIncome::where('user_id', $user->id)
            ->whereBetween('income_date', [$startOfMonth, $endOfMonth])
            ->whereNull('deleted_at')
            ->sum('amount_cents');

        $totalExpenses = PersonalExpense::where('user_id', $user->id)
            ->whereBetween('expense_date', [$startOfMonth, $endOfMonth])
            ->whereNull('deleted_at')
            ->sum('amount_cents');

        $sharedExpenses = SharedExpense::where('couple_id', $couple->id)
            ->whereBetween('expense_date', [$startOfMonth, $endOfMonth])
            ->whereNull('deleted_at')
            ->get();

        // Calculate this user's share of shared expenses
        $isPartnerA = $user->id === $couple->partner_a_id;
        $sharedShare = $sharedExpenses->sum(function ($e) use ($isPartnerA) {
            $pct = $isPartnerA ? $e->partner_a_split_pct : $e->partner_b_split_pct;
            return (int) round($e->amount_cents * ($pct / 100));
        });

        $netCashflow = $totalIncome - $totalExpenses - $sharedShare;

        return [
            'month'                 => $month->format('Y-m'),
            'month_label'           => $month->translatedFormat('F Y'),
            'total_income_cents'    => (int) $totalIncome,
            'total_expenses_cents'  => (int) $totalExpenses,
            'shared_share_cents'    => (int) $sharedShare,
            'total_outflow_cents'   => (int) ($totalExpenses + $sharedShare),
            'net_cashflow_cents'    => (int) $netCashflow,
            'savings_rate_pct'      => $totalIncome > 0
                ? round((max(0, $netCashflow) / $totalIncome) * 100, 1)
                : 0,
        ];
    }

    /**
     * Get monthly summary for the last N months (for trend charts).
     */
    public function getMonthlyTrend(User $user, Couple $couple, int $months = 6): array
    {
        $result = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $result[] = $this->getMonthlySummary($user, $couple, $month);
        }
        return $result;
    }

    /**
     * Get income breakdown by source for a given month.
     */
    public function getIncomeBySource(User $user, Carbon $month): array
    {
        return PersonalIncome::where('user_id', $user->id)
            ->whereBetween('income_date', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth()
            ])
            ->whereNull('deleted_at')
            ->get()
            ->groupBy('source')
            ->map(function ($items, $source) {
                return [
                    'source'       => $source,
                    'source_label' => IncomeSource::SOURCES[$source] ?? $source,
                    'total_cents'  => $items->sum('amount_cents'),
                    'count'        => $items->count(),
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get expense breakdown by category for a given month.
     */
    public function getExpenseByCategory(User $user, Couple $couple, Carbon $month): array
    {
        $personal = PersonalExpense::where('user_id', $user->id)
            ->whereBetween('expense_date', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth()
            ])
            ->whereNull('deleted_at')
            ->get()
            ->groupBy('category')
            ->map(function ($items, $cat) {
                return [
                    'category'     => $cat,
                    'type'         => 'personal',
                    'total_cents'  => $items->sum('amount_cents'),
                    'count'        => $items->count(),
                ];
            });

        $shared = SharedExpense::where('couple_id', $couple->id)
            ->whereBetween('expense_date', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth()
            ])
            ->whereNull('deleted_at')
            ->get()
            ->groupBy('category')
            ->map(function ($items, $cat) {
                return [
                    'category'     => $cat,
                    'type'         => 'shared',
                    'total_cents'  => $items->sum('amount_cents'),
                    'count'        => $items->count(),
                ];
            });

        return $personal->toBase()->merge($shared->toBase())->values()->toArray();
    }

    /**
     * Get recurring incomes for a user.
     */
    public function getRecurringIncomes(User $user): array
    {
        return PersonalIncome::where('user_id', $user->id)
            ->where('is_recurring', true)
            ->whereNull('deleted_at')
            ->orderBy('amount_cents', 'desc')
            ->get()
            ->toArray();
    }
}
