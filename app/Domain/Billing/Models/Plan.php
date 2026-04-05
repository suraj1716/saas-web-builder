<?php

namespace App\Domain\Billing\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

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
        'has_pro_templates',
        'white_label',
        'priority_support',
        'features',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'features' => 'array',
        'has_pro_templates' => 'boolean',
        'white_label' => 'boolean',
        'priority_support' => 'boolean',
        'is_active' => 'boolean'
    ];
}