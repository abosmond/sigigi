import { useState, useEffect } from 'react'
import { api, getDefaultHeaders } from '@/lib/api'

interface Option {
  value: string
  label: string
}

interface UseOptionsResult {
  options: Option[]
  isLoading: boolean
  error: Error | null
}

// Hook untuk mengambil data dokter untuk dropdown
export const useDokterOptions = (): UseOptionsResult => {
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${api.dokter}/list`, {
          credentials: 'include',
          headers: getDefaultHeaders(false)
        })
        if (!response.ok) throw new Error('Failed to fetch dokter options')
        
        const data = await response.json()
        const formattedOptions = data.data.map((dokter: any) => ({
          value: String(dokter.id_dokter),
          label: dokter.nama_dokter
        }))
        
        setOptions(formattedOptions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [])

  return { options, isLoading, error }
}

// Hook untuk mengambil data klinik untuk dropdown
export const useKlinikOptions = (): UseOptionsResult => {
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${api.klinik}/list`, {
          credentials: 'include',
          headers: getDefaultHeaders()
        })
        if (!response.ok) throw new Error('Failed to fetch klinik options')
        
        const data = await response.json()
        const formattedOptions = data.data.map((klinik: any) => ({
          value: String(klinik.id_klinik),
          label: klinik.nama_klinik
        }))
        
        setOptions(formattedOptions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [])

  return { options, isLoading, error }
}

// Hook untuk mengambil data obat untuk dropdown
export const useObatOptions = (): UseOptionsResult => {
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${api.master.obat}/list`, {
          credentials: 'include',
          headers: getDefaultHeaders()
        })
        if (!response.ok) throw new Error('Failed to fetch obat options')
        
        const data = await response.json()
        const formattedOptions = data.data.map((obat: any) => ({
          value: String(obat.id_obat),
          label: `${obat.nama_obat} (${obat.satuan})`
        }))
        
        setOptions(formattedOptions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [])

  return { options, isLoading, error }
}

// Hook untuk mengambil data tindakan untuk dropdown
export const useTindakanOptions = (): UseOptionsResult => {
  const [options, setOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${api.master.tindakan}/list`, {
          credentials: 'include',
          headers: getDefaultHeaders()
        })
        if (!response.ok) throw new Error('Failed to fetch tindakan options')
        
        const data = await response.json()
        const formattedOptions = data.data.map((tindakan: any) => ({
          value: String(tindakan.id_master_tindakan),
          label: tindakan.nama_tindakan
        }))
        
        setOptions(formattedOptions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [])

  return { options, isLoading, error }
}