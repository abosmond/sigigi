// src/pages/master/obat/components/form-dialog.tsx
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ObatFormData } from "@/services/obat"

const formSchema = z.object({
  nama_obat: z.string()
    .min(3, "Nama obat minimal 3 karakter")
    .max(100, "Nama obat maksimal 100 karakter"),
  satuan: z.string().nonempty("Satuan harus dipilih"),
  dosis: z.string().optional().default(""),
  keterangan: z.string().optional().default(""),
})

type FormValues = z.infer<typeof formSchema>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_obat: number
    nama_obat: string
    satuan: string
    dosis: string
    keterangan: string
  } | null
  onSubmit: (values: ObatFormData) => Promise<void>
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
      nama_obat: "",
      satuan: "",
      dosis: "",
      keterangan: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else {
      form.reset({
        nama_obat: "",
        satuan: "",
        dosis: "",
        keterangan: "",
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
            {initialData ? "Edit Obat" : "Tambah Obat Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data obat yang sudah ada" 
              : "Tambah data obat baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_obat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Obat</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama obat" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="satuan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                        <SelectItem value="Botol">Botol</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosis</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan dosis (misal: 500mg)" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan keterangan" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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