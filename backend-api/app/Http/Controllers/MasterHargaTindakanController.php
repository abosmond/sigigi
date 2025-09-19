<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\MasterHargaTindakan;
use App\Models\MasterTindakan;
use App\Models\MasterKlinik;

class MasterHargaTindakanController extends Controller
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
            $tindakanId = $request->input('id_master_tindakan');
            
            $query = MasterHargaTindakan::with(['tindakan', 'klinik']);
            
            // Filter berdasarkan klinik jika ada
            if ($klinikId) {
                $query->where('id_klinik', $klinikId);
            }
            
            // Filter berdasarkan tindakan jika ada
            if ($tindakanId) {
                $query->where('id_master_tindakan', $tindakanId);
            }
            
            // Filter pencarian
            if (!empty($search)) {
                $query->whereHas('tindakan', function($q) use ($search) {
                    $q->where('nama_tindakan', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('klinik', function($q) use ($search) {
                    $q->where('nama_klinik', 'LIKE', "%{$search}%");
                });
            }
            
            $hargaTindakan = $query->orderBy('created_at', 'desc')
                                 ->paginate($perPage, ['*'], 'page', $page);
            
            return response()->json([
                'success' => true,
                'data' => $hargaTindakan->items(),
                'total' => $hargaTindakan->total(),
                'current_page' => $hargaTindakan->currentPage(),
                'total_pages' => $hargaTindakan->lastPage()
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
                'id_master_tindakan' => 'required|exists:master_tindakan,id_master_tindakan',
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
            $exists = \DB::table('master_harga_tindakan')
                    ->where('id_master_tindakan', $request->id_master_tindakan)
                    ->where('id_klinik', $request->id_klinik)
                    ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Harga tindakan sudah ada untuk klinik ini'
                ], 422);
            }

            // Membuat dan menyimpan record harga tindakan baru
            $hargaTindakan = new MasterHargaTindakan();
            $hargaTindakan->id_master_tindakan = $request->id_master_tindakan;
            $hargaTindakan->id_klinik = $request->id_klinik;
            $hargaTindakan->harga = $request->harga;
            $hargaTindakan->keterangan = $request->keterangan;
            $hargaTindakan->save();
            
            // Atau alternatif dengan create
            // $hargaTindakan = MasterHargaTindakan::create([
            //     'id_master_tindakan' => $request->id_master_tindakan,
            //     'id_klinik' => $request->id_klinik,
            //     'harga' => $request->harga,
            //     'keterangan' => $request->keterangan
            // ]);
            
            $hargaTindakan->load(['tindakan', 'klinik']);

            return response()->json([
                'success' => true,
                'message' => 'Data harga tindakan berhasil ditambahkan',
                'data' => $hargaTindakan
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
     * @param  int  $tindakanId
     * @return \Illuminate\Http\Response
     */
    public function show($klinikId, $tindakanId)
    {
        try {
            $hargaTindakan = MasterHargaTindakan::with(['tindakan', 'klinik'])
                                             ->where('id_klinik', $klinikId)
                                             ->where('id_master_tindakan', $tindakanId)
                                             ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $hargaTindakan
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data harga tindakan tidak ditemukan'
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
     * @param  int  $tindakanId
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $klinikId, $tindakanId)
    {
        try {
            $exists = \DB::table('master_harga_tindakan')
                      ->where('id_klinik', $klinikId)
                      ->where('id_master_tindakan', $tindakanId)
                      ->exists();
            
            if (!$exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data harga tindakan tidak ditemukan'
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

            \DB::table('master_harga_tindakan')
              ->where('id_klinik', $klinikId)
              ->where('id_master_tindakan', $tindakanId)
              ->update([
                  'harga' => $request->harga,
                  'keterangan' => $request->keterangan
              ]);
            
            $hargaTindakan = MasterHargaTindakan::with(['tindakan', 'klinik'])
                                             ->where('id_klinik', $klinikId)
                                             ->where('id_master_tindakan', $tindakanId)
                                             ->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Data harga tindakan berhasil diperbarui',
                'data' => $hargaTindakan
            ]);
        } catch (\Exception $e) {
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
     * @param  int  $tindakanId
     * @return \Illuminate\Http\Response
     */
    public function destroy($klinikId, $tindakanId)
    {
        try {
            // Menggunakan DB Query Builder untuk memastikan penghapusan hanya menghapus record yang spesifik
            // dengan kedua kondisi id_klinik dan id_master_tindakan
            $deleted = \DB::table('master_harga_tindakan')
                        ->where('id_klinik', $klinikId)
                        ->where('id_master_tindakan', $tindakanId)
                        ->delete();
            
            if ($deleted == 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data harga tindakan tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data harga tindakan berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get semua harga tindakan untuk satu klinik
     *
     * @param  int  $klinikId
     * @return \Illuminate\Http\Response
     */
    public function getHargaByKlinik($klinikId)
    {
        try {
            $hargaTindakan = MasterHargaTindakan::with('tindakan')
                                             ->where('id_klinik', $klinikId)
                                             ->get()
                                             ->map(function ($item) {
                                                 return [
                                                     'id_master_tindakan' => $item->id_master_tindakan,
                                                     'id_klinik' => $item->id_klinik,
                                                     'nama_tindakan' => $item->tindakan->nama_tindakan,
                                                     'harga' => $item->harga,
                                                     'keterangan' => $item->keterangan,
                                                 ];
                                             });

            return response()->json([
                'success' => true,
                'data' => $hargaTindakan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get semua harga untuk satu tindakan di berbagai klinik
     *
     * @param  int  $tindakanId
     * @return \Illuminate\Http\Response
     */
    public function getHargaByTindakan($tindakanId)
    {
        try {
            $hargaTindakan = MasterHargaTindakan::with('klinik')
                                             ->where('id_master_tindakan', $tindakanId)
                                             ->get()
                                             ->map(function ($item) {
                                                 return [
                                                     'id_master_tindakan' => $item->id_master_tindakan,
                                                     'id_klinik' => $item->id_klinik,
                                                     'nama_klinik' => $item->klinik->nama_klinik,
                                                     'harga' => $item->harga,
                                                     'keterangan' => $item->keterangan,
                                                 ];
                                             });

            return response()->json([
                'success' => true,
                'data' => $hargaTindakan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get all treatments for dropdown list.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function list()
    {
        try {
            $hargaTindakan = MasterHargaTindakan::with(['tindakan', 'klinik'])
                                             ->orderBy('id_klinik', 'asc')
                                             ->orderBy('id_master_tindakan', 'asc')
                                             ->get()
                                             ->map(function ($item) {
                                                 return [
                                                     'id_master_tindakan' => $item->id_master_tindakan,
                                                     'id_klinik' => $item->id_klinik,
                                                     'nama_tindakan' => $item->tindakan->nama_tindakan,
                                                     'nama_klinik' => $item->klinik->nama_klinik,
                                                     'harga' => $item->harga,
                                                 ];
                                             });
            
            return response()->json([
                'success' => true,
                'data' => $hargaTindakan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}