<?php

namespace App\Policies;

use App\Models\SavingsContribution;
use App\Models\User;

class SavingsContributionPolicy
{
    public function update(User $user, SavingsContribution $contribution): bool
    {
        return $user->id === $contribution->user_id;
    }

    public function delete(User $user, SavingsContribution $contribution): bool
    {
        return $user->id === $contribution->user_id;
    }
}
