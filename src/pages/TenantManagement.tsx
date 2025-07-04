import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import TenantManagement from '../components/dashboard/TenantManagement'

const TenantManagementPage: React.FC = () => {
  const { currentUser } = useAuth()

  if (!currentUser || currentUser.role !== 'master') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only master tenants can access tenant management</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your tenants, their rent shares, and utilities distribution
        </p>
      </div>

      {/* Tenant Management Component */}
      <TenantManagement />
    </div>
  )
}

export default TenantManagementPage 