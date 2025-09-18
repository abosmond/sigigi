// src/services/penyakit.ts
import { api, getDefaultHeaders } from '@/lib/api'
export interface Penyakit {
  id_master_kode_penyakit: number
  nama_penyakit: string
}

export type PenyakitFormData = Omit<Penyakit, 'id_master_kode_penyakit'>

interface PaginatedResponse {
  data: Penyakit[]
  total: number
  current_page: number
  total_pages: number
}

export const penyakitService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.master.penyakit}?page=${page}&search=${search}`,
      { 
        credentials: 'include',
        headers: getDefaultHeaders()
      }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Penyakit, 'id_master_kode_penyakit'>): Promise<Penyakit> => {
    const response = await fetch(`${api.master.penyakit}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Penyakit>): Promise<Penyakit> => {
    const response = await fetch(`${api.master.penyakit}/${id}`, {
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
    const response = await fetch(`${api.master.penyakit}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },
}