<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterTindakan;

class MasterTindakanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 10;

        $query = MasterTindakan::query()->orderBy('id_master_tindakan', 'desc');

        if ($search) {
            $query->where('nama_tindakan', 'like', "%$search%");            
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
            'nama_tindakan' => 'required|string|max:100'
        ]);

        $tindakan = MasterTindakan::create([
            'nama_tindakan' => $request->nama_tindakan
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data tindakan berhasil ditambahkan',
            'data' => $tindakan
        ], 201);
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
        $tindakan = MasterTindakan::find($id);

        if (!$tindakan) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);            
        }

        $request->validate([
            'nama_penyakit' => 'sometimes|string|max:100'
        ]);

        $tindakan->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data tindakan berhasil diperbarui',
            'data' => $tindakan
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tindakan = MasterTindakan::find($id);
        if (!$tindakan) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $tindakan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data tindakan berhasil dihapus'
        ]);
    }

    public function list() {
        try {
            $tindakan = MasterTindakan::select('id_master_tindakan', 'nama_tindakan')->orderBy('nama_tindakan', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $tindakan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
