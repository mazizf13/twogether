<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shared_expenses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('couple_id')->constrained('couples')->cascadeOnDelete();
            $table->foreignId('logged_by_id')->constrained('users');
            $table->foreignId('paid_by_id')->constrained('users');
            $table->unsignedBigInteger('amount_cents');
            $table->char('currency_code', 3);
            $table->string('category', 50);
            $table->string('description', 500)->nullable();
            $table->date('expense_date');
            $table->decimal('partner_a_split_pct', 5, 2)->default(50.00);
            $table->decimal('partner_b_split_pct', 5, 2)->default(50.00);
            // settled_by_settlement_id added later
            $table->unsignedBigInteger('settled_by_settlement_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('expense_date');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_expenses');
    }
};
