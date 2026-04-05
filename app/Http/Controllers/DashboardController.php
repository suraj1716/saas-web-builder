<?php
use Inertia\Inertia;
use App\Domain\Websites\Models\Website;


class ProfileController extends Controller
{
public function index()
{
    $websites = Website::latest()->get(); 
    // later change to ->where('user_id', auth()->id())

    return Inertia::render('Dashboard', [
        'websites' => $websites
    ]);
}


}