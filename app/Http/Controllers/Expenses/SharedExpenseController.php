<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\SharedExpense;
use App\Models\SharedExpenseAuditLog;
use App\Models\SharedExpenseGroup;
use App\Enums\ExpenseCategory;
use App\Data\SharedExpenseResource;
use App\Data\CoupleResource;
use App\Services\BalanceCalculatorService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SharedExpenseController extends Controller
{
    public function __construct(
        private BalanceCalculatorService $balanceService,
        private ActivityLogService $activityService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        // In the new UI, we display groups. But we also need the overall balance.
        $query = SharedExpenseGroup::query()
            ->where('couple_id', $couple->id)
            ->withCount('sharedExpenses')
            ->orderByDesc('updated_at');

        $groups = $query->paginate(20);

        $balanceSummary = $this->balanceService->getBalanceSummary($couple, $user);

        return Inertia::render('Expenses/Shared', [
            'groups' => $groups,
            'balance' => $balanceSummary,
            'couple' => CoupleResource::make($couple, $user),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        $partnerAId = $couple->partner_a_id;
        $partnerBId = $couple->partner_b_id;

        $validated = $request->validate([
            'shared_expense_group_id' => 'required|exists:shared_expense_groups,id',
            'amount_cents' => 'required|integer|min:1',
            'category' => 'required|string|in:' . implode(',', array_keys(ExpenseCategory::SHARED_CATEGORIES)),
            'description' => 'nullable|string|max:500',
            'expense_date' => 'required|date',
            'paid_by_id' => 'required|in:' . $partnerAId . ',' . $partnerBId,
            'partner_a_split_pct' => 'required|numeric|min:0|max:100',
            'partner_b_split_pct' => 'required|numeric|min:0|max:100',
        ]);

        if (abs(($validated['partner_a_split_pct'] + $validated['partner_b_split_pct']) - 100) > 0.01) {
            throw ValidationException::withMessages([
                'split' => ['The split percentages must add up to 100%.'],
            ]);
        }

        DB::transaction(function () use ($validated, $user, $couple) {
            $expense = SharedExpense::create([
                'couple_id' => $couple->id,
                'logged_by_id' => $user->id,
                'currency_code' => $couple->currency_code,
                ...$validated,
            ]);

            SharedExpenseAuditLog::create([
                'shared_expense_id' => $expense->id,
                'changed_by_id' => $user->id,
                'action' => 'created',
                'new_data' => $expense->toArray(),
                'changed_at' => now(),
            ]);

            $this->activityService->log(
                $couple,
                $user,
                'expense.shared.created',
                $expense,
                ['amount_cents' => $expense->amount_cents, 'category' => $expense->category]
            );
        });

        return back()->with('status', 'Pengeluaran bersama berhasil ditambahkan.');
    }

    public function update(Request $request, SharedExpense $expense): RedirectResponse
    {
        Gate::authorize('update', $expense);

        $couple = $request->user()->couple;
        $partnerAId = $couple->partner_a_id;
        $partnerBId = $couple->partner_b_id;

        $validated = $request->validate([
            'shared_expense_group_id' => 'required|exists:shared_expense_groups,id',
            'amount_cents' => 'required|integer|min:1',
            'category' => 'required|string|in:' . implode(',', array_keys(ExpenseCategory::SHARED_CATEGORIES)),
            'description' => 'nullable|string|max:500',
            'expense_date' => 'required|date',
            'paid_by_id' => 'required|in:' . $partnerAId . ',' . $partnerBId,
            'partner_a_split_pct' => 'required|numeric|min:0|max:100',
            'partner_b_split_pct' => 'required|numeric|min:0|max:100',
        ]);

        if (abs(($validated['partner_a_split_pct'] + $validated['partner_b_split_pct']) - 100) > 0.01) {
            throw ValidationException::withMessages([
                'split' => ['The split percentages must add up to 100%.'],
            ]);
        }

        DB::transaction(function () use ($request, $expense, $validated) {
            $oldData = $expense->toArray();
            
            $expense->update($validated);

            SharedExpenseAuditLog::create([
                'shared_expense_id' => $expense->id,
                'changed_by_id' => $request->user()->id,
                'action' => 'updated',
                'previous_data' => $oldData,
                'new_data' => $expense->toArray(),
                'changed_at' => now(),
            ]);

            $this->activityService->log(
                $request->user()->couple,
                $request->user(),
                'expense.shared.updated',
                $expense
            );
        });

        return back()->with('status', 'Pengeluaran bersama berhasil diperbarui.');
    }

    public function destroy(Request $request, SharedExpense $expense): RedirectResponse
    {
        Gate::authorize('delete', $expense);

        DB::transaction(function () use ($request, $expense) {
            $oldData = $expense->toArray();

            $expense->delete();

            SharedExpenseAuditLog::create([
                'shared_expense_id' => $expense->id,
                'changed_by_id' => $request->user()->id,
                'action' => 'deleted',
                'previous_data' => $oldData,
                'changed_at' => now(),
            ]);

            $this->activityService->log(
                $request->user()->couple,
                $request->user(),
                'expense.shared.deleted',
                $expense
            );
        });

        return back()->with('status', 'Pengeluaran bersama dihapus.');
    }
}

