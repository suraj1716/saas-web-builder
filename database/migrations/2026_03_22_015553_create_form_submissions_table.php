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
    Schema::create('form_submissions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('website_id')->constrained()->cascadeOnDelete();
        $table->string('section_id'); // the section in the JSON
        $table->json('data');         // stores field values
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
