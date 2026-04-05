<?php

namespace App\Domain\Media\Services;

use App\Domain\Media\Models\Media;
use Illuminate\Support\Facades\Storage;

class MediaService
{
    public function upload($file)
    {
        $hash = md5_file($file->getRealPath());

        $existing = Media::where('hash', $hash)->first();

        if ($existing) {
            return $existing;
        }

        $type = $this->detectType($file);

        $folder = $this->folder($type);

        $path = $file->store($folder, 'public');

        $width = null;
        $height = null;

        if ($type === 'image') {

            [$width, $height] = getimagesize($file);
        }

        return Media::create([

            'user_id' => auth()->id(),

            'path' => $path,

            'type' => $type,

            'mime' => $file->getMimeType(),

            'size' => $file->getSize(),

            'width' => $width,
            'height' => $height,

            'hash' => $hash,

            'is_temporary' => true
        ]);
    }

    private function detectType($file)
    {
        $mime = $file->getMimeType();

        if (str_contains($mime, 'image')) return 'image';

        if (str_contains($mime, 'video')) return 'video';

        if (str_contains($mime, 'svg')) return 'svg';

        return 'other';
    }

    private function folder($type)
    {
        return match ($type) {

            'image' => 'images',

            'video' => 'videos',

            'svg' => 'svg',

            default => 'files'
        };
    }

    public function finalizeFromJson(array $json): array
    {
        $ids = $this->extractMediaIds($json);

        if (!empty($ids)) {

            Media::whereIn('id', $ids)->update([
                'is_temporary' => false
            ]);
        }

        return $json;
    }

    private function extractMediaIds(array $json): array
    {
        $ids = [];

        array_walk_recursive($json, function ($value, $key) use (&$ids) {

            if ($key === 'media_id') {

                $ids[] = $value;
            }
        });

        return $ids;
    }
}