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
import { DokterKlinikFormData } from "@/services/dokterKlinik"

const formSchema = z.object({
  id_dokter: z.string().min(1, "Dokter harus dipilih"),
  id_klinik: z.string().min(1, "Klinik harus dipilih"),
  no_sip: z.string().min(1, "No. SIP harus diisi").max(50, "No. SIP maksimal 50 karakter"),
  jadwal_praktek: z.string().optional().nullable(),
})

interface FormValues extends Omit<z.infer<typeof formSchema>, 'id_dokter' | 'id_klinik'> {
  id_dokter: string
  id_klinik: string
}

interface Option {
  value: string
  label: string
}

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_dokter_klinik: number
    id_dokter: number
    id_klinik: number
    no_sip: string
    jadwal_praktek: string | null
    dokter?: {
      id_dokter: number
      nama_dokter: string
    }
    klinik?: {
      id_klinik: number
      nama_klinik: string
    }
  } | null
  onSubmit: (values: DokterKlinikFormData) => Promise<void>
  loading?: boolean
  dokterOptions: Option[]
  klinikOptions: Option[]
}

export function FormDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit,
  loading = false,
  dokterOptions,
  klinikOptions
}: FormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_dokter: "",
      id_klinik: "",
      no_sip: "",
      jadwal_praktek: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        id_dokter: String(initialData.id_dokter),
        id_klinik: String(initialData.id_klinik),
        no_sip: initialData.no_sip,
        jadwal_praktek: initialData.jadwal_praktek || "",
      })
    } else {
      form.reset({
        id_dokter: "",
        id_klinik: "",
        no_sip: "",
        jadwal_praktek: "",
      })
    }
  }, [form, initialData])

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit({
        id_dokter: parseInt(values.id_dokter),
        id_klinik: parseInt(values.id_klinik),
        no_sip: values.no_sip,
        jadwal_praktek: values.jadwal_praktek || null,
      })
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
            {initialData ? "Edit Praktek Dokter" : "Tambah Praktek Dokter Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data praktek dokter yang sudah ada" 
              : "Tambah data praktek dokter baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_dokter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dokter</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dokter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dokterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_klinik"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klinik</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih klinik" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {klinikOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="no_sip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. SIP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor SIP" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jadwal_praktek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jadwal Praktek</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contoh: Senin-Jumat 08:00-17:00" 
                      {...field} 
                      value={field.value || ""}
                      disabled={loading}
                    />
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