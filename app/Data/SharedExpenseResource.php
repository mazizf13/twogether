<?php

namespace App\Data;

use App\Models\SharedExpense;

class SharedExpenseResource
{
    public static function make(SharedExpense $expense): array
    {
        return [
            'id' => $expense->id,
            'shared_expense_group_id' => $expense->shared_expense_group_id,
            'amount_cents' => $expense->amount_cents,
            'category' => $expense->category,
            'description' => $expense->description,
            'expense_date' => $expense->expense_date->format('Y-m-d'),
            'expense_date_formatted' => $expense->expense_date->translatedFormat('d M Y'),
            'paid_by_id' => $expense->paid_by_id,
            'paid_by' => UserResource::make($expense->paidBy),
            'partner_a_split_pct' => (float) $expense->partner_a_split_pct,
            'partner_b_split_pct' => (float) $expense->partner_b_split_pct,
            'is_settled' => $expense->settled_by_settlement_id !== null,
        ];
    }
}
