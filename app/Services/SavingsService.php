<?php

namespace App\Services;

use App\Models\Couple;
use App\Models\User;
use App\Models\SavingsFund;
use App\Models\SavingsGoal;
use Carbon\Carbon;
use App\Events\SavingsMilestoneReached;

class SavingsService
{
    /**
     * Get summary for the main savings fund
     */
    public function getFundSummary(Couple $couple, User $viewingAs): array
    {
        $fund = $couple->savingsFund;
        
        $totalSavedCents = (int) $couple->savingsContributions()->sum('amount_cents');
        $targetCents = $fund ? $fund->target_amount_cents : null;
        
        $progressPct = 0;
        if ($targetCents > 0) {
            $progressPct = min(100, (float) round(($totalSavedCents / $targetCents) * 100, 1));
        }

        $myContributions = (int) $couple->savingsContributions()
            ->where('user_id', $viewingAs->id)
            ->sum('amount_cents');
            
        $partnerContributions = $totalSavedCents - $myContributions;

        $myContributionPct = $totalSavedCents > 0 ? round(($myContributions / $totalSavedCents) * 100, 1) : 0;
        $partnerContributionPct = $totalSavedCents > 0 ? round(($partnerContributions / $totalSavedCents) * 100, 1) : 0;

        $projectedDate = $this->getProjectedCompletionDate($couple);

        return [
            'total_saved_cents' => $totalSavedCents,
            'target_cents' => $targetCents,
            'progress_pct' => $progressPct,
            'my_contribution_cents' => $myContributions,
            'partner_contribution_cents' => $partnerContributions,
            'my_contribution_pct' => $myContributionPct,
            'partner_contribution_pct' => $partnerContributionPct,
            'projected_completion_date' => $projectedDate ? $projectedDate->translatedFormat('d M Y') : null,
            'milestones_reached' => $fund ? ($fund->milestones_reached ?? []) : [],
        ];
    }

    /**
     * Estimate when the target will be reached
     */
    public function getProjectedCompletionDate(Couple $couple): ?Carbon
    {
        $fund = $couple->savingsFund;
        if (!$fund || !$fund->target_amount_cents) return null;

        $contributions = $couple->savingsContributions()->orderBy('contribution_date')->get();
        if ($contributions->count() < 2) return null;

        $totalSaved = $contributions->sum('amount_cents');
        if ($totalSaved >= $fund->target_amount_cents) return null; // Already done

        $firstDate = $contributions->first()->contribution_date;
        $latestDate = $contributions->last()->contribution_date;
        
        $weeksSinceFirst = $firstDate->diffInWeeks(now());
        if ($weeksSinceFirst < 1) {
            $weeksSinceFirst = max(1, $firstDate->diffInDays(now()) / 7);
        }

        $avgWeeklyContribution = $totalSaved / $weeksSinceFirst;
        if ($avgWeeklyContribution <= 0) return null;

        $remaining = $fund->target_amount_cents - $totalSaved;
        $weeksRemaining = $remaining / $avgWeeklyContribution;

        return now()->addWeeks(ceil($weeksRemaining));
    }

    /**
     * Check if new milestones have been crossed
     * Returns array of newly crossed milestones e.g. [25, 50]
     */
    public function checkMilestones(Couple $couple): array
    {
        $fund = $couple->savingsFund;
        if (!$fund || !$fund->target_amount_cents) return [];

        $totalSaved = (int) $couple->savingsContributions()->sum('amount_cents');
        $progressPct = ($totalSaved / $fund->target_amount_cents) * 100;

        $milestones = [25, 50, 75, 100];
        $previouslyReached = $fund->milestones_reached ?? [];
        $newlyReached = [];

        foreach ($milestones as $milestone) {
            if ($progressPct >= $milestone && !in_array($milestone, $previouslyReached)) {
                $newlyReached[] = $milestone;
                
                event(new SavingsMilestoneReached($couple, $milestone, $totalSaved));
            }
        }

        if (!empty($newlyReached)) {
            $allReached = array_unique(array_merge($previouslyReached, $newlyReached));
            sort($allReached);
            $fund->update(['milestones_reached' => $allReached]);
        }

        return $newlyReached;
    }

    /**
     * Get summary for a specific goal
     */
    public function getGoalSummary(SavingsGoal $goal): array
    {
        $totalSaved = $goal->currentAmountCents();
        
        $myContributions = (int) $goal->contributions()
            ->where('user_id', auth()->id()) // Assuming web guard auth is available
            ->sum('amount_cents');
            
        $partnerContributions = $totalSaved - $myContributions;
        
        $isOverdue = $goal->deadline && $goal->deadline->isPast() && !$goal->isCompleted();

        return [
            'total_saved_cents' => $totalSaved,
            'target_cents' => $goal->target_amount_cents,
            'progress_pct' => $goal->progressPercentage(),
            'my_contribution_cents' => $myContributions,
            'partner_contribution_cents' => $partnerContributions,
            'is_completed' => $goal->isCompleted(),
            'overdue' => $isOverdue,
        ];
    }
}
