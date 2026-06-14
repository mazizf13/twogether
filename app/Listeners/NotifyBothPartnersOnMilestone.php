<?php

namespace App\Listeners;

use App\Events\SavingsMilestoneReached;
use App\Services\ActivityLogService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyBothPartnersOnMilestone implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function handle(SavingsMilestoneReached $event): void
    {
        // Log activity (system generated, so actor is null)
        $this->activityService->log(
            $event->couple,
            null,
            'savings.milestone.reached',
            null,
            [
                'milestone_pct' => $event->milestone,
                'total_saved_cents' => $event->totalSavedCents,
            ]
        );

        // TODO: In a full app, send push notifications / email to both partners
        // e.g. Notification::send([$event->couple->partnerA, $event->couple->partnerB], new MilestoneReachedNotification(...));
    }
}
