<?php

namespace App\Domain\Templates\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Templates\Models\Template;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Domain\Media\Services\MediaService;
use App\Domain\Websites\Models\Website;


class TemplateController extends Controller
{

    protected $mediaService;
    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Show template preview
     * Example:
     * /template/1
     */
    public function show($id)
    {
        $template = Template::active()->findOrFail($id);
    
        return Inertia::render('Templates/TemplateDetail', [
            'template' => $template,
            'templateId' => $template->id,
            'website' => $template->data, // keep if needed
        ]);
    }

    /**
     * Show template page preview
     * Example:
     * /template/1/about
     */
    public function page($id, $slug)
    {
        $template = Template::active()->findOrFail($id);
        return Inertia::render('Templates/TemplateDetail', [
            'template' => $template,
            'templateId' => $template->id,
            'slug' => $slug
        ]);
    }

    /**
     * Trial editor
     * Example:
     * /template/1/editor/home
     */
    public function trialEditor($id, $slug = 'home')
    {
        
        $template = Template::active()->findOrFail($id);
          // No json_decode needed
    $website = $template->data;

    // Optional: add template name to website array
    $website['name'] = $template->name;
        return Inertia::render('web-builder/BuilderEditor', [
            'website' => $website,
            'templateId' => $template->id,
            'slug' => $slug,
            'trial' => true
        ]);
    }


  // TemplateController.php
  public function purchase(Request $request, $id)
  {
      $template = Template::findOrFail($id);
  
      $data = $this->mediaService->finalizeFromJson($request->data);
  
      $website = Website::create([
          'user_id' => auth()->id() ?? 1,
          'template_id' => $template->id,
          'name' => $template->name,
          'data' => $data,
      ]);
  
      return redirect("/builder/{$website->id}/home");
  }

}