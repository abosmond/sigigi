// src/services/obat.ts
import { api, getDefaultHeaders } from '@/lib/api'

export interface Obat {
  id_obat: number
  nama_obat: string
  satuan: string
  dosis: string
  keterangan: string
}

export type ObatFormData = Omit<Obat, 'id_obat'>

interface PaginatedResponse {
  data: Obat[]
  total: number
  current_page: number
  total_pages: number
}

export const obatService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.master.obat}?page=${page}&search=${search}`,
      { credentials: 'include', headers: getDefaultHeaders(false) }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Obat, 'id_obat'>): Promise<Obat> => {
    const response = await fetch(`${api.master.obat}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Obat>): Promise<Obat> => {
    const response = await fetch(`${api.master.obat}/${id}`, {
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
    const response = await fetch(`${api.master.obat}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },
}