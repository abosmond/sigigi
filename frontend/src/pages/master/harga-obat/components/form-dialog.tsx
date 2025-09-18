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
import { HargaObatFormData } from "@/services/hargaObat"

const formSchema = z.object({
  id_obat: z.string().min(1, "Obat harus dipilih"),
  id_klinik: z.string().min(1, "Klinik harus dipilih"),
  harga: z.string().min(1, "Harga harus diisi")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      { message: "Harga harus berupa angka positif" }
    ),
  keterangan: z.string().optional().nullable(),
})

interface FormValues extends Omit<z.infer<typeof formSchema>, 'id_obat' | 'id_klinik' | 'harga'> {
  id_obat: string
  id_klinik: string
  harga: string
}

interface Option {
  value: string
  label: string
}

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_klinik: number
    id_obat: number
    harga: number
    keterangan: string | null
    obat?: {
      id_obat: number
      nama_obat: string
    }
    klinik?: {
      id_klinik: number
      nama_klinik: string
    }
  } | null
  onSubmit: (values: HargaObatFormData) => Promise<void>
  loading?: boolean
  obatOptions: Option[]
  klinikOptions: Option[]
}

export function FormDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit,
  loading = false,
  obatOptions,
  klinikOptions
}: FormDialogProps) {    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_obat: "",
      id_klinik: "",
      harga: "",
      keterangan: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        id_obat: String(initialData.id_obat),
        id_klinik: String(initialData.id_klinik),
        harga: String(initialData.harga),
        keterangan: initialData.keterangan || "",
      })
    } else {
      form.reset({
        id_obat: "",
        id_klinik: "",
        harga: "",
        keterangan: "",
      })
    }
  }, [form, initialData])

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit({
        id_obat: parseInt(values.id_obat),
        id_klinik: parseInt(values.id_klinik),
        harga: parseInt(values.harga),
        keterangan: values.keterangan || null,
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
            {initialData ? "Edit Harga Obat" : "Tambah Harga Obat Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data harga obat yang sudah ada" 
              : "Tambah data harga obat baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Obat selection with search */}
            <FormField
              control={form.control}
              name="id_obat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obat</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih obat" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <div className="px-2 py-1.5">
                          <Input
                            placeholder="Cari obat..."
                            className="h-8"
                            onChange={(e) => {
                              // Filter sederhana untuk pencarian di dalam dropdown
                              const inputElement = e.target as HTMLInputElement;
                              const searchStr = inputElement.value.toLowerCase();
                              
                              // Highlight hasil pencarian dengan memfilter options di UI
                              const options = document.querySelectorAll('[role="option"]');
                              options.forEach(option => {
                                const text = option.textContent?.toLowerCase() || '';
                                if (text.includes(searchStr)) {
                                  option.classList.remove('hidden');
                                } else {
                                  option.classList.add('hidden');
                                }
                              });
                            }}
                          />
                        </div>
                        {obatOptions.length === 0 ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            Tidak ada data obat
                          </div>
                        ) : (
                          obatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Masukkan harga obat" 
                      {...field} 
                      type="number"
                      min="0"
                      disabled={loading} 
                    />
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
                    <Textarea 
                      placeholder="Masukkan keterangan (opsional)" 
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