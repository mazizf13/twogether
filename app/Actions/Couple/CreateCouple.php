<?php

namespace App\Actions\Couple;

use App\Models\Couple;
use App\Models\CoupleInvitation;
use App\Models\User;
use App\Models\ActivityLog;
use App\Jobs\SendInvitationEmail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateCouple
{
    public function execute(User $inviter, string $invitedEmail): array
    {
        // 1. Validate inviter has no active couple
        if ($inviter->couple_id && $inviter->couple?->isActive()) {
            throw ValidationException::withMessages([
                'email' => ['You are already part of an active couple space.'],
            ]);
        }

        // 2. Validate inviter not inviting themselves
        if (strtolower($inviter->email) === strtolower($invitedEmail)) {
            throw ValidationException::withMessages([
                'email' => ['You cannot invite yourself.'],
            ]);
        }

        // 3. Create Couple record (status: 'pending', partner_a_id: $inviter->id)
        $couple = Couple::create([
            'partner_a_id' => $inviter->id,
            'status' => 'pending',
            'currency_code' => 'IDR',
        ]);

        // 4. Update $inviter->couple_id
        $inviter->update(['couple_id' => $couple->id]);

        // 5. Create CoupleInvitation
        $invitation = CoupleInvitation::create([
            'couple_id' => $couple->id,
            'inviter_id' => $inviter->id,
            'invited_email' => $invitedEmail,
            'token' => Str::random(64),
            'expires_at' => now()->addHours(72),
            'status' => 'pending',
        ]);

        // 6. Dispatch SendInvitationEmail job
        dispatch(new SendInvitationEmail($invitation, $inviter));

        // 7. Log activity
        ActivityLog::create([
            'couple_id' => $couple->id,
            'actor_id' => $inviter->id,
            'action' => 'couple.invitation.sent',
            'occurred_at' => now(),
        ]);

        return [$couple, $invitation];
    }
}
