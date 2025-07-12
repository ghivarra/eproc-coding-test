<?php

use App\Http\Controllers\API\Panel\CatalogController;
use App\Http\Controllers\API\Panel\DashboardController;
use App\Http\Controllers\API\Panel\VendorController;
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
    Route::get('vendor', [VendorController::class, 'index'])->name('panel.vendor');
    Route::get('vendor/catalog/{id}', [VendorController::class, 'catalog'])->name('panel.vendor.catalog');

    // catalogs
    Route::get('catalog', [CatalogController::class, 'index'])->name('panel.catalog');
    Route::get('catalog/detail/{id}', [CatalogController::class, 'detail'])->name('panel.catalog.detail');
});

// require_once __DIR__ . '/auth.php';
// require_once __DIR__ . '/settings.php';