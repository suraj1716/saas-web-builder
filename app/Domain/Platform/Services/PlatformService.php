<?php
namespace App\Domain\Platform\Services;

use App\Domain\Platform\Models\Testimonial;

class PlatformService
{
    public function landingData()
    {
        return [
            'testimonials' => Testimonial::where('active', true)->get(),
        ];
    }

    public function pricingPlans()
    {
        return [
            [
                'name' => 'Starter',
                'price' => 0,
                'features' => [
                    '1 website',
                    'Basic templates',
                    'Community support'
                ]
            ],
            [
                'name' => 'Pro',
                'price' => 19,
                'features' => [
                    '10 websites',
                    'Premium templates',
                    'Priority support'
                ]
            ],
            [
                'name' => 'Agency',
                'price' => 49,
                'features' => [
                    'Unlimited websites',
                    'All templates',
                    'White label'
                ]
            ]
        ];
    }
}