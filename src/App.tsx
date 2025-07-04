import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import PaymentReview from './pages/PaymentReview'
import TenantManagement from './pages/TenantManagement'
import RoleSelector from './components/auth/RoleSelector'
import QuickAction from './components/ui/QuickAction'
import NotificationToast from './components/notifications/NotificationToast'

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-teal-50">
            <Header />
            <main className="container mx-auto px-4 py-6 max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/payment-review" element={<PaymentReview />} />
                <Route path="/tenant-management" element={<TenantManagement />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <RoleSelector />
            <QuickAction />
            <NotificationToast />
          </div>
        </NotificationProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App 