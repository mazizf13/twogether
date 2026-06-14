<?php

namespace App\Http\Controllers\Savings;

use App\Http\Controllers\Controller;
use App\Models\SavingsGoal;
use App\Data\GoalResource;
use App\Data\GoalContributionResource;
use App\Data\CoupleResource;
use App\Services\SavingsService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class GoalController extends Controller
{
    public function __construct(
        private SavingsService $savingsService,
        private ActivityLogService $activityService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $goals = SavingsGoal::where('couple_id', $couple->id)
            ->orderByRaw("CASE WHEN status = 'active' THEN 1 WHEN status = 'completed' THEN 2 ELSE 3 END")
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(function($g) {
                $resource = GoalResource::make($g);
                $resource['summary'] = $this->savingsService->getGoalSummary($g);
                return $resource;
            });

        return Inertia::render('Savings/Goals', [
            'goals' => $goals,
            'couple' => CoupleResource::make($couple, $user),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'target_amount_cents' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $goal = SavingsGoal::create([
            'couple_id' => $couple->id,
            'created_by_id' => $user->id,
            'currency_code' => $couple->currency_code,
            ...$validated,
        ]);

        $this->activityService->log(
            $couple,
            $user,
            'savings.goal.created',
            $goal
        );

        return back()->with('status', 'Savings goal created successfully.');
    }

    public function show(Request $request, SavingsGoal $goal): Response
    {
        Gate::authorize('view', $goal);

        $user = $request->user();
        
        $contributions = $goal->contributions()
            ->with('user')
            ->orderByDesc('contribution_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn($c) => GoalContributionResource::make($c));

        $resource = GoalResource::make($goal);
        
        return Inertia::render('Savings/GoalDetail', [
            'goal' => $resource,
            'summary' => $this->savingsService->getGoalSummary($goal),
            'contributions' => $contributions,
            'couple' => CoupleResource::make($user->couple, $user),
        ]);
    }

    public function update(Request $request, SavingsGoal $goal): RedirectResponse
    {
        Gate::authorize('update', $goal);

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'target_amount_cents' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ]);

        $currentSaved = $goal->currentAmountCents();
        if ($validated['target_amount_cents'] < $currentSaved) {
            throw ValidationException::withMessages([
                'target_amount_cents' => ['Target cannot be less than amount already saved (Rp ' . number_format($currentSaved / 100, 0, ',', '.') . ')'],
            ]);
        }

        $goal->update($validated);

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.goal.updated',
            $goal
        );

        return back()->with('status', 'Savings goal updated successfully.');
    }

    public function destroy(Request $request, SavingsGoal $goal): RedirectResponse
    {
        Gate::authorize('delete', $goal);

        $goal->update(['status' => 'archived']);

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.goal.archived',
            $goal
        );

        return redirect()->route('savings.goals.index')->with('status', 'Savings goal archived.');
    }
}
