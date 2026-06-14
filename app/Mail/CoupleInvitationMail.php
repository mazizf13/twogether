<?php

namespace App\Mail;

use App\Models\CoupleInvitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CoupleInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public CoupleInvitation $invitation;
    public User $inviter;

    /**
     * Create a new message instance.
     */
    public function __construct(CoupleInvitation $invitation, User $inviter)
    {
        $this->invitation = $invitation;
        $this->inviter = $inviter;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "{$this->inviter->display_name} wants to plan your wedding together 💍",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.couple-invitation',
        );
    }
}
