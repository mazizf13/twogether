<?php

namespace App\Services;

use App\Models\Couple;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class ActivityLogService
{
    /**
     * Log a new activity.
     */
    public function log(Couple $couple, User $actor, string $action, ?Model $subject = null, array $metadata = []): void
    {
        ActivityLog::create([
            'couple_id' => $couple->id,
            'actor_id' => $actor->id,
            'action' => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject ? $subject->getKey() : null,
            'metadata' => empty($metadata) ? null : json_encode($metadata),
            'occurred_at' => now(),
        ]);
    }

    /**
     * Get recent activity for a couple.
     */
    public function getRecent(Couple $couple, int $limit = 8): Collection
    {
        return ActivityLog::with('actor')
            ->where('couple_id', $couple->id)
            ->orderByDesc('occurred_at')
            ->limit($limit)
            ->get();
    }
}
