// src/pages/klinik/components/form-dialog.tsx
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
import { KlinikFormData } from "@/services/klinik"

const formSchema = z.object({
  nama_klinik: z.string()
    .min(3, "Nama klinik minimal 3 karakter")
    .max(100, "Nama klinik maksimal 100 karakter"),
  alamat_klinik: z.string().optional().default(""),
  telepon: z.string().optional().default(""),
  email: z.string().email("Format email tidak valid").optional().default(""),
  no_izin_klinik: z.string().optional().default(""),
  jam_operasional: z.string().optional().default(""),
})

type FormValues = z.infer<typeof formSchema>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_klinik: number
    nama_klinik: string
    alamat_klinik: string
    telepon: string
    email: string
    no_izin_klinik: string
    jam_operasional: string
  } | null
  onSubmit: (values: KlinikFormData) => Promise<void>
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
      nama_klinik: "",
      alamat_klinik: "",
      telepon: "",
      email: "",
      no_izin_klinik: "",
      jam_operasional: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else {
      form.reset({
        nama_klinik: "",
        alamat_klinik: "",
        telepon: "",
        email: "",
        no_izin_klinik: "",
        jam_operasional: "",
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Klinik" : "Tambah Klinik Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data klinik yang sudah ada" 
              : "Tambah data klinik baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_klinik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Klinik</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama klinik" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alamat_klinik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat klinik" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input placeholder="Masukkan email" type="email" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="no_izin_klinik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Izin Klinik</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor izin" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jam_operasional"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Operasional</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Senin-Jumat 08:00-17:00" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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