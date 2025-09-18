// src/lib/api.ts
export const getDefaultHeaders = (contentType = true) => {
  const headers: Record<string, string> = {
    'Accept': 'application/json'
  }
  
  if (contentType) {
    headers['Content-Type'] = 'application/json'
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Base URL sesuai dengan struktur project PHP kita
export const API_BASE_URL = 'https://api-sigigi.abosmond.xyz';

export const api = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login.php`,
    logout: `${API_BASE_URL}/api/logout`,
    me: `${API_BASE_URL}/api/auth/me.php`,
  },
  master: {
    // Endpoint yang sudah ada
    penyakit: `${API_BASE_URL}/api/master-kode-penyakit`,
    obat: `${API_BASE_URL}/api/master-obat`,
    tindakan: `${API_BASE_URL}/api/master-tindakan`,
    hargaObat: `${API_BASE_URL}/api/master-harga-obat`,
    hargaTindakan: `${API_BASE_URL}/api/master-harga-tindakan`,
    
    // Alias untuk konsistensi dengan tindakan-medis.ts
    diseases: `${API_BASE_URL}/api/master-kode-penyakit`,
    drugs: `${API_BASE_URL}/api/master-obat`,
    treatments: `${API_BASE_URL}/api/master-tindakan`,
    drugPrices: `${API_BASE_URL}/api/master-harga-obat`,
    treatmentPrices: `${API_BASE_URL}/api/master-harga-tindakan`,
  },
  dashboard: {
    all: `${API_BASE_URL}/api/dashboard/all`,
    summary: `${API_BASE_URL}/api/dashboard/summary`,
    todaySchedule: `${API_BASE_URL}/api/dashboard/today-schedule`,
    popularTreatments: `${API_BASE_URL}/api/dashboard/popular-treatments`,
    charts: `${API_BASE_URL}/api/dashboard/charts`,
  },
  klinik: `${API_BASE_URL}/api/klinik`,
  dokter: `${API_BASE_URL}/api/dokter`,
  dokterKlinik: `${API_BASE_URL}/api/dokter-klinik`,
  pasien: `${API_BASE_URL}/api/pasien`,
  tindakan: {
    rekamMedis: `${API_BASE_URL}/api/tindakan-rekam-medis`,
    resep: `${API_BASE_URL}/api/tindakan-resep`,
    odontogram: `${API_BASE_URL}/api/tindakan-odontogram`,
  },
  
  // Alias untuk konsistensi dengan tindakan-medis.ts
  medicalRecords: `${API_BASE_URL}/api/tindakan-rekam-medis`,
  patients: `${API_BASE_URL}/api/pasien`,
};