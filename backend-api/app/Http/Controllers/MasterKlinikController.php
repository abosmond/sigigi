<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterKlinik;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MasterKlinikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);

            $query = MasterKlinik::query();

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_klinik', 'like', '%' . $search . '%');
                    $q->orWhere('alamat_klinik', 'like', '%' . $search . '%');
                    $q->orWhere('telepon', 'like', '%' . $search . '%');
                    $q->orWhere('email', 'like', '%' . $search . '%');
                    $q->orWhere('no_izin_klinik', 'like', '%' . $search . '%');
                    $q->orWhere('jam_operasional', 'like', '%' . $search . '%');
                });
            }

            $klinik = $query->orderBy('nama_klinik', 'asc')->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $klinik->items(),
                'total' => $klinik->total(),
                'current_page' => $klinik->currentPage(),
                'total_pages' => $klinik->lastPage()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validasi input
            $validator = Validator::make($request->all(), [
                'nama_klinik'       => 'required|string|max:100',
                'alamat_klinik'     => 'nullable|string',
                'telepon'           => 'nullable|string|max:20',
                'email'             => 'nullable|email|max:100',
                'no_izin_klinik'    => 'nullable|string|max:50',
                'jam_operasional'   => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Simpan data
            $klinik = MasterKlinik::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Data klinik berhasil disimpan',
                'data' => $klinik,
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function list() {
        try {
            $kliniks = MasterKlinik::select('id_klinik', 'nama_klinik')->orderBy('nama_klinik', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $kliniks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}