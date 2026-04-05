<?php

namespace App\Domain\Billing\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return inertia('Billing/Subscription', [
            'subscription' => $user->subscription('default')
        ]);
    }

    public function cancel(Request $request)
    {
        $request->user()
            ->subscription('default')
            ->cancel();

        return back();
    }
}
