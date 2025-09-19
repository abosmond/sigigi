<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MasterPasien;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MasterPasienController extends Controller
{
    /**
     * Generate nomor rekam medis baru berdasarkan ID klinik
     *
     * @param  int  $id_klinik
     * @return string
     */
    private function generateRekamMedisNumber($id_klinik)
    {
        try {
            // Ambil data klinik
            $klinik = \App\Models\MasterKlinik::findOrFail($id_klinik);
            
            // Ambil 3 karakter pertama dari nama klinik, hilangkan "Klinik" jika ada
            $namaKlinik = preg_replace('/^Klinik\s+/i', '', $klinik->nama_klinik);
            $prefix = strtoupper(substr($namaKlinik, 0, 3));
            
            // Cari nomor terakhir untuk klinik ini
            $lastNumber = MasterPasien::where('no_rekam_medis', 'like', $prefix.'%')
                ->orderBy('no_rekam_medis', 'desc')
                ->value('no_rekam_medis');
            
            if ($lastNumber) {
                // Ekstrak angka dari nomor terakhir
                preg_match('/[A-Z]+(\d+)/', $lastNumber, $matches);
                if (isset($matches[1])) {
                    $nextNumber = intval($matches[1]) + 1;
                } else {
                    $nextNumber = 1;
                }
            } else {
                $nextNumber = 1;
            }
            
            // Format nomor baru dengan 5 digit
            return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
        } catch (\Exception $e) {
            // Fallback jika terjadi error
            $random = rand(10000, 99999);
            return 'RM' . $random;
        }
    }
    
    /**
     * Mendapatkan nomor rekam medis berdasarkan ID klinik
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function generateRekamMedis(Request $request)
    {
        try {
            $id_klinik = $request->query('id_klinik');
            
            if (!$id_klinik) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID klinik diperlukan',
                ], 400);
            }
            
            $rekamMedisNumber = $this->generateRekamMedisNumber($id_klinik);
            
            return response()->json([
                'success' => true,
                'no_rekam_medis' => $rekamMedisNumber
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Menampilkan daftar pasien dengan paginasi dan pencarian
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

            $query = MasterPasien::query();

            // Filter berdasarkan pencarian
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'LIKE', "%{$search}%")
                      ->orWhere('no_rekam_medis', 'LIKE', "%{$search}%")
                      ->orWhere('nik', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('telepon', 'LIKE', "%{$search}%");
                });
            }

            // Paginasi
            $pasiens = $query->orderBy('id_pasien', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $pasiens->items(),
                'total' => $pasiens->total(),
                'current_page' => $pasiens->currentPage(),
                'per_page' => $pasiens->perPage(),
                'total_pages' => $pasiens->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menyimpan pasien baru
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validasi request
            $validator = Validator::make($request->all(), [
                'id_klinik' => 'required|exists:klinik,id_klinik',
                'nama_lengkap' => 'required|max:100',
                'nik' => 'nullable|max:16',
                'tempat_lahir' => 'nullable|max:50',
                'tanggal_lahir' => 'nullable|date',
                'jenis_kelamin' => 'nullable|in:L,P',
                'alamat' => 'nullable',
                'telepon' => 'nullable|max:20',
                'email' => 'nullable|email|max:100',
                'golongan_darah' => 'nullable|in:A,B,AB,O',
                'kontak_darurat_nama' => 'nullable|max:100',
                'kontak_darurat_telepon' => 'nullable|max:20',
                'kontak_darurat_relasi' => 'nullable|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Buat data request untuk pasien
            $inputData = $request->all();
            
            // Generate nomor rekam medis jika tidak ada
            if (empty($inputData['no_rekam_medis'])) {
                $inputData['no_rekam_medis'] = $this->generateRekamMedisNumber($inputData['id_klinik']);
            }
            
            // Buat data pasien baru
            $pasien = MasterPasien::create($inputData);

            return response()->json([
                'success' => true,
                'message' => 'Data pasien berhasil ditambahkan',
                'data' => $pasien,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menampilkan detail pasien
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $pasien = MasterPasien::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $pasien,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data pasien tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update data pasien
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
                'id_klinik' => 'required|exists:klinik,id_klinik',
                'nama_lengkap' => 'required|max:100',
                'nik' => 'nullable|max:16',
                'tempat_lahir' => 'nullable|max:50',
                'tanggal_lahir' => 'nullable|date',
                'jenis_kelamin' => 'nullable|in:L,P',
                'alamat' => 'nullable',
                'telepon' => 'nullable|max:20',
                'email' => 'nullable|email|max:100',
                'golongan_darah' => 'nullable|in:A,B,AB,O',
                'kontak_darurat_nama' => 'nullable|max:100',
                'kontak_darurat_telepon' => 'nullable|max:20',
                'kontak_darurat_relasi' => 'nullable|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Temukan pasien
            $pasien = MasterPasien::findOrFail($id);
            $inputData = $request->all();
            
            // Cek apakah klinik berubah
            $klinikBerubah = $pasien->id_klinik != $inputData['id_klinik'];
            
            // Jika klinik berubah dan no_rekam_medis kosong, generate nomor baru
            // Dalam praktik normal, sebaiknya pertahankan no_rekam_medis meskipun klinik berubah
            if (empty($inputData['no_rekam_medis']) && $klinikBerubah) {
                $inputData['no_rekam_medis'] = $this->generateRekamMedisNumber($inputData['id_klinik']);
            } else if (empty($inputData['no_rekam_medis'])) {
                // Gunakan nomor yang sudah ada
                $inputData['no_rekam_medis'] = $pasien->no_rekam_medis;
            }
            
            // Update pasien
            $pasien->update($inputData);

            return response()->json([
                'status' => 'success',
                'message' => 'Data pasien berhasil diperbarui',
                'data' => $pasien,
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pasien tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Menghapus data pasien
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            // Temukan dan hapus pasien
            $pasien = MasterPasien::findOrFail($id);
            $pasien->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Data pasien berhasil dihapus',
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pasien tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        } 
    }

    /**
     * Mengambil daftar sederhana pasien untuk dropdown
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        try {
            $id_klinik = $request->query('id_klinik');
            $query = MasterPasien::select('id_pasien', 'no_rekam_medis', 'nama_lengkap');
            
            if ($id_klinik) {
                $query->where('id_klinik', $id_klinik);
            }
            
            $pasiens = $query->orderBy('nama_lengkap', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $pasiens
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}