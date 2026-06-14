<?php

namespace App\Data;

class DefaultChecklist
{
    public static function getItems(): array
    {
        return [
            ['title' => 'Set your total wedding budget', 'category' => 'Planning', 'sort_order' => 1],
            ['title' => 'Choose and book your venue', 'category' => 'Venue', 'sort_order' => 2],
            ['title' => 'Set a wedding date', 'category' => 'Planning', 'sort_order' => 3],
            ['title' => 'Book a photographer', 'category' => 'Photography', 'sort_order' => 4],
            ['title' => 'Book a videographer', 'category' => 'Photography', 'sort_order' => 5],
            ['title' => 'Book catering', 'category' => 'Catering', 'sort_order' => 6],
            ['title' => 'Book a florist', 'category' => 'Decorations', 'sort_order' => 7],
            ['title' => 'Book music / DJ / band', 'category' => 'Music', 'sort_order' => 8],
            ['title' => 'Send save-the-dates', 'category' => 'Invitations', 'sort_order' => 9],
            ['title' => 'Design and send formal invitations', 'category' => 'Invitations', 'sort_order' => 10],
            ['title' => 'Choose bridal attire', 'category' => 'Attire', 'sort_order' => 11],
            ['title' => "Choose groom's attire", 'category' => 'Attire', 'sort_order' => 12],
            ['title' => 'Schedule final dress fitting', 'category' => 'Attire', 'sort_order' => 13],
            ['title' => 'Apply for marriage certificate', 'category' => 'Legal', 'sort_order' => 14],
            ['title' => 'Plan the honeymoon', 'category' => 'Honeymoon', 'sort_order' => 15],
            ['title' => 'Book honeymoon accommodation', 'category' => 'Honeymoon', 'sort_order' => 16],
            ['title' => 'Arrange guest accommodation', 'category' => 'Guests', 'sort_order' => 17],
            ['title' => 'Plan the rehearsal dinner', 'category' => 'Planning', 'sort_order' => 18],
            ['title' => 'Create seating arrangements', 'category' => 'Guests', 'sort_order' => 19],
            ['title' => 'Write wedding vows', 'category' => 'Ceremony', 'sort_order' => 20],
        ];
    }
}
