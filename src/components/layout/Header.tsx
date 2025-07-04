import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { paymentSubmissionManagement, propertySettingsManagement } from '../../data/mockData'
import { motion, AnimatePresence } from 'framer-motion'

const Header: React.FC = () => {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path
  
  // Get pending payment count for master tenant
  const pendingPaymentCount = currentUser?.role === 'master' 
    ? paymentSubmissionManagement.getPendingSubmissions().length 
    : 0

  // Get property settings for display
  const propertySettings = propertySettingsManagement.getSettings()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="glass-container sticky top-0 z-50 mx-0 my-0 rounded-none border-b border-white/30">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-gray-800">
                {propertySettings.unitNo ? `${propertySettings.unitNo}` : 'Room Pay'}
              </h1>
              {propertySettings.unitNo && (
                <p className="text-xs text-gray-600 -mt-1 leading-3">Room Pay</p>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-primary-500/20 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
              }`}
            >
              Dashboard
            </Link>
            {currentUser?.role === 'master' && (
              <>
                <Link
                  to="/payment-review"
                  className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 relative ${
                    isActive('/payment-review') 
                      ? 'bg-primary-500/20 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                  }`}
                >
                  Payment Review
                  {pendingPaymentCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingPaymentCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/tenant-management"
                  className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/tenant-management') 
                      ? 'bg-primary-500/20 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                  }`}
                >
                  Tenants
                </Link>
              </>
            )}
            <Link
              to="/settings"
              className={`px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive('/settings') 
                  ? 'bg-primary-500/20 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Mobile Navigation Button & User Info */}
          <div className="flex items-center space-x-2">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{currentUser?.role}</p>
            </div>
            <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">
                {currentUser?.name?.charAt(0)}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1 rounded-md text-gray-600 hover:text-gray-800 hover:bg-white/30 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/30 mt-1 py-1"
            >
              <nav className="flex flex-col space-y-1">
                {/* User Info Mobile */}
                <div className="sm:hidden px-2 py-1 border-b border-white/20 mb-1">
                  <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                  <p className="text-xs text-gray-600 capitalize">{currentUser?.role}</p>
                </div>

                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-primary-500/20 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                  }`}
                >
                  🏠 Dashboard
                </Link>
                {currentUser?.role === 'master' && (
                  <>
                    <Link
                      to="/payment-review"
                      onClick={closeMobileMenu}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                        isActive('/payment-review') 
                          ? 'bg-primary-500/20 text-primary-700' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>💳 Payment Review</span>
                        {pendingPaymentCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {pendingPaymentCount}
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link
                      to="/tenant-management"
                      onClick={closeMobileMenu}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive('/tenant-management') 
                          ? 'bg-primary-500/20 text-primary-700' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                      }`}
                    >
                      👥 Tenant Management
                    </Link>
                  </>
                )}
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/settings') 
                      ? 'bg-primary-500/20 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                  }`}
                >
                  ⚙️ Settings
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header 