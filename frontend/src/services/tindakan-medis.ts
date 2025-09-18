// services/tindakan-medis.ts
import { api, getDefaultHeaders } from '@/lib/api'

// ================ INTERFACES & TYPES ================

// Definisi data tindakan medis
export interface TreatmentData {
  diseaseId: number;
  diseaseName: string;
  treatmentId: number;
  treatmentName: string;
  location: string; // Lokasi gigi, bisa berisi "23D, 23M" atau kosong untuk tindakan umum
  quantity: number; // Kuantitas tindakan
  unitCost: number; // Biaya per satuan
  totalCost: number; // Total biaya (unitCost * quantity)
  notes?: string;
}

// Definisi data resep obat
export interface PrescriptionData {
  drugId: number;
  drugName: string;
  quantity: number;
  unit: string;
  dosage: string;
  cost: number;
  notes?: string;
}

// Interface untuk data rekam medis
export interface MedicalRecord {
  id_rekam_medis: number;
  id_pasien: number;
  id_dokter_klinik: number;
  tanggal_kunjungan: string;
  keluhan: string;
  catatan_dokter: string;
  biaya: number;
  diskon: number;
  status_pembayaran: 'Belum Bayar' | 'Sudah Bayar';
  created_at: string;
  updated_at: string;
  
  // Data relasi
  pasien?: {
    nama_lengkap: string;
    no_rekam_medis: string;
  };
  dokter?: {
    nama_dokter: string;
  };
  treatments?: TreatmentData[];
  prescriptions?: PrescriptionData[];
}

// Interface untuk data odontogram
export interface OdontogramData {
  id_pasien: number;
  tanggal_periksa: string;
  nomor_gigi: string;
  posisi_gigi: string;
  kondisi_gigi: string;
  warna_odontogram: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk Master Kode Penyakit
export interface KodePenyakit {
  id_master_kode_penyakit: number;
  nama_penyakit: string;
}

// Interface untuk Master Tindakan
export interface Tindakan {
  id_master_tindakan: number;
  nama_tindakan: string;
  harga: number; // Tambahkan properti harga
}

// Interface untuk Master Harga Tindakan
export interface HargaTindakan {
  id_klinik: number;
  id_master_tindakan: number;
  harga: number;
  keterangan?: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk Master Obat (menggunakan interface yang sudah ada)
export interface Obat {
  id_obat: number;
  nama_obat: string;
  satuan: string;
  dosis: string;
  keterangan: string;
}

// Interface untuk Master Harga Obat
export interface HargaObat {
  id_klinik: number;
  id_obat: number;
  harga: number;
  keterangan?: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  total_pages: number;
}

// ================ API SERVICES ================

// SERVICE REKAM MEDIS
export const rekamMedisService = {
  // Get all medical records
  getList: async (page: number = 1, search: string = ''): Promise<PaginatedResponse<MedicalRecord>> => {
    const response = await fetch(
      `${api.tindakan.rekamMedis}?page=${page}&search=${search}`,
      { credentials: 'include', headers: getDefaultHeaders(false) }
    );
    if (!response.ok) throw new Error('Failed to fetch medical records');
    return response.json();
  },

  // Get medical record by ID
  getById: async (id: number): Promise<MedicalRecord> => {
    const response = await fetch(`${api.tindakan.rekamMedis}/${id}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to fetch medical record');
    const result = await response.json();
    return result.data;
  },

  // Get patient medical history
  getRiwayatPasien: async (patientId: number): Promise<MedicalRecord[]> => {
    const response = await fetch(`${api.pasien}/${patientId}/riwayat-medis`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to fetch patient medical history');
    return response.json();
  },

  // Get patient odontogram
  getOdontogramPasien: async (patientId: number): Promise<OdontogramData[]> => {
    const response = await fetch(`${api.tindakan.odontogram}/${patientId}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to fetch patient odontogram');
    return response.json();
  },

  // Create new medical record
  create: async (data: any): Promise<MedicalRecord> => {
    const response = await fetch(`${api.tindakan.rekamMedis}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create medical record');
    return response.json();
  },

  // Update medical record
  update: async (id: number, data: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    const response = await fetch(`${api.tindakan.rekamMedis}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update medical record');
    return response.json();
  },

  // Update payment status
  updateStatusPembayaran: async (id: number, status: 'Belum Bayar' | 'Sudah Bayar'): Promise<MedicalRecord> => {
    const response = await fetch(`${api.tindakan.rekamMedis}/${id}/payment`, {
      method: 'PUT',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ status_pembayaran: status }),
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    return response.json();
  },

  // Print medical record
  printRekamMedis: async (id: number): Promise<Blob> => {
    const response = await fetch(`${api.tindakan.rekamMedis}/${id}/print`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to generate print document');
    return response.blob();
  },

  // Print prescription
  printResep: async (id: number): Promise<Blob> => {
    const response = await fetch(`${api.tindakan.resep}/${id}/print`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to generate prescription document');
    return response.blob();
  },
};

// SERVICE MASTER PENYAKIT
export const penyakitService = {
  getList: async (): Promise<any> => {
    try {
      const response = await fetch(`${api.master.penyakit}/list`, {
        credentials: 'include', headers: getDefaultHeaders(false)
      });
      
      if (!response.ok) throw new Error('Failed to fetch diseases data');
      
      return await response.json(); // Kembalikan respons API apa adanya
    } catch (error) {
      console.error('Error fetching diseases list:', error);
      return { data: [] }; // Return format yang konsisten saat error
    }
  },

  getById: async (id: number): Promise<KodePenyakit> => {
    const response = await fetch(`${api.master.penyakit}/${id}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    
    if (!response.ok) throw new Error('Failed to fetch disease data');
    
    const result = await response.json();
    return result.data;
  }
};

// SERVICE MASTER TINDAKAN
export const tindakanService = {
  getList: async (): Promise<any> => {
    try {
      const response = await fetch(`${api.master.tindakan}/list`, {
        credentials: 'include', headers: getDefaultHeaders(false)
      });
      
      if (!response.ok) throw new Error('Failed to fetch treatments data');
      
      return await response.json(); // Kembalikan respons API apa adanya
    } catch (error) {
      console.error('Error fetching treatments list:', error);
      return { data: [] }; // Return format yang konsisten saat error
    }
  },

  getById: async (id: number): Promise<Tindakan> => {
    const response = await fetch(`${api.master.tindakan}/${id}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    
    if (!response.ok) throw new Error('Failed to fetch treatment data');
    
    const result = await response.json();
    return result.data;
  }
};

// SERVICE MASTER HARGA TINDAKAN
export const hargaTindakanService = {
  getByKlinik: async (clinicId: number): Promise<HargaTindakan[]> => {
    try {
      const response = await fetch(`${api.master.hargaTindakan}?klinik=${clinicId}`, {
        credentials: 'include', headers: getDefaultHeaders(false)
      });
      if (!response.ok) throw new Error('Failed to fetch treatment prices');
      
      const result = await response.json();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      console.error('Error fetching treatment prices:', error);
      return [];
    }
  },

  getByKlinikAndTindakan: async (clinicId: number, treatmentId: number): Promise<HargaTindakan | null> => {
    try {
      const response = await fetch(`${api.master.hargaTindakan}/${clinicId}/${treatmentId}`, {
        credentials: 'include', headers: getDefaultHeaders(false)
      });
      if (!response.ok) throw new Error('Failed to fetch treatment price');
      
      const result = await response.json();
      // Jika API mengembalikan format { success: true, data: {...} }
      if (result.success && result.data) {
        return result.data;
      }
      // Jika API mengembalikan data langsung
      return result;
    } catch (error) {
      console.error('Error fetching treatment price:', error);
      return null;
    }
  }
};

// SERVICE MASTER HARGA OBAT
export const hargaObatService = {
  getByKlinik: async (clinicId: number): Promise<HargaObat[]> => {
    const response = await fetch(`${api.master.hargaObat}?klinik=${clinicId}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to fetch drug prices');
    return response.json();
  },

  getByKlinikAndObat: async (clinicId: number, drugId: number): Promise<HargaObat> => {
    const response = await fetch(`${api.master.hargaObat}/${clinicId}/${drugId}`, {
      credentials: 'include', headers: getDefaultHeaders(false)
    });
    if (!response.ok) throw new Error('Failed to fetch drug price');
    return response.json();
  }
};