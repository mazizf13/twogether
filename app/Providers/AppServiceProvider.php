<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Mengarahkan public_path() ke public_html di cPanel secara otomatis jika foldernya ada
        $cpanelPublicPath = base_path('../../public_html/twogether.azmee.my.id');
        if (is_dir($cpanelPublicPath)) {
            $this->app->usePublicPath($cpanelPublicPath);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
