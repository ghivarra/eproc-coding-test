<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Field;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index(): JsonResponse
    {
        // get all
        $data = Field::select('id', 'name')->orderBy('name', 'asc')->get();

        if (empty($data))
        {
            return response()->json([
                'status'  => 'success',
                'message' => 'Belum ada data',
                'data'    => []
            ], 200);
        }

        // return response
        return response()->json([
            'status'  => 'success',
            'message' => 'Data berhasil ditarik',
            'data'    => $data
        ], 200);
    }

    //==========================================================================================
}