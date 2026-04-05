<?php
namespace App\Domain\Platform\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Platform/Dashboard/Index');
    }
}