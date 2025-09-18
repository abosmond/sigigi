// src/services/pasien.ts
import { api, getDefaultHeaders } from '@/lib/api'

export interface Pasien {
  id_pasien: number
  id_klinik: number
  no_rekam_medis: string
  nama_lengkap: string
  nik: string
  tempat_lahir: string
  tanggal_lahir: string
  jenis_kelamin: 'L' | 'P' | null
  alamat: string
  telepon: string
  email: string
  golongan_darah: 'A' | 'B' | 'AB' | 'O' | null
  kontak_darurat_nama: string
  kontak_darurat_telepon: string
  kontak_darurat_relasi: string
}

export type PasienFormData = Omit<Pasien, 'id_pasien'>

interface PaginatedResponse {
  data: Pasien[]
  total: number
  current_page: number
  total_pages: number
}

export const pasienService = {
  // Get paginated list
  getList: async (page: number, search: string = ''): Promise<PaginatedResponse> => {
    const response = await fetch(
      `${api.pasien}?page=${page}&search=${search}`,
      { credentials: 'include', headers: getDefaultHeaders(false) }
    )
    if (!response.ok) throw new Error('Failed to fetch data')
    return response.json()
  },

  // Create new
  create: async (data: Omit<Pasien, 'id_pasien'>): Promise<Pasien> => {
    const response = await fetch(`${api.pasien}`, {
      method: 'POST',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create data')
    return response.json()
  },

  // Update existing
  update: async (id: number, data: Partial<Pasien>): Promise<Pasien> => {
    const response = await fetch(`${api.pasien}/${id}`, {
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
    const response = await fetch(`${api.pasien}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getDefaultHeaders(),
      body: JSON.stringify({ id }),
    })
    if (!response.ok) throw new Error('Failed to delete data')
  },
  
  // Generate rekam medis number
  generateRekamMedis: async (id_klinik: number): Promise<string> => {
    const response = await fetch(
      `${api.pasien}/generate-rekam-medis?id_klinik=${id_klinik}`,
      { credentials: 'include', headers: getDefaultHeaders() }
    )
    if (!response.ok) throw new Error('Failed to generate rekam medis number')
    const result = await response.json()
    return result.no_rekam_medis
  }
}