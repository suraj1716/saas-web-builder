<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplatePurchase extends Model
{
    protected $fillable = [
        'user_id',
        'template_id',
        'amount_paid',
        'currency',
        'stripe_payment_intent_id',
        'status',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}