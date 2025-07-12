<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Subfield;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubfieldController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // input
        $validation = Validator::make($request->all(), [
            'field_id' => ['sometimes', 'exists:fields,id']
        ]);

        // name
        $validation->setAttributeNames([
            'field_id' => 'Bidang'
        ]);

        // check
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memuat data',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 400);
        }

        // get input
        $input = $validation->validated();

        // get all
        $orm = Subfield::select('subfields.id', 'subfields.name', 'fields.name as field_name')
                       ->join('fields', 'field_id', '=', 'fields.id');

        if (isset($input['field_id']))
        {
            $orm->where('field_id', $input['field_id']);
        }

        // get
        $data = $orm->orderBy('field_name', 'asc')->get();

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