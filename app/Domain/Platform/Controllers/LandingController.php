<?php
namespace App\Domain\Platform\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Domain\Platform\Services\PlatformService;

class LandingController extends Controller
{
    public function __invoke(PlatformService $platformService)
    {
        $data = $platformService->landingData();

        return Inertia::render('Platform/Landing', [
            'testimonials' => $data['testimonials']
        ]);
    }
}