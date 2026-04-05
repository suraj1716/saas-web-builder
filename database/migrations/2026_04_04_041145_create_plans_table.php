<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {

            $table->id();

            // Plan identity
            $table->string('name');                 // Starter / Pro / Agency
            $table->string('slug')->unique();       // starter, pro, agency

            // Stripe integration
            $table->string('stripe_price_id')->nullable();
            $table->string('stripe_product_id')->nullable();

            // Pricing
            $table->decimal('price', 8, 2)->default(0);
            $table->string('currency')->default('usd');
            $table->string('billing_interval')->default('month'); 
            // month / year

            // Limits
            $table->integer('max_websites')->nullable(); 
            // null = unlimited

            // Feature flags
            $table->boolean('has_pro_templates')->default(false);
            $table->boolean('white_label')->default(false);
            $table->boolean('priority_support')->default(false);

            // JSON features list (for UI display)
            $table->json('features')->nullable();

            // Status
            $table->boolean('is_active')->default(true);

            // Sorting
            $table->integer('sort_order')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};