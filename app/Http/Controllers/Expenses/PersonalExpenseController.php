<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\PersonalExpense;
use App\Enums\ExpenseCategory;
use App\Data\PersonalExpenseResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class PersonalExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $query = PersonalExpense::query()
            ->with('user')
            ->where(function ($q) use ($user, $couple) {
                // Own expenses
                $q->where('user_id', $user->id)
                  // OR partner's expenses that are visible
                  ->orWhere(function ($sub) use ($user, $couple) {
                      $sub->where('couple_id', $couple->id)
                          ->where('user_id', '!=', $user->id)
                          ->where('is_visible_to_partner', true);
                  });
            });

        // Apply filters
        $month = $request->query('month');
        if ($month) {
            $query->whereMonth('expense_date', substr($month, 5, 2))
                  ->whereYear('expense_date', substr($month, 0, 4));
        }

        $category = $request->query('category');
        if ($category) {
            $query->where('category', $category);
        }

        // Calculate summary before pagination
        $summaryQuery = clone $query;
        $totalCents = $summaryQuery->sum('amount_cents');
        
        $byCategory = $summaryQuery->selectRaw('category, SUM(amount_cents) as total_cents, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('total_cents')
            ->get()
            ->toArray();

        $expenses = $query->orderByDesc('expense_date')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($e) => PersonalExpenseResource::make($e));

        return Inertia::render('Expenses/Personal', [
            'expenses' => $expenses,
            'summary' => [
                'total_cents' => (int) $totalCents,
                'by_category' => $byCategory,
            ],
            'filters' => [
                'categories' => ExpenseCategory::PERSONAL_CATEGORIES,
                // Ideally, dynamically fetch available months. Passing empty for MVP.
            ],
            'active_filters' => [
                'category' => $category,
                'month' => $month,
            ],
            'currency_code' => $couple->currency_code,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'category' => 'required|string|in:' . implode(',', array_keys(ExpenseCategory::PERSONAL_CATEGORIES)),
            'description' => 'nullable|string|max:500',
            'expense_date' => 'required|date',
            'is_visible_to_partner' => 'boolean',
        ]);

        $user = $request->user();

        $expense = PersonalExpense::create([
            'couple_id' => $user->couple_id,
            'user_id' => $user->id,
            'currency_code' => $user->couple->currency_code,
            ...$validated,
        ]);

        if ($expense->is_visible_to_partner) {
            app(\App\Services\ActivityLogService::class)->log(
                $user->couple,
                $user,
                'expense.personal.created',
                $expense,
                ['amount_cents' => $expense->amount_cents, 'category' => $expense->category]
            );
        }

        return back()->with('status', 'Pengeluaran pribadi berhasil ditambahkan.');
    }

    public function update(Request $request, PersonalExpense $expense): RedirectResponse
    {
        Gate::authorize('update', $expense);

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'category' => 'required|string|in:' . implode(',', array_keys(ExpenseCategory::PERSONAL_CATEGORIES)),
            'description' => 'nullable|string|max:500',
            'expense_date' => 'required|date',
            'is_visible_to_partner' => 'boolean',
        ]);

        $wasVisible = $expense->is_visible_to_partner;
        
        $expense->update($validated);

        if ($wasVisible !== $expense->is_visible_to_partner) {
            app(\App\Services\ActivityLogService::class)->log(
                $request->user()->couple,
                $request->user(),
                'expense.personal.visibility_changed',
                $expense,
                ['is_visible' => $expense->is_visible_to_partner]
            );
        }

        return back()->with('status', 'Pengeluaran pribadi berhasil diperbarui.');
    }

    public function destroy(Request $request, PersonalExpense $expense): RedirectResponse
    {
        Gate::authorize('delete', $expense);

        $expense->delete();

        return back()->with('status', 'Pengeluaran pribadi dihapus.');
    }
}

