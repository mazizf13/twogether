<?php

namespace App\Services;

use App\Models\Couple;
use App\Models\User;
use App\Models\SharedExpense;
use Illuminate\Support\Facades\DB;

class BalanceCalculatorService
{
    /**
     * Calculates the balance summary between partners.
     * Positive net_cents = viewing user is owed money
     * Negative net_cents = viewing user owes money
     */
    public function getBalanceSummary(Couple $couple, User $viewingAs): array
    {
        $partnerA = $couple->partnerA;
        $partnerB = $couple->partnerB;

        // If no partner B yet, no balance possible
        if (!$partnerB) {
            return [
                'net_cents' => 0,
                'owed_by_name' => null,
                'owed_to_name' => null,
                'is_settled' => true,
                'partner_a_paid' => 0,
                'partner_b_paid' => 0,
                'partner_a_share' => 0,
                'partner_b_share' => 0,
            ];
        }

        $netCents = 0;
        
        $lastSettledAt = DB::table('settlements')
            ->where('couple_id', $couple->id)
            ->latest('settlement_date')
            ->value('settlement_date');

        $query = SharedExpense::where('couple_id', $couple->id)
            ->whereNull('settled_by_settlement_id');
        
        $expenses = $query->get();
        
        $totalPaidByA = 0;
        $totalOwedByA = 0;
        $totalPaidByB = 0;
        $totalOwedByB = 0;

        foreach ($expenses as $expense) {
            if ($expense->paid_by_id === $partnerA->id) {
                $totalPaidByA += $expense->amount_cents;
            } else {
                $totalPaidByB += $expense->amount_cents;
            }
            
            // Calculate exact share based on percentage
            $splitA = (int) round($expense->amount_cents * ($expense->partner_a_split_pct / 100));
            $splitB = (int) round($expense->amount_cents * ($expense->partner_b_split_pct / 100));
            
            // Handle rounding difference by assigning remainder to the one with larger split, or evenly.
            $diff = $expense->amount_cents - ($splitA + $splitB);
            if ($diff !== 0) {
                if ($expense->partner_a_split_pct >= $expense->partner_b_split_pct) {
                    $splitA += $diff;
                } else {
                    $splitB += $diff;
                }
            }
            
            $totalOwedByA += $splitA;
            $totalOwedByB += $splitB;
        }
        
        // Net for A = Paid by A - Owed by A
        $netA = $totalPaidByA - $totalOwedByA;
        // Net for B = Paid by B - Owed by B
        $netB = $totalPaidByB - $totalOwedByB;
        
        if ($viewingAs->id === $partnerA->id) {
            $netCents = $netA;
        } else {
            $netCents = $netB;
        }

        $isSettled = $netCents === 0;
        
        $owedByName = null;
        $owedToName = null;

        $otherPartner = $viewingAs->id === $partnerA->id ? $partnerB : $partnerA;

        if ($netCents > 0) {
            $owedByName = $otherPartner->display_name;
            $owedToName = 'You';
        } elseif ($netCents < 0) {
            $owedByName = 'You';
            $owedToName = $otherPartner->display_name;
        }

        return [
            'net_cents' => $netCents,
            'owed_by_name' => $owedByName,
            'owed_to_name' => $owedToName,
            'is_settled' => $isSettled,
            'partner_a_paid' => $totalPaidByA,
            'partner_b_paid' => $totalPaidByB,
            'partner_a_share' => $totalOwedByA,
            'partner_b_share' => $totalOwedByB,
        ];
    }
}
