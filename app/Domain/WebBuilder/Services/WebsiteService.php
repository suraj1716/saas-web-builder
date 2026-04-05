<?php

namespace App\Domain\WebBuilder\Services;

use App\Domain\Websites\Models\Website;

class WebsiteService
{

    public function save(array $data)
    {

        return Website::updateOrCreate(

            ['id' => $data['id'] ?? null],

            [
                'user_id' => auth()->id(),
                'name' => $data['name'],
                'template_id' => $data['templateId'],
                'data' => $data['data']
            ]

        );

    }

}