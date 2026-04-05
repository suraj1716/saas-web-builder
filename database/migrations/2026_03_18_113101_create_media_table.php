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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('path');
        
            $table->string('type');      // image / video / svg
            $table->string('mime')->nullable();
        
            $table->integer('size')->nullable();
        
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
        
            $table->string('hash')->unique();
        
            $table->boolean('is_temporary')->default(true);
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
