// src/pages/pasien/PasienPage.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { FormDialog } from "./components/form-dialog"
import { DeleteAlert } from "./components/delete-alert"
import { useDebounce } from "@/hooks/use-debounce"
import { pasienService, type Pasien } from "@/services/pasien"
import { klinikService } from "@/services/klinik" // Assuming you have this service

const PasienPage = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<Pasien[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [selectedData, setSelectedData] = useState<Pasien | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [klinikList, setKlinikList] = useState<{ id_klinik: number; nama_klinik: string }[]>([])

  const debouncedSearch = useDebounce(searchQuery, 500)
  const { toast } = useToast()

  // Fetch klinik data
  useEffect(() => {
    const fetchKlinikData = async () => {
      try {
        const response = await klinikService.getList(1, "")
        setKlinikList(response.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal mengambil data klinik. Silakan coba lagi.",
        })
      }
    }

    fetchKlinikData()
  }, [toast])

  // Fetch pasien data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await pasienService.getList(currentPage, debouncedSearch)
        setData(response.data)
        setTotalPages(response.total_pages)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal mengambil data. Silakan coba lagi.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentPage, debouncedSearch, toast])

  // Handle submit (create/update)
  const handleSubmit = async (values: Omit<Pasien, 'id_pasien'>) => {
    try {
      setIsSubmitting(true)
      if (selectedData) {
        await pasienService.update(selectedData.id_pasien, values)
        toast({ title: "Berhasil", description: "Data pasien berhasil diperbarui" })
      } else {
        await pasienService.create(values)
        toast({ title: "Berhasil", description: "Data pasien berhasil ditambahkan" })
      }
      const response = await pasienService.getList(currentPage, debouncedSearch)
      setData(response.data)
      setTotalPages(response.total_pages)
      setOpenForm(false)
      setSelectedData(null)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menyimpan data. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (data: Pasien) => {
    setSelectedData(data)
    setOpenForm(true)
  }

  // Handle delete
  const handleDelete = (data: Pasien) => {
    setSelectedData(data)
    setOpenDeleteAlert(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedData) return

    try {
      setIsDeleting(true)
      await pasienService.delete(selectedData.id_pasien)
      toast({ title: "Berhasil", description: "Data pasien berhasil dihapus" })
      const response = await pasienService.getList(currentPage, debouncedSearch)
      setData(response.data)
      setTotalPages(response.total_pages)
      setOpenDeleteAlert(false)
      setSelectedData(null)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menghapus data. Silakan coba lagi." })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Data Pasien</h2>
        <Button 
          onClick={() => {
            setSelectedData(null)
            setOpenForm(true)
          }}
          disabled={isLoading}
        >
          Tambah Pasien
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama atau nomor rekam medis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
      </div>

      <DataTable 
        columns={columns} 
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />

      <FormDialog 
        open={openForm}
        onOpenChange={setOpenForm}
        initialData={selectedData}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        klinikList={klinikList}
      />

      <DeleteAlert 
        open={openDeleteAlert}
        onOpenChange={setOpenDeleteAlert}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        itemToDelete={selectedData}
      />
    </div>
  )
}

export default PasienPage