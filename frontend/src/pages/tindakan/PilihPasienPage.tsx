import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { api, getDefaultHeaders } from '@/lib/api';
import { Loader2, Search, PlusCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// Definisikan interface untuk data pasien
interface Pasien {
  id_pasien: number;
  no_rekam_medis: string;
  nama_lengkap: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  alamat?: string;
}

// Interface untuk respons API
interface PasienResponse {
  success: boolean;
  data: Pasien[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const PilihPasienPage = () => {
  const navigate = useNavigate();
  
  // State untuk filter dan paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch data pasien
  const { 
    data: pasienData, 
    isLoading, 
    isError,
    refetch
  } = useQuery<PasienResponse>({
    queryKey: ['pasien', currentPage, searchQuery],
    queryFn: async () => {
      // Buat query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`${api.pasien}?${params.toString()}`, {
        credentials: 'include', headers: getDefaultHeaders()
      });
      
      if (!response.ok) throw new Error('Gagal memuat data pasien');
      return response.json();
    }
  });
  
  // Handler untuk memilih pasien
  const handlePilihPasien = (id: number) => {
    navigate(`/tindakan/pasien/${id}`);
  };
  
  // Handler untuk kembali
  const handleBack = () => {
    navigate('/tindakan');
  };
  
  // Handler untuk melakukan pencarian
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };
  
  // Handler untuk paginasi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pilih Pasien</CardTitle>
          <CardDescription>Pilih pasien untuk tindakan medis baru</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2 max-w-md mb-4">
            <Input
              placeholder="Cari nama atau No. RM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
          </form>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64 text-destructive">
              Terjadi kesalahan saat memuat data. Silakan coba lagi.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. RM</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Tgl. Lahir</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pasienData?.data && pasienData.data.length > 0 ? (
                  pasienData.data.map((pasien: Pasien) => (
                    <TableRow key={pasien.id_pasien}>
                      <TableCell className="font-medium">{pasien.no_rekam_medis}</TableCell>
                      <TableCell>{pasien.nama_lengkap}</TableCell>
                      <TableCell>{formatDate(pasien.tanggal_lahir)}</TableCell>
                      <TableCell>{pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                      <TableCell className="truncate max-w-xs">{pasien.alamat}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => handlePilihPasien(pasien.id_pasien)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Pilih
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          
          {pasienData?.meta && (
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Halaman {currentPage} dari {pasienData.meta.last_page}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pasienData.meta.last_page}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pasienData.meta.last_page)}
                  disabled={currentPage === pasienData.meta.last_page}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PilihPasienPage;