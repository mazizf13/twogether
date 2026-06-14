<?php

namespace App\Events;

use App\Models\Couple;
use App\Models\SavingsGoal;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GoalCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public SavingsGoal $goal,
        public Couple $couple
    ) {}
}
