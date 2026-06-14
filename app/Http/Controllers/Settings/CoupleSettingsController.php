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

class CoupleSettingsController extends Controller
{
    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function show(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        if (!$couple) {
            return Inertia::render('Settings/Couple', [
                'couple' => null,
                'user' => UserResource::make($user),
            ]);
        }

        return Inertia::render('Settings/Couple', [
            'couple' => CoupleResource::make($couple, $user),
            'user' => UserResource::make($user),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        if (!$couple) {
            return back()->with('error', 'You are not in a couple space.');
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:200',
            'wedding_date' => 'nullable|date',
            'currency_code' => 'nullable|in:IDR,USD,EUR,SGD,MYR,AUD,GBP',
        ]);

        $oldDate = $couple->wedding_date ? $couple->wedding_date->format('Y-m-d') : null;
        $newDate = $validated['wedding_date'] ?? null;
        if ($newDate) {
            $newDate = \Carbon\Carbon::parse($newDate)->format('Y-m-d');
        }

        $couple->update($validated);

        if ($oldDate !== $newDate) {
            $this->activityService->log($couple, $user, 'couple.wedding_date.changed', $couple, [
                'old_date' => $oldDate,
                'new_date' => $newDate,
            ]);
        }

        return back()->with('status', 'Couple settings updated');
    }
}
