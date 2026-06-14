<?php

namespace App\Http\Controllers\Savings;

use App\Http\Controllers\Controller;
use App\Models\SavingsContribution;
use App\Services\SavingsService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ContributionController extends Controller
{
    public function __construct(
        private SavingsService $savingsService,
        private ActivityLogService $activityService
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'contribution_date' => 'required|date',
            'notes' => 'nullable|string|max:300',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $contribution = SavingsContribution::create([
            'couple_id' => $couple->id,
            'user_id' => $user->id,
            'currency_code' => $couple->currency_code,
            ...$validated,
        ]);

        $newMilestones = $this->savingsService->checkMilestones($couple);
        
        $this->activityService->log(
            $couple,
            $user,
            'savings.contribution.added',
            $contribution,
            ['amount_cents' => $contribution->amount_cents]
        );

        $response = back()->with('status', 'Kontribusi berhasil ditambahkan.');
        
        if (!empty($newMilestones)) {
            $response->with('milestones_reached', $newMilestones);
        }

        return $response;
    }

    public function update(Request $request, SavingsContribution $contribution): RedirectResponse
    {
        Gate::authorize('update', $contribution);

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'contribution_date' => 'required|date',
            'notes' => 'nullable|string|max:300',
        ]);

        $contribution->update($validated);

        $newMilestones = $this->savingsService->checkMilestones($request->user()->couple);

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.contribution.updated',
            $contribution,
            ['amount_cents' => $contribution->amount_cents]
        );

        $response = back()->with('status', 'Kontribusi berhasil diperbarui.');

        if (!empty($newMilestones)) {
            $response->with('milestones_reached', $newMilestones);
        }

        return $response;
    }

    public function destroy(Request $request, SavingsContribution $contribution): RedirectResponse
    {
        Gate::authorize('delete', $contribution);

        $contribution->delete();

        $this->activityService->log(
            $request->user()->couple,
            $request->user(),
            'savings.contribution.deleted',
            $contribution
        );

        return back()->with('status', 'Kontribusi dihapus.');
    }
}

