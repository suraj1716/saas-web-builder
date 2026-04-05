<?php

namespace App\Domain\Websites\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteBusinessDetail extends Model
{
    protected $table = 'website_business_details';

    protected $fillable = [
        'website_id',

        // BUSINESS INFO
        'business_name',
        'business_email',
        'phone',

        // ADDRESS
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'country',
        'zip',

        // BRANDING
        'logo',
        'favicon',

        // SOCIAL LINKS
        'facebook',
        'instagram',
        'twitter',
        'linkedin',
        'youtube',
        'tiktok',

        // FOOTER CONTENT
        'footer_text',
        'copyright_text',

        // DOMAIN / HOSTING
        'custom_domain',
        'a_record',
        'cname_record',
        'dns_verified',
        'verification_checked_at',
        'dns_records',
        'hosting_provider',

        // DEPLOYMENT
        'deployed_url',
        'is_deployed',
    ];

    protected $casts = [
        'dns_verified' => 'boolean',
        'is_deployed' => 'boolean',
        'verification_checked_at' => 'datetime',
    ];
}