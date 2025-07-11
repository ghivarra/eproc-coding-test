<?php

use App\Http\Controllers\API\Panel\DashboardController;
use App\Http\Controllers\View\AuthViewController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('view.login');
})->name('home');

// yooo
Route::get('/login', [AuthViewController::class, 'login'])->name('view.login');
Route::get('/register', [AuthViewController::class, 'register'])->name('view.register');

// admin
Route::prefix('panel')->group(function() {

    // dasbor
    Route::get('dashboard', [DashboardController::class, 'index'])->name('panel.dashboard');

    // vendor
    Route::get('vendor')->name('panel.vendor');
    Route::get('vendor/catalog')->name('panel.vendor.catalog');

    // catalogs
    Route::get('catalog')->name('panel.catalog');
});

// require_once __DIR__ . '/auth.php';
// require_once __DIR__ . '/settings.php';