<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavingsFund extends Model
{
    use HasFactory;

    protected $fillable = [
        'couple_id',
        'target_amount_cents',
        'currency_code',
        'milestones_reached',
    ];

    protected function casts(): array
    {
        return [
            'milestones_reached' => 'array',
        ];
    }

    public function couple(): BelongsTo
    {
        return $this->belongsTo(Couple::class);
    }
}
