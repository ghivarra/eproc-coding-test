<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
        $accessToken  = $user->createToken('acess-token', ['role' => 1], Carbon::now()->addDay(1))->plainTextToken;

        // return response
        return response()->json([
            'status'  => 'success',
            'message' => 'Otorisasi berhasil',
            'data'    => [
                'access_token' => $accessToken,
            ]
        ], 200);
    }

    //===========================================================================================
}
