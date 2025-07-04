import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'

const RoleSelector: React.FC = () => {
  const { currentUser, users, switchRole } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleRoleSwitch = (userId: string) => {
    switchRole(userId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass-card mb-4 p-4 w-72"
          >
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Switch User Role</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleRoleSwitch(user.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    currentUser?.id === user.id
                      ? 'bg-primary-500/20 border border-primary-300/50 text-primary-700'
                      : 'hover:bg-white/30 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                    </div>
                    {currentUser?.id === user.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
        className="rounded-full w-12 h-12 p-0 shadow-glass-lg"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      </Button>
    </div>
  )
}

export default RoleSelector 