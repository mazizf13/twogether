<?php

namespace App\Events;

use App\Models\Couple;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CoupleFormed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Couple $couple;

    /**
     * Create a new event instance.
     */
    public function __construct(Couple $couple)
    {
        $this->couple = $couple;
    }
}
