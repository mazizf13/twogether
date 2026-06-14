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
        Schema::create('personal_expenses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('couple_id')->constrained('couples')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('amount_cents');
            $table->char('currency_code', 3);
            $table->string('category', 50);
            $table->string('description', 500)->nullable();
            $table->date('expense_date');
            $table->boolean('is_visible_to_partner')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('expense_date');
            $table->index('category');
            $table->index('is_visible_to_partner');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_expenses');
    }
};
