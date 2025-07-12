<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Models\CatalogFieldSubfield;
use App\Models\Subfield;
use App\Models\Vendor;
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
            'subfields.*'   => ['required',  'exists:subfields,id'],
            'description'   => ['sometimes'],

            'register_date_start'      => ['required', 'date'],
            'register_date_end'        => ['required', 'date'],
        ]);

        // set name
        $validation->setAttributeNames([
            'title'               => 'Judul/Nama Katalog',
            'number'              => 'Nomor Katalog',
            'method'              => 'Metode Pengadaan',
            'location'            => 'Lokasi Pekerjaan',
            'qualification'       => 'Kualifikasi Penyedia Barang/Jasa',
            'value'               => 'Nilai HPS',
            'vendor_id'           => 'Vendor',
            'subfields.*'         => 'Sub Bidang Usaha',
            'description'         => 'Keterangan',
            'register_date_start' => 'Jadwal Mulai Pendaftaran',
            'register_date_end'   => 'Jadwal Pendaftaran Selesai',
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
        $catalog->description = $input['description'];
        $catalog->register_date_start = date('Y-m-d', strtotime($input['register_date_start']));
        $catalog->register_date_end = date('Y-m-d', strtotime($input['register_date_end']));
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

        // save fields and subfields
        $subfields = Subfield::select('id', 'field_id')->whereIn('id', $input['subfields'])->get();

        if (!empty($subfields))
        {
            $insertData = [];

            foreach ($subfields as $sub):

                array_push($insertData, [
                    'catalog_id'  => $catalog->id,
                    'field_id'    => $sub->field_id,
                    'subfield_id' => $sub->id,
                ]);

            endforeach;

            // insert
            CatalogFieldSubfield::insert($insertData);
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

        // delete the subfields and field first
        CatalogFieldSubfield::where('catalog_id', $catalog->id)->delete();

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
            'catalogs.description',
            'catalogs.register_date_start',
            'catalogs.register_date_end',
            'catalogs.created_at',
            'catalogs.updated_at',
        ];

        // validasi
        $catalog = Catalog::select($selectedFields)
                          ->join('vendors', 'vendor_id', '=', 'vendors.id')
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

        // get fields and subfields collection
        $catalog = $catalog->toArray();
        $catalog['subfields_collection'] = [];

        $selectedFields = [
            'catalog_id',
            'catalogs_fields_subfields.field_id', 
            'fields.name as field_name', 
            'subfield_id',
            'subfields.name as subfield_name',
        ];

        $subfields = CatalogFieldSubfield::select($selectedFields)
                                         ->where('catalog_id', $catalog['id'])
                                         ->join('fields', 'catalogs_fields_subfields.field_id', '=', 'fields.id')
                                         ->join('subfields', 'subfield_id', '=', 'subfields.id')
                                         ->get();

        if (!empty($subfields))
        {
            foreach ($subfields as $item):

                array_push($catalog['subfields_collection'], $item);

            endforeach;
        }

        // send response
        return response()->json([
            'status'  => 'success',
            'message' => "Data berhasil ditarik",
            'data'    => $catalog
        ], 200);
    }

    //================================================================================================

    public function index(Request $request): JsonResponse
    {
        // simple query/forms
        // validasi
        $validation = Validator::make($request->all(), [
            'query'  => ['sometimes'],
            'vendor' => ['sometimes', 'exists:vendors,id'],
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
            'catalogs.location',
            'catalogs.qualification',
            'catalogs.value',
            'catalogs.vendor_id',
            'vendors.name as vendor_name',
            'catalogs.register_date_start',
            'catalogs.register_date_end',
            'catalogs.created_at',
            'catalogs.updated_at',
            // 'catalogs.method',
            // 'catalogs.description',
        ];

        // validasi
        $orm = Catalog::select($selectedFields)
                      ->join('vendors', 'vendor_id', '=', 'vendors.id');

        if (!empty($input['vendor']))
        {
            $orm = $orm->where('catalogs.vendor_id', $input['vendor']);
        }

        if (!empty($input['query']))
        {
            $orm = $orm->whereLike('catalogs.title', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('catalogs.number', "%{$input['query']}%", caseSensitive: false)
                       ->orWhereLike('vendors.name', "%{$input['query']}%", caseSensitive: false);
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

        // data
//        $data = $data->toArray();
//
//        // get all
//        $dataIDS     = array_column($data, 'id');
//        $selectedCol = [
//            'catalog_id',
//            'catalogs_fields_subfields.field_id', 
//            'fields.name as field_name', 
//            'subfield_id',
//            'subfields.name as subfield_name',
//        ];
//
//        $subfields = CatalogFieldSubfield::select($selectedCol)
//                                         ->join('fields', 'catalogs_fields_subfields.field_id', '=', 'fields.id')
//                                         ->join('subfields', 'catalogs_fields_subfields.field_id', '=', 'subfields.id')
//                                         ->whereIn('catalog_id', $dataIDS)
//                                         ->get();
//
//        foreach ($data as $i => $item):
//
//            $data[$i]['subfields_collection'] = [];
//
//            if (empty($subfields))
//            {
//                continue;
//            }
//
//            foreach ($subfields as $n => $sub):
//
//                if ($sub->catalog_id === $item['id'])
//                {
//                    // push into collection
//                    array_push($data[$i]['subfields_collection'], $sub);
//
//                    // unset
//                    unset($subfields[$n]);
//                }
//
//            endforeach;
//
//        endforeach;

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
            'subfields.*'   => ['required',  'exists:subfields,id'],
            'description'   => ['sometimes'],

            'register_date_start' => ['required', 'date'],
            'register_date_end'   => ['required', 'date'],
        ]);

        // set name
        $validation->setAttributeNames([
            'title'               => 'Judul/Nama Katalog',
            'number'              => 'Nomor Katalog',
            'method'              => 'Metode Pengadaan',
            'location'            => 'Lokasi Pekerjaan',
            'qualification'       => 'Kualifikasi Penyedia Barang/Jasa',
            'value'               => 'Nilai HPS',
            'subfields.*'         => 'Sub Bidang Usaha',
            'description'         => 'Keterangan',
            'register_date_start' => 'Jadwal Mulai Pendaftaran',
            'register_date_end'   => 'Jadwal Pendaftaran Selesai',
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
        $catalog->description = $input['description'];
        $catalog->register_date_start = date('Y-m-d', strtotime($input['register_date_start']));
        $catalog->register_date_end = date('Y-m-d', strtotime($input['register_date_end']));

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

        // reset and re-insert subfields
        CatalogFieldSubfield::where('catalog_id', $catalog->id)->delete();

        // get new subfields
        $subfields = Subfield::select('id', 'field_id')->whereIn('id', $input['subfields'])->get();

        if (!empty($subfields))
        {
            $insertData = [];

            foreach ($subfields as $sub):

                array_push($insertData, [
                    'catalog_id'  => $catalog->id,
                    'field_id'    => $sub->field_id,
                    'subfield_id' => $sub->id,
                ]);

            endforeach;

            // insert
            CatalogFieldSubfield::insert($insertData);
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