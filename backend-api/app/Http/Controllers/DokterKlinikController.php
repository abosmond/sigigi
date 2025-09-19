<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\DokterKlinik;
use App\models\MasterDokter;
use App\models\MasterKlinik;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DokterKlinikController extends Controller
{
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $klinikId = $request->input('id_klinik');
            $dokterId = $request->input('id_dokter');
            
            $query = DokterKlinik::with(['dokter', 'klinik']);
            
            // Filter berdasarkan klinik jika ada
            if ($klinikId) {
                $query->where('id_klinik', $klinikId);
            }
            
            // Filter berdasarkan dokter jika ada
            if ($dokterId) {
                $query->where('id_dokter', $dokterId);
            }
            
            // Filter pencarian
            if (!empty($search)) {
                $query->whereHas('dokter', function($q) use ($search) {
                    $q->where('nama_dokter', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('klinik', function($q) use ($search) {
                    $q->where('nama_klinik', 'LIKE', "%{$search}%");
                })
                ->orWhere('no_sip', 'LIKE', "%{$search}%");
            }
            
            $dokterKliniks = $query->orderBy('created_at', 'desc')
                                  ->paginate($perPage, ['*'], 'page', $page);
            
            return response()->json([
                'success' =>true,
                'data' => $dokterKliniks->items(),
                'meta' => [
                    'current_page' => $dokterKliniks->currentPage(),
                    'last_page' => $dokterKliniks->lastPage(),
                    'per_page' => $dokterKliniks->perPage(),
                    'total' => $dokterKliniks->total()
                ],
                'total_pages' => $dokterKliniks->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
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
                'id_dokter' => 'required|exists:dokter,id_dokter',
                'id_klinik' => 'required|exists:klinik,id_klinik',
                'no_sip' => 'required|string|max:50|unique:dokter_klinik',
                'jadwal_praktek' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' =>false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cek apakah relasi sudah ada
            $exists = DokterKlinik::where('id_dokter', $request->id_dokter)
                                ->where('id_klinik', $request->id_klinik)
                                ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' =>false,
                    'message' => 'Dokter sudah terdaftar di klinik ini'
                ], 422);
            }

            $dokterKlinik = DokterKlinik::create($request->all());
            $dokterKlinik->load(['dokter', 'klinik']);

            return response()->json([
                'success' =>true,
                'message' => 'Data dokter klinik berhasil ditambahkan',
                'data' => $dokterKlinik
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $dokterKlinik = DokterKlinik::with(['dokter', 'klinik'])
                                      ->findOrFail($id);
            
            return response()->json([
                'success' =>true,
                'data' => $dokterKlinik
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Data dokter klinik tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $dokterKlinik = DokterKlinik::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'id_dokter' => 'required|exists:dokter,id_dokter',
                'id_klinik' => 'required|exists:klinik,id_klinik',
                'no_sip' => 'required|string|max:50|unique:dokter_klinik,no_sip,' . $id . ',id_dokter_klinik',
                'jadwal_praktek' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' =>false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cek duplikasi selain record ini sendiri
            $exists = DokterKlinik::where('id_dokter', $request->id_dokter)
                                ->where('id_klinik', $request->id_klinik)
                                ->where('id_dokter_klinik', '!=', $id)
                                ->exists();
            
            if ($exists) {
                return response()->json([
                    'success' =>false,
                    'message' => 'Dokter sudah terdaftar di klinik ini'
                ], 422);
            }

            $dokterKlinik->update($request->all());
            $dokterKlinik->load(['dokter', 'klinik']);

            return response()->json([
                'success' =>true,
                'message' => 'Data dokter klinik berhasil diperbarui',
                'data' => $dokterKlinik
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Data dokter klinik tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $dokterKlinik = DokterKlinik::findOrFail($id);
            $dokterKlinik->delete();

            return response()->json([
                'success' =>true,
                'message' => 'Data dokter klinik berhasil dihapus'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Data dokter klinik tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dokters by klinik
     *
     * @param  int  $klinikId
     * @return \Illuminate\Http\Response
     */
    public function getDoktersByKlinik($klinikId)
    {
        try {
            $dokters = DokterKlinik::with('dokter')
                                  ->where('id_klinik', $klinikId)
                                  ->get()
                                  ->map(function ($item) {
                                      return [
                                          'id_dokter_klinik' => $item->id_dokter_klinik,
                                          'id_dokter' => $item->dokter->id_dokter,
                                          'nama_dokter' => $item->dokter->nama_dokter,
                                          'no_sip' => $item->no_sip,
                                          'jadwal_praktek' => $item->jadwal_praktek,
                                      ];
                                  });

            return response()->json([
                'success' =>true,
                'data' => $dokters
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get kliniks by dokter
     *
     * @param  int  $dokterId
     * @return \Illuminate\Http\Response
     */
    public function getKliniksByDokter($dokterId)
    {
        try {
            $kliniks = DokterKlinik::with('klinik')
                                  ->where('id_dokter', $dokterId)
                                  ->get()
                                  ->map(function ($item) {
                                      return [
                                          'id_dokter_klinik' => $item->id_dokter_klinik,
                                          'id_klinik' => $item->klinik->id_klinik,
                                          'nama_klinik' => $item->klinik->nama_klinik,
                                          'no_sip' => $item->no_sip,
                                          'jadwal_praktek' => $item->jadwal_praktek,
                                      ];
                                  });

            return response()->json([
                'success' =>true,
                'data' => $kliniks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' =>false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}
