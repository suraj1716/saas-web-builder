<?php

namespace App\Domain\Media\Models;

use Illuminate\Database\Eloquent\Model;

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
        'is_temporary'
    ];
}
