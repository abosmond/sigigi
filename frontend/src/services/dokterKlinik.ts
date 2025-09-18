import { api, getDefaultHeaders } from '@/lib/api'

export interface DokterKlinik {
  id_dokter_klinik: number
  id_dokter: number
  id_klinik: number
  no_sip: string
  jadwal_praktek: string | null
  dokter?: {
    id_dokter: number
    nama_dokter: string
    no_str: string
    spesialis: string
  }
  klinik?: {
    id_klinik: number
    nama_klinik: string
  }
}

export interface DokterKlinikFormData {
    id_dokter: number
    id_klinik: number
    no_sip: string
    jadwal_praktek: string | null // Ubah menjadi string | null
  }

//export type DokterKlinikFormData = Omit<DokterKlinik, 'id_dokter_klinik' | 'dokter' | 'klinik'>

interface PaginatedResponse {
  data: DokterKlinik[]
  total: number
  current_page: number
  total_pages: number
}

export const dokterKlinikService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.dokterKlinik}?page=${page}&search=${search}`,
      { credentials: 'include', 
        headers: getDefaultHeaders(false),  
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: DokterKlinikFormData): Promise<DokterKlinik> => {
    const response = await fetch(`${api.dokterKlinik}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<DokterKlinikFormData>): Promise<DokterKlinik> => {
    const response = await fetch(`${api.dokterKlinik}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update data')
    return response.json()
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${api.dokterKlinik}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },

  // Get dokters by klinik
  getDoktersByKlinik: async (klinikId: number): Promise<DokterKlinik[]> => {
    const response = await fetch(
      `${api.dokterKlinik}/klinik/${klinikId}/dokters`,
      { credentials: 'include' }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Get kliniks by dokter
  getKliniksByDokter: async (dokterId: number): Promise<DokterKlinik[]> => {
    const response = await fetch(
      `${api.dokterKlinik}/dokter/${dokterId}/kliniks`,
      { credentials: 'include' }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  }
}