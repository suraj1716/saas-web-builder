<?php

namespace App\Domain\Templates\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Websites\Models\Website;

class Template extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'preview_image',
        'category',
        'business_category',
        'tier',
        'one_time_price',
        'data',
        'css',
        'css_vars',
        'is_active',
    ];

    protected $casts = [
        'data'           => 'array',
        'css_vars'       => 'array',
        'is_active'      => 'boolean',
        'one_time_price' => 'decimal:2',
    ];

    public function isPremium(): bool
    {
        return $this->tier === 'premium';
    }

    public function isFree(): bool
    {
        return $this->tier === 'free' || $this->tier === 'basic';
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(TemplatePurchase::class);
    }

    public function websites()
    {
        return $this->hasMany(Website::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeTier($query, $tier)
    {
        return $query->where('tier', $tier);
    }

    public function scopeBusinessCategory($query, $category)
    {
        return $query->where('business_category', $category);
    }
}