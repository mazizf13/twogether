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
        Schema::create('shared_expense_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shared_expense_id')->constrained('shared_expenses')->cascadeOnDelete();
            $table->foreignId('changed_by_id')->constrained('users');
            $table->enum('action', ['created', 'updated', 'deleted']);
            $table->json('previous_data')->nullable();
            $table->json('new_data')->nullable();
            $table->timestamp('changed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_expense_audit_logs');
    }
};
