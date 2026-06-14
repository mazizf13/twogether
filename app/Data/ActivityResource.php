<?php

namespace App\Data;

use App\Models\ActivityLog;

class ActivityResource
{
    public static function make(ActivityLog $activity): array
    {
        return [
            'id' => $activity->id,
            'action' => $activity->action,
            'description' => self::getDescription($activity),
            'actor' => UserResource::make($activity->actor),
            'occurred_at' => $activity->occurred_at->diffForHumans(),
            'icon' => self::getIcon($activity->action),
        ];
    }

    private static function getDescription(ActivityLog $activity): string
    {
        $name = $activity->actor ? $activity->actor->display_name : 'Someone';
        
        return match ($activity->action) {
            'expense.shared.created' => "{$name} added a shared expense",
            'expense.shared.updated' => "{$name} updated a shared expense",
            'savings.contribution.added' => "{$name} added a savings contribution 💰",
            'savings.goal.created' => "{$name} created a new goal",
            'checklist.item.completed' => "{$name} completed a task ✓",
            'couple.formed' => "You're now planning together! 🎉",
            'savings.milestone.reached' => "You've hit a savings milestone! 🎉",
            'couple.invitation.sent' => "{$name} sent an invitation",
            default => "{$name} performed an action",
        };
    }

    private static function getIcon(string $action): string
    {
        return match (true) {
            str_contains($action, 'expense') => 'credit-card',
            str_contains($action, 'savings') => 'piggy-bank',
            str_contains($action, 'checklist') => 'check-circle',
            str_contains($action, 'couple') => 'heart',
            default => 'activity',
        };
    }
}
