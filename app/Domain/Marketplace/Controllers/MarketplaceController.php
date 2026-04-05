<?php

namespace App\Domain\Marketplace\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Templates\Models\Template;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    /**
     * Show template preview
     * Example:
     * /template/1
     */

     public function index()
    {
        // You are using $id but index() doesn't receive it, so either pass $id or list all templates
        $templates = Template::active()->get(); // get all active templates
// dd($templates);
 
        return Inertia::render('Marketplace/Marketplace', [
            
            'templates' => $templates,
        ]);
    }
   

}