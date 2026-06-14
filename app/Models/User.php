<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'display_name',
        'email',
        'password',
        'avatar_url',
        'couple_id',
        'notification_preferences',
        'theme',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_preferences' => 'array',
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
    public function couple(): BelongsTo
    {
        return $this->belongsTo(Couple::class);
    }

    public function personalExpenses(): HasMany
    {
        return $this->hasMany(PersonalExpense::class);
    }

    public function sharedExpensesLogged(): HasMany
    {
        return $this->hasMany(SharedExpense::class, 'logged_by_id');
    }

    public function sharedExpensesPaid(): HasMany
    {
        return $this->hasMany(SharedExpense::class, 'paid_by_id');
    }

    public function savingsContributions(): HasMany
    {
        return $this->hasMany(SavingsContribution::class);
    }

    public function goalContributions(): HasMany
    {
        return $this->hasMany(GoalContribution::class);
    }

    public function savingsGoals(): HasMany
    {
        return $this->hasMany(SavingsGoal::class, 'created_by_id');
    }

    public function personalIncomes(): HasMany
    {
        return $this->hasMany(PersonalIncome::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // Helpers
    public function isInCouple(): bool
    {
        return !is_null($this->couple_id);
    }

    public function isPartnerOf(User $user): bool
    {
        return $this->isInCouple() && $user->isInCouple() && $this->couple_id === $user->couple_id;
    }

    public function getCouplePartner(): ?User
    {
        if (!$this->isInCouple() || !$this->couple) {
            return null;
        }

        return $this->couple->getOtherPartner($this);
    }
}
