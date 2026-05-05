<?php

namespace App\Domain\Media\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Media extends Model
{
    protected $fillable = [
        'user_id',
        'path',
        'type',
        'mime',
        'size',
        'width',
        'height',
        'hash',
        'is_temporary',
    ];

    protected $casts = [
        'is_temporary' => 'boolean',
        'size'         => 'integer',
        'width'        => 'integer',
        'height'       => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
