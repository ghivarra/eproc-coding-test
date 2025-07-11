<?php

namespace App\Http\Controllers\View;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AuthViewController extends Controller
{
    public function login()
    {
        return Inertia::render('auth/login');
    }

    //==============================================================================================

    public function register(): Response
    {
        return Inertia::render('auth/register');
    }

    //==============================================================================================
}
