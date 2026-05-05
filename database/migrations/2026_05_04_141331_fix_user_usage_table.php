<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_usage', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    
            $table->bigInteger('storage_bytes_used')->default(0);
            $table->integer('websites_count')->default(0);
            $table->integer('template_slots_used')->default(0);
        });
    }
    
    public function down()
    {
        Schema::table('user_usage', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'storage_bytes_used',
                'websites_count',
                'template_slots_used',
            ]);
        });
    }
};
