import { Routes, Route } from 'react-router-dom';
import TindakanListPage from './TindakanListPage';
import PilihPasienPage from './PilihPasienPage';
import TindakanViewPage from './TindakanViewPage';
import TindakanDetailPage from './TindakanDetailPage';

/**
 * TindakanPage berfungsi sebagai router untuk modul Tindakan
 * 
 * Routes:
 * /tindakan - Menampilkan daftar semua tindakan (TindakanListPage)
 * /tindakan/tambah - Halaman pemilihan pasien untuk tindakan baru (PilihPasienPage)
 * /tindakan/pasien/:patientId - Form tindakan untuk pasien tertentu (TindakanDetailPage)
 */
const TindakanPage = () => {
  return (
    <Routes>
      <Route path="/" element={<TindakanListPage />} />
      <Route path="/tambah" element={<PilihPasienPage />} />
      <Route path="/pasien/:patientId" element={<TindakanDetailPage />} />
      <Route path="view/:id" element={<TindakanViewPage />} /> {/* Tambahkan rute ini */}
    </Routes>
  );
};

export default TindakanPage;