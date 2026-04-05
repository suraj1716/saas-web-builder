<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 's@gmail.com'],
            [
                'name' => 'Admin User',
                'email' => 's@gmail.com',
                'password' => Hash::make('qwerty'),
            ]
        );
    }
}