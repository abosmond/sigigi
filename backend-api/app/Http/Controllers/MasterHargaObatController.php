<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\MasterHargaObat;
use App\Models\MasterObat;
use App\Models\MasterKlinik;

class MasterHargaObatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $klinikId = $request->input('id_klinik');
            $obatId = $request->input('id_obat');
            
            $query = MasterHargaObat::with(['obat', 'klinik']);
            
            // Filter berdasarkan klinik jika ada
            if ($klinikId) {
                $query->where('id_klinik', $klinikId);
            }
            
            // Filter berdasarkan obat jika ada
            if ($obatId) {
                $query->where('id_obat', $obatId);
            }
            
            // Filter pencarian
            if (!empty($search)) {
                $query->whereHas('obat', function($q) use ($search) {
                    $q->where('nama_obat', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('klinik', function($q) use ($search) {
                    $q->where('nama_klinik', 'LIKE', "%{$search}%");
                });
            }
            
            $hargaObat = $query->orderBy('created_at', 'desc')
                             ->paginate($perPage, ['*'], 'page', $page);
            
            return response()->json([
                'success' => true,
                'data' => $hargaObat->items(),
                'total' => $hargaObat->total(),
                'current_page' => $hargaObat->currentPage(),
                'total_pages' => $hargaObat->lastPage()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_obat' => 'required|exists:master_obat,id_obat',
                'id_klinik' => 'required|exists:klinik,id_klinik',
                'harga' => 'required|integer|min:0',
                'keterangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cek apakah relasi sudah ada, gunakan query langsung untuk menghindari masalah konvensi penamaan
            $exists = \DB::table('master_harga_obat')
                      ->where('id_obat', $request->id_obat)
                      ->where('id_klinik', $request->id_klinik)
                      ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Harga obat sudah ada untuk klinik ini'
                ], 422);
            }

            $hargaObat = new MasterHargaObat();
            $hargaObat->id_obat = $request->id_obat;
            $hargaObat->id_klinik = $request->id_klinik;
            $hargaObat->update([
                'harga' => $request->harga,
                'keterangan' => $request->keterangan
            ]);
            
            $hargaObat->load(['obat', 'klinik']);

            return response()->json([
                'success' => true,
                'message' => 'Data harga obat berhasil ditambahkan',
                'data' => $hargaObat
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $klinikId
     * @param  int  $obatId
     * @return \Illuminate\Http\Response
     */
    public function show($klinikId, $obatId)
    {
        try {
            $hargaObat = MasterHargaObat::with(['obat', 'klinik'])
                                       ->where('id_klinik', $klinikId)
                                       ->where('id_obat', $obatId)
                                       ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $hargaObat
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data harga obat tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $klinikId
     * @param  int  $obatId
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $klinikId, $obatId)
    {
        try {
            $exists = \DB::table('master_harga_obat')
                      ->where('id_klinik', $klinikId)
                      ->where('id_obat', $obatId)
                      ->exists();
            
            if (!$exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data harga obat tidak ditemukan'
                ], 404);                
            }

            $validator = Validator::make($request->all(), [
                'harga' => 'required|integer|min:0',
                'keterangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            \DB::table('master_harga_obat')
              ->where('id_klinik', $klinikId)
              ->where('id_obat', $obatId)
              ->update([
                  'harga' => $request->harga,
                  'keterangan' => $request->keterangan
              ]);
            
            $hargaObat = MasterHargaObat::with(['obat', 'klinik'])->where('id_klinik', $klinikId)->where('id_obat', $obatId)->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Data harga obat berhasil diperbarui',
                'data' => $hargaObat
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $klinikId
     * @param  int  $obatId
     * @return \Illuminate\Http\Response
     */
    public function destroy($klinikId, $obatId)
    {
        try {
            $hargaObat = MasterHargaObat::where('id_klinik', $klinikId)
                                       ->where('id_obat', $obatId)
                                       ->firstOrFail();
            
            $hargaObat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data harga obat berhasil dihapus'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data harga obat tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get semua harga obat untuk satu klinik
     *
     * @param  int  $klinikId
     * @return \Illuminate\Http\Response
     */
    public function getHargaByKlinik($klinikId)
    {
        try {
            $hargaObat = MasterHargaObat::with('obat')
                                       ->where('id_klinik', $klinikId)
                                       ->get()
                                       ->map(function ($item) {
                                           return [
                                               'id_obat' => $item->id_obat,
                                               'id_klinik' => $item->id_klinik,
                                               'nama_obat' => $item->obat->nama_obat,
                                               'satuan' => $item->obat->satuan,
                                               'harga' => $item->harga,
                                               'keterangan' => $item->keterangan,
                                           ];
                                       });

            return response()->json([
                'success' => true,
                'data' => $hargaObat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get semua harga untuk satu obat di berbagai klinik
     *
     * @param  int  $obatId
     * @return \Illuminate\Http\Response
     */
    public function getHargaByObat($obatId)
    {
        try {
            $hargaObat = MasterHargaObat::with('klinik')
                                       ->where('id_obat', $obatId)
                                       ->get()
                                       ->map(function ($item) {
                                           return [
                                               'id_obat' => $item->id_obat,
                                               'id_klinik' => $item->id_klinik,
                                               'nama_klinik' => $item->klinik->nama_klinik,
                                               'harga' => $item->harga,
                                               'keterangan' => $item->keterangan,
                                           ];
                                       });

            return response()->json([
                'success' => true,
                'data' => $hargaObat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get all drugs for dropdown list.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function list()
    {
        try {
            $hargaObat = MasterHargaObat::with(['obat', 'klinik'])
                                       ->orderBy('id_klinik', 'asc')
                                       ->orderBy('id_obat', 'asc')
                                       ->get()
                                       ->map(function ($item) {
                                           return [
                                               'id_obat' => $item->id_obat,
                                               'id_klinik' => $item->id_klinik,
                                               'nama_obat' => $item->obat->nama_obat,
                                               'nama_klinik' => $item->klinik->nama_klinik,
                                               'harga' => $item->harga,
                                           ];
                                       });
            
            return response()->json([
                'success' => true,
                'data' => $hargaObat
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}