<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Services\FinancialSummaryService;
use App\Data\CoupleResource;
use App\Data\PersonalIncomeResource;
use App\Models\PersonalIncome;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function __construct(
        private FinancialSummaryService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $monthStr = $request->query('month');
        $selectedMonth = $monthStr ? Carbon::parse($monthStr . '-01') : Carbon::now();
        $previousMonth = $selectedMonth->copy()->subMonth();

        $currentMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $selectedMonth);
        $previousMonthSummary = $this->financialService->getMonthlySummary($user, $couple, $previousMonth);

        // Trend is for the last 6 months ENDING AT the selected month
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $selectedMonth->copy()->subMonths($i);
            $trend[] = $this->financialService->getMonthlySummary($user, $couple, $month);
        }

        $incomeBySource = $this->financialService->getIncomeBySource($user, $selectedMonth);
        $expenseByCategory = $this->financialService->getExpenseByCategory($user, $couple, $selectedMonth);

        // Split shared expenses for a dedicated breakdown chart
        $sharedByCategory = array_values(array_filter($expenseByCategory, fn($item) => $item['type'] === 'shared'));

        $recurringIncomesRaw = $this->financialService->getRecurringIncomes($user);
        $recurringIncomes = array_map(function ($item) {
            $model = new PersonalIncome($item);
            $model->id = $item['id'];
            $model->income_date = Carbon::parse($item['income_date']);
            return PersonalIncomeResource::make($model);
        }, $recurringIncomesRaw);

        return Inertia::render('Analytics/Index', [
            'current_month' => $currentMonthSummary,
            'previous_month' => $previousMonthSummary,
            'trend' => $trend,
            'income_by_source' => $incomeBySource,
            'expense_by_category' => $expenseByCategory,
            'shared_by_category' => $sharedByCategory,
            'recurring_incomes' => $recurringIncomes,
            'selected_month' => $selectedMonth->format('Y-m'),
            'couple' => CoupleResource::make($couple, $user),
            'currency_code' => $couple->currency_code,
        ]);
    }
}
