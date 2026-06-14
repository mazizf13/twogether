<?php

namespace App\Http\Controllers\Savings;

use App\Http\Controllers\Controller;
use App\Models\SavingsFund;
use App\Data\SavingsFundResource;
use App\Data\ContributionResource;
use App\Data\GoalResource;
use App\Data\CoupleResource;
use App\Services\SavingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SavingsFundController extends Controller
{
    public function __construct(
        private SavingsService $savingsService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;
        
        $fund = $couple->savingsFund;
        $summary = $this->savingsService->getFundSummary($couple, $user);
        
        $contributions = $couple->savingsContributions()
            ->with('user')
            ->latest('contribution_date')
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn($c) => ContributionResource::make($c));

        $goals = $couple->savingsGoals()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->map(function($g) {
                $resource = GoalResource::make($g);
                $resource['summary'] = $this->savingsService->getGoalSummary($g);
                return $resource;
            });

        return Inertia::render('Savings/Overview', [
            'fund' => SavingsFundResource::make($fund),
            'summary' => $summary,
            'contributions' => $contributions,
            'goals' => $goals,
            'couple' => CoupleResource::make($couple, $user),
            'milestones_reached' => session('milestones_reached', []),
        ]);
    }

    public function updateTarget(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'target_amount_cents' => 'required|integer|min:1',
        ]);

        $couple = $request->user()->couple;
        
        $fund = $couple->savingsFund;
        if ($fund) {
            $fund->update($validated);
        } else {
            SavingsFund::create([
                'couple_id' => $couple->id,
                'target_amount_cents' => $validated['target_amount_cents'],
                'currency_code' => $couple->currency_code,
            ]);
        }

        return back()->with('status', 'Savings target updated successfully.');
    }
}
