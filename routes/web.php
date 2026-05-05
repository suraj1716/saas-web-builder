<?php

use App\Http\Controllers\ProfileController;
use App\Domain\Marketplace\Controllers\MarketplaceController;
use App\Domain\WebBuilder\Controllers\BuilderController;
use App\Domain\Media\Controllers\MediaController;
use App\Domain\Forms\Controllers\FormSubmissionController;
use App\Domain\Websites\Models\Website;
use App\Domain\Websites\Controllers\WebsiteController;
use App\Domain\Templates\Controllers\TemplateController;
use App\Domain\Platform\Controllers\LandingController;
use App\Domain\Platform\Controllers\PricingController;
use Laravel\Cashier\Http\Controllers\WebhookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Domain\Templates\Models\Template;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| These are the default routes provided by Laravel Breeze + Inertia.
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),    // For Breeze login/register links
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



// Dashboard home → list all websites
Route::get('/dashboard', function () {
    $websites = Website::latest()->get(); // later: ->where('user_id', auth()->id())
    return Inertia::render('Dashboard', [
        'websites' => $websites,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Dashboard → Form Submissions routes
Route::prefix('dashboard')->middleware(['web','auth', 'verified'])->group(function () {
    // Get submissions for a website (filter by type query param)
    Route::get('/{websiteId}/submissions', [FormSubmissionController::class, 'getSubmissions'])
        ->name('dashboard.submissions.getSubmissions');

    // Mark a submission as read
    Route::post('/submissions/{id}/mark-read', [FormSubmissionController::class, 'markRead'])
        ->name('dashboard.submissions.markRead');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


/* TEMPLATE DEMO EDITOR */
Route::get('/templates/{id}', [TemplateController::class, 'show'])->name('templates.show');
Route::get('/api/templates/{id}', [TemplateController::class, 'apiShow']);
Route::get('/template/{id}/editor/{slug?}', [TemplateController::class, 'trialEditor'])
    ->where('slug', '.*');
Route::post('/templates/{id}/purchase', [TemplateController::class, 'purchase'])->name('templates.purchase');
  
Route::get('/template/{id}/{slug}', [TemplateController::class, 'page'])
    ->where('slug', '.*');


/* WEBSITE BUILDER */
Route::get('/builder/{id}/{slug?}', [BuilderController::class, 'editor'])
    ->where('slug', '.*')->name('builder.edit');


/*Marketplace*/
Route::get('/marketplace', [MarketplaceController::class, 'index'])->name('marketplace');



/* BUILDER */

Route::post('/builder/{id}/save', [BuilderController::class, 'save']);
Route::post('/builder/{website}/reset', [BuilderController::class, 'reset'])->name('builder.reset');
Route::get('/builder/{id}/{slug?}', [BuilderController::class, 'editor'])
    ->where('slug', '.*');

Route::middleware(['auth'])->group(function () {
    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::get('/media/cleanup', [MediaController::class, 'cleanup']);
});


Route::get('/websites/{website}/settings', [WebsiteController::class, 'settings'])
    ->name('websites.settings');
Route::post('/websites/{website}/update-settings', [WebsiteController::class, 'updateSettings'])
    ->name('websites.update-settings');

    
Route::post('/forms/submit/{websiteId}/{sectionId}', [FormSubmissionController::class, 'submit']);



Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);


Route::post('/admin/create-template', [TemplateController::class, 'createReactTemplate'])
    ->name('admin.create-template');

require __DIR__.'/platform.php';



// Route::get('/marketplace', [PagesController::class, 'marketplace'])->name('marketplace');

// /* TRIAL EDITOR FIRST */
// Route::get('/template/{id}/editor/{slug?}', [PagesController::class, 'trialEditor'])->name('template.editor');

// /* TEMPLATE PREVIEW */
// Route::get('/template/{id}', [PagesController::class, 'templateDetail'])->name('template.show');
// Route::get('/template/{id}/{slug}', [PagesController::class, 'templatePage']);

// /* BUILDER */
// Route::post('/templates/{id}/purchase', [BuilderController::class, 'purchase']);
// Route::get('/builder/{id}/{slug?}', [BuilderController::class, 'editor'])
//     ->where('slug', '.*');
// Route::post('/builder/{id}/save', [BuilderController::class, 'save']);
// Route::post('/builder/{website}/reset', [BuilderController::class, 'reset'])->name('builder.reset');


// Route::middleware(['auth'])->group(function () {
//     Route::post('/media/upload', [MediaController::class, 'upload']);
//     Route::get('/media/cleanup', [MediaController::class, 'cleanup']);
// });



// require app_path('Domain/WebBuilder/routes.php');
require __DIR__.'/auth.php';