import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formatDate, formatRupiah } from "@/lib/utils";
import { api, getDefaultHeaders } from '@/lib/api';
import { Loader2, Plus, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";

import { rekamMedisService } from '@/services/tindakan-medis';
import { RefreshCw } from "lucide-react";

// Definisikan interface untuk data rekam medis
interface Pasien {
  id_pasien: number;
  nama_lengkap: string;
  no_rekam_medis: string;
}

interface Dokter {
  id_dokter: number;
  nama_dokter: string;
}

interface DokterKlinik {
  id_dokter_klinik: number;
  dokter: Dokter;
}

interface RekamMedis {
  id_rekam_medis: number;
  id_pasien: number;
  id_dokter_klinik: number;
  tanggal_kunjungan: string;
  keluhan: string;
  catatan_dokter: string;
  biaya: number;
  diskon: number;
  status_pembayaran: 'Belum Bayar' | 'Sudah Bayar';
  created_at: string;
  updated_at: string;
  pasien?: Pasien;
  dokterKlinik?: DokterKlinik;
}

// Interface untuk respons API
interface RekamMedisResponse {
  success: boolean;
  data: RekamMedis[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  total_pages: number;
}

const TindakanListPage = () => {
  const navigate = useNavigate();
  
  // State untuk filter dan paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPasien, setFilterPasien] = useState('all');
  const [filterDokter, setFilterDokter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Fetch data rekam medis
  const { 
    data: rekamMedisData, 
    isLoading, 
    isError,
    refetch
  } = useQuery<RekamMedisResponse>({
    queryKey: ['rekamMedis', currentPage, searchQuery, filterPasien, filterDokter, filterStatus],
    queryFn: async () => {
      // Buat query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      
      if (searchQuery) params.append('search', searchQuery);
      if (filterPasien && filterPasien !== 'all') params.append('id_pasien', filterPasien);
      if (filterDokter && filterDokter !== 'all') params.append('id_dokter_klinik', filterDokter);
      if (filterStatus && filterStatus !== 'all') params.append('status_pembayaran', filterStatus);
      
      const response = await fetch(`${api.tindakan.rekamMedis}?${params.toString()}`, {
        credentials: 'include', headers: getDefaultHeaders()
      });
      
      if (!response.ok) throw new Error('Gagal memuat data rekam medis');
      return response.json();
    }
  });
  
  // Handler untuk menambah tindakan baru
  const handleAddTindakan = () => {
    navigate('/tindakan/tambah');
  };
  
  // Handler untuk melihat detail tindakan
  const handleViewDetail = (id: number) => {
    navigate(`/tindakan/view/${id}`); // Gunakan path yang berbeda untuk view
  };
  
  // Handler untuk melakukan pencarian
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };
  
  // Handler untuk reset filter
  const handleResetFilter = () => {
    setSearchQuery('');
    setFilterPasien('all');
    setFilterDokter('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };
  
  // Tambahkan mutation untuk update status pembayaran
  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: 'Belum Bayar' | 'Sudah Bayar' }) => 
      rekamMedisService.updateStatusPembayaran(id, status),
    onSuccess: () => {
      // Refresh data setelah berhasil update
      refetch();
    }
  });

  // Handler untuk mengubah status pembayaran
  const handleTogglePaymentStatus = (e: React.MouseEvent, id: number, currentStatus: 'Belum Bayar' | 'Sudah Bayar') => {
    e.stopPropagation(); // Mencegah event bubble ke parent (baris tabel)
    const newStatus = currentStatus === 'Belum Bayar' ? 'Sudah Bayar' : 'Belum Bayar';
    updatePaymentMutation.mutate({ id, status: newStatus });
  };

  // Handler untuk paginasi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Tindakan Medis</h1>
        <Button onClick={handleAddTindakan}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tindakan
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          <CardDescription>Cari dan filter data tindakan medis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <form onSubmit={handleSearch} className="flex space-x-2">
                <Input
                  placeholder="Cari nama pasien, dokter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <div>
              <Select 
                value={filterPasien} 
                onValueChange={setFilterPasien}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter pasien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pasien</SelectItem>
                  {/* Opsi pasien akan dimuat dari API */}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={filterDokter} 
                onValueChange={setFilterDokter}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter dokter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Dokter</SelectItem>
                  {/* Opsi dokter akan dimuat dari API */}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select 
                value={filterStatus} 
                onValueChange={setFilterStatus}
                defaultValue="all"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Belum Bayar">Belum Bayar</SelectItem>
                  <SelectItem value="Sudah Bayar">Sudah Bayar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={handleResetFilter}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
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
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Diskon</TableHead>
                  <TableHead>Total Biaya</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rekamMedisData?.data && rekamMedisData.data.length > 0 ? (
                  rekamMedisData.data.map((item: RekamMedis) => (
                    <TableRow key={item.id_rekam_medis}>
                      <TableCell>{item.pasien?.no_rekam_medis}</TableCell>
                      <TableCell>{formatDate(item.tanggal_kunjungan)}</TableCell>
                      <TableCell>{item.pasien?.nama_lengkap}</TableCell>
                      <TableCell>{item.dokterKlinik?.dokter?.nama_dokter}</TableCell>
                      <TableCell>{formatRupiah(item.biaya)}</TableCell>
                      <TableCell>{formatRupiah(item.diskon || 0)}</TableCell>
                      <TableCell className="font-medium">{formatRupiah(item.biaya - (item.diskon || 0))}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status_pembayaran === 'Sudah Bayar' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status_pembayaran}
                          </span>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={updatePaymentMutation.isPending}
                            onClick={(e) => handleTogglePaymentStatus(e, item.id_rekam_medis, item.status_pembayaran)}
                          >
                            {updatePaymentMutation.isPending && updatePaymentMutation.variables?.id === item.id_rekam_medis ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetail(item.id_rekam_medis)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        
        {rekamMedisData?.meta && (
          <div className="flex items-center justify-center p-4 border-t">
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
                Halaman {currentPage} dari {rekamMedisData.meta.last_page}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === rekamMedisData.meta.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(rekamMedisData.meta.last_page)}
                disabled={currentPage === rekamMedisData.meta.last_page}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TindakanListPage;