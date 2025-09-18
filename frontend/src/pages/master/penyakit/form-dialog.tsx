// src/pages/master/penyakit/components/form-dialog.tsx
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
import { PenyakitFormData } from "@/services/penyakit"

const formSchema = z.object({
  nama_penyakit: z.string()
    .min(3, "Nama penyakit minimal 3 karakter")
    .max(100, "Nama penyakit maksimal 100 karakter"),
})

type FormValues = z.infer<typeof formSchema>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_master_kode_penyakit: number
    nama_penyakit: string
  } | null
  onSubmit: (values: PenyakitFormData) => Promise<void>
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
      nama_penyakit: "",
    },
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        nama_penyakit: initialData.nama_penyakit
      })
    } else {
      form.reset({
        nama_penyakit: ""
      })
    }
  }, [form, initialData])

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values)
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
            {initialData ? "Edit Kode Penyakit" : "Tambah Kode Penyakit"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data kode penyakit yang sudah ada" 
              : "Tambah data kode penyakit baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_penyakit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penyakit</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan nama penyakit" 
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