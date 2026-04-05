<?php

namespace App\Domain\Forms\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    protected $table = 'form_fields';

    protected $fillable = [
        'form_id',
        'website_id',
        'section_id',
        'name',
        'label',
        'type',
        'options',
        'required'
    ];

    protected $casts = [
        'options' => 'array',
        'required' => 'boolean'
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
