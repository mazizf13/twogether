<?php

namespace App\Actions\Couple;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LeaveCouple
{
    public function execute(User $user): void
    {
        $couple = $user->couple;

        if (!$couple) {
            return; // No couple to leave
        }

        // 2. DB transaction
        DB::transaction(function () use ($user, $couple) {
            // Update couple
            $couple->update([
                'status' => 'dissolved',
                'dissolved_at' => now(),
            ]);

            $partnerB = $couple->partnerB;
            $partnerA = $couple->partnerA;

            // Set user->couple_id = null
            $user->update(['couple_id' => null]);

            // Set partner->couple_id = null (if partner exists and is not the user)
            if ($partnerA && $partnerA->id !== $user->id) {
                $partnerA->update(['couple_id' => null]);
            }
            if ($partnerB && $partnerB->id !== $user->id) {
                $partnerB->update(['couple_id' => null]);
            }

            // Log activity
            ActivityLog::create([
                'couple_id' => $couple->id,
                'actor_id' => $user->id,
                'action' => 'couple.dissolved',
                'occurred_at' => now(),
            ]);
        });
    }
}
