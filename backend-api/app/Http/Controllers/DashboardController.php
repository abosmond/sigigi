<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dashboard;

class DashboardController extends Controller
{
    /**
     * Mendapatkan data ringkasan untuk dashboard
     */
    public function summary()
    {
        try {
            $data = Dashboard::getSummary();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mendapatkan jadwal dokter hari ini
     */
    public function todaySchedule()
    {
        try {
            $data = Dashboard::getTodaySchedule();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mendapatkan tindakan terpopuler
     */
    public function popularTreatments()
    {
        try {
            $data = Dashboard::getPopularTreatments();

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mendapatkan data untuk chart
     */
    public function charts()
    {
        try {
            $monthlyVisits = Dashboard::getMonthlyVisits();
            $monthlyRevenue = Dashboard::getMonthlyRevenue();

            return response()->json([
                'success' => true,
                'data' => [
                    'visits' => $monthlyVisits,
                    'revenue' => $monthlyRevenue
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mendapatkan semua data dashboard dalam sekali panggil
     */
    public function all()
    {
        try {
            $summary = Dashboard::getSummary();
            $todaySchedule = Dashboard::getTodaySchedule();
            $popularTreatments = Dashboard::getPopularTreatments();
            $monthlyVisits = Dashboard::getMonthlyVisits();
            $monthlyRevenue = Dashboard::getMonthlyRevenue();

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => $summary,
                    'today_schedule' => $todaySchedule,
                    'popular_treatments' => $popularTreatments,
                    'charts' => [
                        'visits' => $monthlyVisits,
                        'revenue' => $monthlyRevenue
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}