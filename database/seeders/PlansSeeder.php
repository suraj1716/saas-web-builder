<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Domain\Billing\Models\Plan;
class PlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  // database/seeders/PlansSeeder.php
public function run(): void
{
    $plans = [
        [
            'name'                 => 'Free',
            'slug'                 => 'free',
            'price'                => 0,
            'currency'             => 'USD',
            'billing_interval'     => 'month',
            'max_websites'         => 1,
            'max_template_slots'   => 3,
            'max_pages_per_site'   => 3,
            'max_sections_per_page'=> 5,
            'max_storage_mb'       => 50,
            'has_pro_templates'    => false,
            'custom_domain'        => false,
            'white_label'          => false,
            'priority_support'     => false,
            'is_active'            => true,
            'sort_order'           => 1,
        ],
        [
            'name'                 => 'Starter',
            'slug'                 => 'starter',
            'price'                => 19,
            'currency'             => 'USD',
            'billing_interval'     => 'month',
            'max_websites'         => 3,
            'max_template_slots'   => 5,
            'max_pages_per_site'   => 10,
            'max_sections_per_page'=> 10,
            'max_storage_mb'       => 500,
            'has_pro_templates'    => false,
            'custom_domain'        => true,
            'white_label'          => false,
            'priority_support'     => false,
            'is_active'            => true,
            'sort_order'           => 2,
        ],
        [
            'name'                 => 'Pro',
            'slug'                 => 'pro',
            'price'                => 49,
            'currency'             => 'USD',
            'billing_interval'     => 'month',
            'max_websites'         => 10,
            'max_template_slots'   => 10,
            'max_pages_per_site'   => 9999, // unlimited
            'max_sections_per_page'=> 9999, // unlimited
            'max_storage_mb'       => 5000,
            'has_pro_templates'    => true,
            'custom_domain'        => true,
            'white_label'          => false,
            'priority_support'     => false,
            'is_active'            => true,
            'sort_order'           => 3,
        ],
        [
            'name'                 => 'Agency',
            'slug'                 => 'agency',
            'price'                => 99,
            'currency'             => 'USD',
            'billing_interval'     => 'month',
            'max_websites'         => 9999, // unlimited
            'max_template_slots'   => 9999, // unlimited
            'max_pages_per_site'   => 9999, // unlimited
            'max_sections_per_page'=> 9999, // unlimited
            'max_storage_mb'       => 20000,
            'has_pro_templates'    => true,
            'custom_domain'        => true,
            'white_label'          => true,
            'priority_support'     => true,
            'is_active'            => true,
            'sort_order'           => 4,
        ],
    ];

    foreach ($plans as $plan) {
        Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
    }
}
}
