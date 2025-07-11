<?php

use App\Http\Controllers\View\AuthViewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login', [AuthViewController::class, 'login'])->name('view.login');
Route::get('/register', [AuthViewController::class, 'register'])->name('view.register');

// require_once __DIR__ . '/auth.php';
// require_once __DIR__ . '/settings.php';