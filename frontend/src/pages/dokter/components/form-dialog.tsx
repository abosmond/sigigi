// src/pages/dokter/components/form-dialog.tsx
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
import { DokterFormData } from "@/services/dokter"

const formSchema = z.object({
  nama_dokter: z.string()
    .min(3, "Nama dokter minimal 3 karakter")
    .max(100, "Nama dokter maksimal 100 karakter"),
  no_str: z.string().optional().default(""),
  spesialis: z.string().optional().default(""),
  telepon: z.string().optional().default(""),
  email: z.string().email("Format email tidak valid").optional().default(""),
})

type FormValues = z.infer<typeof formSchema>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_dokter: number
    nama_dokter: string
    no_str: string
    spesialis: string
    telepon: string
    email: string
  } | null
  onSubmit: (values: DokterFormData) => Promise<void>
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
      nama_dokter: "",
      no_str: "",
      spesialis: "",
      telepon: "",
      email: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else {
      form.reset({
        nama_dokter: "",
        no_str: "",
        spesialis: "",
        telepon: "",
        email: "",
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
            {initialData ? "Edit Dokter" : "Tambah Dokter Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data dokter yang sudah ada" 
              : "Tambah data dokter baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_dokter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Dokter</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama dokter" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="no_str"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. STR</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan No STR" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spesialis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spesialis</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan spesialis" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telepon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat email" {...field} disabled={loading} />
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