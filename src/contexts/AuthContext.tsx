import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '../types'
import { mockUsers } from '../data/mockData'

interface AuthContextType {
  currentUser: User | null
  users: User[]
  switchRole: (userId: string) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]) // Default to master tenant
  const [users] = useState<User[]>(mockUsers)

  const switchRole = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
    }
  }

  const value = {
    currentUser,
    users,
    switchRole,
    isAuthenticated: currentUser !== null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 