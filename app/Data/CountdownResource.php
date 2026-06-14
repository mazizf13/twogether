<?php

namespace App\Data;

use Carbon\Carbon;

class CountdownResource
{
    public static function make(?Carbon $weddingDate): array
    {
        if (!$weddingDate) {
            return ['days' => null, 'date_formatted' => null, 'state' => 'no_date'];
        }
        
        $today = Carbon::today();
        $days = $today->diffInDays($weddingDate, false); // negative if past
        
        return [
            'days' => $days,
            'weeks' => (int) abs($today->diffInWeeks($weddingDate)),
            'months' => (int) abs($today->diffInMonths($weddingDate)),
            'date_formatted' => $weddingDate->translatedFormat('l, j F Y'),
            'date_iso' => $weddingDate->format('Y-m-d'),
            'date' => $weddingDate->translatedFormat('l, j F Y'),
            'message' => match(true) {
                $days > 0 => "Hari lagi!",
                $days == 0 => "Hari H telah tiba! 💍",
                default => "Kalian sudah menikah! Selamat 🎉",
            },
            'state' => match(true) {
                $days > 0 => 'upcoming',
                $days == 0 => 'today',
                default => 'past',
            },
            'is_soon' => $days > 0 && $days <= 30,  // within 30 days
        ];
    }
}
