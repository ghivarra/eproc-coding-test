<?php

namespace App\Http\Controllers\API\Panel;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use Inertia\Response;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('catalog', []);
    }

    //===========================================================================================

    public function detail(string $uuid): Response
    {
        // catalog
        $catalog = Catalog::select('id')->where('uuid', $uuid)->first();

        if (empty($catalog))
        {
            abort(404, 'Katalog tidak ditemukan');
        }

        return Inertia::render('catalog-detail', [
            'id'   => $catalog->id,
            'uuid' => $uuid,
        ]);
    }

    //===========================================================================================
}