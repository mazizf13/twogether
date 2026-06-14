<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Settlement extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'uuid',
        'couple_id',
        'initiated_by_id',
        'amount_cents',
        'currency_code',
        'payer_id',
        'payee_id',
        'settlement_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'settlement_date' => 'date',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function couple(): BelongsTo
    {
        return $this->belongsTo(Couple::class);
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by_id');
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payer_id');
    }

    public function payee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payee_id');
    }

    public function settledExpenses(): HasMany
    {
        return $this->hasMany(SharedExpense::class, 'settled_by_settlement_id');
    }
}
