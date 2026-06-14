<?php

namespace App\Data;

use App\Models\User;

class UserResource
{
    public static function make(?User $user): ?array
    {
        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'display_name' => $user->display_name,
            'avatar_url' => $user->avatar_url,
            'theme' => $user->theme,
        ];
    }
}
