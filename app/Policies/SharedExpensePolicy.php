<?php

namespace App\Policies;

use App\Models\SharedExpense;
use App\Models\User;

class SharedExpensePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SharedExpense $expense): bool
    {
        return $user->couple_id === $expense->couple_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SharedExpense $expense): bool
    {
        return $user->couple_id === $expense->couple_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SharedExpense $expense): bool
    {
        return $user->couple_id === $expense->couple_id;
    }
}
