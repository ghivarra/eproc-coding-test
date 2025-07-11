<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// require_once __DIR__ . '/auth.php';
// require_once __DIR__ . '/settings.php';