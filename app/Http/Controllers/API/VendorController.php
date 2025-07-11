<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $form = [
            'name'       => $request->input('name'),
            'website'    => $request->input('website'),
            'founded_at' => $request->input('founded_at')
        ];

        // mutate form website
        if (!str_contains($form['website'], 'http'))
        {
            $form['website'] = "http://{$form['website']}";
        }

        // validasi
        $validation = Validator::make($form, [
            'name'       => ['required', 'max:200'],
            'website'    => ['required', 'max:200', 'url'],
            'founded_at' => ['required', 'date_format:Y' ]
        ]);

        // set name
        $validation->setAttributeNames([
            'name'       => 'Nama Vendor',
            'website'    => 'Website Vendor',
            'founded_at' => 'Tahun Berdiri'
        ]);

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat vendor',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 422);
        }

        // get data
        $input       = $validation->validated();
        $currentUser = auth('sanctum')->user();

        // input vendor
        $vendor = new Vendor;
        $vendor->name = $input['name'];
        $vendor->website = $input['website'];
        $vendor->founded_at = $input['founded_at'];
        $vendor->user_id = $currentUser->id;
        $isSaved = $vendor->save();

        if (!$isSaved)
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Server sedang sibuk, silahkan coba lagi',
            ], 503);
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Vendor {$vendor->name} berhasil ditambahkan",
            'data'    => $vendor
        ], 200);
    }

    //================================================================================================

    public function delete(Request $request): JsonResponse
    {
        $id = $request->input('id');

        // validasi
        $vendor = Vendor::find($id);

        // if not found
        if (!isset($vendor->name))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus vendor, ID tidak valid',
            ], 422);
        }

        // delete
        $vendor->delete();

        // delete all catalogs from vendor too
        Catalog::where('vendor_id', $id)->delete();

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Vendor {$vendor->name} berhasil dihapus"
        ], 200);
    }

    //================================================================================================

    public function find(Request $request): JsonResponse
    {
        $id = $request->input('id');

        // validasi
        $vendor = Vendor::select('vendors.id', 'vendors.name', 'website', 'founded_at', 'user_id', 'users.name as user_name')
                        ->join('users', 'user_id', '=', 'users.id')
                        ->where('vendors.id', $id)
                        ->first();

        // if not found
        if (!isset($vendor->name))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menarik data vendor, ID tidak valid',
            ], 422);
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Data berhasil ditarik",
            'data'    => $vendor
        ], 200);
    }

    //================================================================================================

    public function index(Request $request): JsonResponse
    {
        // simple query/forms
        // validasi
        $validation = Validator::make($request->all(), [
            'query'  => ['sometimes'],
            'limit'  => ['required', 'numeric', 'max:20'],
            'offset' => ['required', 'numeric']
        ]);

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menarik data vendor',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 400);
        }

        // get data
        $input = $validation->validated();

        // find total
        $totalData = Vendor::count();

        // validasi
        $orm = Vendor::select('vendors.id', 'vendors.name', 'website', 'founded_at', 'user_id', 'users.name as user_name')
                      ->join('users', 'user_id', '=', 'users.id');

        if (!empty($input['query']))
        {
            $orm = $orm->whereLike('vendors.name', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('users.name', "%{$input['query']}%", caseSensitive: false);
        }

        // get total filtered data
        $totalFilteredData = $orm->count();

        // get data
        $data = $orm->orderBy('vendors.name', 'ASC')
                    ->limit($input['limit'])
                    ->offset($input['offset'])
                    ->get();

        // if not found
        if (empty($data))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Vendor tidak ditemukan',
                'data'    => [],
            ], 200);
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Data berhasil ditarik",
            'data'    => [
                'total'         => $totalData,
                'totalFiltered' => $totalFilteredData,
                'data'          => $data
            ],
        ], 200);
    }

    //================================================================================================

    public function update(Request $request): JsonResponse
    {
        $form = [
            'id'         => $request->input('id'),
            'name'       => $request->input('name'),
            'website'    => $request->input('website'),
            'founded_at' => $request->input('founded_at')
        ];

        // mutate form website
        if (!str_contains($form['website'], 'http'))
        {
            $form['website'] = "http://{$form['website']}";
        }

        // validasi
        $validation = Validator::make($form, [
            'id'         => ['required', 'exists:vendors,id'],
            'name'       => ['required', 'max:200'],
            'website'    => ['required', 'max:200', 'url'],
            'founded_at' => ['required', 'date_format:Y' ]
        ]);

        // set name
        $validation->setAttributeNames([
            'id'         => 'Vendor',
            'name'       => 'Nama Vendor',
            'website'    => 'Website Vendor',
            'founded_at' => 'Tahun Berdiri'
        ]);

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbaharui data vendor',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 422);
        }

        // get data
        $input = $validation->validated();

        // input vendor
        $vendor = Vendor::find($input['id']);
        $vendor->name = $input['name'];
        $vendor->website = $input['website'];
        $vendor->founded_at = $input['founded_at'];
        $isSaved = $vendor->save();

        if (!$isSaved)
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Server sedang sibuk, silahkan coba lagi',
            ], 503);
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Data vendor {$vendor->name} berhasil diperbaharui",
            'data'    => $vendor
        ], 200);
    }

    //================================================================================================
}