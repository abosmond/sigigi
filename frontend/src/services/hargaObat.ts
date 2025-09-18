import { api, getDefaultHeaders } from '@/lib/api'

export interface HargaObat {
  id_klinik: number
  id_obat: number
  harga: number
  keterangan: string | null
  obat?: {
    id_obat: number
    nama_obat: string
    satuan: string
    dosis: string | null
  }
  klinik?: {
    id_klinik: number
    nama_klinik: string
  }
}

export interface HargaObatFormData {
  id_klinik: number
  id_obat: number
  harga: number
  keterangan: string | null
}

interface PaginatedResponse {
  data: HargaObat[]
  total: number
  current_page: number
  total_pages: number
}

export const hargaObatService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.master.hargaObat}?page=${page}&search=${search}`,
      { credentials: 'include', headers: getDefaultHeaders(false) }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: HargaObatFormData): Promise<HargaObat> => {
    const response = await fetch(`${api.master.hargaObat}`, {
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
    id_obat: number, 
    data: Partial<HargaObatFormData>
  ): Promise<HargaObat> => {
    const response = await fetch(`${api.master.hargaObat}/${id_klinik}/${id_obat}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update data')
    return response.json()
  },

  // Delete
  delete: async (id_klinik: number, id_obat: number): Promise<void> => {
    const response = await fetch(`${api.master.hargaObat}/${id_klinik}/${id_obat}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },

  // Get harga by obat
  getHargaByObat: async (obatId: number): Promise<HargaObat[]> => {
    const response = await fetch(
      `${api.master.hargaObat}/obat/${obatId}`,
      { 
        credentials: 'include',
        headers: getDefaultHeaders(false)
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Get harga by klinik
  getHargaByKlinik: async (klinikId: number): Promise<HargaObat[]> => {
    const response = await fetch(
      `${api.master.hargaObat}/klinik/${klinikId}`,
      {         
        credentials: 'include',
        headers: getDefaultHeaders(false)
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  }
}