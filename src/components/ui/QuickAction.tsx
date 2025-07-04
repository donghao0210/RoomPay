import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

const QuickAction: React.FC = () => {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickAction = () => {
    if (currentUser?.role === 'master') {
      // Generate Bills for master tenant
      addNotification({
        type: 'success',
        title: 'Bills Generated',
        message: 'Monthly bills have been generated for all tenants'
      })
    } else {
      // For tenants, navigate to dashboard and show helpful message
      if (location.pathname !== '/') {
        navigate('/')
      }
      addNotification({
        type: 'info',
        title: 'Submit Payment',
        message: 'Use the "Submit Payment" button in the dashboard header to submit your payment'
      })
    }
    setIsOpen(false)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  const isMaster = currentUser?.role === 'master'

  return (
    <div className="fixed left-4 z-40" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card mb-4 p-4 w-64 bg-white/20 backdrop-blur-xl border border-white/30 shadow-glass-lg"
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {isMaster ? 'Master Actions' : 'Quick Actions'}
            </h3>
            
            {/* Quick Action Button */}
            <button
              onClick={handleQuickAction}
              className="w-full text-left p-3 rounded-lg mb-3 bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/40 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm">
                    {isMaster ? '📋' : '💳'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {isMaster ? 'Generate Bills' : 'Submit Payment'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {isMaster ? 'Create monthly bills' : 'Go to payment form'}
                  </p>
                </div>
              </div>
            </button>

            {/* Navigation Options */}
            <div className="space-y-2 border-t border-white/30 pt-3">
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-primary-100/70 backdrop-blur-sm text-primary-700 border border-primary-200/50' 
                    : 'hover:bg-white/20 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🏠</span>
                  <span className="text-sm font-medium">Dashboard</span>
                </div>
              </button>

              {isMaster && (
                <>
                  <button
                    onClick={() => handleNavigation('/payment-review')}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/payment-review' 
                        ? 'bg-primary-100/70 backdrop-blur-sm text-primary-700 border border-primary-200/50' 
                        : 'hover:bg-white/20 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💳</span>
                      <span className="text-sm font-medium">Payment Review</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleNavigation('/tenant-management')}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/tenant-management' 
                        ? 'bg-primary-100/70 backdrop-blur-sm text-primary-700 border border-primary-200/50' 
                        : 'hover:bg-white/20 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">👥</span>
                      <span className="text-sm font-medium">Tenant Management</span>
                    </div>
                  </button>
                </>
              )}

              <button
                onClick={() => handleNavigation('/settings')}
                className={`w-full text-left p-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/settings' 
                    ? 'bg-primary-100/70 backdrop-blur-sm text-primary-700 border border-primary-200/50' 
                    : 'hover:bg-white/20 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
        className="rounded-full w-12 h-12 p-0 shadow-glass-lg bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 text-gray-700 hover:text-gray-800"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : isMaster ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            )}
          </svg>
        </motion.div>
      </Button>
    </div>
  )
}

export default QuickAction 