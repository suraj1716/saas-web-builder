<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Domain\Templates\Models\Template;
use App\Domain\Websites\Models\Website;

class PagesController extends Controller
{
    public function marketplace()
    {
        return Inertia::render('Marketplace');
    }

    // Preview default page
    public function templateDetail($id)
    {
        $template = Template::findOrFail($id);

        return Inertia::render('TemplateDetail', [
            'template' => $template,
            'templateId' => $template->id,
            'slug' => 'home',
            'trial' => false
        ]);
    }

    // Preview specific page
    public function templatePage($id, $slug)
    {
        $template = Template::findOrFail($id);

        return Inertia::render('TemplateDetail', [
            'template' => [
                'id' => $template->id,
                'data' => $template->data
            ],
            'templateId' => $template->id,
            'slug' => $slug
        ]);
    }

    // Create real website from template
    public function createFromTemplate($templateId)
    {
        $template = Template::findOrFail($templateId);

        $website = Website::create([
            'user_id' => auth()->id(),
            'template_id' => $template->id,
            'name' => $template->name,
            'data' => $template->data
        ]);

        return redirect("/builder/{$website->id}/home");
    }

    // Trial editor
    public function trialEditor($id, $slug = 'home')
    {
        $template = Template::findOrFail($id);

        return Inertia::render('web-builder/BuilderEditor', [
            'website' => $template->data,
            'templateId' => $template->id,
            'slug' => $slug,
            'trial' => true
        ]);
    }

    public function checkout()
    {
        return Inertia::render('Checkout');
    }

    public function success()
    {
        return Inertia::render('Success');
    }

    public function dashboard()
    {
        return Inertia::render('Dashboard');
    }

    public function userSites()
    {
        return Inertia::render('UserSites');
    }
}