<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'email'     => ['required', 'exists:users,email', 'email'],
            'password'  => ['required', 'string'],
        ]);

        $validation->setAttributeNames([
            'email'    => 'Email',
            'password' => 'Kata Sandi'
        ]);

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun email dan password tidak cocok',
            ], 401);
        }

        // get data
        $input = $validation->validated();

        // validasi
        $user = User::where('email', $input['email'])->first();

        // validasi
        if (!Hash::check($input['password'], $user->password))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun email dan password tidak cocok',
            ], 401);
        }

        // get token
        // with one day expiration
        $accessToken  = $user->createToken('acess-token',['*'], Carbon::now()->addDay(1))->plainTextToken;

        // return response
        return response()->json([
            'status'  => 'success',
            'message' => 'Otorisasi berhasil',
            'data'    => [
                'access_token' => $accessToken,
                'user'         => $user,
            ]
        ], 200);
    }

    //===========================================================================================

    public function logout()
    {
        // revoke token
        $user = auth('sanctum')->user();

        if (is_null($user))
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Anda belum melakukan autentikasi login',
            ], 401);
        }

        // revoke token
        /** @var \App\Models\User|\Laravel\Sanctum\HasApiTokens $user */
        /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
        $token = $user->currentAccessToken();
        $token?->delete();

        // return ok
        return response()->json([
            'status'  => 'success',
            'message' => 'Berhasil keluar, token anda sudah dihapus',
        ], 200);
    }

    //===========================================================================================

    public function register(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'name'      => ['required', 'max:200'],
            'email'     => ['required', 'email', 'unique:users,email', 'max:200'],
            'password'  => ['required', 'confirmed', Password::min(10)->letters()->mixedCase()->numbers()->symbols()],
        ]);

        // set name
        $validation->setAttributeNames([
            'name'     => 'Nama',
            'email'    => 'Email',
            'password' => 'Kata Sandi'
        ]);

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal membuat akun pengguna',
                'data'    => [
                    'errors' => $validation->errors()
                ]
            ], 422);
        }

        // get data
        $input = $validation->validated();

        // input user
        $user = new User;
        $user->name = $input['name'];
        $user->email = $input['email'];
        $user->password = $input['password'];
        $isSuccess = $user->save();

        if (!$isSuccess)
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Server sedang sibuk, silahkan coba lagi',
            ], 503);
        }

        // return
        return response()->json([
            'status'  => 'success',
            'message' => "User {$user->name} berhasil ditambahkan",
            'data'    => $user
        ], 200);
    }

    //===========================================================================================
}
