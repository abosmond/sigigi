// src/services/dokter.ts
import { api, getDefaultHeaders } from '@/lib/api'

export interface Dokter {
  id_dokter: number
  nama_dokter: string
  no_str: string
  spesialis: string
  telepon: string
  email: string
}

export type DokterFormData = Omit<Dokter, 'id_dokter'>

interface PaginatedResponse {
  data: Dokter[]
  total: number
  current_page: number
  total_pages: number
}

export const dokterService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.dokter}?page=${page}&search=${search}`,
      { credentials: 'include',
        headers: getDefaultHeaders(false),
       }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Dokter, 'id_dokter'>): Promise<Dokter> => {
    const response = await fetch(`${api.dokter}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Dokter>): Promise<Dokter> => {
    const response = await fetch(`${api.dokter}/${id}`, {
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
    const response = await fetch(`${api.dokter}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },
}