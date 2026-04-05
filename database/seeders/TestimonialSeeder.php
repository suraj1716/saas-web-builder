<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Domain\Platform\Models\Testimonial;
class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Testimonial::create([
            'name' => 'John Carter',
            'company' => 'Startup Inc',
            'message' => 'Amazing platform for building websites fast.'
        ]);
        
        Testimonial::create([
            'name' => 'Sarah Lee',
            'company' => 'Agency Pro',
            'message' => 'This SaaS saved us weeks of development.'
        ]);
    }
}
