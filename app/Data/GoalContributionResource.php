<?php

namespace App\Data;

use App\Models\GoalContribution;

class GoalContributionResource
{
    public static function make(GoalContribution $contribution): array
    {
        return [
            'id' => $contribution->id,
            'amount_cents' => $contribution->amount_cents,
            'contribution_date' => $contribution->contribution_date->format('Y-m-d'),
            'contribution_date_formatted' => $contribution->contribution_date->translatedFormat('d M Y'),
            'notes' => $contribution->notes,
            'user' => UserResource::make($contribution->user),
            'is_mine' => auth()->id() === $contribution->user_id,
        ];
    }
}
