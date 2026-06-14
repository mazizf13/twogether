<?php

namespace App\Policies;

use App\Models\PersonalExpense;
use App\Models\User;

class PersonalExpensePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PersonalExpense $expense): bool
    {
        if ($user->id === $expense->user_id) {
            return true;
        }

        if ($user->couple_id === $expense->couple_id && $expense->is_visible_to_partner) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PersonalExpense $expense): bool
    {
        return $user->id === $expense->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PersonalExpense $expense): bool
    {
        return $user->id === $expense->user_id;
    }
}
