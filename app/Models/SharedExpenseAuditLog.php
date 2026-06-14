<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedExpenseAuditLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'shared_expense_id',
        'changed_by_id',
        'action',
        'previous_data',
        'new_data',
        'changed_at',
    ];

    protected function casts(): array
    {
        return [
            'previous_data' => 'array',
            'new_data' => 'array',
            'changed_at' => 'datetime',
        ];
    }

    public function sharedExpense(): BelongsTo
    {
        return $this->belongsTo(SharedExpense::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_id');
    }
}
