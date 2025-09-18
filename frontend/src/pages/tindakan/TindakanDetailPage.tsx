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
import { Input } from "@/components/ui/input";
import { Loader2, Save, Printer, ArrowLeft } from "lucide-react";

import { DataTable } from './components/data-table';
import { treatmentColumns } from './components/columns';
import { TreatmentForm } from './components/treatment-form';
import { PrescriptionForm } from './components/prescription-form';
import { PatientInfo } from './components/patient-info';
import { rekamMedisService, TreatmentData, PrescriptionData } from '@/services/tindakan-medis';
import { api, getDefaultHeaders } from '@/lib/api';

const TindakanDetailPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State untuk menampung ID pasien
  const [pasienId, setPasienId] = useState<string | null>(null);
  
  // State untuk data tindakan medis
  const [activeTab, setActiveTab] = useState('info');
  const [treatments, setTreatments] = useState<TreatmentData[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [complaints, setComplaints] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  
  // Cek apakah patientId adalah ID rekam medis atau ID pasien
  useEffect(() => {
    if (!patientId || isNaN(Number(patientId))) return;
    
    // Cek apakah ini ID rekam medis dengan fetch data
    const checkIfRekamMedisId = async () => {
      try {
        const response = await fetch(`${api.tindakan.rekamMedis}/${patientId}`, {
          credentials: 'include', headers: getDefaultHeaders()
        });
        
        if (response.ok) {
          // Ini adalah ID rekam medis
          const data = await response.json();
          
          // Ambil ID pasien dari data rekam medis
          if (data.success && data.data && data.data.id_pasien) {
            setPasienId(data.data.id_pasien.toString());
          }
        } else {
          // Ini mungkin ID pasien
          setPasienId(patientId);
        }
      } catch (error) {
        console.error("Error checking ID type:", error);
        setPasienId(patientId); // Asumsikan ini ID pasien jika terjadi error
      }
    };
    
    checkIfRekamMedisId();
  }, [patientId]);
  
  // Fetch data pasien
  const { 
    data: patient, 
    isLoading: isLoadingPatient,
    isError: isErrorPatient
  } = useQuery({
    queryKey: ['patient', pasienId], 
    queryFn: async () => {
      const response = await fetch(`${api.pasien}/${pasienId}`, {
        credentials: 'include', headers: getDefaultHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch patient data');
      return response.json();
    },
    enabled: !!pasienId
  });
  
  // Fetch riwayat rekam medis pasien
  const {
    isLoading: isLoadingHistory,
    isError: isErrorHistory
  } = useQuery({
    queryKey: ['medicalHistory', pasienId],
    queryFn: () => rekamMedisService.getRiwayatPasien(Number(pasienId)),
    enabled: !!pasienId
  });
  
  // Mutasi untuk menyimpan rekam medis baru
  const saveMutation = useMutation({
    mutationFn: (data: any) => rekamMedisService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicalHistory', pasienId] });
      queryClient.invalidateQueries({ queryKey: ['rekamMedis'] }); // Invalidate daftar rekam medis
      // Navigasi ke daftar tindakan
      navigate('/tindakan');
    }
  });

  // Hitung total biaya
  const calculateTotalCost = () => {
    const treatmentCost = treatments.reduce((sum, t) => sum + (t.totalCost || 0), 0);
    const prescriptionCost = prescriptions.reduce((sum, p) => sum + (p.cost || 0), 0);
    return treatmentCost + prescriptionCost;
  };

  // Hitung total biaya setelah diskon
  const calculateFinalTotal = () => {
    const totalBeforeDiscount = calculateTotalCost();
    return totalBeforeDiscount - discount;
  };

  // Handler untuk menambah tindakan
  const handleAddTreatment = (treatmentData: TreatmentData) => {
    setTreatments([...treatments, treatmentData]);
  };

  // Handler untuk menghapus tindakan
  const handleDeleteTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  // Handler untuk menambah resep
  const handleAddPrescription = (prescriptionData: PrescriptionData) => {
    setPrescriptions([...prescriptions, prescriptionData]);
  };

  // Handler untuk menghapus resep
  const handleDeletePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  // Handler untuk menyimpan rekam medis
  const handleSave = () => {
    if (!pasienId) {
      console.error("No valid patient ID");
      return;
    }
    
    const medicalRecordData = {
      id_pasien: Number(pasienId),
      id_dokter_klinik: 1, // Perlu disesuaikan dengan dokter yang login
      tanggal_kunjungan: new Date().toISOString(),
      keluhan: complaints,
      catatan_dokter: doctorNotes,
      treatments,
      prescriptions,
      biaya: calculateTotalCost(),
      diskon: discount,
      biaya_akhir: calculateFinalTotal(),
      status_pembayaran: 'Belum Bayar'
    };
    
    saveMutation.mutate(medicalRecordData);
  };

  // Handler untuk kembali
  const handleBack = () => {
    navigate('/tindakan/tambah');
  };

  // Kondisi loading
  const isLoading = isLoadingPatient || isLoadingHistory || !pasienId;
  
  // Kondisi error
  const isError = isErrorPatient || isErrorHistory;

  // Validasi jika patientId tidak valid atau tidak ada pasien
  if (!isLoading && (!pasienId || (patient && !patient.data))) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>ID Pasien Tidak Valid</AlertTitle>
          <AlertDescription>
            ID pasien tidak ditemukan atau tidak valid. Silakan pilih pasien terlebih dahulu.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/tindakan/tambah')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Pilih Pasien
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Terjadi kesalahan saat memuat data. Silakan coba lagi.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Tindakan Medis Baru</h1>
      </div>

      {patient && patient.data && (
        <PatientInfo patient={patient.data} className="mb-6" />
      )}

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Informasi Kunjungan</TabsTrigger>
          <TabsTrigger value="treatment">Tindakan</TabsTrigger>
          <TabsTrigger value="prescription">Resep Obat</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
        </TabsList>
        
        {/* Tab Informasi Kunjungan */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kunjungan</CardTitle>
              <CardDescription>
                Masukkan informasi keluhan pasien dan catatan dokter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="complaints" className="font-medium">Keluhan Pasien</label>
                  <textarea
                    id="complaints"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="doctorNotes" className="font-medium">Catatan Dokter</label>
                  <textarea
                    id="doctorNotes"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('treatment')}>
                Lanjut ke Tindakan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Tindakan */}
        <TabsContent value="treatment">
          <Card>
            <CardHeader>
              <CardTitle>Tindakan Medis</CardTitle>
              <CardDescription>
                Tambahkan tindakan untuk pasien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TreatmentForm 
                  onAddTreatment={handleAddTreatment}
                />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Daftar Tindakan</h3>
                  <DataTable 
                    columns={treatmentColumns(handleDeleteTreatment)} 
                    data={treatments} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('prescription')}>
                Lanjut ke Resep Obat
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Resep Obat */}
        <TabsContent value="prescription">
          <Card>
            <CardHeader>
              <CardTitle>Resep Obat</CardTitle>
              <CardDescription>
                Tambahkan resep obat jika diperlukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionForm 
                onAddPrescription={handleAddPrescription} 
                existingPrescriptions={prescriptions}
                onDeletePrescription={handleDeletePrescription}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('summary')}>
                Lanjut ke Ringkasan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab Ringkasan */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Tindakan Medis</CardTitle>
              <CardDescription>
                Periksa kembali informasi sebelum menyimpan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Informasi Pasien</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Nama Pasien:</div>
                    <div>{patient?.data?.nama_lengkap || '-'}</div>
                    <div className="font-medium">No. Rekam Medis:</div>
                    <div>{patient?.data?.no_rekam_medis || '-'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Keluhan</h3>
                  <p className="text-sm">{complaints || '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Catatan Dokter</h3>
                  <p className="text-sm">{doctorNotes || '-'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Tindakan ({treatments.length})</h3>
                  {treatments.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {treatments.map((t, i) => (
                        <li key={i}>
                          {t.treatmentName} {t.location ? `- Lokasi: ${t.location}` : ''} - 
                          {t.quantity > 1 ? `${t.quantity} x ` : ''}
                          Rp {t.unitCost?.toLocaleString()} = Rp {t.totalCost?.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Tidak ada tindakan</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Resep Obat ({prescriptions.length})</h3>
                  {prescriptions.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {prescriptions.map((p, i) => (
                        <li key={i}>{p.drugName} - {p.quantity} {p.unit} - {p.dosage} - Rp {p.cost?.toLocaleString()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">Tidak ada resep obat</p>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Total Biaya</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Biaya Tindakan:</div>
                    <div>Rp {treatments.reduce((sum, t) => sum + (t.totalCost || 0), 0).toLocaleString()}</div>
                    <div className="font-medium">Biaya Obat:</div>
                    <div>Rp {prescriptions.reduce((sum, p) => sum + (p.cost || 0), 0).toLocaleString()}</div>
                    <div className="font-medium">Subtotal:</div>
                    <div>Rp {calculateTotalCost().toLocaleString()}</div>
                    
                    {/* Tambahkan input diskon */}
                    <div className="font-medium">Diskon:</div>
                    <div className="flex items-center">
                      <Input 
                        type="number" 
                        value={discount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscount(Number(e.target.value))} 
                        min="0"
                        max={calculateTotalCost()}
                        className="w-24 h-7 mr-2"
                      />
                      <span>Rp {discount.toLocaleString()}</span>
                    </div>
                    
                    <div className="font-medium text-lg pt-2 border-t">Total Akhir:</div>
                    <div className="text-lg font-bold pt-2 border-t">Rp {calculateFinalTotal().toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('prescription')}
              >
                Kembali
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  disabled={saveMutation.isPending}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Cetak
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TindakanDetailPage;