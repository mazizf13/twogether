<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PersonalExpense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'couple_id',
        'user_id',
        'amount_cents',
        'currency_code',
        'category',
        'description',
        'expense_date',
        'is_visible_to_partner',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'date',
            'is_visible_to_partner' => 'boolean',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
