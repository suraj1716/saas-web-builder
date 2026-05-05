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


    public function apiShow($id)
    {
        $template = Template::active()->findOrFail($id);
    
        // Normalize structure so frontend NEVER deals with nested chaos
        $data = $template->data ?? [];
    
        return response()->json([
            'id' => $template->id,
            'name' => $data['name'] ?? $template->name,
    
            // IMPORTANT: flatten structure
            'data' => [
                'layout' => $data['data']['layout'] ?? [],
                'pages'  => $data['data']['pages'] ?? [],
            ],
    
            'css' => $template->css ?? '',
            'cssVars' => $template->css_vars ?? [],
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


     public function trialEditor(Request $request, $id, $slug = 'home')
     {
         $website = Website::find($id);
     
         // If website exists → normal editor
         if ($website) {
             $website->update([
                 'data' => $request->data,
                 'css' => $request->css,
                 'css_vars' => $request->cssVars,
             ]);
     
             return Inertia::render('web-builder/BuilderEditor', [
                 'website' => [
                     'id' => null,
                     'name' => $website->name,
                     'data' => $website->data,
                     'css' => $website->css ?? '',
                     'cssVars' => $website->css_vars ?? [],
                 ],
                 'slug' => $slug,
                 'trial' => false,
             ]);
         }
         
     
         // 🔥 Trial mode (Template fallback)
         $template = Template::findOrFail($id);
     
         return Inertia::render('web-builder/BuilderEditor', [
             'website' => [
                 'id' => 'trial',
                 'name' => $template->name,
                 'data' => $template->data,
                 'css' => $template->css ?? '',
                 'cssVars' => $template->css_vars ?? [],
             ],
             'templateId' => $template->id,
             'slug' => $slug,
             'trial' => true,
         ]);
     }

    private function getTemplateCss($template)
{
    $name = $template->name;

    $path = storage_path("templates/{$name}/index.css");

    if (file_exists($path)) {
        return file_get_contents($path);
    }

    return "
    .simple-template-1 {
        --color-primary: #4f46e5;
        --color-text: #1f2937;
        --color-bg: #ffffff;
        --color-muted: #6b7280;
        --color-border: #e5e7eb;
    }";
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
  
          // ✅ fallback to template css
          'css' => $request->input('css') ?? $template->css,
          'css_vars' => $request->input('cssVars') ?? $template->css_vars,
      ]);
  
      return redirect("/builder/{$website->id}/home");
  }

  public function createReactTemplate(Request $request)
{
    $name = $request->input('name');
    $site = $request->input('site');

    // Folder path
    $folder = storage_path("templates/{$name}");
    if (!file_exists($folder)) {
        mkdir($folder, 0755, true);
    }

    // Save template.json
    file_put_contents("{$folder}/template.json", json_encode($site, JSON_PRETTY_PRINT));

    // Save CSS
    $cssContent = $request->input('css') ?? "";
    file_put_contents("{$folder}/index.css", $cssContent);

    // Node script path (UPDATED for .cjs)
    $scriptPath = base_path("react-app-generator/generateTemplate.cjs");

    // Safe command
    $cmd = "node " . escapeshellarg($scriptPath) . " " . escapeshellarg($name);

    exec($cmd . " 2>&1", $output, $return_var);

    if ($return_var !== 0) {
        return response()->json([
            'error' => 'Failed to generate React app',
            'output' => $output,
            'cmd' => $cmd
        ], 500);
    }

    return response()->json([
        'success' => true,
        'message' => "React app generated for template '{$name}'"
    ]);
}


}