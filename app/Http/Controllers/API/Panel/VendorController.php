<?php

namespace App\Http\Controllers\API\Panel;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Inertia\Response;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vendor', []);
    }

    //===========================================================================================

    public function catalog(string $vendorID): Response
    {
        return Inertia::render('vendor-catalog', [
            'id' => intval($vendorID)
        ]);
    }

    //===========================================================================================
}