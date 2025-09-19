<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        // Validasi input
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        // Cek apakah user ada
        $user = User::where('username', $request->username)->first();

        // Cek password dengan bcrypt
        if (!$user || !Hash::check($request->password, $user->passwords)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah'
            ], 401);
        }

        // Simpan sesi user
        Session::put('user', $user->id_users);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'user' => [
                'id_users' => $user->id_users,
                'username' => $user->username,
                'nama_lengkap' => $user->nama_lengkap
            ]
        ]);
    }

    /**
     * Logout user
     */
    public function logout()
    {
        Session::forget('user');
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * Cek status login user
     */
    public function checkSession()
    {
        if (Session::has('user')) {
            return response()->json([
                'success' => true,
                'message' => 'User masih login',
                'user_id' => Session::get('user')
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User belum login'
        ]);
    }
}