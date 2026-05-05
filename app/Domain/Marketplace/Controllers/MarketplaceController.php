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
         $templates = Template::active()->get();
     
         $normalized = $templates->map(function ($tpl) {
             $data = is_array($tpl->data)
                 ? $tpl->data
                 : json_decode($tpl->data ?? '{}', true);
     
             return [
                 'id' => $tpl->id,
                 'name' => $tpl->name,
                 'data' => [
                     'layout' => $data['layout'] ?? [],
                     'pages' => $data['pages'] ?? [],
                     'design' => $data['design'] ?? [],
                 ],
             ];
         });
     
         return Inertia::render('Marketplace/Marketplace', [
             'templates' => $normalized,
         ]);
     }
   

}