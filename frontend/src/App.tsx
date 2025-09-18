// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import KlinikPage from '@/pages/klinik/KlinikPage'
import DokterPage from '@/pages/dokter/DokterPage'
import PasienPage from '@/pages/pasien/PasienPage'
import TindakanPage from '@/pages/tindakan/TindakanPage'
import PenggunaPage from '@/pages/pengguna/PenggunaPage'

// Master Pages
import ObatPage from '@/pages/master/obat/ObatPage'
import TindakanMasterPage from '@/pages/master/tindakan/TindakanPage'
import PenyakitPage from '@/pages/master/penyakit/PenyakitPage'
import HargaObatPage from '@/pages/master/harga-obat/HargaObatPage'
import HargaTindakanPage from '@/pages/master/harga-tindakan/HargaTindakanPage'
import DokterKlinikPage from './pages/dokter-klinik/DokterKlinikPage'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/klinik" element={<KlinikPage />} />
            <Route path="/dokter-klinik" element={<DokterKlinikPage />} />
            <Route path="/dokter" element={<DokterPage />} />
            <Route path="/pasien" element={<PasienPage />} />
            <Route path="/tindakan/*" element={<TindakanPage />} />
            
            <Route path="/pengguna" element={<PenggunaPage />} />
            
            {/* Master Routes */}
            <Route path="/master/obat" element={<ObatPage />} />
            <Route path="/master/tindakan" element={<TindakanMasterPage />} />
            <Route path="/master/penyakit" element={<PenyakitPage />} />
            <Route path="/master/harga-obat" element={<HargaObatPage />} />
            <Route path="/master/harga-tindakan" element={<HargaTindakanPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
      {/* Optional: Add React Query Devtools in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App