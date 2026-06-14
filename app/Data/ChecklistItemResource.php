<?php

namespace App\Data;

use App\Models\ChecklistItem;

class ChecklistItemResource
{
    public static function make(ChecklistItem $item): array
    {
        $couple = $item->couple;
        
        // Human-readable assignee label
        $assignedToLabel = 'Unassigned';
        if ($item->assigned_to === 'both') {
            $assignedToLabel = 'Both';
        } elseif ($item->assigned_to === 'partner_a') {
            $assignedToLabel = $couple->partnerA->display_name;
        } elseif ($item->assigned_to === 'partner_b') {
            $assignedToLabel = $couple->partnerB->display_name;
        }

        return [
            'id' => $item->id,
            'uuid' => $item->uuid,
            'title' => $item->title,
            'category' => $item->category,
            'description' => $item->description,
            'assigned_to' => $item->assigned_to,
            'assigned_to_label' => $assignedToLabel,
            'due_date' => $item->due_date ? $item->due_date->format('Y-m-d') : null,
            'due_date_formatted' => $item->due_date ? $item->due_date->translatedFormat('d M Y') : null,
            'status' => $item->status,
            'is_overdue' => $item->isOverdue(),
            'completed_by' => $item->completedBy ? [
                'id' => $item->completedBy->id,
                'display_name' => $item->completedBy->display_name,
                'avatar_url' => $item->completedBy->avatar_url,
            ] : null,
            'completed_at' => $item->completed_at ? $item->completed_at->format('c') : null,
            'is_system_default' => $item->is_system_default,
            'can_delete' => true, // Both partners can delete any item
        ];
    }
}
