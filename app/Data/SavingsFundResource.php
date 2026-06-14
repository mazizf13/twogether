<?php

namespace App\Data;

use App\Models\SavingsFund;

class SavingsFundResource
{
    public static function make(?SavingsFund $fund): ?array
    {
        if (!$fund) return null;
        
        return [
            'id' => $fund->id,
            'target_amount_cents' => $fund->target_amount_cents,
            'milestones_reached' => $fund->milestones_reached ?? [],
        ];
    }
}
