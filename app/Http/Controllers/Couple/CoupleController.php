<?php

namespace App\Http\Controllers\Couple;

use App\Http\Controllers\Controller;
use App\Actions\Couple\CreateCouple;
use App\Actions\Couple\LeaveCouple;
use App\Models\CoupleInvitation;
use App\Models\SavingsFund;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class CoupleController extends Controller
{
    /**
     * Show the onboarding flow.
     */
    public function onboarding(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // If user already has an active couple, redirect to dashboard
        if ($user->couple_id && $user->couple?->isActive()) {
            return redirect()->route('dashboard');
        }

        $pendingInvitation = null;
        if ($user->couple_id && $user->couple?->status === 'pending') {
            $pendingInvitation = CoupleInvitation::where('couple_id', $user->couple_id)
                ->where('status', 'pending')
                ->latest()
                ->first();
        }

        return Inertia::render('Couple/Onboarding', [
            'hasCouple' => (bool)$user->couple_id,
            'coupleStatus' => $user->couple?->status,
            'pendingInvitation' => $pendingInvitation,
            'userEmail' => $user->email,
        ]);
    }

    /**
     * Create a new couple space and send an invitation.
     */
    public function create(Request $request, CreateCouple $action): RedirectResponse
    {
        $request->validate([
            'invited_email' => 'required|email|max:255',
        ]);

        $action->execute($request->user(), $request->invited_email);

        return redirect()->route('onboarding')->with('status', 'Invitation sent successfully!');
    }

    /**
     * Resend an invitation.
     */
    public function invite(Request $request, CreateCouple $action): RedirectResponse
    {
        $request->validate([
            'invited_email' => 'required|email|max:255',
        ]);

        $user = $request->user();
        
        // Invalidate old pending invitations
        if ($user->couple_id) {
            CoupleInvitation::where('couple_id', $user->couple_id)
                ->where('status', 'pending')
                ->update(['status' => 'expired']);
        }

        $action->execute($user, $request->invited_email);

        return redirect()->route('onboarding')->with('status', 'Invitation resent successfully!');
    }

    /**
     * Leave the current couple space.
     */
    public function leave(Request $request, LeaveCouple $action): RedirectResponse
    {
        $action->execute($request->user());

        return redirect()->route('onboarding')->with('status', 'You have left the couple space. Your personal data remains private.');
    }

    /**
     * Complete the onboarding process.
     */
    public function completeOnboarding(Request $request): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        if (!$couple || !$couple->isActive()) {
            throw ValidationException::withMessages([
                'couple' => ['You must have an active couple space to complete onboarding.'],
            ]);
        }

        $validated = $request->validate([
            'couple_name' => 'nullable|string|max:200',
            'wedding_date' => 'nullable|date|after:today',
            'currency_code' => 'nullable|string|in:IDR,USD,EUR,SGD,MYR',
            'budget_cents' => 'nullable|integer|min:1',
        ]);

        $couple->update([
            'name' => $validated['couple_name'] ?? $couple->name,
            'wedding_date' => $validated['wedding_date'] ?? null,
            'currency_code' => $validated['currency_code'] ?? 'IDR',
        ]);

        if (!empty($validated['budget_cents'])) {
            SavingsFund::updateOrCreate(
                ['couple_id' => $couple->id],
                ['target_amount_cents' => $validated['budget_cents']]
            );
        }

        return redirect()->route('dashboard')->with('status', 'Welcome to Twogether!');
    }
}
