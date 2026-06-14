<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PersonalIncome extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'couple_id',
        'user_id',
        'amount_cents',
        'currency_code',
        'source',
        'description',
        'income_date',
        'is_recurring',
        'recurring_frequency',
        'is_visible_to_partner',
    ];

    protected $casts = [
        'income_date' => 'date',
        'is_recurring' => 'boolean',
        'is_visible_to_partner' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function couple(): BelongsTo
    {
        return $this->belongsTo(Couple::class);
    }

    public function isVisibleTo(User $user): bool
    {
        if ($this->user_id === $user->id) {
            return true;
        }

        if ($this->couple_id === $user->couple_id && $this->is_visible_to_partner) {
            return true;
        }

        return false;
    }
}
