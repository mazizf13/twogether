<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Data\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        
        // Default preferences
        $defaults = [
            'partner_added_expense' => true,
            'partner_added_contribution' => true,
            'partner_completed_task' => true,
            'milestone_reached' => true,
            'wedding_countdown_reminders' => true,
        ];

        $preferences = array_merge($defaults, $user->notification_preferences ?? []);

        return Inertia::render('Settings/Notifications', [
            'user' => UserResource::make($user),
            'preferences' => $preferences,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'partner_added_expense' => 'boolean',
            'partner_added_contribution' => 'boolean',
            'partner_completed_task' => 'boolean',
            'milestone_reached' => 'boolean',
            'wedding_countdown_reminders' => 'boolean',
        ]);

        $user = $request->user();
        $user->update([
            'notification_preferences' => $validated,
        ]);

        return back()->with('status', 'Notification preferences saved');
    }
}
