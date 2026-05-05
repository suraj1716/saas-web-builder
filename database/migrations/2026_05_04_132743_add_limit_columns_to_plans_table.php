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
        Schema::table('plans', function (Blueprint $table) {
            // Limits
            $table->unsignedInteger('max_template_slots')->default(3)->after('max_websites');
            $table->unsignedInteger('max_pages_per_site')->default(3)->after('max_template_slots');
            $table->unsignedInteger('max_sections_per_page')->default(5)->after('max_pages_per_site');
            $table->unsignedBigInteger('max_storage_mb')->default(50)->after('max_sections_per_page');
            $table->boolean('custom_domain')->default(false)->after('max_storage_mb');
        });
    }
    
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'max_template_slots',
                'max_pages_per_site',
                'max_sections_per_page',
                'max_storage_mb',
                'custom_domain',
            ]);
        });
    }
};
