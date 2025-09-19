<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RekamMedisPasien;
use App\Models\RekamMedisTindakan;
use App\Models\ResepTindakan;
use App\Models\DokterKlinik;
use App\Models\MasterPasien;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RekamMedisController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $pasienId = $request->input('id_pasien');
            $dokterKlinikId = $request->input('id_dokter_klinik');
            $statusPembayaran = $request->input('status_pembayaran');
            
            $query = RekamMedisPasien::with(['pasien', 'dokterKlinik.dokter']);
            
            // Filter berdasarkan pasien jika ada
            if ($pasienId) {
                $query->where('id_pasien', $pasienId);
            }
            
            // Filter berdasarkan dokter klinik jika ada
            if ($dokterKlinikId) {
                $query->where('id_dokter_klinik', $dokterKlinikId);
            }
            
            // Filter berdasarkan status pembayaran jika ada
            if ($statusPembayaran) {
                $query->where('status_pembayaran', $statusPembayaran);
            }
            
            // Filter pencarian
            if (!empty($search)) {
                $query->whereHas('pasien', function($q) use ($search) {
                    $q->where('nama_lengkap', 'LIKE', "%{$search}%")
                      ->orWhere('no_rekam_medis', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('dokterKlinik.dokter', function($q) use ($search) {
                    $q->where('nama_dokter', 'LIKE', "%{$search}%");
                })
                ->orWhere('keluhan', 'LIKE', "%{$search}%");
            }
            
            $rekamMedis = $query->orderBy('tanggal_kunjungan', 'desc')
                              ->paginate($perPage, ['*'], 'page', $page);
            
            return response()->json([
                'success' => true,
                'data' => $rekamMedis->items(),
                'meta' => [
                    'current_page' => $rekamMedis->currentPage(),
                    'last_page' => $rekamMedis->lastPage(),
                    'per_page' => $rekamMedis->perPage(),
                    'total' => $rekamMedis->total()
                ],
                'total_pages' => $rekamMedis->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getKondisiGigiDariTindakan($treatmentID) {
        switch($treatmentID) {
            case 1:
                return 'Karies';
            default:
                return 'Perawatan Ortodonti';
        }
    }

    private function getWarnaOdontogramDariTindakan($treatmentId) {
        // Logika untuk menentukan warna berdasarkan ID tindakan
        
        switch ($treatmentId) {
            case 1: return '#FF0000'; // merah untuk tambalan
            case 2: return '#000000'; // hitam untuk ekstraksi
            // tambahkan case lainnya sesuai kebutuhan
            default: return '#0000FF'; // biru default
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
                'id_pasien' => 'required|exists:pasien,id_pasien',
                'id_dokter_klinik' => 'required|exists:dokter_klinik,id_dokter_klinik',
                'tanggal_kunjungan' => 'required|date',
                'keluhan' => 'nullable|string',
                'catatan_dokter' => 'nullable|string',
                'biaya' => 'nullable|numeric',
                'status_pembayaran' => 'nullable|in:Belum Bayar,Sudah Bayar',
                'treatments' => 'nullable|array',
                'prescriptions' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Simpan data rekam medis
            $rekamMedis = RekamMedisPasien::create([
                'id_pasien' => $request->id_pasien,
                'id_dokter_klinik' => $request->id_dokter_klinik,
                'tanggal_kunjungan' => $request->tanggal_kunjungan,
                'keluhan' => $request->keluhan,
                'catatan_dokter' => $request->catatan_dokter,
                'biaya' => $request->biaya ?? 0,
                'status_pembayaran' => $request->status_pembayaran ?? 'Belum Bayar'
            ]);

            // Simpan data tindakan jika ada
            if ($request->has('treatments') && is_array($request->treatments)) {
                foreach ($request->treatments as $treatment) {
                    RekamMedisTindakan::create([
                        'id_rekam_medis' => $rekamMedis->id_rekam_medis,
                        'id_master_kode_penyakit' => $treatment['diseaseId'],
                        'id_master_tindakan' => $treatment['treatmentId'],
                        'nomor_gigi' => $treatment['toothNumber'],
                        'posisi_gigi' => $treatment['position'],
                        'catatan_tindakan' => $treatment['notes'] ?? null
                    ]);

                    $kondisiGigi = $this->getKondisiGigiDariTindakan($treatment['treatmentId']);
                    $warnaOdontogram = $this->getWarnaOdontogramDariTindakan($treatment['treatmentId']);
                    $formattedDate = date('Y-m-d H:i:s', strtotime($request->tanggal_kunjungan));

                    DB::table('odontogram_pasien')->updateOrInsert(
                        [
                            'id_pasien' => $request->id_pasien,
                            'nomor_gigi' => $treatment['toothNumber'],
                            'posisi_gigi' => $treatment['position'],
                            'tanggal_periksa' => $formattedDate
                        ],
                        [
                            'kondisi_gigi' => $kondisiGigi,
                            'warna_odontogram' => $warnaOdontogram,
                            'keterangan' => $treatment['notes'] ?? null,
                            'created_at' => now(),
                            'updated_at' => now()
                        ] 
                    );
                }
            }

            // Simpan data resep jika ada
            if ($request->has('prescriptions') && is_array($request->prescriptions)) {
                $resepCounter = 1;
                foreach ($request->prescriptions as $prescription) {
                    ResepTindakan::create([
                        'id_resep_tindakan' => $resepCounter++,
                        'id_rekam_medis' => $rekamMedis->id_rekam_medis,
                        'id_obat' => $prescription['drugId'],
                        'jumlah' => $prescription['quantity'],
                        'aturan_pakai' => $prescription['dosage'],
                        'catatan' => $prescription['notes'] ?? null
                    ]);
                }
            }

            DB::commit();

            // Load relasi untuk response
            $rekamMedis->load(['pasien', 'dokterKlinik.dokter', 'tindakan.kodePenyakit', 'tindakan.tindakan', 'resep.obat']);

            return response()->json([
                'success' => true,
                'message' => 'Data rekam medis berhasil ditambahkan',
                'data' => $rekamMedis
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
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
            // Ambil rekam medis dengan relasi
            $rekamMedis = RekamMedisPasien::with([
                'pasien', 
                'dokterKlinik.dokter', 
                'dokterKlinik.klinik',
                'tindakan.kodePenyakit', 
                'tindakan.tindakan', 
                'resep.obat'
            ])->findOrFail($id);
            
            // Ambil ID klinik
            $klinikId = $rekamMedis->dokterKlinik ? $rekamMedis->dokterKlinik->id_klinik : null;
            
            // Format data tindakan menjadi format yang diharapkan frontend
            $treatments = [];
            foreach ($rekamMedis->tindakan as $tindakan) {

                $hargaTindakan = DB::table('master_harga_tindakan')
                ->where('id_klinik', $klinikId)
                ->where('id_master_tindakan', $tindakan->id_master_tindakan)
                ->first();

                $treatments[] = [
                    'diseaseId' => $tindakan->id_master_kode_penyakit,
                    'diseaseName' => $tindakan->kodePenyakit ? $tindakan->kodePenyakit->nama_penyakit : '',
                    'treatmentId' => $tindakan->id_master_tindakan,
                    'treatmentName' => $tindakan->tindakan ? $tindakan->tindakan->nama_tindakan : '',
                    'toothNumber' => $tindakan->nomor_gigi,
                    'position' => $tindakan->posisi_gigi,
                    'cost' => $hargaTindakan ? $hargaTindakan->harga : 0,
                    'notes' => $tindakan->catatan_tindakan
                ];
            }
            
            // Format data resep menjadi format yang diharapkan frontend
            $prescriptions = [];
            foreach ($rekamMedis->resep as $resep) {
                $hargaObat = DB::table('master_harga_obat')
                ->where('id_klinik', $klinikId)
                ->where('id_obat', $resep->id_obat)
                ->first();

                $prescriptions[] = [
                    'drugId' => $resep->id_obat,
                    'drugName' => $resep->obat ? $resep->obat->nama_obat : '',
                    'quantity' => $resep->jumlah,
                    'unit' => $resep->obat ? $resep->obat->satuan : '',
                    'dosage' => $resep->aturan_pakai,
                    'cost' => $hargaObat ? $hargaObat->harga * $resep->jumlah : 0,
                    'notes' => $resep->catatan
                ];
            }
            
            // Tambahkan data yang telah diformat ke rekam medis
            $rekamMedisData = $rekamMedis->toArray();
            $rekamMedisData['treatments'] = $treatments;
            $rekamMedisData['prescriptions'] = $prescriptions;
            
            return response()->json([
                'success' => true,
                'data' => $rekamMedisData
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $rekamMedis = RekamMedisPasien::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'id_dokter_klinik' => 'nullable|exists:dokter_klinik,id_dokter_klinik',
                'tanggal_kunjungan' => 'nullable|date',
                'keluhan' => 'nullable|string',
                'catatan_dokter' => 'nullable|string',
                'biaya' => 'nullable|numeric',
                'status_pembayaran' => 'nullable|in:Belum Bayar,Sudah Bayar',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update rekam medis
            $rekamMedis->update($request->all());
            
            // Load relasi untuk response
            $rekamMedis->load(['pasien', 'dokterKlinik.dokter', 'tindakan.kodePenyakit', 'tindakan.tindakan', 'resep.obat']);

            return response()->json([
                'success' => true,
                'message' => 'Data rekam medis berhasil diperbarui',
                'data' => $rekamMedis
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status for a specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatePaymentStatus(Request $request, $id)
    {
        try {
            $rekamMedis = RekamMedisPasien::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'status_pembayaran' => 'required|in:Belum Bayar,Sudah Bayar',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update status pembayaran
            $rekamMedis->update([
                'status_pembayaran' => $request->status_pembayaran
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status pembayaran berhasil diperbarui',
                'data' => $rekamMedis
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
            ], 404);
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $rekamMedis = RekamMedisPasien::findOrFail($id);
            
            DB::beginTransaction();
            
            // Hapus semua tindakan terkait
            RekamMedisTindakan::where('id_rekam_medis', $id)->delete();
            
            // Hapus semua resep terkait
            ResepTindakan::where('id_rekam_medis', $id)->delete();
            
            // Hapus rekam medis
            $rekamMedis->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data rekam medis berhasil dihapus'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get medical records by patient ID
     *
     * @param  int  $pasienId
     * @return \Illuminate\Http\Response
     */
    public function getRiwayatPasien($pasienId)
    {
        try {
            // Validasi ID pasien
            $pasien = MasterPasien::findOrFail($pasienId);

            $rekamMedis = RekamMedisPasien::with([
                'dokterKlinik.dokter',
                'tindakan.kodePenyakit',
                'tindakan.tindakan',
                'resep.obat'
            ])
            ->where('id_pasien', $pasienId)
            ->orderBy('tanggal_kunjungan', 'desc')
            ->get();

            return response()->json([
                'success' => true,
                'data' => $rekamMedis
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data pasien tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate printable medical record
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function printRekamMedis($id)
    {
        try {
            $rekamMedis = RekamMedisPasien::with([
                'pasien', 
                'dokterKlinik.dokter', 
                'dokterKlinik.klinik',
                'tindakan.kodePenyakit', 
                'tindakan.tindakan'
            ])->findOrFail($id);

            // Di sini Anda bisa membuat logika untuk menghasilkan file PDF atau dokumen lainnya
            // Untuk sementara, kita hanya mengembalikan data lengkap

            return response()->json([
                'success' => true,
                'data' => $rekamMedis,
                'message' => 'Dokumen rekam medis siap untuk dicetak'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate printable prescription
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function printResep($id)
    {
        try {
            $rekamMedis = RekamMedisPasien::with([
                'pasien', 
                'dokterKlinik.dokter', 
                'dokterKlinik.klinik',
                'resep.obat'
            ])->findOrFail($id);

            // Di sini Anda bisa membuat logika untuk menghasilkan file PDF atau dokumen lainnya
            // Untuk sementara, kita hanya mengembalikan data lengkap

            return response()->json([
                'success' => true,
                'data' => $rekamMedis,
                'message' => 'Resep obat siap untuk dicetak'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data rekam medis tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}