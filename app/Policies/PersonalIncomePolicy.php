<?php

namespace App\Policies;

use App\Models\PersonalIncome;
use App\Models\User;

class PersonalIncomePolicy
{
    public function view(User $user, PersonalIncome $income): bool
    {
        if ($user->id === $income->user_id) {
            return true;
        }

        if ($user->couple_id === $income->couple_id && $income->is_visible_to_partner) {
            return true;
        }

        return false;
    }

    public function update(User $user, PersonalIncome $income): bool
    {
        return $user->id === $income->user_id;
    }

    public function delete(User $user, PersonalIncome $income): bool
    {
        return $user->id === $income->user_id;
    }
}
