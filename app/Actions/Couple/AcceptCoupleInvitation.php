<?php

namespace App\Actions\Couple;

use App\Models\Couple;
use App\Models\CoupleInvitation;
use App\Models\User;
use App\Models\ActivityLog;
use App\Events\CoupleFormed;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AcceptCoupleInvitation
{
    public function execute(User $invitee, CoupleInvitation $invitation): Couple
    {
        // 1. Validate invitation is pending and not expired
        if ($invitation->status !== 'pending' || $invitation->isExpired()) {
            throw ValidationException::withMessages([
                'invitation' => ['This invitation is no longer valid or has expired.'],
            ]);
        }

        // 2. Validate invitee has no active couple
        if ($invitee->couple_id && $invitee->couple?->isActive()) {
            throw ValidationException::withMessages([
                'invitation' => ['You are already part of an active couple space.'],
            ]);
        }

        $couple = $invitation->couple;

        // 3. Validate invitee is not the inviter
        if ($couple->partner_a_id === $invitee->id) {
            throw ValidationException::withMessages([
                'invitation' => ['You cannot accept your own invitation.'],
            ]);
        }

        // 4. DB transaction
        DB::transaction(function () use ($invitee, $invitation, $couple) {
            // Update couple
            $couple->update([
                'partner_b_id' => $invitee->id,
                'status' => 'active',
            ]);

            // Update invitee
            $invitee->update(['couple_id' => $couple->id]);

            // Update invitation
            $invitation->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            // Log activity
            ActivityLog::create([
                'couple_id' => $couple->id,
                'actor_id' => $invitee->id,
                'action' => 'couple.formed',
                'occurred_at' => now(),
            ]);
        });

        // 5. Dispatch SeedChecklistOnCoupleFormed event
        event(new CoupleFormed($couple));

        return $couple->fresh();
    }
}
