<?php

namespace App\Policies;

use App\Models\GoalContribution;
use App\Models\User;

class GoalContributionPolicy
{
    public function update(User $user, GoalContribution $contribution): bool
    {
        return $user->id === $contribution->user_id;
    }

    public function delete(User $user, GoalContribution $contribution): bool
    {
        return $user->id === $contribution->user_id;
    }
}
