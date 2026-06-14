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
        Schema::table('shared_expenses', function (Blueprint $table) {
            $table->foreignId('shared_expense_group_id')->nullable()->constrained('shared_expense_groups')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shared_expenses', function (Blueprint $table) {
            $table->dropForeign(['shared_expense_group_id']);
            $table->dropColumn('shared_expense_group_id');
        });
    }
};
