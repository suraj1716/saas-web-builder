<?php

namespace App\Domain\Forms\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    protected $fillable = ['website_id', 'section_id', 'data'];
    protected $casts = [
        'data' => 'array',
    ];
}
