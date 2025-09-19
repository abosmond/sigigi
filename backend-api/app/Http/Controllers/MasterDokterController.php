<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterDokter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MasterDokterController extends Controller
{
    /**
     * Menampilkan daftar dokter dengan paginasi dan pencarian
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 10);

            $query = MasterDokter::query();

            // Filter berdasarkan pencarian
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_dokter', 'LIKE', "%{$search}%")
                      ->orWhere('no_str', 'LIKE', "%{$search}%")
                      ->orWhere('spesialis', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('telepon', 'LIKE', "%{$search}%");
                });
            }

            // Paginasi
            $dokters = $query->orderBy('id_dokter', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $dokters->items(),
                'total' => $dokters->total(),
                'current_page' => $dokters->currentPage(),
                'per_page' => $dokters->perPage(),
                'total_pages' => $dokters->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menyimpan dokter baru
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validasi request
            $validator = Validator::make($request->all(), [
                'nama_dokter' => 'required|max:100',
                'no_str' => 'nullable|max:50',
                'spesialis' => 'nullable|max:50',
                'telepon' => 'nullable|max:20',
                'email' => 'nullable|email|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Buat data dokter baru
            $dokter = MasterDokter::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data dokter berhasil ditambahkan',
                'data' => $dokter,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail dokter
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $dokter = MasterDokter::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $dokter,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data dokter tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update data dokter
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            // Validasi request
            $validator = Validator::make($request->all(), [
                'nama_dokter' => 'required|max:100',
                'no_str' => 'nullable|max:50',
                'spesialis' => 'nullable|max:50',
                'telepon' => 'nullable|max:20',
                'email' => 'nullable|email|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Temukan dan update dokter
            $dokter = MasterDokter::findOrFail($id);
            $dokter->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Data dokter berhasil diperbarui',
                'data' => $dokter,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data dokter tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menghapus data dokter
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            // Temukan dan hapus dokter
            $dokter = MasterDokter::findOrFail($id);
            $dokter->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Data dokter berhasil dihapus',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data dokter tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        } 
    }

    public function list() {
        try {
            $dokters = MasterDokter::select('id_dokter', 'nama_dokter')->orderBy('nama_dokter', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $dokters
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}