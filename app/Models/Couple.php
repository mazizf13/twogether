<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Couple extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'name',
        'partner_a_id',
        'partner_b_id',
        'wedding_date',
        'currency_code',
        'status',
        'dissolved_at',
        'avatar_url',
    ];

    protected function casts(): array
    {
        return [
            'wedding_date' => 'date',
            'dissolved_at' => 'datetime',
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

    // Relationships
    public function partnerA(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_a_id');
    }

    public function partnerB(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_b_id');
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(CoupleInvitation::class);
    }

    public function personalExpenses(): HasMany
    {
        return $this->hasMany(PersonalExpense::class);
    }

    public function sharedExpenses(): HasMany
    {
        return $this->hasMany(SharedExpense::class);
    }

    public function savingsFund(): HasOne
    {
        return $this->hasOne(SavingsFund::class);
    }

    public function savingsContributions(): HasMany
    {
        return $this->hasMany(SavingsContribution::class);
    }

    public function savingsGoals(): HasMany
    {
        return $this->hasMany(SavingsGoal::class);
    }

    public function personalIncomes(): HasMany
    {
        return $this->hasMany(PersonalIncome::class);
    }

    public function checklistItems(): HasMany
    {
        return $this->hasMany(ChecklistItem::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(Settlement::class);
    }

    // Helpers
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function hasBothPartners(): bool
    {
        return !is_null($this->partner_a_id) && !is_null($this->partner_b_id);
    }

    public function getOtherPartner(User $user): ?User
    {
        if ($this->partner_a_id === $user->id) {
            return $this->partnerB;
        }

        if ($this->partner_b_id === $user->id) {
            return $this->partnerA;
        }

        return null;
    }

    public function daysUntilWedding(): ?int
    {
        if (!$this->wedding_date) {
            return null;
        }

        $now = \Carbon\Carbon::now()->startOfDay();
        $wedding = \Carbon\Carbon::parse($this->wedding_date)->startOfDay();

        return $now->diffInDays($wedding, false) > 0 ? (int) $now->diffInDays($wedding, false) : 0;
    }
}
