<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\SharedExpenseGroup;
use App\Models\SharedExpense;
use App\Data\CoupleResource;
use App\Data\SharedExpenseResource;
use App\Services\ActivityLogService;
use App\Enums\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class SharedExpenseGroupController extends Controller
{
    public function __construct(
        private ActivityLogService $activityService
    ) {}

    public function show(Request $request, SharedExpenseGroup $group)
    {
        $user = $request->user();
        $couple = $user->couple;

        if ($group->couple_id != $couple->id) {
            abort(403);
        }

        $expenses = $group->sharedExpenses()
            ->with('paidBy')
            ->orderByDesc('expense_date')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($e) => SharedExpenseResource::make($e));

        return Inertia::render('Expenses/SharedGroup', [
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'icon' => $group->icon,
                'color' => $group->color,
                'status' => $group->status,
                'created_at' => $group->created_at->toISOString(),
            ],
            'expenses' => $expenses,
            'couple' => CoupleResource::make($couple, $user),
            'filters' => [
                'categories' => ExpenseCategory::SHARED_CATEGORIES,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        $group = SharedExpenseGroup::create([
            'couple_id' => $couple->id,
            'created_by_id' => $user->id,
            ...$validated,
        ]);

        return redirect()->route('expenses.shared.groups.show', $group)->with('status', 'Kegiatan berhasil dibuat.');
    }

    public function update(Request $request, SharedExpenseGroup $group): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        if ($group->couple_id != $couple->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        $group->update($validated);

        return back()->with('status', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(Request $request, SharedExpenseGroup $group): RedirectResponse
    {
        if ($group->couple_id != $request->user()->couple_id) {
            abort(403);
        }

        $group->delete();

        return redirect()->route('expenses.shared')->with('status', 'Kegiatan berhasil dihapus.');
    }

    public function markSettled(Request $request, SharedExpenseGroup $group): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        if ($group->couple_id != $couple->id) {
            abort(403);
        }

        $group->update(['status' => 'settled']);

        return back()->with('status', 'Kegiatan berhasil ditandai selesai.');
    }
}
