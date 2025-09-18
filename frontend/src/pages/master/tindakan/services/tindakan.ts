// src/services/tindakan.ts
import { api } from '@/lib/api'

export interface Tindakan {
  id_master_tindakan: number
  nama_tindakan: string
}

export type TindakanFormData = Omit<Tindakan, 'id_master_tindakan'>

interface PaginatedResponse {
  data: Tindakan[]
  total: number
  current_page: number
  total_pages: number
}

export const tindakanService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.master.tindakan}?page=${page}&search=${search}`,
      { credentials: 'include' }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Tindakan, 'id_master_tindakan'>): Promise<Tindakan> => {
    const response = await fetch(`${api.master.tindakan}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Tindakan>): Promise<Tindakan> => {
    const response = await fetch(`${api.master.tindakan}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update data')
    return response.json()
  },

  // Delete
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${api.master.tindakan}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },
}