<?php

namespace App\Http\Controllers\API\Panel;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', []);
    }

    //===========================================================================================
}