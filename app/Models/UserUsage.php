<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserUsage extends Model
{
    protected $table = 'user_usage';

    protected $fillable = [
        'user_id',
        'storage_bytes_used',
        'websites_count',
        'template_slots_used',
    ];

    protected $casts = [
        'storage_bytes_used'  => 'integer',
        'websites_count'      => 'integer',
        'template_slots_used' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}