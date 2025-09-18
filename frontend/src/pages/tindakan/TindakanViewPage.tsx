import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Printer, ArrowLeft, Check, X, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRupiah } from "@/lib/utils";

import { rekamMedisService, TreatmentData } from '@/services/tindakan-medis';
import odontogramService, { OdontogramData } from '@/services/odontogram';

const TindakanViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Validasi ID rekam medis
  const isValidId = Boolean(id && !isNaN(Number(id)));
  
  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState('info');
  
  // Fetch data rekam medis
  const { 
    data: rekamMedis, 
    isLoading: isLoadingRekamMedis,
    isError: isErrorRekamMedis    
  } = useQuery({
    queryKey: ['rekamMedis', id], 
    queryFn: () => rekamMedisService.getById(Number(id)),
    enabled: isValidId
  });
  
  // State untuk data odontogram
  const [odontogramData, setOdontogramData] = useState<OdontogramData[]>([]);
  const [isLoadingOdontogram, setIsLoadingOdontogram] = useState<boolean>(false);
  const [odontogramError, setOdontogramError] = useState<string | null>(null);
  
  // Fetch data odontogram saat pasien ID tersedia
  useEffect(() => {
    if (rekamMedis?.id_pasien) {
      setIsLoadingOdontogram(true);
      setOdontogramError(null);
      
      odontogramService.getOdontogramPasien(rekamMedis.id_pasien)
        .then(data => {
          setOdontogramData(data);
          setIsLoadingOdontogram(false);
        })
        .catch(error => {
          console.error('Error fetching odontogram data:', error);
          setOdontogramError('Gagal memuat data odontogram');
          setIsLoadingOdontogram(false);
        });
    }
  }, [rekamMedis?.id_pasien]);
  
  // Mutation untuk update status pembayaran
const updatePaymentStatusMutation = useMutation({
  mutationFn: (status: 'Belum Bayar' | 'Sudah Bayar') => 
    rekamMedisService.updateStatusPembayaran(Number(id), status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['rekamMedis', id] });
    queryClient.invalidateQueries({ queryKey: ['rekamMedis'] });
  }
});

  // Handler untuk toggle status pembayaran
  const handleTogglePaymentStatus = () => {
    if (!rekamMedis) return;
    
    const currentStatus = rekamMedis.status_pembayaran;
    const newStatus = currentStatus === 'Belum Bayar' ? 'Sudah Bayar' : 'Belum Bayar';
    
    updatePaymentStatusMutation.mutate(newStatus);
  };
  
  // Handler untuk kembali ke daftar tindakan
  const handleBack = () => {
    navigate('/tindakan');
  };
  
  // Handler untuk mencetak rekam medis
  const handlePrintRekamMedis = async () => {
    try {
      const blob = await rekamMedisService.printRekamMedis(Number(id));
      // Buat URL untuk blob dan buka di tab baru
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error printing medical record:', error);
    }
  };
  
  // Handler untuk mencetak resep
  /*const handlePrintResep = async () => {
    try {
      const blob = await rekamMedisService.printResep(Number(id));
      // Buat URL untuk blob dan buka di tab baru
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error printing prescription:', error);
    }
  }; */ 

  // Validasi jika ID tidak valid
  if (!isValidId) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>ID Rekam Medis Tidak Valid</AlertTitle>
          <AlertDescription>
            ID rekam medis tidak ditemukan atau tidak valid.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Button>
      </div>
    );
  }

  if (isLoadingRekamMedis) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  if (isErrorRekamMedis || !rekamMedis) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Terjadi kesalahan saat memuat data rekam medis. Silakan coba lagi.
        </AlertDescription>
      </Alert>
    );
  }

  const medicalRecord = rekamMedis;
  
    // Define DiseaseGroup interface based on TreatmentData
  interface DiseaseGroup {
    diseaseId: number;
    diseaseName: string;
    treatments: TreatmentData[];
  }

  // Group treatments by disease
  const treatmentsByDisease: Record<string, DiseaseGroup> = medicalRecord.treatments && medicalRecord.treatments.length > 0 
    ? medicalRecord.treatments.reduce((acc: Record<string, DiseaseGroup>, treatment: TreatmentData) => {
        const diseaseIdKey = treatment.diseaseId.toString(); // Use string as key
        if (!acc[diseaseIdKey]) {
          acc[diseaseIdKey] = {
            diseaseId: treatment.diseaseId,
            diseaseName: treatment.diseaseName,
            treatments: []
          };
        }
        acc[diseaseIdKey].treatments.push(treatment);
        return acc;
      }, {})
    : {};
  
  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    
    if (medicalRecord.treatments && medicalRecord.treatments.length > 0) {
      subtotal = medicalRecord.treatments.reduce((sum, treatment) => 
        sum + (treatment.totalCost || 0), 0);
    }
    
    // Menggunakan properti diskon dari API
    const discount = medicalRecord.diskon ? medicalRecord.diskon : 0;
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  };
  
  const { subtotal, discount, total } = calculateTotals();

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Detail Tindakan Medis</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={medicalRecord.status_pembayaran === 'Sudah Bayar' ? 'outline' : 'default'}
            onClick={handleTogglePaymentStatus}
            disabled={updatePaymentStatusMutation.isPending}
          >
            {updatePaymentStatusMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : medicalRecord.status_pembayaran === 'Sudah Bayar' ? (
              <X className="h-4 w-4 mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {medicalRecord.status_pembayaran === 'Sudah Bayar' ? 'Batalkan Pembayaran' : 'Tandai Sudah Bayar'}
          </Button>
        </div>
      </div>

      {medicalRecord.pasien && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Pasien</h3>
                <p className="font-medium">{medicalRecord.pasien.nama_lengkap}</p>
                <p className="text-sm text-muted-foreground">No. RM: {medicalRecord.pasien.no_rekam_medis}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tanggal Kunjungan</h3>
                <p className="font-medium">{formatDate(medicalRecord.tanggal_kunjungan)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status Pembayaran</h3>
                <Badge 
                    variant={medicalRecord.status_pembayaran === 'Sudah Bayar' ? 'default' : 'destructive'}
                    className={medicalRecord.status_pembayaran === 'Sudah Bayar' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                >
                    {medicalRecord.status_pembayaran}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="info">Informasi Kunjungan</TabsTrigger>
        {medicalRecord && medicalRecord.treatments && medicalRecord.treatments.length > 0 && (
          <TabsTrigger value="treatments">Tindakan</TabsTrigger>
        )}
        {medicalRecord.pasien && (
          <TabsTrigger value="odontogram">Odontogram</TabsTrigger>
        )}
        {medicalRecord && medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0 && (
          <TabsTrigger value="prescriptions">Resep Obat</TabsTrigger>
        )}
      </TabsList>
        
        {/* Tab Informasi Kunjungan */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kunjungan</CardTitle>
              <CardDescription>
                Detail keluhan pasien dan catatan dokter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Keluhan Pasien</h3>
                  <div className="p-4 bg-muted rounded-md">
                    {medicalRecord.keluhan || 'Tidak ada keluhan'}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Catatan Dokter</h3>
                  <div className="p-4 bg-muted rounded-md">
                    {medicalRecord.catatan_dokter || 'Tidak ada catatan'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Tindakan */}
        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Tindakan yang Dilakukan</CardTitle>
              <CardDescription>
                Daftar tindakan yang telah dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecord.treatments && medicalRecord.treatments.length > 0 ? (
                <div className="space-y-6">
                  {/* Grouped treatments by disease */}
                  {Object.values(treatmentsByDisease).map((diseaseGroup: DiseaseGroup, index: number) => (
                    <div key={`disease-${diseaseGroup.diseaseId}-${index}`} className="border rounded-md overflow-hidden">
                      {/* Disease header */}
                      <div className="bg-muted p-4">
                        <h3 className="font-medium">{diseaseGroup.diseaseName}</h3>
                      </div>
                      
                      {/* Treatments list */}
                      <div className="divide-y">
                        {diseaseGroup.treatments.map((treatment: TreatmentData, idx: number) => (
                          <div key={`treatment-${idx}`} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              {/* Treatment name */}
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Tindakan</h4>
                                <p className="font-medium">{treatment.treatmentName}</p>
                              </div>
                              
                              {/* Location */}
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Lokasi</h4>
                                <p className="font-medium">{treatment.location || '-'}</p>
                              </div>
                              
                              {/* Quantity */}
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Kuantitas</h4>
                                <p className="font-medium">{treatment.quantity || 1}</p>
                              </div>
                              
                              {/* Unit cost */}
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Biaya Satuan</h4>
                                <p className="font-medium">{formatRupiah(treatment.unitCost)}</p>
                              </div>
                              
                              {/* Total cost */}
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Total Biaya</h4>
                                <p className="font-medium">{formatRupiah(treatment.totalCost)}</p>
                              </div>
                            </div>
                            
                            {/* Notes (if any) */}
                            {treatment.notes && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Catatan</h4>
                                <p className="text-sm">{treatment.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Payment summary */}
                  <div className="flex flex-col items-end mt-8">
                    <div className="w-full md:w-1/3 bg-muted p-4 rounded-md space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sub Total:</span>
                        <span>{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Diskon:</span>
                        <span>{formatRupiah(discount)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total:</span>
                        <span>{formatRupiah(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Tidak ada tindakan yang dilakukan</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={handlePrintRekamMedis}>
                <Printer className="h-4 w-4 mr-2" />
                Cetak Tindakan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Odontogram */}
        <TabsContent value="odontogram">
          <Card>
            <CardHeader>
              <CardTitle>Odontogram Pasien</CardTitle>
              <CardDescription>
                Visualisasi kondisi gigi pasien
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOdontogram ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Memuat data odontogram...</span>
                </div>
              ) : odontogramError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{odontogramError}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {/* Visualisasi odontogram */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px] p-4 border rounded-md">
                      <h3 className="text-lg font-medium mb-4">Odontogram Pasien: {medicalRecord.pasien?.nama_lengkap}</h3>
                      
                      {/* Visualisasi rahang atas */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Rahang Atas (Maxilla)</p>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-8 gap-2">
                            {Array.from({ length: 16 }).map((_, index) => {
                              // Nomor gigi dari 18 hingga 11 (kiri ke kanan)
                              // dan dari 21 hingga 28 (kiri ke kanan)
                              const toothNumber = index < 8 
                                ? (18 - index).toString() 
                                : (index - 8 + 21).toString();
                              
                              // Cek apakah ada tindakan pada gigi ini
                              const hasTreatment = medicalRecord.treatments?.some(treatment => 
                                treatment.location?.includes(toothNumber)
                              );
                              
                              // Cek apakah ada data odontogram untuk gigi ini
                              const toothOdontogram = odontogramData.filter(o => 
                                o.nomor_gigi === toothNumber
                              );
                              
                              // Tentukan warna berdasarkan ada tidaknya tindakan atau data odontogram
                              let bgColor = 'bg-gray-50';
                              let borderColor = 'border-gray-200';
                              
                              if (hasTreatment) {
                                bgColor = 'bg-blue-100';
                                borderColor = 'border-blue-500';
                              } else if (toothOdontogram.length > 0) {
                                // Gunakan warna dari data odontogram jika ada
                                const latestData = toothOdontogram.sort((a, b) => {
                                  const dateA = a.tanggal_periksa ? new Date(a.tanggal_periksa) : new Date(0);
                                  const dateB = b.tanggal_periksa ? new Date(b.tanggal_periksa) : new Date(0);
                                  return dateB.getTime() - dateA.getTime();
                                })[0];
                                
                                if (latestData.warna_odontogram) {
                                  bgColor = latestData.warna_odontogram;
                                  borderColor = 'border-gray-400';
                                }
                              }
                              
                              return (
                                <div 
                                  key={`upper-tooth-${toothNumber}`}
                                  className={`aspect-square w-14 border flex items-center justify-center ${bgColor} border-${borderColor}`}
                                  title={`Gigi ${toothNumber}`}
                                >
                                  <span className="text-sm font-medium">{toothNumber}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Visualisasi rahang bawah */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Rahang Bawah (Mandibula)</p>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-8 gap-2">
                            {Array.from({ length: 16 }).map((_, index) => {
                              // Nomor gigi dari 48 hingga 41 (kiri ke kanan)
                              // dan dari 31 hingga 38 (kiri ke kanan)
                              const toothNumber = index < 8 
                                ? (48 - index).toString() 
                                : (index - 8 + 31).toString();
                              
                              // Cek apakah ada tindakan pada gigi ini
                              const hasTreatment = medicalRecord.treatments?.some(treatment => 
                                treatment.location?.includes(toothNumber)
                              );
                              
                              // Cek apakah ada data odontogram untuk gigi ini
                              const toothOdontogram = odontogramData.filter(o => 
                                o.nomor_gigi === toothNumber
                              );
                              
                              // Tentukan warna berdasarkan ada tidaknya tindakan atau data odontogram
                              let bgColor = 'bg-gray-50';
                              let borderColor = 'border-gray-200';
                              
                              if (hasTreatment) {
                                bgColor = 'bg-blue-100';
                                borderColor = 'border-blue-500';
                              } else if (toothOdontogram.length > 0) {
                                // Gunakan warna dari data odontogram jika ada
                                const latestData = toothOdontogram.sort((a, b) => {
                                  const dateA = a.tanggal_periksa ? new Date(a.tanggal_periksa) : new Date(0);
                                  const dateB = b.tanggal_periksa ? new Date(b.tanggal_periksa) : new Date(0);
                                  return dateB.getTime() - dateA.getTime();
                                })[0];
                                
                                if (latestData.warna_odontogram) {
                                  bgColor = latestData.warna_odontogram;
                                  borderColor = 'border-gray-400';
                                }
                              }
                              
                              return (
                                <div 
                                  key={`lower-tooth-${toothNumber}`}
                                  className={`aspect-square w-14 border flex items-center justify-center ${bgColor} border-${borderColor}`}
                                  title={`Gigi ${toothNumber}`}
                                >
                                  <span className="text-sm font-medium">{toothNumber}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Legenda */}
                      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-100 border border-blue-500 mr-2"></div>
                          <span>Gigi dengan tindakan saat ini</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-50 border border-gray-200 mr-2"></div>
                          <span>Gigi tanpa tindakan</span>
                        </div>
                        {/* Warna lainnya bisa ditambahkan sesuai data warna_odontogram */}
                      </div>
                    </div>
                  </div>
                  
                  {/* Daftar tindakan pada odontogram */}
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-4">
                      <h3 className="font-medium">Tindakan pada Kunjungan Ini</h3>
                    </div>
                    
                    <div className="p-4">
                      {medicalRecord.treatments && medicalRecord.treatments.some(t => t.location) ? (
                        <table className="w-full border-collapse">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-2 text-left">No. Gigi</th>
                              <th className="p-2 text-left">Posisi</th>
                              <th className="p-2 text-left">Tindakan</th>
                              <th className="p-2 text-left">Penyakit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {medicalRecord.treatments?.filter(t => t.location).map((treatment, idx) => {
                              // Parse location untuk mendapatkan nomor gigi dan posisi
                              const locations = treatment.location?.split(', ') || [];
                              
                              return locations.map((loc, locIdx) => {
                                // Ekstrak nomor gigi dan posisinya jika ada (e.g. "23D" -> "23" dan "D")
                                const match = loc.match(/(\d+)([A-Z])?/);
                                const toothNumber = match ? match[1] : '';
                                const position = match && match[2] ? match[2] : '-';
                                
                                return (
                                  <tr key={`treatment-${idx}-loc-${locIdx}`}>
                                    <td className="p-2">{toothNumber}</td>
                                    <td className="p-2">{position}</td>
                                    <td className="p-2">{treatment.treatmentName}</td>
                                    <td className="p-2">{treatment.diseaseName}</td>
                                  </tr>
                                );
                              });
                            }).flat()}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted-foreground py-2">Tidak ada tindakan pada gigi untuk kunjungan ini</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Riwayat odontogram */}
                  {odontogramData.length > 0 && (
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-4">
                        <h3 className="font-medium">Riwayat Odontogram</h3>
                      </div>
                      
                      <div className="p-4">
                        <table className="w-full border-collapse">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-2 text-left">Tanggal</th>
                              <th className="p-2 text-left">No. Gigi</th>
                              <th className="p-2 text-left">Posisi</th>
                              <th className="p-2 text-left">Kondisi</th>
                              <th className="p-2 text-left">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {odontogramData.slice(0, 10).map((item, idx) => (
                              <tr key={`odontogram-${idx}`}>
                                <td className="p-2">{item.tanggal_periksa ? formatDate(item.tanggal_periksa) : '-'}</td>
                                <td className="p-2">{item.nomor_gigi}</td>
                                <td className="p-2">{item.posisi_gigi}</td>
                                <td className="p-2">{item.kondisi_gigi}</td>
                                <td className="p-2">{item.keterangan || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {odontogramData.length > 10 && (
                          <div className="text-center mt-2">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan 10 dari {odontogramData.length} riwayat odontogram
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrintRekamMedis}>
            <FileDown className="h-4 w-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button onClick={handlePrintRekamMedis}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak Rekam Medis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TindakanViewPage;