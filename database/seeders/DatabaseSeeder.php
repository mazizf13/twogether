<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create 2 test users
        $userA = \App\Models\User::factory()->create([
            'display_name' => 'Alice',
            'email' => 'alice@example.com',
        ]);

        $userB = \App\Models\User::factory()->create([
            'display_name' => 'Bob',
            'email' => 'bob@example.com',
        ]);

        // 2. Create an active couple between them
        $couple = \App\Models\Couple::create([
            'partner_a_id' => $userA->id,
            'partner_b_id' => $userB->id,
            'name' => 'Alice & Bob',
            'wedding_date' => \Carbon\Carbon::now()->addMonths(6),
            'status' => 'active',
        ]);

        $userA->update(['couple_id' => $couple->id]);
        $userB->update(['couple_id' => $couple->id]);

        // 2b. Seed 5 personal incomes for each user
        $incomeSources = ['salary', 'freelance', 'bonus'];
        foreach ([$userA, $userB] as $user) {
            for ($i = 0; $i < 5; $i++) {
                \App\Models\PersonalIncome::create([
                    'couple_id'   => $couple->id,
                    'user_id'     => $user->id,
                    'amount_cents' => rand(3000000, 15000000) * 100, // 3jt - 15jt IDR
                    'currency_code' => 'IDR',
                    'source'      => $incomeSources[array_rand($incomeSources)],
                    'description' => 'Test income ' . $i,
                    'income_date' => \Carbon\Carbon::now()->subDays(rand(1, 60)),
                    'is_recurring' => (bool) rand(0, 1),
                    'recurring_frequency' => 'monthly',
                    'is_visible_to_partner' => false,
                ]);
            }
        }

        // 3. Seed 10 personal expenses for each user
        $categories = ['Food', 'Transport', 'Shopping', 'Entertainment'];
        foreach ([$userA, $userB] as $user) {
            for ($i = 0; $i < 10; $i++) {
                \App\Models\PersonalExpense::create([
                    'couple_id' => $couple->id,
                    'user_id' => $user->id,
                    'amount_cents' => rand(10000, 100000), // 100 to 1000
                    'currency_code' => 'IDR',
                    'category' => $categories[array_rand($categories)],
                    'description' => 'Test personal expense ' . $i,
                    'expense_date' => \Carbon\Carbon::now()->subDays(rand(1, 30)),
                    'is_visible_to_partner' => (bool) rand(0, 1),
                ]);
            }
        }

        // 4. Seed 8 shared expenses with varied splits
        for ($i = 0; $i < 8; $i++) {
            $splitA = rand(10, 90);
            $splitB = 100 - $splitA;
            $payer = rand(0, 1) ? $userA : $userB;
            
            \App\Models\SharedExpense::create([
                'couple_id' => $couple->id,
                'logged_by_id' => $payer->id,
                'paid_by_id' => $payer->id,
                'amount_cents' => rand(50000, 500000),
                'currency_code' => 'IDR',
                'category' => 'Wedding ' . $categories[array_rand($categories)],
                'description' => 'Test shared expense ' . $i,
                'expense_date' => \Carbon\Carbon::now()->subDays(rand(1, 30)),
                'partner_a_split_pct' => $splitA,
                'partner_b_split_pct' => $splitB,
            ]);
        }

        // 5. Seed a savings fund with 5 contributions
        $fund = \App\Models\SavingsFund::create([
            'couple_id' => $couple->id,
            'target_amount_cents' => 50000000, // 500k
        ]);

        for ($i = 0; $i < 5; $i++) {
            $user = rand(0, 1) ? $userA : $userB;
            \App\Models\SavingsContribution::create([
                'couple_id' => $couple->id,
                'user_id' => $user->id,
                'amount_cents' => rand(50000, 200000),
                'currency_code' => 'IDR',
                'contribution_date' => \Carbon\Carbon::now()->subDays(rand(1, 30)),
                'notes' => 'Test fund contribution ' . $i,
            ]);
        }

        // 6. Seed 3 savings goals with contributions
        for ($i = 1; $i <= 3; $i++) {
            $goal = \App\Models\SavingsGoal::create([
                'couple_id' => $couple->id,
                'created_by_id' => $userA->id,
                'name' => 'Test Goal ' . $i,
                'target_amount_cents' => rand(1000000, 5000000),
                'currency_code' => 'IDR',
                'deadline' => \Carbon\Carbon::now()->addMonths(rand(1, 12)),
            ]);

            for ($j = 0; $j < 3; $j++) {
                $user = rand(0, 1) ? $userA : $userB;
                \App\Models\GoalContribution::create([
                    'savings_goal_id' => $goal->id,
                    'couple_id' => $couple->id,
                    'user_id' => $user->id,
                    'amount_cents' => rand(50000, 200000),
                    'currency_code' => 'IDR',
                    'contribution_date' => \Carbon\Carbon::now()->subDays(rand(1, 30)),
                    'notes' => 'Test goal contribution',
                ]);
            }
        }

        // 7. Seed the default checklist
        $checklistItems = \App\Data\DefaultChecklist::getItems();
        foreach ($checklistItems as $index => $item) {
            \App\Models\ChecklistItem::create([
                'couple_id' => $couple->id,
                'title' => $item['title'],
                'category' => $item['category'],
                'description' => $item['description'] ?? null,
                'is_system_default' => true,
                'sort_order' => $index,
            ]);
        }

        // 8. Seed 10 activity log entries
        for ($i = 0; $i < 10; $i++) {
            $user = rand(0, 1) ? $userA : $userB;
            \App\Models\ActivityLog::create([
                'couple_id' => $couple->id,
                'actor_id' => $user->id,
                'action' => 'expense.shared.created',
                'occurred_at' => \Carbon\Carbon::now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
