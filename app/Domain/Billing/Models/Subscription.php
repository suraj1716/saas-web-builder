<?php

namespace App\Domain\Billing\Models;

use Laravel\Cashier\Subscription as CashierSubscription;
use App\Domain\Billing\Models\Plan;
use App\Models\User;


class Subscription extends CashierSubscription
{
    protected $table = 'subscriptions';

    protected $fillable = [
        'user_id',
        'type',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'trial_ends_at',
        'ends_at',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    // ✅ Link to Plan using Stripe price ID
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'stripe_price', 'stripe_price_id');
    }

}