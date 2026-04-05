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
        'category', // maybe a free-form tag
        'tier',     // basic / pro
        'business_category', // new column
        'css',
        'data',
        'is_active'
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean'
    ];

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