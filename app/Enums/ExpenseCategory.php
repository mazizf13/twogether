<?php

namespace App\Enums;

class ExpenseCategory
{
    public const PERSONAL_CATEGORIES = [
        'food_dining'     => 'Makan Di Luar (Pribadi)',
        'transportation'  => 'Transportasi (Pribadi)',
        'shopping'        => 'Belanja Pribadi',
        'entertainment'   => 'Hobi & Rekreasi',
        'health'          => 'Kesehatan',
        'education'       => 'Edukasi',
        'bills_utilities' => 'Utilitas & Tagihan',
        'wedding'         => 'Tabungan Pernikahan',
        'other'           => 'Lainnya (Pribadi)',
    ];

    public const SHARED_CATEGORIES = [
        'venue'           => 'Tempat & Lokasi',
        'catering'        => 'Makanan & Katering',
        'photography'     => 'Fotografi & Video',
        'attire'          => 'Pakaian & Kecantikan',
        'invitations'     => 'Undangan & Kertas',
        'decorations'     => 'Dekorasi & Bunga',
        'music'           => 'Musik & Hiburan',
        'honeymoon'       => 'Bulan Madu',
        'rings_jewelry'   => 'Cincin Kawin',
        'food_dining'     => 'Kencan & Makan Di Luar',
        'transportation'  => 'Transportasi',
        'accommodation'   => 'Akomodasi & Tempat Tinggal',
        'other'           => 'Lainnya (Bersama)',
    ];
}
