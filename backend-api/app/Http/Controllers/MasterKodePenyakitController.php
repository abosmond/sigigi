<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterKodePenyakit;

class MasterKodePenyakitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 10;

        $query = MasterKodePenyakit::query()->orderBy('id_master_kode_penyakit', 'desc');

        if ($search) {
            $query->where('nama_penyakit', 'like', "%$search%");            
        }

        $data = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'total_pages' => $data->lastPage()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_penyakit' => 'required|string|max:100'
        ]);

        $penyakit = MasterKodePenyakit::create([
            'nama_penyakit' => $request->nama_penyakit
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data penyakit berhasil ditambahkan',
            'data' => $penyakit
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $penyakit = MasterKodePenyakit::find($id);
        if (!$penyakit) {
            return response()->json([
               'success' => false,
               'message' => 'Data penyakit tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $penyakit
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $penyakit = MasterKodePenyakit::find($id);

        if (!$penyakit) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404); 
        }

        $request->validate([
            'nama_penyakit' => 'sometimes|string|max:100'
        ]);

        $penyakit->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data penyakit berhasil diperbarui',
            'data' => $penyakit
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $penyakit = MasterKodePenyakit::find($id);
        if (!$penyakit) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $penyakit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data penyakit berhasil dihapus'
        ]);
    }

    public function list() {
        try {
            $kode_penyakit = MasterKodePenyakit::select('id_master_kode_penyakit', 'nama_penyakit')->orderBy('nama_penyakit', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $kode_penyakit
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
