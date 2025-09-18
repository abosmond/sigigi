import { api, getDefaultHeaders } from '@/lib/api'

export interface Klinik {
  id_klinik: number
  nama_klinik: string
  alamat_klinik: string
  telepon: string
  email: string
  no_izin_klinik: string
  jam_operasional: string
}

export type KlinikFormData = Omit<Klinik, 'id_klinik'>

interface PaginatedResponse {
  data: Klinik[]
  total: number
  current_page: number
  total_pages: number
}

export const klinikService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.klinik}?page=${page}&search=${search}`,
      { 
        credentials: 'include',
        headers: getDefaultHeaders(false),        
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Klinik, 'id_klinik'>): Promise<Klinik> => {
    const response = await fetch(`${api.klinik}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Klinik>): Promise<Klinik> => {
    const response = await fetch(`${api.klinik}/${id}`, {
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
    try {
      const response = await fetch(`${api.klinik}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ id }),
      })
      if (!response.ok) throw new Error('Failed to delete data')
    } catch (error) {
      console.error('Error during delete:', error);
      throw error;
    }    
  },
}