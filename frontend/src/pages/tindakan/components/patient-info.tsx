import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Patient {
  id_pasien?: number;
  no_rekam_medis: string;
  nama_lengkap: string;
  nik?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  alamat?: string;
  telepon?: string;
  email?: string;
  golongan_darah?: 'A' | 'B' | 'AB' | 'O';
  kontak_darurat_nama?: string;
  kontak_darurat_telepon?: string;
  kontak_darurat_relasi?: string;
}

interface PatientInfoProps {
  patient: Patient;
  className?: string;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient, className }) => {
  // Fungsi untuk menampilkan jenis kelamin
  const displayGender = (gender?: 'L' | 'P') => {
    if (!gender) return '-';
    return gender === 'L' ? 'Laki-laki' : 'Perempuan';
  };

  // Fungsi untuk menghitung umur
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} tahun`;
  };

  return (
    <Card className={cn("bg-white shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kolom 1: Informasi dasar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Informasi Dasar</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">No. RM</span>
                <span className="text-sm font-medium">{patient.no_rekam_medis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nama</span>
                <span className="text-sm font-medium">{patient.nama_lengkap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">NIK</span>
                <span className="text-sm font-medium">{patient.nik || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Jenis Kelamin</span>
                <span className="text-sm font-medium">{displayGender(patient.jenis_kelamin)}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Informasi lahir */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Kelahiran & Kontak</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tempat Lahir</span>
                <span className="text-sm font-medium">{patient.tempat_lahir || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tanggal Lahir</span>
                <span className="text-sm font-medium">{formatDate(patient.tanggal_lahir)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Usia</span>
                <span className="text-sm font-medium">{calculateAge(patient.tanggal_lahir)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Golongan Darah</span>
                <span className="text-sm font-medium">{patient.golongan_darah || '-'}</span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Kontak & Alamat */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Kontak & Alamat</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Telepon</span>
                <span className="text-sm font-medium">{formatPhoneNumber(patient.telepon)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium">{patient.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Alamat</span>
                <span className="text-sm font-medium truncate max-w-[180px]" title={patient.alamat}>
                  {patient.alamat || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kontak darurat */}
        {(patient.kontak_darurat_nama || patient.kontak_darurat_telepon) && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Kontak Darurat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nama</span>
                <span className="text-sm font-medium">{patient.kontak_darurat_nama || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Telepon</span>
                <span className="text-sm font-medium">{formatPhoneNumber(patient.kontak_darurat_telepon)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hubungan</span>
                <span className="text-sm font-medium">{patient.kontak_darurat_relasi || '-'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};