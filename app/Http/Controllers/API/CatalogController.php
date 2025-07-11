<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\Subfield;
use App\Models\Vendor;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Uuid;

class CatalogController extends Controller
{
    protected Vendor $usedVendor;

    //================================================================================================

    private function validateVendorAndUser(int|string $vendorID): bool
    {
        $vendor      = Vendor::find($vendorID);
        $currentUser = auth('sanctum')->user();

        // set
        $this->usedVendor = $vendor;

        // vendor dan user tidak valid
        return ($currentUser->id === $vendor->user_id);
    }

    //================================================================================================

    public function create(Request $request): JsonResponse
    {
        // validasi
        $validation = Validator::make($request->all(), [
            'title'         => ['required', 'max:500'],
            'number'        => ['required', 'max:255'],
            'method'        => ['required', 'max:500'],
            'location'      => ['required', 'max:500'],
            'qualification' => ['sometimes', 'max:1000'],
            'value'         => ['required', 'numeric'],
            'vendor_id'     => ['required',  'exists:vendors,id'],
            'field_id'      => ['required',  'exists:fields,id'],
            'subfield_id'   => ['required',  'exists:subfields,id'],
            'description'   => ['sometimes'],

            'register_date_start'      => ['required', 'date'],
            'register_date_end'        => ['required', 'date'],
            'documentation_date_start' => ['required', 'date'],
            'documentation_date_end'   => ['required', 'date'],
        ]);

        // set name
        $validation->setAttributeNames([
            'title'                    => 'Judul/Nama Katalog',
            'number'                   => 'Nomor Katalog',
            'method'                   => 'Metode Pengadaan',
            'location'                 => 'Lokasi Pekerjaan',
            'qualification'            => 'Kualifikasi Penyedia Barang/Jasa',
            'value'                    => 'Nilai HPS',
            'vendor_id'                => 'Vendor',
            'field_id'                 => 'Bidang Usaha',
            'subfield_id'              => 'Sub Bidang Usaha',
            'description'              => 'Keterangan',
            'register_date_start'      => 'Jadwal Mulai Pendaftaran',
            'register_date_end'        => 'Jadwal Pendaftaran Selesai',
            'documentation_date_start' => 'Jadwal Mulai Pengambilan Dokumen',
            'documentation_date_end'   => 'Jadwal Pengambilan Dokumen Selesai',
        ]);

        // validasi vendor dan user
        if (!$this->validateVendorAndUser($request->input('vendor_id')))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => "Anda tidak memiliki izin untuk menambahkan katalog di vendor {$this->usedVendor->name}",
            ], 403);
        }

        // check sub-bidang dan bidang
        $fieldID       = $request->input('field_id');
        $subfieldID    = $request->input('subfield_id');
        $subfieldExist = Subfield::where('id', $subfieldID)
                                 ->where('field_id', $fieldID)
                                 ->first();

        if (empty($subfieldExist))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => "Sub Bidang Usaha tidak sesuai dengan Bidang Usaha yang diinput",
            ], 422);
        }

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat katalog',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 422);
        }

        // get data
        $input = $validation->validated();

        // input vendor
        $catalog = new Catalog;
        $catalog->uuid = Uuid::uuid4();
        $catalog->title = $input['title'];
        $catalog->number = $input['number'];
        $catalog->method = $input['method'];
        $catalog->location = $input['location'];
        $catalog->qualification = $input['qualification'];
        $catalog->value = $input['value'];
        $catalog->vendor_id = $input['vendor_id'];
        $catalog->field_id = $input['field_id'];
        $catalog->subfield_id = $input['subfield_id'];
        $catalog->description = $input['description'];
        $catalog->register_date_start = date('Y-m-d H:i:s', strtotime($input['register_date_start']));
        $catalog->register_date_end = date('Y-m-d H:i:s', strtotime($input['register_date_end']));
        $catalog->documentation_date_start = date('Y-m-d H:i:s', strtotime($input['documentation_date_start']));
        $catalog->documentation_date_end = date('Y-m-d H:i:s', strtotime($input['documentation_date_end']));

        // save
        $isSaved = $catalog->save();

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
            'message' => "Katalog {$catalog->name} berhasil ditambahkan pada vendor {$this->usedVendor->name}",
            'data'    => $catalog
        ], 200);
    }

    //================================================================================================

    public function delete(Request $request): JsonResponse
    {
        $id = $request->input('id');

        // validasi
        $catalog = Catalog::find($id);

        // if not found
        if (!isset($catalog->title))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menghapus katalog, ID tidak valid',
            ], 422);
        }

        // validasi vendor dan user
        if (!$this->validateVendorAndUser($catalog->vendor_id))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => "Anda tidak memiliki izin untuk menghapus katalog milik vendor {$this->usedVendor->name}",
            ], 403);
        }

        // delete
        $catalog->delete();

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Katalog {$catalog->title} berhasil dihapus"
        ], 200);
    }

    //================================================================================================

    public function find(Request $request): JsonResponse
    {
        $id = $request->input('id');

        // field
        $selectedFields = [
            'catalogs.id',
            'catalogs.uuid',
            'catalogs.title',
            'catalogs.number',
            'catalogs.method',
            'catalogs.location',
            'catalogs.qualification',
            'catalogs.value',
            'catalogs.vendor_id',
            'vendors.name as vendor_name',
            'catalogs.field_id',
            'fields.name as field_name',
            'catalogs.subfield_id',
            'subfields.name as subfield_name',
            'catalogs.description',
            'catalogs.register_date_start',
            'catalogs.register_date_end',
            'catalogs.documentation_date_start',
            'catalogs.documentation_date_end',
            'catalogs.created_at',
            'catalogs.updated_at',
        ];

        // validasi
        $catalog = Catalog::select($selectedFields)
                          ->join('vendors', 'vendor_id', '=', 'vendors.id')
                          ->join('fields', 'field_id', '=', 'fields.id')
                          ->join('subfields', 'subfield_id', '=', 'subfields.id')
                          ->where('catalogs.id', $id)
                          ->first();

        // if not found
        if (!isset($catalog->title))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal menarik data catalog, ID tidak valid',
            ], 422);
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Data berhasil ditarik",
            'data'    => $catalog
        ], 200);
    }

    //================================================================================================

    public function index(Request $request)
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
        $totalData = Catalog::count();

        // field
        $selectedFields = [
            'catalogs.id',
            'catalogs.uuid',
            'catalogs.title',
            'catalogs.number',
            'catalogs.method',
            'catalogs.location',
            'catalogs.qualification',
            'catalogs.value',
            'catalogs.vendor_id',
            'vendors.name as vendor_name',
            'catalogs.field_id',
            'fields.name as field_name',
            'catalogs.subfield_id',
            'subfields.name as subfield_name',
            'catalogs.description',
            'catalogs.register_date_start',
            'catalogs.register_date_end',
            'catalogs.documentation_date_start',
            'catalogs.documentation_date_end',
            'catalogs.created_at',
            'catalogs.updated_at',
        ];

        // validasi
        $orm = Catalog::select($selectedFields)
                      ->join('vendors', 'vendor_id', '=', 'vendors.id')
                      ->join('fields', 'field_id', '=', 'fields.id')
                      ->join('subfields', 'subfield_id', '=', 'subfields.id');

        if (!empty($input['query']))
        {
            $orm = $orm->whereLike('catalogs.title', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('catalogs.number', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('vendors.name', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('fields.name', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('subfields.name', "%{$input['query']}%", caseSensitive: false);
        }

        // get total filtered data
        $totalFilteredData = $orm->count();

        // get data
        $data = $orm->orderBy('catalogs.created_at', 'DESC')
                    ->limit($input['limit'])
                    ->offset($input['offset'])
                    ->get();

        // if not found
        if (empty($data))
        {
            // id not valid
            return response()->json([
                'status'  => 'error',
                'message' => 'Katalog tidak ditemukan',
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
        // get old data
        $catalog = Catalog::find($request->input('id'));

        if (empty($catalog) || !isset($catalog->vendor_id))
        {
            return response()->json([
                'status'  => 'error',
                'message' => 'ID Katalog tidak ditemukan',
            ], 422);
        }

        // validasi
        $validation = Validator::make($request->all(), [
            'title'         => ['required', 'max:500'],
            'number'        => ['required', 'max:255'],
            'method'        => ['required', 'max:500'],
            'location'      => ['required', 'max:500'],
            'qualification' => ['sometimes', 'max:1000'],
            'value'         => ['required', 'numeric'],
            'field_id'      => ['required',  'exists:fields,id'],
            'subfield_id'   => ['required',  'exists:subfields,id'],
            'description'   => ['sometimes'],

            'register_date_start'      => ['required', 'date'],
            'register_date_end'        => ['required', 'date'],
            'documentation_date_start' => ['required', 'date'],
            'documentation_date_end'   => ['required', 'date'],
        ]);

        // set name
        $validation->setAttributeNames([
            'title'                    => 'Judul/Nama Katalog',
            'number'                   => 'Nomor Katalog',
            'method'                   => 'Metode Pengadaan',
            'location'                 => 'Lokasi Pekerjaan',
            'qualification'            => 'Kualifikasi Penyedia Barang/Jasa',
            'value'                    => 'Nilai HPS',
            'field_id'                 => 'Bidang Usaha',
            'subfield_id'              => 'Sub Bidang Usaha',
            'description'              => 'Keterangan',
            'register_date_start'      => 'Jadwal Mulai Pendaftaran',
            'register_date_end'        => 'Jadwal Pendaftaran Selesai',
            'documentation_date_start' => 'Jadwal Mulai Pengambilan Dokumen',
            'documentation_date_end'   => 'Jadwal Pengambilan Dokumen Selesai',
        ]);

        // validasi vendor dan user
        if (!$this->validateVendorAndUser($catalog->vendor_id))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => "Anda tidak memiliki izin untuk menambahkan katalog milik vendor {$this->usedVendor->name}",
            ], 403);
        }

        // check sub-bidang dan bidang
        $fieldID       = $request->input('field_id');
        $subfieldID    = $request->input('subfield_id');
        $subfieldExist = Subfield::where('id', $subfieldID)
                                 ->where('field_id', $fieldID)
                                 ->first();

        if (empty($subfieldExist))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => "Sub Bidang Usaha tidak sesuai dengan Bidang Usaha yang diinput",
            ], 422);
        }

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbaharui data katalog',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 422);
        }

        // get data
        $input = $validation->validated();

        // input vendor
        $catalog->title = $input['title'];
        $catalog->number = $input['number'];
        $catalog->method = $input['method'];
        $catalog->location = $input['location'];
        $catalog->qualification = $input['qualification'];
        $catalog->value = $input['value'];
        $catalog->field_id = $input['field_id'];
        $catalog->subfield_id = $input['subfield_id'];
        $catalog->description = $input['description'];
        $catalog->register_date_start = date('Y-m-d H:i:s', strtotime($input['register_date_start']));
        $catalog->register_date_end = date('Y-m-d H:i:s', strtotime($input['register_date_end']));
        $catalog->documentation_date_start = date('Y-m-d H:i:s', strtotime($input['documentation_date_start']));
        $catalog->documentation_date_end = date('Y-m-d H:i:s', strtotime($input['documentation_date_end']));

        // save
        $isSaved = $catalog->save();

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
            'message' => "Katalog {$catalog->name} berhasil diperbaharui oleh pemilik vendor {$this->usedVendor->name}",
            'data'    => $catalog
        ], 200);
    }

    //================================================================================================
}