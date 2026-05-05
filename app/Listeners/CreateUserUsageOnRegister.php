<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\UserUsage;
use Illuminate\Auth\Events\Registered;
class CreateUserUsageOnRegister
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        UserUsage::create([
            'user_id'              => $event->user->id,
            'storage_bytes_used'   => 0,
            'websites_count'       => 0,
            'template_slots_used'  => 0,
        ]);
    }
}
