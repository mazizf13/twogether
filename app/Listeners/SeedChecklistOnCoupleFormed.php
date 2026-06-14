<?php

namespace App\Listeners;

use App\Events\CoupleFormed;
use App\Models\ChecklistItem;
use App\Data\DefaultChecklist;

class SeedChecklistOnCoupleFormed
{
    /**
     * Handle the event.
     */
    public function handle(CoupleFormed $event): void
    {
        $couple = $event->couple;
        $items = DefaultChecklist::getItems();

        foreach ($items as $item) {
            ChecklistItem::create([
                'couple_id' => $couple->id,
                'category' => $item['category'],
                'title' => $item['title'],
                'sort_order' => $item['sort_order'],
                'is_system_default' => true,
                'created_by_id' => null, // System created
                'status' => 'todo',
            ]);
        }
    }
}
