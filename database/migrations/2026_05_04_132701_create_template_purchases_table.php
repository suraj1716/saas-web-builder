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
        Schema::create('template_purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('template_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->decimal('amount_paid', 8, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('stripe_payment_intent_id')->nullable();
            $table->enum('status', ['paid', 'pending', 'failed'])->default('pending');
            $table->timestamps();
    
            // One user buys one template once
            $table->unique(['user_id', 'template_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_purchases');
    }
};
