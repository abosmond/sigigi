// src/pages/master/tindakan/form-dialog.tsx
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TindakanFormData } from "@/services/tindakan"

const formSchema = z.object({
  nama_tindakan: z.string()
    .min(3, "Nama tindakan minimal 3 karakter")
    .max(100, "Nama tindakan maksimal 100 karakter"),
  harga: z.string()
    .min(1, "Harga harus diisi")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      { message: "Harga harus berupa angka positif" }
    )
})

interface FormValues extends Omit<z.infer<typeof formSchema>, 'harga'> {
  harga: string // Input type number akan berupa string
}

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_master_tindakan: number
    nama_tindakan: string
    harga: number
  } | null
  onSubmit: (values: TindakanFormData) => Promise<void>
  loading?: boolean
}

export function FormDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit,
  loading = false 
}: FormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_tindakan: "",
      harga: "0"
    },
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        nama_tindakan: initialData.nama_tindakan,
        harga: initialData.harga !== undefined ? initialData.harga.toString() : "0"
      })
    } else {
      form.reset({
        nama_tindakan: "",
        harga: "0"
      })
    }
  }, [form, initialData])

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit({
        nama_tindakan: values.nama_tindakan,
        harga: parseInt(values.harga)
      })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Kode Tindakan" : "Tambah data master Tindakan"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data kode tindakan yang sudah ada" 
              : "Tambah data tindakan baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_tindakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tindakan</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan nama tindakan" 
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tambahkan field harga */}
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan harga tindakan" 
                      type="number"
                      min="0"
                      {...field} 
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}