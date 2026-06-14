<?php

namespace App\Data;

use App\Models\Settlement;

class SettlementResource
{
    public static function make(Settlement $settlement): array
    {
        return [
            'id' => $settlement->id,
            'amount_cents' => $settlement->amount_cents,
            'settlement_date' => $settlement->settlement_date->format('Y-m-d'),
            'settlement_date_formatted' => $settlement->settlement_date->translatedFormat('d M Y'),
            'payer' => UserResource::make($settlement->payer),
            'payee' => UserResource::make($settlement->payee),
            'notes' => $settlement->notes,
        ];
    }
}
