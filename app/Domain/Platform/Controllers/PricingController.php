<?php
namespace App\Domain\Platform\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Domain\Platform\Services\PlatformService;

class PricingController extends Controller
{
    public function index(PlatformService $platformService)
    {
        return Inertia::render('Platform/Pricing', [
            'plans' => $platformService->pricingPlans()
        ]);
    }
}