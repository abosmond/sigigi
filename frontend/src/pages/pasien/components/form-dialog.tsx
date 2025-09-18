// src/pages/pasien/components/form-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { pasienService, PasienFormData } from "@/services/pasien"

const formSchema = z.object({
  id_klinik: z.number().min(1, "Klinik harus dipilih"),
  no_rekam_medis: z.string().min(1, "No Rekam Medis harus diisi"),
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter").max(100, "Nama lengkap maksimal 100 karakter"),
  nik: z.string().optional().default(""),
  tempat_lahir: z.string().optional().default(""),
  tanggal_lahir: z.string().optional().default(""),
  jenis_kelamin: z.enum(["L", "P"]).nullable().optional(),
  alamat: z.string().optional().default(""),
  telepon: z.string().optional().default(""),
  email: z.string().email("Format email tidak valid").optional().default(""),
  golongan_darah: z.enum(["A", "B", "AB", "O"]).nullable().optional(),
  kontak_darurat_nama: z.string().optional().default(""),
  kontak_darurat_telepon: z.string().optional().default(""),
  kontak_darurat_relasi: z.string().optional().default(""),
})

type FormValues = z.infer<typeof formSchema>

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id_pasien: number
    id_klinik: number
    no_rekam_medis: string
    nama_lengkap: string
    nik: string
    tempat_lahir: string
    tanggal_lahir: string
    jenis_kelamin: 'L' | 'P' | null
    alamat: string
    telepon: string
    email: string
    golongan_darah: 'A' | 'B' | 'AB' | 'O' | null
    kontak_darurat_nama: string
    kontak_darurat_telepon: string
    kontak_darurat_relasi: string
  } | null
  onSubmit: (values: PasienFormData) => Promise<void>
  loading?: boolean
  klinikList: { id_klinik: number; nama_klinik: string }[]
}

export function FormDialog({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit,
  loading = false,
  klinikList = [] 
}: FormDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_klinik: klinikList.length > 0 ? klinikList[0].id_klinik : 1,
      no_rekam_medis: "",
      nama_lengkap: "",
      nik: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: null,
      alamat: "",
      telepon: "",
      email: "",
      golongan_darah: null,
      kontak_darurat_nama: "",
      kontak_darurat_telepon: "",
      kontak_darurat_relasi: "",
    },
  })

  // Generate nomor rekam medis saat klinik berubah (untuk pasien baru)
  const generateRekamMedis = async (id_klinik: number) => {
    try {
      if (!initialData && id_klinik) {
        const rekamMedis = await pasienService.generateRekamMedis(id_klinik);
        form.setValue('no_rekam_medis', rekamMedis);
      }
    } catch (error) {
      console.error('Error generating rekam medis number:', error);
    }
  };

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for input type="date"
      const formattedData = {
        ...initialData,
        tanggal_lahir: initialData.tanggal_lahir 
          ? new Date(initialData.tanggal_lahir).toISOString().split('T')[0]
          : ""
      }
      form.reset(formattedData)
    } else {
      const defaultKlinikId = klinikList.length > 0 ? klinikList[0].id_klinik : 1;
      
      form.reset({
        id_klinik: defaultKlinikId,
        no_rekam_medis: "",
        nama_lengkap: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: null,
        alamat: "",
        telepon: "",
        email: "",
        golongan_darah: null,
        kontak_darurat_nama: "",
        kontak_darurat_telepon: "",
        kontak_darurat_relasi: "",
      });
      
      // Generate rekam medis untuk pasien baru
      if (defaultKlinikId) {
        generateRekamMedis(defaultKlinikId);
      }
    }
  }, [form, initialData, klinikList])
  
  // Watch perubahan id_klinik untuk generate nomor rekam medis
  const selectedKlinikId = form.watch('id_klinik');
  
  useEffect(() => {
    // Hanya generate jika ini adalah form tambah pasien baru
    if (!initialData && selectedKlinikId) {
      generateRekamMedis(selectedKlinikId);
    }
  }, [selectedKlinikId, initialData]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values as PasienFormData)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Pasien" : "Tambah Pasien Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Edit data pasien yang sudah ada" 
              : "Tambah data pasien baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Klinik */}
              <FormField
                control={form.control}
                name="id_klinik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klinik</FormLabel>
                    <Select
                      disabled={loading || !!initialData} // Disable jika ini adalah edit (tidak boleh ganti klinik) - silahkan hapus jika perlu
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? field.value.toString() : "1"}
                      defaultValue={klinikList.length > 0 ? klinikList[0].id_klinik.toString() : "1"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih klinik" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {klinikList.length > 0 ? (
                          klinikList.map((klinik) => (
                            <SelectItem 
                              key={klinik.id_klinik} 
                              value={klinik.id_klinik.toString()}
                            >
                              {klinik.nama_klinik}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="1">Klinik Default</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* No Rekam Medis */}
              <FormField
                control={form.control}
                name="no_rekam_medis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Rekam Medis</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Auto-generated" 
                        {...field} 
                        disabled={true} // Selalu disable karena ini auto-generated
                        className={field.value ? "bg-muted" : ""}
                      />
                    </FormControl>
                    {!field.value && (
                      <p className="text-xs text-muted-foreground">
                        Nomor rekam medis akan dibuat otomatis
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nama Lengkap */}
              <FormField
                control={form.control}
                name="nama_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIK */}
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan NIK" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tempat Lahir */}
              <FormField
                control={form.control}
                name="tempat_lahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan tempat lahir" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tanggal Lahir */}
              <FormField
                control={form.control}
                name="tanggal_lahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jenis Kelamin */}
              <FormField
                control={form.control}
                name="jenis_kelamin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => field.onChange(value !== "" ? value : null)}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Golongan Darah */}
              <FormField
                control={form.control}
                name="golongan_darah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Golongan Darah</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => field.onChange(value !== "" ? value : null)}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih golongan darah" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telepon */}
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

              {/* Email */}
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
            </div>

            {/* Alamat - span 2 columns */}
            <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Masukkan alamat lengkap" 
                      {...field} 
                      disabled={loading} 
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-md space-y-4">
              <h3 className="text-sm font-medium">Kontak Darurat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kontak Darurat Nama */}
                <FormField
                  control={form.control}
                  name="kontak_darurat_nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama kontak darurat" {...field} disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kontak Darurat Telepon */}
                <FormField
                  control={form.control}
                  name="kontak_darurat_telepon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan telepon kontak darurat" {...field} disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kontak Darurat Relasi - fill remaining space */}
                <FormField
                  control={form.control}
                  name="kontak_darurat_relasi"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Hubungan</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan hubungan kontak darurat" {...field} disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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