<?php

namespace App\Domain\Websites\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Websites\Models\Website;
use App\Domain\Websites\Models\WebsiteBusinessDetail;
use App\Domain\Media\Models\Media;
use App\Domain\Media\Services\MediaService;
use Inertia\Inertia;
class WebsiteController extends Controller
{
    protected $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    public function settings(Website $website)
    {
        $details = WebsiteBusinessDetail::firstOrCreate([
            'website_id' => $website->id,
        ]);

      
        return Inertia::render('websites/SettingsPage', [
            'website' => $website,
            'details' => $details,
        ]);
    }

    public function updateSettings(Request $request, Website $website)
    {
        $details = WebsiteBusinessDetail::firstOrCreate([
            'website_id' => $website->id,
        ]);
    
        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address_line_1' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'youtube' => 'nullable|url|max:255',
            'custom_domain' => 'nullable|string|max:255',
            'logo' => 'nullable|file|image|max:2048',
            'favicon' => 'nullable|file|image|max:1024',
        ]);
    
        if ($request->hasFile('logo')) {
            $media = $this->mediaService->upload($request->file('logo'));
            $validated['logo'] = $media->path;
        }
    
        if ($request->hasFile('favicon')) {
            $media = $this->mediaService->upload($request->file('favicon'));
            $validated['favicon'] = $media->path;
        }
    
        $details->update($validated);
    
        // Safe DNS verification
        $this->verifyDns($details);
    
        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    protected function verifyDns(WebsiteBusinessDetail $details)
    {
        $domain = $details->custom_domain;

        if (!$domain) {
            $details->update([
                'dns_verified' => false,
                'verification_checked_at' => now(),
            ]);
            return;
        }

        $pointsToYourIP = false;
        $pointsToYourHost = false;

        // Safe A record check
        $aRecords = @dns_get_record($domain, DNS_A) ?: [];
        foreach ($aRecords as $rec) {
            if (isset($rec['ip']) && $rec['ip'] === config('app.server_ip')) {
                $pointsToYourIP = true;
                break;
            }
        }

        // Safe CNAME check
        $cnameRecords = @dns_get_record('www.' . $domain, DNS_CNAME) ?: [];
        foreach ($cnameRecords as $rec) {
            if (isset($rec['target']) && $rec['target'] === 'app.yoursaas.com') {
                $pointsToYourHost = true;
                break;
            }
        }

        $details->update([
            'dns_verified' => $pointsToYourIP || $pointsToYourHost,
            'verification_checked_at' => now(),
        ]);
    }
}