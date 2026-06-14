<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'uuid' => $request->user()->uuid,
                    'display_name' => $request->user()->display_name,
                    'email' => $request->user()->email,
                    'avatar_url' => $request->user()->avatar_url,
                    'theme' => $request->user()->theme,
                    'couple_id' => $request->user()->couple_id,
                ] : null,
                'couple' => $request->user()?->couple ? [
                    'id' => $request->user()->couple->id,
                    'uuid' => $request->user()->couple->uuid,
                    'name' => $request->user()->couple->name,
                    'wedding_date' => $request->user()->couple->wedding_date?->format('Y-m-d'),
                    'currency_code' => $request->user()->couple->currency_code,
                    'status' => $request->user()->couple->status,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
