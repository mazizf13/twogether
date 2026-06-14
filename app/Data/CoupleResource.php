<?php

namespace App\Data;

use App\Models\Couple;
use App\Models\User;

class CoupleResource
{
    public static function make(Couple $couple, User $viewingUser): array
    {
        return [
            'id' => $couple->id,
            'name' => $couple->name,
            'wedding_date' => $couple->wedding_date?->format('Y-m-d'),
            'wedding_date_formatted' => $couple->wedding_date?->translatedFormat('j F Y'),
            'currency_code' => $couple->currency_code,
            'partner_a' => UserResource::make($couple->partnerA),
            'partner_b' => UserResource::make($couple->partnerB),
            'status' => $couple->status,
            'is_me_partner_a' => $viewingUser->id === $couple->partner_a_id,
        ];
    }
}
