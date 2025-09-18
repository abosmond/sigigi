import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Search } from "lucide-react";

import { 
  penyakitService, 
  tindakanService, 
  TreatmentData,
  KodePenyakit,
  Tindakan
} from '@/services/tindakan-medis';

interface TreatmentFormProps {
  onAddTreatment: (treatment: TreatmentData) => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ 
  onAddTreatment 
}) => {
  // State untuk form
  const [diseaseId, setDiseaseId] = useState<string>('');
  const [treatmentId, setTreatmentId] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk pencarian
  const [diseaseSearch, setDiseaseSearch] = useState<string>('');
  const [treatmentSearch, setTreatmentSearch] = useState<string>('');
  
  // State untuk data lokal
  const [diseasesData, setDiseasesData] = useState<KodePenyakit[]>([]);
  const [treatmentsData, setTreatmentsData] = useState<Tindakan[]>([]);

  // Fetch master data penyakit
  const { 
    data: diseases,
    isLoading: isLoadingDiseases,
    isError: isErrorDiseases
  } = useQuery({
    queryKey: ['diseases-list'],
    queryFn: () => penyakitService.getList(),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  });

  // Fetch master data tindakan
  const { 
    data: treatments,
    isLoading: isLoadingTreatments,
    isError: isErrorTreatments
  } = useQuery({
    queryKey: ['treatments-list'],
    queryFn: () => tindakanService.getList(),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  });

  // Set data penyakit dari API response
  useEffect(() => {
    if (diseases) {
      if (Array.isArray(diseases)) {
        setDiseasesData(diseases);
      } else if (diseases.data && Array.isArray(diseases.data)) {
        setDiseasesData(diseases.data);
      } else {
        console.error('Format data tidak sesuai dengan yang diharapkan:', diseases);
        setDiseasesData([]);
      }
    }
  }, [diseases]);

  // Set data tindakan dari API response
  useEffect(() => {
    if (treatments) {
      if (Array.isArray(treatments)) {
        setTreatmentsData(treatments);
      } else if (treatments.data && Array.isArray(treatments.data)) {
        setTreatmentsData(treatments.data);
      } else {
        console.error('Format data tidak sesuai dengan yang diharapkan:', treatments);
        setTreatmentsData([]);
      }
    }
  }, [treatments]);

  // Update harga berdasarkan tindakan yang dipilih
  useEffect(() => {
    if (treatmentId && treatmentsData.length > 0) {
      const selectedTreatment = treatmentsData.find(
        (treatment) => treatment.id_master_tindakan.toString() === treatmentId
      );
      
      if (selectedTreatment && selectedTreatment.harga !== undefined) {
        setUnitCost(selectedTreatment.harga);
      } else {
        setUnitCost(0);
      }
    }
  }, [treatmentId, treatmentsData]);

  // Hitung total biaya berdasarkan quantity dan unitCost
  const calculateTotalCost = () => {
    return unitCost * quantity;
  };

  // Reset form
  const resetForm = () => {
    setDiseaseId('');
    setTreatmentId('');
    setLocation('');
    setQuantity(1);
    setUnitCost(0);
    setNotes('');
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diseaseId || !treatmentId) {
      return; // Validasi form
    }

    setIsSubmitting(true);

    const selectedDisease = diseasesData.find((d) => 
      d.id_master_kode_penyakit.toString() === diseaseId
    );
    
    const selectedTreatment = treatmentsData.find((t) => 
      t.id_master_tindakan.toString() === treatmentId
    );

    const treatmentData: TreatmentData = {
      diseaseId: Number(diseaseId),
      diseaseName: selectedDisease?.nama_penyakit || '',
      treatmentId: Number(treatmentId),
      treatmentName: selectedTreatment?.nama_tindakan || '',
      location: location,
      quantity: quantity,
      unitCost: unitCost,
      totalCost: calculateTotalCost(),
      notes: notes
    };

    setTimeout(() => {
      onAddTreatment(treatmentData);
      resetForm();
      setIsSubmitting(false);
    }, 300);
  };

  // Filtered data
  const filteredDiseases = diseasesData.filter((disease) => 
    disease.nama_penyakit.toLowerCase().includes(diseaseSearch.toLowerCase())
  );

  const filteredTreatments = treatmentsData.filter((treatment) => 
    treatment.nama_tindakan.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
              <Label htmlFor="disease">Kode Penyakit</Label>
              <Select
                value={diseaseId}
                onValueChange={setDiseaseId}
                disabled={isLoadingDiseases || isSubmitting}
              >
                <SelectTrigger id="disease">
                  <SelectValue placeholder={isLoadingDiseases ? "Memuat data..." : "Pilih kode penyakit"} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-3 pb-2">
                    <div className="flex items-center border rounded-md px-3 gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari kode penyakit..."
                        className="border-0 focus-visible:ring-0 focus-visible:ring-transparent p-2"
                        value={diseaseSearch}
                        onChange={(e) => setDiseaseSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {isLoadingDiseases ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Memuat data...</span>
                    </div>
                  ) : isErrorDiseases ? (
                    <div className="text-center py-4 text-sm text-destructive">
                      Gagal memuat data. Silakan coba lagi.
                    </div>
                  ) : filteredDiseases.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Tidak ada data yang sesuai
                    </div>
                  ) : (
                    filteredDiseases.map((disease) => (
                      <SelectItem 
                        key={disease.id_master_kode_penyakit} 
                        value={disease.id_master_kode_penyakit.toString()}
                      >
                        {disease.nama_penyakit}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Tindakan</Label>
              <Select
                value={treatmentId}
                onValueChange={setTreatmentId}
                disabled={isLoadingTreatments || isSubmitting}
              >
                <SelectTrigger id="treatment">
                  <SelectValue placeholder={isLoadingTreatments ? "Memuat data..." : "Pilih tindakan"} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-3 pb-2">
                    <div className="flex items-center border rounded-md px-3 gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari tindakan..."
                        className="border-0 focus-visible:ring-0 focus-visible:ring-transparent p-2"
                        value={treatmentSearch}
                        onChange={(e) => setTreatmentSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {isLoadingTreatments ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Memuat data...</span>
                    </div>
                  ) : isErrorTreatments ? (
                    <div className="text-center py-4 text-sm text-destructive">
                      Gagal memuat data. Silakan coba lagi.
                    </div>
                  ) : filteredTreatments.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Tidak ada data yang sesuai
                    </div>
                  ) : (
                    filteredTreatments.map((treatment) => (
                      <SelectItem 
                        key={treatment.id_master_tindakan} 
                        value={treatment.id_master_tindakan.toString()}
                      >
                        {treatment.nama_tindakan}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            
            
            <div className="space-y-2">
              <Label htmlFor="location">Lokasi Gigi</Label>
              <Input
                id="location"
                placeholder="Contoh: 23D, 24D (spesifik) atau kosongkan (umum)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Kuantitas</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitCost">Biaya Satuan</Label>
              <Input
                id="unitCost"
                type="number"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Biaya</Label>
              <Input
                id="totalCost"
                value={`Rp ${calculateTotalCost().toLocaleString()}`}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Masukkan catatan tambahan untuk tindakan ini"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              type="submit"
              disabled={!diseaseId || !treatmentId || isSubmitting || isLoadingDiseases || isLoadingTreatments}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tindakan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};