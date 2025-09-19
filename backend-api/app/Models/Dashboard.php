<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Dashboard extends Model
{
    /**
     * Mendapatkan ringkasan data untuk dashboard
     */
    public static function getSummary()
    {
        $currentMonth = date('m');
        $lastMonth = date('m', strtotime('-1 month'));
        $currentYear = date('Y');

        // Total Pasien
        $totalPatients = DB::table('pasien')->count();
        $newPatientsThisMonth = DB::table('pasien')
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Total Dokter
        $totalDoctors = DB::table('dokter')->count();
        $totalClinics = DB::table('klinik')->count();

        // Tindakan Bulan Ini
        $treatmentsThisMonth = DB::table('rekam_medis_tindakan')
            ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
            ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $currentMonth)
            ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
            ->count();

        $treatmentsLastMonth = DB::table('rekam_medis_tindakan')
            ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
            ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $lastMonth)
            ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
            ->count();

        $treatmentPercentChange = $treatmentsLastMonth > 0 
            ? round((($treatmentsThisMonth - $treatmentsLastMonth) / $treatmentsLastMonth) * 100) 
            : 0;

        // Kalkulasi Pendapatan (dari tindakan)
        $revenueThisMonth = DB::table('rekam_medis_tindakan')
            ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
            ->join('master_harga_tindakan', function ($join) {
                $join->on('rekam_medis_tindakan.id_master_tindakan', '=', 'master_harga_tindakan.id_master_tindakan');
            })
            ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $currentMonth)
            ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
            ->sum('master_harga_tindakan.harga');

        $revenueLastMonth = DB::table('rekam_medis_tindakan')
            ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
            ->join('master_harga_tindakan', function ($join) {
                $join->on('rekam_medis_tindakan.id_master_tindakan', '=', 'master_harga_tindakan.id_master_tindakan');
            })
            ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $lastMonth)
            ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
            ->sum('master_harga_tindakan.harga');

        $revenuePercentChange = $revenueLastMonth > 0 
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100) 
            : 0;

        return [
            'total_patients' => $totalPatients,
            'new_patients_this_month' => $newPatientsThisMonth,
            'total_doctors' => $totalDoctors,
            'total_clinics' => $totalClinics,
            'treatments_this_month' => $treatmentsThisMonth,
            'treatment_percent_change' => $treatmentPercentChange,
            'revenue_this_month' => $revenueThisMonth,
            'revenue_percent_change' => $revenuePercentChange
        ];
    }

    /**
     * Mendapatkan jadwal dokter hari ini
     */
    public static function getTodaySchedule()
    {
        $today = date('Y-m-d');

        return DB::table('dokter_klinik')
            ->join('dokter', 'dokter_klinik.id_dokter', '=', 'dokter.id_dokter')
            ->join('klinik', 'dokter_klinik.id_klinik', '=', 'klinik.id_klinik')
            ->select(
                'dokter.nama_dokter',
                'dokter_klinik.jadwal_praktek',
                'klinik.nama_klinik',
                DB::raw('(SELECT COUNT(*) FROM rekam_medis_pasien 
                          WHERE rekam_medis_pasien.id_dokter_klinik = dokter_klinik.id_dokter_klinik 
                          AND DATE(rekam_medis_pasien.tanggal_kunjungan) = "' . $today . '") as jumlah_pasien')
            )
            ->where(DB::raw('FIND_IN_SET(DAYNAME("' . $today . '"), REPLACE(REPLACE(dokter_klinik.jadwal_praktek, " ", ""), ",", ","))'), '>', 0)
            ->orderBy('jumlah_pasien', 'desc')
            ->get();
    }

    /**
     * Mendapatkan tindakan terpopuler bulan ini
     */
    public static function getPopularTreatments()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        return DB::table('rekam_medis_tindakan')
            ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
            ->join('master_tindakan', 'rekam_medis_tindakan.id_master_tindakan', '=', 'master_tindakan.id_master_tindakan')
            ->select(
                'master_tindakan.nama_tindakan',
                DB::raw('COUNT(*) as jumlah_tindakan')
            )
            ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $currentMonth)
            ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
            ->groupBy('master_tindakan.nama_tindakan')
            ->orderBy('jumlah_tindakan', 'desc')
            ->limit(5)
            ->get();
    }

    /**
     * Mendapatkan data kunjungan per bulan (untuk grafik)
     */
    public static function getMonthlyVisits()
    {
        $currentYear = date('Y');
        
        $months = [];
        for ($i = 1; $i <= 12; $i++) {
            $months[] = [
                'month' => date('M', mktime(0, 0, 0, $i, 1)),
                'month_num' => $i
            ];
        }

        $result = [];
        foreach ($months as $month) {
            $count = DB::table('rekam_medis_pasien')
                ->whereMonth('tanggal_kunjungan', $month['month_num'])
                ->whereYear('tanggal_kunjungan', $currentYear)
                ->count();

            $result[] = [
                'name' => $month['month'],
                'total' => $count
            ];
        }

        return $result;
    }

    /**
     * Mendapatkan data pendapatan per bulan (untuk grafik)
     */
    public static function getMonthlyRevenue()
    {
        $currentYear = date('Y');
        
        $months = [];
        for ($i = 1; $i <= 12; $i++) {
            $months[] = [
                'month' => date('M', mktime(0, 0, 0, $i, 1)),
                'month_num' => $i
            ];
        }

        $result = [];
        foreach ($months as $month) {
            $revenue = DB::table('rekam_medis_tindakan')
                ->join('rekam_medis_pasien', 'rekam_medis_tindakan.id_rekam_medis', '=', 'rekam_medis_pasien.id_rekam_medis')
                ->join('master_harga_tindakan', function ($join) {
                    $join->on('rekam_medis_tindakan.id_master_tindakan', '=', 'master_harga_tindakan.id_master_tindakan');
                })
                ->whereMonth('rekam_medis_pasien.tanggal_kunjungan', $month['month_num'])
                ->whereYear('rekam_medis_pasien.tanggal_kunjungan', $currentYear)
                ->sum('master_harga_tindakan.harga');

            $result[] = [
                'name' => $month['month'],
                'total' => $revenue
            ];
        }

        return $result;
    }
}