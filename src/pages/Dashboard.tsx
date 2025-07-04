import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import MasterDashboard from '../components/dashboard/MasterDashboard'
import SubtenantDashboard from '../components/dashboard/SubtenantDashboard'

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Room Pay</h2>
          <p className="text-gray-600">Please select a user role to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {currentUser.role === 'master' ? (
        <MasterDashboard />
      ) : (
        <SubtenantDashboard />
      )}
    </div>
  )
}

export default Dashboard 