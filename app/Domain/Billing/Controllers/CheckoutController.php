<?php

namespace App\Domain\Billing\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function subscribe(Request $request)
    {
        $priceId = $request->price_id;

        return $request->user()
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('dashboard'),
                'cancel_url' => route('pricing'),
            ]);
    }
}
