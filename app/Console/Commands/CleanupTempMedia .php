<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\WebBuilder\Models\Media; // use your actual Media model
use Illuminate\Support\Facades\Storage;

class CleanupTempMedia extends Command
{
    protected $signature = 'media:cleanup';
    protected $description = 'Delete unused temporary media';

    public function handle()
    {
        $medias = Media::where('is_temporary', 1)
            ->where('created_at', '<', now()->subHours(2))
            ->get();

        foreach ($medias as $media) {
            // Use the correct disk
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }
            $media->delete();
        }

        $this->info('Temporary media cleaned up: ' . $medias->count());
    }
}