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
        Schema::create('website_business_details', function (Blueprint $table) {

            $table->id();

            $table->foreignId('website_id')
                ->constrained('websites')
                ->cascadeOnDelete();

            // BUSINESS INFO
            $table->string('business_name')->nullable();
            $table->string('business_email')->nullable();
            $table->string('phone')->nullable();

            // ADDRESS
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('zip')->nullable();

            // BRANDING
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();

            // SOCIAL LINKS
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('youtube')->nullable();
            $table->string('tiktok')->nullable();

            // FOOTER CONTENT
            $table->text('footer_text')->nullable();
            $table->string('copyright_text')->nullable();

            // DOMAIN / HOSTING
            $table->string('custom_domain')->nullable();
            $table->text('dns_records')->nullable();
            $table->string('hosting_provider')->nullable();
             // add DNS verification columns
             $table->string('a_record')->nullable();
             $table->string('cname_record')->nullable();
             $table->boolean('dns_verified')->default(false);
             $table->timestamp('verification_checked_at')->nullable();

            // DEPLOYMENT
            $table->string('deployed_url')->nullable();
            $table->boolean('is_deployed')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_business_details');
    }
};
