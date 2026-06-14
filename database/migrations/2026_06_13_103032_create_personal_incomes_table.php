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
        Schema::create('personal_incomes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('couple_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->bigInteger('amount_cents');
            $table->char('currency_code', 3)->default('IDR');
            
            $table->string('source', 50);
            $table->string('description', 500)->nullable();
            
            $table->date('income_date');
            
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_frequency', ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'])->nullable();
            
            $table->boolean('is_visible_to_partner')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('couple_id');
            $table->index('user_id');
            $table->index('income_date');
            $table->index('source');
            $table->index('is_recurring');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_incomes');
    }
};
