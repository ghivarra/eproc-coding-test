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

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'email'     => ['required', 'exists:users,email', 'email'],
            'password'  => ['required', 'string'],
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
        $accessToken  = $user->createToken('acess-token', Carbon::now()->addDay(1))->plainTextToken;

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

    public function logout(Request $request)
    {
        // revoke token
        $request->user()->currentAccessToken()->delete();

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

        // check if error
        if ($validation->fails())
        {
            // return error response
            return response()->json([
                'status'  => 'error',
                'message' => 'Akun email dan password tidak cocok',
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
