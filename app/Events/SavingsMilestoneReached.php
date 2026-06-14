<?php

namespace App\Events;

use App\Models\Couple;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SavingsMilestoneReached
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Couple $couple,
        public int $milestone,
        public int $totalSavedCents
    ) {}
}
