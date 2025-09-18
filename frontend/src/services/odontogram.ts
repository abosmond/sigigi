// services/odontogram.ts
import { api, getDefaultHeaders } from '@/lib/api';

// Interface untuk data odontogram
export interface OdontogramData {
  id_pasien: number;
  tanggal_periksa?: string;
  nomor_gigi: string;
  posisi_gigi: string;
  kondisi_gigi: string;
  warna_odontogram: string;
  keterangan?: string;
}

// Interface untuk batch update
export interface OdontogramBatchData {
  id_pasien: number;
  tanggal_periksa?: string;
  entries: OdontogramData[];
}

export const odontogramService = {
  // Mendapatkan data odontogram pasien
  getOdontogramPasien: async (pasienId: number) => {
    try {
      const response = await fetch(`${api.tindakan.odontogram}/${pasienId}`, {
        credentials: 'include',
        headers: getDefaultHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch odontogram data');
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching odontogram data:', error);
      return [];
    }
  },
  
  // Mendapatkan data odontogram pasien berdasarkan tanggal
  getOdontogramByDate: async (pasienId: number, date: string) => {
    try {
      const response = await fetch(`${api.tindakan.odontogram}/${pasienId}/date/${date}`, {
        credentials: 'include',
        headers: getDefaultHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch odontogram data');
      
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching odontogram data by date:', error);
      return [];
    }
  },
  
  // Memperbarui odontogram
  updateOdontogram: async (data: OdontogramData) => {
    try {
      const response = await fetch(`${api.tindakan.odontogram}`, {
        method: 'POST',
        credentials: 'include',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update odontogram');
      
      return await response.json();
    } catch (error) {
      console.error('Error updating odontogram:', error);
      throw error;
    }
  },
  
  // Memperbarui batch odontogram
  updateOdontogramBatch: async (data: OdontogramBatchData) => {
    try {
      const response = await fetch(`${api.tindakan.odontogram}/batch`, {
        method: 'POST',
        credentials: 'include',
        headers: getDefaultHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update odontogram batch');
      
      return await response.json();
    } catch (error) {
      console.error('Error updating odontogram batch:', error);
      throw error;
    }
  }
};

export default odontogramService;