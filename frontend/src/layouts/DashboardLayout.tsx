import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import { useAuthStore } from '@/stores/authStore'
import { usePantryStore } from '@/stores/pantryStore'
import { pantryService } from '@/services/pantry.service'

export default function DashboardLayout() {
  const { isAuthenticated } = useAuthStore()
  const { setItems } = usePantryStore()

  // Fetch pantry once per session and populate the global store
  useEffect(() => {
    if (!isAuthenticated) return
    pantryService.getItems().then(setItems).catch(() => {})
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-bg-base">
      <Navbar />

      <main className="md:pl-60 pb-24 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
