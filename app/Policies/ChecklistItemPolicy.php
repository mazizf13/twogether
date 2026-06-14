<?php

namespace App\Policies;

use App\Models\ChecklistItem;
use App\Models\User;

class ChecklistItemPolicy
{
    public function view(User $user, ChecklistItem $item): bool
    {
        return $user->couple_id === $item->couple_id;
    }

    public function update(User $user, ChecklistItem $item): bool
    {
        return $user->couple_id === $item->couple_id;
    }

    public function delete(User $user, ChecklistItem $item): bool
    {
        return $user->couple_id === $item->couple_id;
    }
}
