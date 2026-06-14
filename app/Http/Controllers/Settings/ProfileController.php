<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Data\UserResource;
use App\Data\CoupleResource;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProfileController extends Controller
{
    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function show(Request $request): Response
    {
        $user = $request->user();
        return Inertia::render('Settings/Profile', [
            'user' => UserResource::make($user),
            'couple' => $user->couple ? CoupleResource::make($user->couple, $user) : null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'display_name' => 'required|string|min:1|max:100',
            'avatar_url' => 'nullable|url|max:500',
            'theme' => 'nullable|string|in:light,dark,system',
        ]);

        $user = $request->user();
        $user->update($validated);

        if ($user->couple) {
            $this->activityService->log($user->couple, $user, 'user.profile.updated', $user);
        }

        return back()->with('status', 'Profile updated');
    }
}
