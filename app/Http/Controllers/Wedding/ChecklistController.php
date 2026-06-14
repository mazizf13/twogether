<?php

namespace App\Http\Controllers\Wedding;

use App\Http\Controllers\Controller;
use App\Models\ChecklistItem;
use App\Data\CoupleResource;
use App\Data\CountdownResource;
use App\Data\ChecklistItemResource;
use App\Services\ActivityLogService;
use App\Services\SavingsService;
use App\Events\AllChecklistItemsCompleted;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ChecklistController extends Controller
{
    public function __construct(
        private ActivityLogService $activityService,
        private SavingsService $savingsService
    ) {}

    public function hub(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $items = $couple->checklistItems()->get();
        $total = $items->count();
        $completed = $items->where('status', 'done')->count();
        $overdue = $items->filter(fn($item) => $item->isOverdue())->count();
        
        $pct = $total > 0 ? (int) round(($completed / $total) * 100) : 0;

        // Group by category
        $byCategory = $items->groupBy('category')->map(function($categoryItems, $categoryName) {
            return [
                'name' => $categoryName,
                'total' => $categoryItems->count(),
                'completed' => $categoryItems->where('status', 'done')->count(),
                'pct' => $categoryItems->count() > 0 
                    ? (int) round(($categoryItems->where('status', 'done')->count() / $categoryItems->count()) * 100) 
                    : 0,
            ];
        })->values()->toArray();

        $checklistSummary = [
            'total' => $total,
            'completed' => $completed,
            'overdue' => $overdue,
            'pct' => $pct,
            'by_category' => $byCategory,
        ];

        // Also get Savings summary for the hub
        $savingsSummary = $this->savingsService->getFundSummary($couple, $user);

        return Inertia::render('Wedding/Hub', [
            'couple' => CoupleResource::make($couple, $user),
            'countdown' => CountdownResource::make($couple->wedding_date),
            'checklist_summary' => $checklistSummary,
            'savings_summary' => $savingsSummary,
        ]);
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $query = $couple->checklistItems();

        // Optional basic filters applied in backend, but we also pass all items grouped
        $items = $query->get();

        $categories = $items->pluck('category')->unique()->sort()->values()->toArray();

        // Bring 'Planning' category to front if it exists
        $planningIndex = array_search('Planning', $categories);
        if ($planningIndex !== false) {
            unset($categories[$planningIndex]);
            array_unshift($categories, 'Planning');
        }

        // We group items by category for the frontend
        $groupedItems = [];
        foreach ($categories as $cat) {
            $catItems = $items->where('category', $cat);
            
            // Sort: ToDo first, then Done. Within ToDo, by due_date (nulls last)
            $sortedItems = $catItems->sort(function ($a, $b) {
                if ($a->status !== $b->status) {
                    return $a->status === 'todo' ? -1 : 1;
                }
                if ($a->due_date == $b->due_date) {
                    return $a->sort_order <=> $b->sort_order;
                }
                if (!$a->due_date) return 1;
                if (!$b->due_date) return -1;
                return $a->due_date <=> $b->due_date;
            })->values();

            $groupedItems[] = [
                'category' => $cat,
                'items' => $sortedItems->map(fn($i) => ChecklistItemResource::make($i)),
                'completed_count' => $catItems->where('status', 'done')->count(),
                'total_count' => $catItems->count(),
            ];
        }

        return Inertia::render('Wedding/Checklist', [
            'couple' => CoupleResource::make($couple, $user),
            'countdown' => CountdownResource::make($couple->wedding_date),
            'items_grouped' => $groupedItems,
            'categories' => $categories,
            'filters' => $request->only(['status', 'assigned_to', 'category']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'category' => 'required|string|max:100',
            'assigned_to' => 'required|in:partner_a,partner_b,both',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $maxSort = $couple->checklistItems()->max('sort_order') ?? 0;

        $item = ChecklistItem::create([
            'couple_id' => $couple->id,
            'created_by_id' => $user->id,
            'is_system_default' => false,
            'status' => 'todo',
            'sort_order' => $maxSort + 1,
            ...$validated,
        ]);

        $this->activityService->log(
            $couple,
            $user,
            'checklist.item.created',
            $item
        );

        return back()->with('status', 'Task created.');
    }

    public function update(Request $request, ChecklistItem $item): RedirectResponse
    {
        Gate::authorize('update', $item);

        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'category' => 'required|string|max:100',
            'assigned_to' => 'required|in:partner_a,partner_b,both',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,done',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $oldStatus = $item->status;
        $newStatus = $validated['status'];

        if ($oldStatus !== 'done' && $newStatus === 'done') {
            $item->completed_by_id = $user->id;
            $item->completed_at = now();
        } elseif ($oldStatus === 'done' && $newStatus === 'todo') {
            $item->completed_by_id = null;
            $item->completed_at = null;
        }

        $item->update($validated);

        if ($oldStatus !== 'done' && $newStatus === 'done') {
            $this->activityService->log($couple, $user, 'checklist.item.completed', $item);

            // Check if all are done
            $todoCount = $couple->checklistItems()->where('status', 'todo')->count();
            if ($todoCount === 0) {
                event(new AllChecklistItemsCompleted($couple));
            }
        }

        return back()->with('status', 'Task updated.');
    }

    public function destroy(Request $request, ChecklistItem $item): RedirectResponse
    {
        Gate::authorize('delete', $item);

        $item->delete();

        // Check if all remaining are done
        $couple = $request->user()->couple;
        $todoCount = $couple->checklistItems()->where('status', 'todo')->count();
        if ($todoCount === 0 && $couple->checklistItems()->count() > 0) {
            event(new AllChecklistItemsCompleted($couple));
        }

        return back()->with('status', 'Task deleted.');
    }
}
