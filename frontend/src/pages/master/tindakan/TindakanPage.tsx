// src/pages/master/tindakan/TindakanPage.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { FormDialog } from "./form-dialog"
import { DeleteAlert } from "./delete-alert"
import { useDebounce } from "@/hooks/use-debounce"
import { tindakanService, type Tindakan } from "@/services/tindakan"

const TindakanPage = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<Tindakan[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] =useState(false)
  const [selectedData, setSelectedData] = useState<Tindakan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await tindakanService.getList(currentPage, debouncedSearch)
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
  const handleSubmit = async (values: Omit<Tindakan, 'id_master_tindakan'>) => {
    try {
      setIsSubmitting(true)
      if (selectedData) {
        await tindakanService.update(selectedData.id_master_tindakan, values)
        toast({ title: "Berhasil", description: "Data tindakan berhasil diperbarui" })
      } else {
        await tindakanService.create(values)
        toast({ title: "Berhasil", description: "Data tindakan berhasil ditambahkan" })
      }
      const response = await tindakanService.getList(currentPage, debouncedSearch)
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
  const handleEdit = (data: Tindakan) => {
    setSelectedData(data)
    
    setOpenForm(true)
  }

  // Handle delete
  const handleDelete = (data: Tindakan) => {
    setSelectedData(data)
    setOpenDeleteAlert(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedData) return

    try {
      setIsDeleting(true)
      await tindakanService.delete(selectedData.id_master_tindakan)
      toast({ title: "Berhasil", description: "Data tindakan berhasil dihapus" })
      const response = await tindakanService.getList(currentPage, debouncedSearch)
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
        <h2 className="text-3xl font-bold tracking-tight">Master Tindakan</h2>
        <Button 
          onClick={() => {
            setSelectedData(null)
            setOpenForm(true)
          }}
          disabled={isLoading}
        >
          Tambah Tindakan
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Cari kode tindakan..."
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

export default TindakanPage