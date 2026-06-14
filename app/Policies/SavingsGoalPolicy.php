<?php

namespace App\Policies;

use App\Models\SavingsGoal;
use App\Models\User;

class SavingsGoalPolicy
{
    public function view(User $user, SavingsGoal $goal): bool
    {
        return $user->couple_id === $goal->couple_id;
    }

    public function update(User $user, SavingsGoal $goal): bool
    {
        return $user->couple_id === $goal->couple_id;
    }

    public function delete(User $user, SavingsGoal $goal): bool
    {
        return $user->couple_id === $goal->couple_id;
    }
}
