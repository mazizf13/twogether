<?php

namespace App\Http\Controllers\Income;

use App\Http\Controllers\Controller;
use App\Models\PersonalIncome;
use App\Enums\IncomeSource;
use App\Data\PersonalIncomeResource;
use App\Services\FinancialSummaryService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;

class PersonalIncomeController extends Controller
{
    public function __construct(
        private FinancialSummaryService $financialService,
        private ActivityLogService $activityService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $query = PersonalIncome::where('user_id', $user->id);

        $month = $request->query('month');
        if ($month) {
            $query->whereMonth('income_date', substr($month, 5, 2))
                  ->whereYear('income_date', substr($month, 0, 4));
        }

        $source = $request->query('source');
        if ($source) {
            $query->where('source', $source);
        }

        $incomes = $query->orderByDesc('income_date')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($i) => PersonalIncomeResource::make($i));

        $recurringIncomes = collect($this->financialService->getRecurringIncomes($user))
            ->map(function ($item) {
                // To keep it simple, we use the resource to format the array item.
                // We need to hydrate it to a model to use the resource.
                $model = new PersonalIncome($item);
                $model->id = $item['id'];
                $model->income_date = Carbon::parse($item['income_date']);
                return PersonalIncomeResource::make($model);
            });

        $thisMonth = $month ? Carbon::parse($month . '-01') : Carbon::now();
        $lastMonth = $thisMonth->copy()->subMonth();

        $thisMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $thisMonth);
        $lastMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $lastMonth);

        $changePct = 0;
        if ($lastMonthSummary['total_income_cents'] > 0) {
            $diff = $thisMonthSummary['total_income_cents'] - $lastMonthSummary['total_income_cents'];
            $changePct = round(($diff / $lastMonthSummary['total_income_cents']) * 100, 1);
        } elseif ($thisMonthSummary['total_income_cents'] > 0) {
            $changePct = 100;
        }

        return Inertia::render('Income/Personal', [
            'incomes' => $incomes,
            'recurring_incomes' => $recurringIncomes,
            'summary' => [
                'total_this_month_cents' => $thisMonthSummary['total_income_cents'],
                'total_last_month_cents' => $lastMonthSummary['total_income_cents'],
                'change_pct' => $changePct,
                'by_source' => $this->financialService->getIncomeBySource($user, $thisMonth),
            ],
            'filters' => [
                'sources' => IncomeSource::SOURCES,
            ],
            'active_filters' => [
                'source' => $source,
                'month' => $month,
            ],
            'currency_code' => $couple->currency_code,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'currency_code' => 'required|string|size:3',
            'source' => 'required|in:' . implode(',', array_keys(IncomeSource::SOURCES)),
            'description' => 'nullable|string|max:500',
            'income_date' => 'required|date',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|required_if:is_recurring,true|in:' . implode(',', array_keys(IncomeSource::FREQUENCIES)),
            'is_visible_to_partner' => 'boolean',
        ]);

        $user = $request->user();
        $couple = $user->couple;

        $income = PersonalIncome::create([
            'couple_id' => $couple->id,
            'user_id' => $user->id,
            ...$validated,
            'is_recurring' => $validated['is_recurring'] ?? false,
            'is_visible_to_partner' => $validated['is_visible_to_partner'] ?? false,
        ]);

        if ($income->is_visible_to_partner) {
            $this->activityService->log(
                $couple,
                $user,
                'income.personal.created',
                $income,
                ['amount_cents' => $income->amount_cents, 'source' => $income->source]
            );
        }

        return back()->with('status', 'Pemasukan berhasil ditambahkan.');
    }

    public function update(Request $request, PersonalIncome $income): RedirectResponse
    {
        Gate::authorize('update', $income);

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'currency_code' => 'required|string|size:3',
            'source' => 'required|in:' . implode(',', array_keys(IncomeSource::SOURCES)),
            'description' => 'nullable|string|max:500',
            'income_date' => 'required|date',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|required_if:is_recurring,true|in:' . implode(',', array_keys(IncomeSource::FREQUENCIES)),
            'is_visible_to_partner' => 'boolean',
        ]);

        $wasVisible = $income->is_visible_to_partner;
        $income->update([
            ...$validated,
            'is_recurring' => $validated['is_recurring'] ?? false,
            'is_visible_to_partner' => $validated['is_visible_to_partner'] ?? false,
            'recurring_frequency' => empty($validated['is_recurring']) ? null : $validated['recurring_frequency'],
        ]);

        if (!$wasVisible && $income->is_visible_to_partner) {
            $this->activityService->log(
                $request->user()->couple,
                $request->user(),
                'income.personal.created', // logically it's newly visible
                $income,
                ['amount_cents' => $income->amount_cents, 'source' => $income->source]
            );
        }

        return back()->with('status', 'Pemasukan berhasil diperbarui.');
    }

    public function destroy(Request $request, PersonalIncome $income): RedirectResponse
    {
        Gate::authorize('delete', $income);

        $income->delete();

        return back()->with('status', 'Pemasukan dihapus.');
    }
}
