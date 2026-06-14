<?php

namespace App\Http\Controllers\Savings;

use App\Http\Controllers\Controller;
use App\Models\SavingsGoal;
use App\Models\GoalContribution;
use App\Services\ActivityLogService;
use App\Events\GoalCompleted;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class GoalContributionController extends Controller
{
    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function store(Request $request, SavingsGoal $goal): RedirectResponse
    {
        Gate::authorize('update', $goal);

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'contribution_date' => 'required|date',
            'notes' => 'nullable|string|max:300',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $contribution = $goal->contributions()->create([
            'couple_id' => $couple->id,
            'user_id' => $user->id,
            'currency_code' => $couple->currency_code,
            ...$validated,
        ]);

        // Check if goal completed
        if ($goal->status !== 'completed' && $goal->currentAmountCents() >= $goal->target_amount_cents) {
            $goal->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
            event(new GoalCompleted($goal, $couple));
        }

        $this->activityService->log(
            $couple,
            $user,
            'savings.goal.contribution.added',
            $contribution,
            ['goal_name' => $goal->name, 'amount_cents' => $contribution->amount_cents]
        );

        return back()->with('status', 'Kontribusi berhasil ditambahkan.');
    }

    public function update(Request $request, SavingsGoal $goal, GoalContribution $contribution): RedirectResponse
    {
        Gate::authorize('update', $goal);
        Gate::authorize('update', $contribution);

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'contribution_date' => 'required|date',
            'notes' => 'nullable|string|max:300',
        ]);

        $contribution->update($validated);

        // Check if goal completed
        if ($goal->status !== 'completed' && $goal->currentAmountCents() >= $goal->target_amount_cents) {
            $goal->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
            event(new GoalCompleted($goal, $request->user()->couple));
        } elseif ($goal->status === 'completed' && $goal->currentAmountCents() < $goal->target_amount_cents) {
            // Revert completed status if amount drops below target
            $goal->update([
                'status' => 'active',
                'completed_at' => null,
            ]);
        }

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.goal.contribution.updated',
            $contribution,
            ['goal_name' => $goal->name, 'amount_cents' => $contribution->amount_cents]
        );

        return back()->with('status', 'Kontribusi berhasil diperbarui.');
    }

    public function destroy(Request $request, SavingsGoal $goal, GoalContribution $contribution): RedirectResponse
    {
        Gate::authorize('update', $goal);
        Gate::authorize('delete', $contribution);

        $contribution->delete();

        // Check if goal was completed but now isn't
        if ($goal->status === 'completed' && $goal->currentAmountCents() < $goal->target_amount_cents) {
            $goal->update([
                'status' => 'active',
                'completed_at' => null,
            ]);
        }

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.goal.contribution.deleted',
            $contribution
        );

        return back()->with('status', 'Kontribusi dihapus.');
    }
}

