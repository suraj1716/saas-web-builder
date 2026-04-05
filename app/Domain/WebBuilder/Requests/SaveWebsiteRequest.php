<?php

namespace App\Domain\WebBuilder\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveWebsiteRequest extends FormRequest
{

    public function rules()
    {
        return [

            'name' => 'required|string',
            'templateId' => 'nullable|string',
            'data' => 'required|array'

        ];
    }

}