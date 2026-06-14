<?php

namespace App\Jobs;

use App\Models\CoupleInvitation;
use App\Models\User;
use App\Mail\CoupleInvitationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendInvitationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public CoupleInvitation $invitation;
    public User $inviter;

    /**
     * Create a new job instance.
     */
    public function __construct(CoupleInvitation $invitation, User $inviter)
    {
        $this->invitation = $invitation;
        $this->inviter = $inviter;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->invitation->email)
            ->send(new CoupleInvitationMail($this->invitation, $this->inviter));
    }
}
