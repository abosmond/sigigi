// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout