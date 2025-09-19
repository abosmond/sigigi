<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterObat;

class MasterObatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 10;

        $query = MasterObat::query()->orderBy('id_obat', 'desc');

        if ($search) {
            $query->where('nama_obat', 'like', "%$search%");            
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
        $validated = $request->validate([
            'nama_obat' => 'required|string|max:100',
            'satuan' => 'required|string|max:20',
            'dosis' => 'nullable|string|max:50',
            'keterangan' => 'nullable|string',
        ]);

        $obat = MasterObat::create($validated);

        return response()->json([
			'success'	=> true,
            'message' => 'Obat berhasil ditambahkan.',
            'data' => $obat,
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
        $obat = MasterObat::find($id);

        if (!$obat) {
            return response()->json([
               'success' => false,
               'message' => 'Data obat tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nama_obat' => 'required|string|max:100',
            'satuan' => 'required|string|max:20',
            'dosis' => 'nullable|string|max:50',
            'keterangan' => 'nullable|string',
        ]);

        if ($obat->update($validated)) {
            return response()->json([
                'success' => true,
                'message' => 'Data obat berhasil diperbarui',
                'data' => $obat
            ]);            
        }

        return response()->json([
            'success' => false,
            'message' => 'Data tindakan gagal diperbarui'
        ], 500);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $obat = MasterObat::find($id);
        if (!$obat) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        if ($obat->delete()) {
            return response()->json([
                'success' => true,
                'message' => 'Data obat berhasil dihapus'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Data obat gagal diperbarui'
        ], 500);
    }

    public function list()
    {
        $obat = MasterObat::select('id_obat', 'nama_obat', 'satuan', 'dosis')
            ->orderBy('nama_obat', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $obat
        ]);
    }
}
