import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { Plus, Loader2 } from "lucide-react";

import { DataTable } from './data-table';
import { prescriptionColumns } from './columns';
import { obatService } from '@/services/obat';
import { hargaObatService, PrescriptionData } from '@/services/tindakan-medis';

interface PrescriptionFormProps {
  onAddPrescription: (prescription: PrescriptionData) => void;
  onDeletePrescription: (index: number) => void;
  existingPrescriptions: PrescriptionData[];
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onAddPrescription,
  onDeletePrescription,
  existingPrescriptions
}) => {
  // State untuk form
  const [drugId, setDrugId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [dosage, setDosage] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  // Fetch master data obat
  const { 
    data: drugs,
    isLoading: isLoadingDrugs
  } = useQuery({
    queryKey: ['drugs'],
    queryFn: () => obatService.getList(1)
    .then(response => response.data)
  });

  // Fetch harga obat ketika drugId berubah
  const { 
    data: drugPrice,
    isLoading: isLoadingPrice
  } = useQuery({
    queryKey: ['drugPrice', drugId],
    queryFn: () => hargaObatService.getByKlinikAndObat(1, Number(drugId)),
    enabled: !!drugId
  });

  // Hitung total biaya obat
  useEffect(() => {
    const total = existingPrescriptions.reduce((sum, p) => sum + (p.cost || 0), 0);
    setTotalCost(total);
  }, [existingPrescriptions]);

  // Update harga ketika data harga atau quantity berubah
  useEffect(() => {
    if (drugPrice) {
      setCost(drugPrice.harga * quantity);
    }
  }, [drugPrice, quantity]);

  // Handle reset form
  const resetForm = () => {
    setDrugId('');
    setQuantity(1);
    setDosage('');
    setCost(0);
    setNotes('');
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!drugId || !dosage) {
      return; // Validasi form
    }

    setIsSubmitting(true);

    const selectedDrug = drugs?.find(d => d.id_obat.toString() === drugId);

    const prescriptionData: PrescriptionData = {
      drugId: Number(drugId),
      drugName: selectedDrug?.nama_obat || '',
      quantity,
      unit: selectedDrug?.satuan || '',
      dosage,
      cost,
      notes
    };

    // Delay sedikit untuk animasi
    setTimeout(() => {
      onAddPrescription(prescriptionData);
      resetForm();
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tambah Resep Obat</CardTitle>
          <CardDescription>
            Tambahkan obat yang akan diresepkan ke pasien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drug">Obat</Label>
                <Select
                  value={drugId}
                  onValueChange={setDrugId}
                  disabled={isLoadingDrugs || isSubmitting}
                >
                  <SelectTrigger id="drug">
                    <SelectValue placeholder="Pilih obat" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugs?.map((drug) => (
                      <SelectItem 
                        key={drug.id_obat} 
                        value={drug.id_obat.toString()}
                      >
                        {drug.nama_obat} ({drug.dosis || '-'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={!drugId || isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Aturan Pakai</Label>
                <Input
                  id="dosage"
                  placeholder="Contoh: 3x1 sehari setelah makan"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  disabled={!drugId || isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Biaya</Label>
                <Input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  disabled={isLoadingPrice || isSubmitting}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  placeholder="Catatan tambahan untuk obat ini"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                type="submit"
                disabled={!drugId || !dosage || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Obat
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Resep Obat</CardTitle>
          <CardDescription>
            Daftar obat yang akan diresepkan ke pasien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={prescriptionColumns(onDeletePrescription)} 
            data={existingPrescriptions} 
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="font-medium">Total Biaya Obat:</div>
          <div className="font-bold">
            Rp {totalCost.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};