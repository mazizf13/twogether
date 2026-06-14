<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class SharedExpense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'couple_id',
        'shared_expense_group_id',
        'logged_by_id',
        'paid_by_id',
        'amount_cents',
        'currency_code',
        'category',
        'description',
        'expense_date',
        'partner_a_split_pct',
        'partner_b_split_pct',
        'settled_by_settlement_id',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'date',
            'partner_a_split_pct' => 'decimal:2',
            'partner_b_split_pct' => 'decimal:2',
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

    public function loggedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'logged_by_id');
    }

    public function paidBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by_id');
    }

    public function settlement(): BelongsTo
    {
        return $this->belongsTo(Settlement::class, 'settled_by_settlement_id');
    }

    public function sharedExpenseGroup(): BelongsTo
    {
        return $this->belongsTo(SharedExpenseGroup::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(SharedExpenseAuditLog::class);
    }
}
