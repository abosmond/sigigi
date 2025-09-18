import { api, getDefaultHeaders } from '@/lib/api'

export interface HargaTindakan {
  id_klinik: number
  id_master_tindakan: number
  harga: number
  keterangan: string | null
  tindakan?: {
    id_master_tindakan: number
    nama_tindakan: string
  }
  klinik?: {
    id_klinik: number
    nama_klinik: string
  }
}

export interface HargaTindakanFormData {
  id_klinik: number
  id_master_tindakan: number
  harga: number
  keterangan: string | null
}

interface PaginatedResponse {
  data: HargaTindakan[]
  total: number
  current_page: number
  total_pages: number
}

export const hargaTindakanService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.master.hargaTindakan}?page=${page}&search=${search}`,
      { 
        credentials: 'include',
        headers: getDefaultHeaders(false),
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: HargaTindakanFormData): Promise<HargaTindakan> => {
    const response = await fetch(`${api.master.hargaTindakan}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (
    id_klinik: number, 
    id_master_tindakan: number, 
    data: Partial<HargaTindakanFormData>
  ): Promise<HargaTindakan> => {
    const response = await fetch(`${api.master.hargaTindakan}/${id_klinik}/${id_master_tindakan}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update data')
    return response.json()
  },

  // Delete
  delete: async (id_klinik: number, id_master_tindakan: number): Promise<void> => {
    const response = await fetch(`${api.master.hargaTindakan}/${id_klinik}/${id_master_tindakan}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },

  // Get harga by tindakan
  getHargaByTindakan: async (tindakanId: number): Promise<HargaTindakan[]> => {
    const response = await fetch(
      `${api.master.hargaTindakan}/tindakan/${tindakanId}`,
      { 
        credentials: 'include',
        headers: getDefaultHeaders()
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Get harga by klinik
  getHargaByKlinik: async (klinikId: number): Promise<HargaTindakan[]> => {
    const response = await fetch(
      `${api.master.hargaTindakan}/klinik/${klinikId}`,
      { 
        credentials: 'include', 
        headers: getDefaultHeaders()
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  }
}