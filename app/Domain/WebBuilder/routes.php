<?php

use Illuminate\Support\Facades\Route;
use App\Domain\WebBuilder\Controllers\BuilderController;

Route::prefix('builder')->group(function () {

    Route::get('{id}', [BuilderController::class, 'editor']);

    Route::post('/save', [BuilderController::class, 'save']);

});