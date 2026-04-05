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
        // Check if this ID is a real website
        $website = Website::find($id);
    
        $trial = false;
    
        if (!$website) {
            // This is a trial/demo session for a template
            $template = Template::findOrFail($id);
    
            $website = (object)[
                'id' => 'trial', // temporary ID
                'template_id' => $template->id,
                'name' => 'Demo: ' . $template->name,
                'data' => $template->data,
            ];
    
            $trial = true; // mark this session as trial
        }
    
        return Inertia::render('web-builder/BuilderEditor', [
            'website' => array_merge($website->data, [
                'name' => $website->name
            ]),
            'websiteId' => $website->id,
            'templateId' => $website->template_id,
            'slug' => $slug,
            'trial' => $trial,
        ]);
    }

  
    public function save(Request $request, $id)
    {
        $website = Website::findOrFail($id);
    
        // Finalize media in JSON
        $data = $this->mediaService->finalizeFromJson($request->data ?? []);
    
        // -----------------------------
        // Handle forms (contact, quote, etc.)
        // -----------------------------
        if (!empty($data['pages']) && is_array($data['pages'])) {
            foreach ($data['pages'] as &$page) {
                if (!empty($page['sections']) && is_array($page['sections'])) {
                    foreach ($page['sections'] as &$section) {
    
                        // Only handle "form" type sections
                        if (in_array($section['type'], ['contact', 'quote'])) {
    
                            if (!empty($section['content']['fields']) && is_array($section['content']['fields'])) {
    
                                // Create or find the form for this section
                                $form = Form::firstOrCreate(
                                    [
                                        'website_id' => $website->id,
                                        'section_id' => $section['id'], // ensure this column exists in DB!
                                    ],
                                    [
                                        'name' => $section['content']['title'] ?? ucfirst($section['type']) . " Form",
                                        'type' => $section['type'],
                                        ]
                                );
    
                                // Delete old fields
                                FormField::where('form_id', $form->id)->delete();
    
                                // Insert new fields
                                foreach ($section['content']['fields'] as $field) {
                                    FormField::create([
                                        'form_id'    => $form->id,
                                        'website_id' => $website->id,
                                        'section_id' => $section['id'],
    
                                        'name'       => $field['name'] ?? null,
                                        'label'      => $field['label'] ?? null,
                                        'type'       => $field['type'] ?? 'text',
                                        'options'    => !empty($field['options']) ? json_encode($field['options']) : null,
                                        'required'   => $field['required'] ?? false,
                                    ]);
                                }
    
                                // Store form_id in section content
                                $section['content']['form_id'] = $form->id;
                            }
                        }
                    }
                }
            }
        }
    
        // -----------------------------
        // Update website JSON
        // -----------------------------
        $website->update([
            'name' => $data['name'] ?? $website->name,
            'data' => $data,
        ]);
    
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
        Log::info("Reset called for Website ID: {$websiteId}", ['website' => $website->toArray()]);
    
        // Fetch template for this website
        $template = Template::find($website->template_id);
        Log::info("Template fetched for reset", ['template' => $template ? $template->toArray() : null]);
    
        if (!$template) {
            return response()->json([
                'error' => 'Template not found for this website'
            ], 404);
        }
    
        // Use the 'data' column from template
        if (empty($template->data)) {
            return response()->json([
                'error' => 'Template data is empty'
            ], 500);
        }
    
        // Reset website data
        $website->data = json_decode(json_encode($template->data), true); // convert stdClass to array
        $website->save();
    
        Log::info("Website reset successfully", ['website_id' => $website->id, 'data' => $website->data]);
    
        return response()->json([
            'message' => 'Website reset to template successfully',
            'website' => $website->fresh()
        ]);
    }


}