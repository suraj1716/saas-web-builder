<?php

namespace App\Domain\Media\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Media\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Domain\Media\Services\MediaService;
class MediaController extends Controller
{
    // Upload any image/video
    public function upload(Request $request, MediaService $service)
    {
        $request->validate([
            'file' => 'required|file|max:20480'
        ]);

        $media = $service->upload($request->file('file'));

        return response()->json([

            'id' => $media->id,

            'url' => asset('storage/'.$media->path),

            'type' => $media->type
        ]);
    }

    public function cleanup()
    {
        $old = Media::where('is_temporary', true)
            ->where('created_at', '<', now()->subHours(2))
            ->get();

        foreach ($old as $media) {

            Storage::disk('public')->delete($media->path);

            $media->delete();
        }

        return response()->json([
            'deleted' => $old->count()
        ]);
    }
}