<?php
use Illuminate\Support\Facades\Route;
use App\Domain\Templates\Controllers\TemplateController;

Route::get('/marketplace', [TemplateController::class, 'marketplace']);

Route::get('/template/{id}', [TemplateController::class, 'preview']);