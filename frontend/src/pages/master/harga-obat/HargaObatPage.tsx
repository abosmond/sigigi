import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { FormDialog } from "./components/form-dialog"
import { DeleteAlert } from "./components/delete-alert"
import { useDebounce } from "@/hooks/use-debounce"
import { useObatOptions, useKlinikOptions } from "@/hooks/use-options"
import { hargaObatService, type HargaObat } from "@/services/hargaObat"

const HargaObatPage = () => {
  // Hooks
  const { 
    options: obatOptions, 
    isLoading: isObatLoading
  } = useObatOptions();
    
  const { 
    options: klinikOptions, 
    isLoading: isKlinikLoading
  } = useKlinikOptions();
  
  // States
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [data, setData] = useState<HargaObat[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [selectedData, setSelectedData] = useState<HargaObat | null>(null)
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
        const response = await hargaObatService.getList(currentPage, debouncedSearch)
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
  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true)
      if (selectedData) {
        await hargaObatService.update(selectedData.id_klinik, selectedData.id_obat, values)
        toast({ title: "Berhasil", description: "Data harga obat berhasil diperbarui" })
      } else {
        await hargaObatService.create(values)
        toast({ title: "Berhasil", description: "Data harga obat berhasil ditambahkan" })
      }
      const response = await hargaObatService.getList(currentPage, debouncedSearch)
      setData(response.data)
      setTotalPages(response.total_pages)
      setOpenForm(false)
      setSelectedData(null)
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Gagal menyimpan data. Silakan coba lagi." 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (data: HargaObat) => {
    setSelectedData(data)
    setOpenForm(true)
  }

  // Handle delete
  const handleDelete = (data: HargaObat) => {
    setSelectedData(data)
    setOpenDeleteAlert(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedData) return

    try {
      setIsDeleting(true)
      await hargaObatService.delete(selectedData.id_klinik, selectedData.id_obat)
      toast({ title: "Berhasil", description: "Data harga obat berhasil dihapus" })
      const response = await hargaObatService.getList(currentPage, debouncedSearch)
      setData(response.data)
      setTotalPages(response.total_pages)
      setOpenDeleteAlert(false)
      setSelectedData(null)
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Gagal menghapus data. Silakan coba lagi." 
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Data Harga Obat</h2>
        <Button 
          onClick={() => {
            setSelectedData(null)
            setOpenForm(true)
          }}
          disabled={isLoading}
        >
          Tambah Harga Obat
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama obat atau klinik..."
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
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
      />

      <FormDialog 
        open={openForm}
        onOpenChange={setOpenForm}
        initialData={selectedData}
        onSubmit={handleSubmit}
        loading={isSubmitting || isObatLoading || isKlinikLoading}
        obatOptions={obatOptions}
        klinikOptions={klinikOptions}
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

export default HargaObatPage