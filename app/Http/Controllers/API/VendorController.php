<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    public function create(Request $request)
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

    public function delete(Request $request)
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

    public function index(Request $request)
    {

    }

    //================================================================================================

    public function update(Request $request)
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