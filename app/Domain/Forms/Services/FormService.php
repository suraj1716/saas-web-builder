<?php
namespace App\Domain\Forms\Services;

use App\Domain\Forms\Models\FormSubmission;

class FormService
{
    public function submit($form, $data)
    {
        return FormSubmission::create([
            'form_id' => $form->id,
            'data' => $data
        ]);
    }
}