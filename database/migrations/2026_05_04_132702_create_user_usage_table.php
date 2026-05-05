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
        Schema::create('user_usage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete()
                  ->unique(); // one row per user only
    
            // These are fast counters — never count(*) queries at runtime
            $table->unsignedBigInteger('storage_bytes_used')->default(0);
            $table->unsignedInteger('websites_count')->default(0);
            $table->unsignedInteger('template_slots_used')->default(0);
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_usage');
    }
};
