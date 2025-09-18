// src/services/dashboard.ts
import { api, getDefaultHeaders } from '@/lib/api';

export interface DashboardSummary {
  total_patients: number;
  new_patients_this_month: number;
  total_doctors: number;
  total_clinics: number;
  treatments_this_month: number;
  treatment_percent_change: number;
  revenue_this_month: number;
  revenue_percent_change: number;
}

export interface DoctorSchedule {
  nama_dokter: string;
  jadwal_praktek: string;
  nama_klinik: string;
  jumlah_pasien: number;
}

export interface PopularTreatment {
  nama_tindakan: string;
  jumlah_tindakan: number;
}

export interface ChartData {
  name: string;
  total: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  today_schedule: DoctorSchedule[];
  popular_treatments: PopularTreatment[];
  charts: {
    visits: ChartData[];
    revenue: ChartData[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const dashboardService = {
  // Mendapatkan semua data dashboard
  getAll: async (): Promise<DashboardData> => {
    const response = await fetch(api.dashboard.all, {
      credentials: 'include',
      headers: getDefaultHeaders(false)
    });
    const data = await response.json() as ApiResponse<DashboardData>;
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil data dashboard');
    }
    
    return data.data;
  },

  // Mendapatkan ringkasan dashboard
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await fetch(api.dashboard.summary, {
      credentials: 'include',
      headers: getDefaultHeaders(false)
    });
    const data = await response.json() as ApiResponse<DashboardSummary>;
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil data ringkasan');
    }
    
    return data.data;
  },

  // Mendapatkan jadwal dokter hari ini
  getTodaySchedule: async (): Promise<DoctorSchedule[]> => {
    const response = await fetch(api.dashboard.todaySchedule, {
      credentials: 'include',
      headers: getDefaultHeaders(false)
    });
    const data = await response.json() as ApiResponse<DoctorSchedule[]>;
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil jadwal dokter');
    }
    
    return data.data;
  },

  // Mendapatkan tindakan terpopuler
  getPopularTreatments: async (): Promise<PopularTreatment[]> => {
    const response = await fetch(api.dashboard.popularTreatments, {
      credentials: 'include',
      headers: getDefaultHeaders(false)
    });
    const data = await response.json() as ApiResponse<PopularTreatment[]>;
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil data tindakan populer');
    }
    
    return data.data;
  },

  // Mendapatkan data chart
  getCharts: async (): Promise<{ visits: ChartData[]; revenue: ChartData[] }> => {
    const response = await fetch(api.dashboard.charts, {
      credentials: 'include',
      headers: getDefaultHeaders(false)
    });
    const data = await response.json() as ApiResponse<{ visits: ChartData[]; revenue: ChartData[] }>;
    
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengambil data grafik');
    }
    
    return data.data;
  }
};