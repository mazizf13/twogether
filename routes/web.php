<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'has_couple', 'couple_active'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'has_couple', 'couple_active'])->group(function () {
    // Shared Expense Groups
    Route::post('/expenses/shared/groups', [\App\Http\Controllers\Expenses\SharedExpenseGroupController::class, 'store'])->name('expenses.shared.groups.store');
    Route::get('/expenses/shared/groups/{group}', [\App\Http\Controllers\Expenses\SharedExpenseGroupController::class, 'show'])->name('expenses.shared.groups.show');
    Route::put('/expenses/shared/groups/{group}', [\App\Http\Controllers\Expenses\SharedExpenseGroupController::class, 'update'])->name('expenses.shared.groups.update');
    Route::delete('/expenses/shared/groups/{group}', [\App\Http\Controllers\Expenses\SharedExpenseGroupController::class, 'destroy'])->name('expenses.shared.groups.destroy');
    Route::post('/expenses/shared/groups/{group}/settle', [\App\Http\Controllers\Expenses\SharedExpenseGroupController::class, 'markSettled'])->name('expenses.shared.groups.settle');

    // Shared Expenses
    Route::get('/expenses/shared', [\App\Http\Controllers\Expenses\SharedExpenseController::class, 'index'])->name('expenses.shared');
    Route::post('/expenses/shared', [\App\Http\Controllers\Expenses\SharedExpenseController::class, 'store'])->name('expenses.shared.store');
    Route::put('/expenses/shared/{expense}', [\App\Http\Controllers\Expenses\SharedExpenseController::class, 'update'])->name('expenses.shared.update');
    Route::delete('/expenses/shared/{expense}', [\App\Http\Controllers\Expenses\SharedExpenseController::class, 'destroy'])->name('expenses.shared.destroy');

    // Personal Expenses
    Route::get('/expenses/personal', [\App\Http\Controllers\Expenses\PersonalExpenseController::class, 'index'])->name('expenses.personal');
    Route::post('/expenses/personal', [\App\Http\Controllers\Expenses\PersonalExpenseController::class, 'store'])->name('expenses.personal.store');
    Route::put('/expenses/personal/{expense}', [\App\Http\Controllers\Expenses\PersonalExpenseController::class, 'update'])->name('expenses.personal.update');
    Route::delete('/expenses/personal/{expense}', [\App\Http\Controllers\Expenses\PersonalExpenseController::class, 'destroy'])->name('expenses.personal.destroy');

    // Balance
    Route::get('/expenses/balance', [\App\Http\Controllers\Expenses\BalanceController::class, 'index'])->name('expenses.balance');
    Route::post('/expenses/balance/settle', [\App\Http\Controllers\Expenses\BalanceController::class, 'settle'])->name('expenses.balance.settle');

    // Personal Income
    Route::get('/income/personal', [\App\Http\Controllers\Income\PersonalIncomeController::class, 'index'])->name('income.personal');
    Route::post('/income/personal', [\App\Http\Controllers\Income\PersonalIncomeController::class, 'store'])->name('income.personal.store');
    Route::put('/income/personal/{income}', [\App\Http\Controllers\Income\PersonalIncomeController::class, 'update'])->name('income.personal.update');
    Route::delete('/income/personal/{income}', [\App\Http\Controllers\Income\PersonalIncomeController::class, 'destroy'])->name('income.personal.destroy');

    // Analytics
    Route::get('/analytics', [\App\Http\Controllers\Analytics\AnalyticsController::class, 'index'])->name('analytics');

    // Savings
    Route::get('/savings', [\App\Http\Controllers\Savings\SavingsFundController::class, 'index'])->name('savings.index');
    Route::post('/savings/fund/target', [\App\Http\Controllers\Savings\SavingsFundController::class, 'updateTarget'])->name('savings.fund.target');
    Route::post('/savings/contributions', [\App\Http\Controllers\Savings\ContributionController::class, 'store'])->name('savings.contributions.store');
    Route::put('/savings/contributions/{contribution}', [\App\Http\Controllers\Savings\ContributionController::class, 'update'])->name('savings.contributions.update');
    Route::delete('/savings/contributions/{contribution}', [\App\Http\Controllers\Savings\ContributionController::class, 'destroy'])->name('savings.contributions.destroy');

    // Savings Goals
    Route::get('/savings/goals', [\App\Http\Controllers\Savings\GoalController::class, 'index'])->name('savings.goals.index');
    Route::post('/savings/goals', [\App\Http\Controllers\Savings\GoalController::class, 'store'])->name('savings.goals.store');
    Route::get('/savings/goals/{goal}', [\App\Http\Controllers\Savings\GoalController::class, 'show'])->name('savings.goals.show');
    Route::put('/savings/goals/{goal}', [\App\Http\Controllers\Savings\GoalController::class, 'update'])->name('savings.goals.update');
    Route::delete('/savings/goals/{goal}', [\App\Http\Controllers\Savings\GoalController::class, 'destroy'])->name('savings.goals.destroy');
    Route::post('/savings/goals/{goal}/contributions', [\App\Http\Controllers\Savings\GoalContributionController::class, 'store'])->name('savings.goals.contributions.store');
    Route::put('/savings/goals/{goal}/contributions/{contribution}', [\App\Http\Controllers\Savings\GoalContributionController::class, 'update'])->name('savings.goals.contributions.update');
    Route::delete('/savings/goals/{goal}/contributions/{contribution}', [\App\Http\Controllers\Savings\GoalContributionController::class, 'destroy'])->name('savings.goals.contributions.destroy');

    // Wedding
    Route::get('/wedding', [\App\Http\Controllers\Wedding\ChecklistController::class, 'hub'])->name('wedding');
    Route::get('/wedding/checklist', [\App\Http\Controllers\Wedding\ChecklistController::class, 'index'])->name('wedding.checklist.index');
    Route::post('/wedding/checklist', [\App\Http\Controllers\Wedding\ChecklistController::class, 'store'])->name('wedding.checklist.store');
    Route::put('/wedding/checklist/{item}', [\App\Http\Controllers\Wedding\ChecklistController::class, 'update'])->name('wedding.checklist.update');
    Route::delete('/wedding/checklist/{item}', [\App\Http\Controllers\Wedding\ChecklistController::class, 'destroy'])->name('wedding.checklist.destroy');

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'show'])->name('settings.profile.show');
        Route::put('/profile', [\App\Http\Controllers\Settings\ProfileController::class, 'update'])->name('settings.profile.update');
        
        Route::get('/couple', [\App\Http\Controllers\Settings\CoupleSettingsController::class, 'show'])->name('settings.couple.show');
        Route::put('/couple', [\App\Http\Controllers\Settings\CoupleSettingsController::class, 'update'])->name('settings.couple.update');
        
        Route::get('/security', [\App\Http\Controllers\Settings\SecurityController::class, 'show'])->name('settings.security.show');
        Route::put('/security/password', [\App\Http\Controllers\Settings\SecurityController::class, 'updatePassword'])->name('settings.security.password.update');
        
        Route::get('/notifications', [\App\Http\Controllers\Settings\NotificationController::class, 'show'])->name('settings.notifications.show');
        Route::put('/notifications', [\App\Http\Controllers\Settings\NotificationController::class, 'update'])->name('settings.notifications.update');
    });

    // Couple Leave Action (Danger Zone)
    Route::delete('/couple/leave', [\App\Http\Controllers\Couple\CoupleController::class, 'leave'])->name('couple.leave');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Couple & Onboarding
    Route::get('/onboarding', [\App\Http\Controllers\Couple\CoupleController::class, 'onboarding'])->name('onboarding');
    Route::post('/onboarding/complete', [\App\Http\Controllers\Couple\CoupleController::class, 'completeOnboarding'])->name('onboarding.complete');
    Route::post('/couple/create', [\App\Http\Controllers\Couple\CoupleController::class, 'create'])->name('couple.create');
    Route::post('/couple/invite', [\App\Http\Controllers\Couple\CoupleController::class, 'invite'])->name('couple.invite');
    Route::delete('/couple/leave', [\App\Http\Controllers\Couple\CoupleController::class, 'leave'])->name('couple.leave');
});

// Invitation Routes
Route::get('/invite/{token}', [\App\Http\Controllers\Couple\InvitationController::class, 'show'])->name('invite.show');
Route::post('/invite/{token}/accept', [\App\Http\Controllers\Couple\InvitationController::class, 'accept'])->middleware('auth')->name('invite.accept');

require __DIR__.'/auth.php';
