<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasActiveCouple
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->couple_id || !$user->couple?->isActive()) {
            // Check if they are trying to access onboarding, prevent infinite redirect
            if (!$request->routeIs('onboarding', 'onboarding.*')) {
                return redirect()->route('onboarding');
            }
        }

        return $next($request);
    }
}
