<?php

namespace App\Domain\WebBuilder\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Domain\Websites\Models\Website;
use App\Domain\Templates\Models\Template;
use App\Domain\Forms\Models\Form;
use App\Domain\Forms\Models\FormField;
use App\Domain\Media\Services\MediaService;

use Illuminate\Support\Facades\Log;
class BuilderController extends Controller
{
    protected $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    // Show editor
    public function editor($id, $slug = 'home')
    {
        $website = Website::find($id);
    
        if (!$website) {
            $template = Template::findOrFail($id);
    
            $website = (object)[
                'id' => 'trial',
                'template_id' => $template->id,
                'name' => 'Demo: ' . $template->name,
                'data' => $template->data,
                'css' => $template->css ?? '', // ✅
                
            ];
    
            $trial = true;
        } else {
            $trial = false;
        }
    
        // 🔥 DEBUG
        Log::info("EDITOR LOAD CSS", [
            'css' => $website->css,
        ]);
    
        return Inertia::render('web-builder/BuilderEditor', [
            'website' => [
                'name' => $website->name,
                'data' => $website->data,
                'css' => $website->css ?? '', 
                'cssVars' => $website->css_vars ?? [], 
            ],
            'websiteId' => $website->id,
            'templateId' => $website->template_id,
            'slug' => $slug,
            'trial' => $trial,
        ]);
    }

  
  public function save(Request $request, $id)
{
    $type = $request->type ?? 'website';

    // -----------------------------
    // Choose model dynamically
    // -----------------------------
    if ($type === 'template') {
        $model = Template::findOrFail($id);
    } else {
        $model = Website::findOrFail($id);
    }

    // -----------------------------
    // Finalize media
    // -----------------------------
    $data = $this->mediaService->finalizeFromJson($request->data ?? []);

    // -----------------------------
    // Handle forms ONLY for websites
    // -----------------------------
    if ($model instanceof Website) {
        if (!empty($data['pages']) && is_array($data['pages'])) {
            foreach ($data['pages'] as &$page) {
                if (!empty($page['sections']) && is_array($page['sections'])) {
                    foreach ($page['sections'] as &$section) {

                        if (in_array($section['type'], ['contact', 'quote'])) {

                            if (!empty($section['content']['fields'])) {

                                $form = Form::firstOrCreate(
                                    [
                                        'website_id' => $model->id,
                                        'section_id' => $section['id'],
                                    ],
                                    [
                                        'name' => $section['content']['title'] ?? ucfirst($section['type']) . " Form",
                                        'type' => $section['type'],
                                    ]
                                );

                                FormField::where('form_id', $form->id)->delete();

                                foreach ($section['content']['fields'] as $field) {
                                    FormField::create([
                                        'form_id'    => $form->id,
                                        'website_id' => $model->id,
                                        'section_id' => $section['id'],
                                        'name'       => $field['name'] ?? null,
                                        'label'      => $field['label'] ?? null,
                                        'type'       => $field['type'] ?? 'text',
                                        'options'    => !empty($field['options']) ? json_encode($field['options']) : null,
                                        'required'   => $field['required'] ?? false,
                                    ]);
                                }

                                $section['content']['form_id'] = $form->id;
                            }
                        }
                    }
                }
            }
        }
    }

    // -----------------------------
    // Save model (Website OR Template)
    // -----------------------------
    unset($data['css']);

    $model->update([
        'name' => $data['name'] ?? $model->name,
        'data' => $data,
        'css' => $request->css,
        'css_vars' => $request->cssVars ?? [],
    ]);

    Log::info('SAVE REQUEST', [
        'type' => $type,
        'model_id' => $model->id,
        'css' => $request->css,
        'has_data' => isset($request->data),
    ]);

    $model->refresh();

    return redirect()->back();
}


    // Buy template → clone + finalize media
    public function purchase(Request $request, $id)
    {
        $template = Template::findOrFail($id);

        $data = $this->mediaService->finalizeFromJson($request->data);

        $website = Website::create([
            'user_id' => auth()->id() ?? 1,
            'template_id' => $template->id,
            'name' => $template->name,
            'data' => $data
        ]);

        return redirect("/builder/{$website->id}/home");
    }

    public function reset($websiteId)
    {
        $website = Website::findOrFail($websiteId);
    
        Log::info("Reset called for Website ID: {$websiteId}");
    
        $template = Template::find($website->template_id);
    
        if (!$template) {
            return response()->json([
                'error' => 'Template not found for this website'
            ], 404);
        }
    
        if (empty($template->data)) {
            return response()->json([
                'error' => 'Template data is empty'
            ], 500);
        }
    
        // Normalize safely
        $templateData = is_array($template->data)
            ? $template->data
            : json_decode($template->data, true);
    
        if (!$templateData) {
            return response()->json([
                'error' => 'Invalid template data format'
            ], 500);
        }
    
        // Optional: backup current state (VERY recommended for builders)
        $website->update([
            'data_backup' => $website->data
        ]);
    
        // Reset
        $website->data = $templateData;
        $website->save();
    
        return response()->json([
            'message' => 'Website reset to template successfully',
            'website' => $website->fresh()
        ]);
    }


}