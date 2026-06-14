<?php

namespace App\Http\Controllers\Couple;

use App\Http\Controllers\Controller;
use App\Actions\Couple\AcceptCoupleInvitation;
use App\Models\CoupleInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class InvitationController extends Controller
{
    /**
     * Show the invitation acceptance page.
     */
    public function show(Request $request, string $token): Response
    {
        $invitation = CoupleInvitation::with('couple.partnerA')->where('token', $token)->first();

        if (!$invitation) {
            abort(404);
        }

        $inviter = $invitation->couple->partnerA;

        return Inertia::render('Couple/AcceptInvitation', [
            'invitation' => $invitation,
            'inviterName' => $inviter ? $inviter->display_name : 'Your partner',
            'isExpired' => $invitation->isExpired(),
            'isAccepted' => $invitation->status === 'accepted',
            'isLoggedIn' => auth()->check(),
            'userEmail' => auth()->user()?->email,
        ]);
    }

    /**
     * Accept the invitation.
     */
    public function accept(Request $request, string $token, AcceptCoupleInvitation $action): RedirectResponse
    {
        $invitation = CoupleInvitation::where('token', $token)->firstOrFail();

        if (!auth()->check()) {
            return redirect()->route('register', ['invitation' => $token]);
        }

        $action->execute(auth()->user(), $invitation);

        return redirect()->route('dashboard')->with('status', 'You have successfully joined the couple space!');
    }
}
