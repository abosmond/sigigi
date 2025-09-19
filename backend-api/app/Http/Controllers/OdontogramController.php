<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OdontogramPasien;
use App\Models\MasterPasien;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OdontogramController extends Controller
{
    /**
     * Get odontogram for a specific patient
     *
     * @param  int  $pasienId
     * @return \Illuminate\Http\Response
     */
    public function getOdontogramPasien($pasienId)
    {
        try {
            // Validasi ID pasien
            $pasien = MasterPasien::findOrFail($pasienId);

            $odontogram = OdontogramPasien::where('id_pasien', $pasienId)
                ->orderBy('tanggal_periksa', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $odontogram
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
     * Get odontogram for a specific patient at a specific date
     *
     * @param  int  $pasienId
     * @param  string  $date (format: Y-m-d)
     * @return \Illuminate\Http\Response
     */
    public function getOdontogramByDate($pasienId, $date)
    {
        try {
            // Validasi ID pasien
            $pasien = MasterPasien::findOrFail($pasienId);

            $odontogram = OdontogramPasien::where('id_pasien', $pasienId)
                ->whereDate('tanggal_periksa', $date)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $odontogram
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
     * Update odontogram for a patient
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateOdontogram(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_pasien' => 'required|exists:pasien,id_pasien',
                'nomor_gigi' => 'required|string|max:2',
                'posisi_gigi' => 'required|in:M,D,O,B,L,P,R',
                'kondisi_gigi' => 'required|string|max:50',
                'warna_odontogram' => 'required|string|max:7',
                'keterangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Set tanggal periksa ke waktu saat ini jika tidak diberikan
            $tanggalPeriksa = $request->input('tanggal_periksa', now());

            // Cari record odontogram yang sudah ada
            $odontogram = OdontogramPasien::where('id_pasien', $request->id_pasien)
                ->where('nomor_gigi', $request->nomor_gigi)
                ->where('posisi_gigi', $request->posisi_gigi)
                ->whereDate('tanggal_periksa', $tanggalPeriksa)
                ->first();

            if ($odontogram) {
                // Update record yang sudah ada
                $odontogram->update([
                    'kondisi_gigi' => $request->kondisi_gigi,
                    'warna_odontogram' => $request->warna_odontogram,
                    'keterangan' => $request->keterangan
                ]);
            } else {
                // Buat record baru
                $odontogram = OdontogramPasien::create([
                    'id_pasien' => $request->id_pasien,
                    'tanggal_periksa' => $tanggalPeriksa,
                    'nomor_gigi' => $request->nomor_gigi,
                    'posisi_gigi' => $request->posisi_gigi,
                    'kondisi_gigi' => $request->kondisi_gigi,
                    'warna_odontogram' => $request->warna_odontogram,
                    'keterangan' => $request->keterangan
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data odontogram berhasil diperbarui',
                'data' => $odontogram
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple odontogram entries in batch
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateOdontogramBatch(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id_pasien' => 'required|exists:pasien,id_pasien',
                'entries' => 'required|array',
                'entries.*.nomor_gigi' => 'required|string|max:2',
                'entries.*.posisi_gigi' => 'required|in:M,D,O,B,L,P,R',
                'entries.*.kondisi_gigi' => 'required|string|max:50',
                'entries.*.warna_odontogram' => 'required|string|max:7',
                'entries.*.keterangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Set tanggal periksa ke waktu saat ini jika tidak diberikan
            $tanggalPeriksa = $request->input('tanggal_periksa', now());

            DB::beginTransaction();

            $updatedEntries = [];

            foreach ($request->entries as $entry) {
                // Cari record odontogram yang sudah ada
                $odontogram = OdontogramPasien::where('id_pasien', $request->id_pasien)
                    ->where('nomor_gigi', $entry['nomor_gigi'])
                    ->where('posisi_gigi', $entry['posisi_gigi'])
                    ->whereDate('tanggal_periksa', $tanggalPeriksa)
                    ->first();

                if ($odontogram) {
                    // Update record yang sudah ada
                    $odontogram->update([
                        'kondisi_gigi' => $entry['kondisi_gigi'],
                        'warna_odontogram' => $entry['warna_odontogram'],
                        'keterangan' => $entry['keterangan'] ?? null
                    ]);
                } else {
                    // Buat record baru
                    $odontogram = OdontogramPasien::create([
                        'id_pasien' => $request->id_pasien,
                        'tanggal_periksa' => $tanggalPeriksa,
                        'nomor_gigi' => $entry['nomor_gigi'],
                        'posisi_gigi' => $entry['posisi_gigi'],
                        'kondisi_gigi' => $entry['kondisi_gigi'],
                        'warna_odontogram' => $entry['warna_odontogram'],
                        'keterangan' => $entry['keterangan'] ?? null
                    ]);
                }

                $updatedEntries[] = $odontogram;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data odontogram berhasil diperbarui',
                'data' => $updatedEntries
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}