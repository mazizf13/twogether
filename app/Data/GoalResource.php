<?php

namespace App\Data;

use App\Models\SavingsGoal;

class GoalResource
{
    public static function make(SavingsGoal $goal): array
    {
        return [
            'id' => $goal->id,
            'name' => $goal->name,
            'target_amount_cents' => $goal->target_amount_cents,
            'deadline' => $goal->deadline ? $goal->deadline->format('Y-m-d') : null,
            'deadline_formatted' => $goal->deadline ? $goal->deadline->translatedFormat('d M Y') : null,
            'description' => $goal->description,
            'color' => $goal->color,
            'icon' => $goal->icon,
            'status' => $goal->status,
            'completed_at' => $goal->completed_at ? $goal->completed_at->format('Y-m-d H:i:s') : null,
            'current_amount_cents' => $goal->currentAmountCents(),
            'progress_pct' => $goal->progressPercentage(),
            'created_by' => UserResource::make($goal->createdBy),
        ];
    }
}
