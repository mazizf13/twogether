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
            $table->foreign('settled_by_settlement_id')->references('id')->on('settlements')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shared_expenses', function (Blueprint $table) {
            $table->dropForeign(['settled_by_settlement_id']);
        });
    }
};
