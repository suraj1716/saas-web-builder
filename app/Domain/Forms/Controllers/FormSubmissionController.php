<?php

namespace App\Domain\Forms\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Domain\Forms\Models\FormSubmission;

class FormSubmissionController extends Controller
{
    public function submit(Request $request, $websiteId, $sectionId)
    {
        $data = $request->input('data');
// dd($data);
        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid data'], 422);
        }

        FormSubmission::create([
            'website_id' => $websiteId,
            'section_id' => $sectionId,
            'data' => $data
        ]);

        return response()->json(['success' => true]);
    }


    public function getSubmissions(Request $request, $websiteId)
    {
        $type = $request->query('type', null); // optional, can filter by section prefix

        // Get all submissions for this website
        $query = FormSubmission::where('website_id', $websiteId);

        if ($type) {
            // filter by section_id prefix (e.g., "contact", "booking")
            $query->where('section_id', 'like', "$type%");
        }

        $submissions = $query->orderBy('created_at', 'desc')->get();

        // Convert JSON 'data' to flat array for frontend table
        $submissionsArray = $submissions->map(function ($sub) {
            $flat = [
                'id' => $sub->id,
                'section_id' => $sub->section_id,
                'created_at' => $sub->created_at->format('Y-m-d H:i:s'),
                'read' => $sub->data['read'] ?? false,
            ];

            // Merge all data fields dynamically
            if (is_array($sub->data)) {
                foreach ($sub->data as $key => $value) {
                    if ($key !== 'read') { // skip read flag
                        $flat[$key] = $value;
                    }
                }
            }

            return $flat;
        });

        return response()->json([
            'submissions' => $submissionsArray,
        ]);
    }

    // Mark a submission as read
    public function markRead($id)
    {
        $submission = FormSubmission::findOrFail($id);

        // Save read flag inside JSON data
        $data = $submission->data ?? [];
        $data['read'] = true;

        $submission->data = $data;
        $submission->save();

        return response()->json(['success' => true]);
    }


}