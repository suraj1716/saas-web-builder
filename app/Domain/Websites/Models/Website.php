<?php

namespace App\Domain\Websites\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Websites\Models\WebsiteBusinessDetail;

class Website extends Model
{

    protected $table = 'websites';

    protected $fillable = [
        'user_id',
        'template_id',
        'name',
        'status',
        'subdomain',
        'custom_domain',
        'pages_count',
        'data',
        'css',
        'css_vars',
        'published_at',
    ];

    protected $casts = [
        'data' => 'array',
        'css_vars' => 'array','published_at' => 'datetime',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }
    public function business()
{
    return $this->hasOne(WebsiteBusinessDetail::class);
}

}