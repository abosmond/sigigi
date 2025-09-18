// src/components/layout/Header.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,  
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from 'react-router-dom'
import { api } from "@/lib/api"

const Header = () => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { 
      label: 'Klinik',
      submenu: [
        { label: 'Data Klinik', path: '/klinik' },
        { label: 'Dokter Klinik', path: '/dokter-klinik' },
      ] 
    },
    { label: 'Dokter', path: '/dokter' },
    { label: 'Pasien', path: '/pasien' },
    { 
      label: 'Master Data',
      submenu: [
        { label: 'Data Obat', path: '/master/obat' },
        { label: 'Data Tindakan', path: '/master/tindakan' },
        { label: 'Kode Penyakit', path: '/master/penyakit' },
        { label: 'Harga Obat', path: '/master/harga-obat' },
        { label: 'Harga Tindakan', path: '/master/harga-tindakan' },
      ]
    },
    { 
      label: 'Tindakan Medis',
      submenu: [
        { label: 'Daftar Tindakan', path: '/tindakan' },
        { label: 'Tambah Tindakan', path: '/tindakan/tambah' },
      ]
    },
    { label: 'Pengguna', path: '/pengguna' },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      
      // Ambil token dari localStorage
      const token = localStorage.getItem('token')
      
      // Call logout API dengan token di header
      const response = await fetch(api.auth.logout, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // Tambahkan token di header
        },
      })
      
      if (response.ok) {
        // Hapus data autentikasi dari localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        
        // Redirect to login page
        navigate('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <div className="mr-8">
          <Link to="/" className="font-bold">
            Dental Clinic
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          {menuItems.map((item) => {
            if (item.submenu) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium">
                      {item.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.path}>
                        <Link to={subItem.path} className="w-full">
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <span className="sr-only">Buka menu pengguna</span>
                <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center">
                  A
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Keluar..." : "Keluar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header