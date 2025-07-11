<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CatalogController;
use App\Http\Controllers\API\FieldController;
use App\Http\Controllers\API\SubfieldController;
use App\Http\Controllers\API\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// authorization
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');

// auth
Route::middleware('auth:sanctum')->group(function() {

    Route::prefix('admin')->group(function() {

        // vendors
        Route::prefix('vendor')->group(function() {
            Route::get('/', [VendorController::class, 'index'])->name('api.vendor.index');
            Route::get('/find', [VendorController::class, 'find'])->name('api.vendor.find');
            Route::post('/create', [VendorController::class, 'create'])->name('api.vendor.create');
            Route::patch('/update', [VendorController::class, 'update'])->name('api.vendor.update');
            Route::delete('/delete', [VendorController::class, 'delete'])->name('api.vendor.delete');
        });
    
        // catalogs
        Route::prefix('catalog')->group(function() {
            Route::get('/', [CatalogController::class, 'index'])->name('api.catalog.index');
            Route::get('/find', [CatalogController::class, 'find'])->name('api.catalog.find');
            Route::post('/create', [CatalogController::class, 'create'])->name('api.catalog.create');
            Route::patch('/update', [CatalogController::class, 'update'])->name('api.catalog.update');
            Route::delete('/delete', [CatalogController::class, 'delete'])->name('api.catalog.delete');
        });
    
        // get list of fields and subfields
        Route::get('field', [FieldController::class, 'index'])->name('api.field');
        Route::get('subfield', [SubfieldController::class, 'index'])->name('api.subfield');

    });

});