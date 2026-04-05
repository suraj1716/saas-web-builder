<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Templates\Models\Template;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Example: Simple Website Template
        Template::updateOrCreate(
            ['slug' => 'simple-website'],
            [
                'name' => 'Simple Website',
                'preview_image' => '/images/templates/simple-website.png',
                'category' => 'Business',
                'is_active' => true,
                'data' => [
                    'cssClass' => 'simple-template-1',
                    'design' => [
                        'primaryColor' => '#4f46e5',
                        'backgroundColor' => '#ffffff',
                        'textColor' => '#1f2937',
                        'mutedColor' => '#6b7280',
                        'borderColor' => '#e5e7eb'
                    ],
                    'layout' => [
                        'navbar' => [
                            'id' => 'navbar-1',
                            'type' => 'navbar',
                            'content' => ['title' => 'My Simple Site'],
                            'draggable' => false
                        ],
                        'footer' => [
                            'id' => 'footer-1',
                            'type' => 'footer',
                            'content' => ['copyright' => '© 2026'],
                            'draggable' => false
                        ]
                    ],
                    'pages' => [
                        [
                            'pageId' => 'home',
                            'title' => 'Home',
                            'slug' => 'home',
                            'sections' => [
                                [
                                    'id' => 'hero-1',
                                    'type' => 'hero',
                                    'content' => ['heading' => 'Welcome to Simple Website'],
                                    'draggable' => true
                                ],
                                [
                                    'id' => 'about-1',
                                    'type' => 'about',
                                    'content' => ['text' => 'About us section'],
                                    'draggable' => true
                                ]
                            ]
                        ],
                        [
                            'pageId' => 'contact',
                            'title' => 'Contact',
                            'slug' => 'contact',
                            'sections' => [
                                [
                                    'id' => 'contact-1',
                                    'type' => 'contact',
                                    'content' => ['email' => 'info@simple.com'],
                                    'draggable' => true
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        );

        // Add more templates if needed
        Template::updateOrCreate(
            ['slug' => 'modern-business'],
            [
                'name' => 'Modern Business',
                'preview_image' => '/images/templates/modern-business.png',
                'category' => 'Business',
                'is_active' => true,
                'data' => [
                    'cssClass' => 'modern-template-1',
                    'design' => [
                        'primaryColor' => '#ef4444',
                        'backgroundColor' => '#f3f4f6',
                        'textColor' => '#111827'
                    ],
                    'layout' => [
                        'navbar' => [
                            'id' => 'navbar-1',
                            'type' => 'navbar',
                            'content' => ['title' => 'Modern Business'],
                            'draggable' => false
                        ],
                        'footer' => [
                            'id' => 'footer-1',
                            'type' => 'footer',
                            'content' => ['copyright' => '© 2026 Modern'],
                            'draggable' => false
                        ]
                    ],
                    'pages' => [
                        [
                            'pageId' => 'home',
                            'title' => 'Home',
                            'slug' => 'home',
                            'sections' => [
                                [
                                    'id' => 'hero-1',
                                    'type' => 'hero',
                                    'content' => ['heading' => 'Modern Business Hero'],
                                    'draggable' => true
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        );

        $this->command->info('Templates seeded successfully!');
    }
}