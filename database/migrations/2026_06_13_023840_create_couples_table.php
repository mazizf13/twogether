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
        Schema::create('couples', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name', 200)->nullable();
            $table->foreignId('partner_a_id')->constrained('users');
            $table->foreignId('partner_b_id')->nullable()->constrained('users');
            $table->date('wedding_date')->nullable();
            $table->char('currency_code', 3)->default('IDR');
            $table->enum('status', ['pending', 'active', 'dissolved'])->default('pending')->index();
            $table->timestamp('dissolved_at')->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->timestamps();
            
            $table->index('partner_a_id');
            $table->index('partner_b_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('couples');
    }
};
