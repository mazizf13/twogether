<?php

namespace App\Data;

use App\Models\PersonalExpense;

class PersonalExpenseResource
{
    public static function make(PersonalExpense $expense): array
    {
        return [
            'id' => $expense->id,
            'amount_cents' => $expense->amount_cents,
            'category' => $expense->category,
            'description' => $expense->description,
            'expense_date' => $expense->expense_date->format('Y-m-d'),
            'expense_date_formatted' => $expense->expense_date->translatedFormat('d M Y'),
            'is_visible_to_partner' => $expense->is_visible_to_partner,
            'user' => UserResource::make($expense->user),
            'is_mine' => auth()->id() === $expense->user_id,
        ];
    }
}
