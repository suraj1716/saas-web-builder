<?php
use Illuminate\Support\Facades\Route;

use App\Domain\Platform\Controllers\LandingController;
use App\Domain\Platform\Controllers\PricingController;
use App\Domain\Billing\Controllers\CheckoutController;
use App\Domain\Billing\Controllers\SubscriptionController;

Route::get('/', LandingController::class)->name('landing');

Route::get('/pricing', [PricingController::class, 'index'])->name('pricing');

Route::middleware(['auth'])->group(function () {

    Route::post('/subscribe', [CheckoutController::class, 'subscribe'])
        ->name('subscribe');

    Route::get('/subscription', [SubscriptionController::class, 'index'])
        ->name('subscription');

    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('subscription.cancel');

});