<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SavingsGoal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'couple_id',
        'created_by_id',
        'name',
        'target_amount_cents',
        'currency_code',
        'deadline',
        'description',
        'color',
        'icon',
        'status',
        'completed_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'completed_at' => 'datetime',
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

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(GoalContribution::class);
    }

    // Helpers
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function currentAmountCents(): int
    {
        return (int) $this->contributions->sum('amount_cents');
    }

    public function progressPercentage(): int
    {
        if ($this->target_amount_cents <= 0) return 0;
        
        $percentage = ($this->currentAmountCents() / $this->target_amount_cents) * 100;
        return min(100, (int) round($percentage));
    }
}
