<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CoupleActive
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->couple && $user->couple->status === 'dissolved') {
            return redirect()->route('onboarding')->with('error', 'Your couple space has been dissolved.');
        }

        return $next($request);
    }
}
