<?php

namespace App\Enums;

class IncomeSource
{
    public const SOURCES = [
        'salary'      => 'Gaji Tetap',
        'freelance'   => 'Freelance',
        'business'    => 'Bisnis',
        'investment'  => 'Investasi',
        'rental'      => 'Sewa / Kos',
        'bonus'       => 'Bonus',
        'gift'        => 'Hadiah / THR',
        'other'       => 'Lainnya',
    ];

    public const FREQUENCIES = [
        'weekly'      => 'Setiap Minggu',
        'biweekly'    => 'Dua Minggu Sekali',
        'monthly'     => 'Setiap Bulan',
        'quarterly'   => 'Setiap Kuartal',
        'yearly'      => 'Setiap Tahun',
    ];
}
