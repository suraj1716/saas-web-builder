<?php

namespace App\Domain\Billing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'stripe_price_id',
        'stripe_product_id',
        'price',
        'currency',
        'billing_interval',
        'max_websites',
        'max_template_slots',
        'max_pages_per_site',
        'max_sections_per_page',
        'max_storage_mb',
        'has_pro_templates',
        'custom_domain',
        'white_label',
        'priority_support',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features'          => 'array',
        'has_pro_templates' => 'boolean',
        'custom_domain'     => 'boolean',
        'white_label'       => 'boolean',
        'priority_support'  => 'boolean',
        'is_active'         => 'boolean',
        'price'             => 'decimal:2',
    ];

    // helper: is this the free plan?
    public function isFree(): bool
    {
        return $this->price == 0;
    }

    // helper: storage limit in bytes for comparisons
    public function maxStorageBytes(): int
    {
        return $this->max_storage_mb * 1024 * 1024;
    }
}