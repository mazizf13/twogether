<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\Settlement;
use App\Models\SharedExpense;
use App\Data\SettlementResource;
use App\Data\CoupleResource;
use App\Services\BalanceCalculatorService;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class BalanceController extends Controller
{
    public function __construct(
        private BalanceCalculatorService $balanceService,
        private ActivityLogService $activityService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $couple = $user->couple;

        $balanceSummary = $this->balanceService->getBalanceSummary($couple, $user);

        $settlements = Settlement::with(['payer', 'payee'])
            ->where('couple_id', $couple->id)
            ->orderByDesc('settlement_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn($s) => SettlementResource::make($s));

        return Inertia::render('Expenses/Balance', [
            'balance' => $balanceSummary,
            'settlements' => $settlements,
            'couple' => CoupleResource::make($couple, $user),
        ]);
    }

    public function settle(Request $request): RedirectResponse
    {
        $user = $request->user();
        $couple = $user->couple;

        $validated = $request->validate([
            'amount_cents' => 'required|integer|min:1',
            'settlement_date' => 'required|date',
            'notes' => 'nullable|string|max:500',
        ]);

        $balanceSummary = $this->balanceService->getBalanceSummary($couple, $user);

        if ($balanceSummary['is_settled']) {
            return back()->with('error', 'There is no balance to settle.');
        }

        // Determine who is paying who based on the balance
        if ($balanceSummary['net_cents'] < 0) {
            // Viewing user owes money, so viewing user is the payer
            $payerId = $user->id;
            $payeeId = $user->id === $couple->partner_a_id ? $couple->partner_b_id : $couple->partner_a_id;
        } else {
            // Viewing user is owed money, so the other partner is the payer
            $payerId = $user->id === $couple->partner_a_id ? $couple->partner_b_id : $couple->partner_a_id;
            $payeeId = $user->id;
        }

        DB::transaction(function () use ($validated, $user, $couple, $payerId, $payeeId) {
            $settlement = Settlement::create([
                'couple_id' => $couple->id,
                'initiated_by_id' => $user->id,
                'currency_code' => $couple->currency_code,
                'payer_id' => $payerId,
                'payee_id' => $payeeId,
                ...$validated,
            ]);

            // Mark all currently unsettled expenses as settled by this settlement
            SharedExpense::where('couple_id', $couple->id)
                ->whereNull('settled_by_settlement_id')
                ->where('expense_date', '<=', $validated['settlement_date'])
                ->update(['settled_by_settlement_id' => $settlement->id]);

            $this->activityService->log(
                $couple,
                $user,
                'balance.settled',
                $settlement,
                ['amount_cents' => $settlement->amount_cents]
            );
        });

        return back()->with('status', 'Balance settled successfully.');
    }
}
