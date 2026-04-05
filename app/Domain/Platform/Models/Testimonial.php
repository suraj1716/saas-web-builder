<?php

namespace App\Domain\Platform\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name',
        'company',
        'message',
        'avatar',
        'active'
    ];
}
