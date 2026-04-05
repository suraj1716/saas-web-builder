<?php

namespace App\Domain\Websites\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Websites\Models\WebsiteBusinessDetail;

class Website extends Model
{

    protected $table = 'websites';

    protected $fillable = [
        'user_id',
        'name',
        'template_id',
        'data'
    ];

    protected $casts = [
        'data' => 'array'
    ];

    public function business()
{
    return $this->hasOne(WebsiteBusinessDetail::class);
}

}