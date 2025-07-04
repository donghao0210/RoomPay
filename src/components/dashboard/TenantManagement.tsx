import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, TenantShare, TenantDiscount } from '../../types'
import { mockUsers, tenantManagement, mockSettings } from '../../data/mockData'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import AddTenantForm from './AddTenantForm'
import EditTenantForm from './EditTenantForm'
import DiscountForm from './DiscountForm'

const TenantManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTenant, setEditingTenant] = useState<User | null>(null)
  const [showDiscountForm, setShowDiscountForm] = useState<string | null>(null)
  const [tenants, setTenants] = useState<User[]>(tenantManagement.getTenants())
  const { addNotification } = useNotifications()
  const { currency, formatCurrency } = useCurrency()

  const refreshTenants = () => {
    setTenants(tenantManagement.getTenants())
  }

  const handleRemoveTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (!tenant) return

    if (window.confirm(`Are you sure you want to remove ${tenant.name}?`)) {
      tenantManagement.removeTenant(tenantId)
      refreshTenants()
      addNotification({
        type: 'success',
        title: 'Tenant Removed',
        message: `${tenant.name} has been removed from the house.`
      })
    }
  }

  const handleEditTenant = (tenant: User) => {
    setEditingTenant(tenant)
  }

  const handleRemoveDiscount = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (!tenant) return

    if (window.confirm(`Remove discount for ${tenant.name}?`)) {
      tenantManagement.removeDiscount(tenantId)
      refreshTenants()
      addNotification({
        type: 'success',
        title: 'Discount Removed',
        message: `Discount for ${tenant.name} has been removed.`
      })
    }
  }

  const getDiscountedRent = (tenant: User) => {
    return tenantManagement.calculateDiscountedRent(tenant.id)
  }

  const formatDiscountDisplay = (discount: TenantDiscount) => {
    if (discount.type === 'percentage') {
      return `${discount.value}% off`
    } else {
      return `${formatCurrency(discount.value)} off`
    }
  }

  const getTotalRent = () => {
    return tenantManagement.getTotalRentShares()
  }

  const getTotalUtilitiesShares = () => {
    return tenantManagement.getTotalUtilitiesShares()
  }

  const getRentPercentage = (tenant: User) => {
    const totalRent = mockSettings.totalRent
    const rentAmount = tenant.share?.rentAmount || 0
    return totalRent > 0 ? Math.round((rentAmount / totalRent) * 100) : 0
  }

  const getUtilitiesStatus = () => {
    const total = getTotalUtilitiesShares()
    if (total === 100) return { status: 'perfect', color: 'text-green-600' }
    if (total < 100) return { status: 'under', color: 'text-yellow-600' }
    return { status: 'over', color: 'text-red-600' }
  }

  const utilitiesStatus = getUtilitiesStatus()

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Tenant Management</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-full sm:w-auto"
        >
          Add Tenant
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border">
          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Total Rent</h3>
            <p className="text-lg sm:text-2xl font-bold text-blue-600">
              {formatCurrency(getTotalRent())}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              of {formatCurrency(mockSettings.totalRent)} target
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border">
          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Utilities Split</h3>
            <p className={`text-lg sm:text-2xl font-bold ${utilitiesStatus.color}`}>
              {getTotalUtilitiesShares()}%
            </p>
            {utilitiesStatus.status !== 'perfect' && (
              <p className={`text-xs sm:text-sm ${utilitiesStatus.color}`}>
                {utilitiesStatus.status === 'under' 
                  ? `${100 - getTotalUtilitiesShares()}% unallocated`
                  : `${getTotalUtilitiesShares() - 100}% over-allocated`
                }
              </p>
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border">
          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Active Tenants</h3>
            <p className="text-lg sm:text-2xl font-bold text-purple-600">{tenants.length}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total tenants</p>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="space-y-3 sm:space-y-4">
        {tenants.map((tenant, index) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 sm:p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/70 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {tenant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">{tenant.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{tenant.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(tenant.share?.joinDate || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">Rent</p>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-lg font-bold text-gray-800">
                      {formatCurrency(tenant.share?.rentAmount || 0)}
                    </p>
                    {tenant.share?.discount && tenant.share.discount.isActive && (
                      <div className="space-y-1">
                        <p className="text-xs text-green-600 font-medium">
                          {formatDiscountDisplay(tenant.share.discount)}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-green-700">
                          Final: {formatCurrency(getDiscountedRent(tenant))}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {getRentPercentage(tenant)}% of total
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600">Utilities</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-800">
                    {tenant.share?.utilitiesPercentage || 0}%
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                  <Button
                    onClick={() => handleEditTenant(tenant)}
                    variant="secondary"
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    Edit
                  </Button>
                  {tenant.share?.discount && tenant.share.discount.isActive ? (
                    <Button
                      onClick={() => handleRemoveDiscount(tenant.id)}
                      variant="secondary"
                      size="sm"
                      className="text-orange-600 hover:bg-orange-50 text-xs sm:text-sm"
                    >
                      Remove Discount
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowDiscountForm(tenant.id)}
                      variant="secondary"
                      size="sm"
                      className="text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                    >
                      Add Discount
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemoveTenant(tenant.id)}
                    variant="secondary"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tenants.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">No tenants added yet</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add Tenant" to get started</p>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddForm && (
        <AddTenantForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            refreshTenants()
          }}
        />
      )}

      {/* Edit Tenant Modal */}
      {editingTenant && (
        <EditTenantForm
          tenant={editingTenant}
          onClose={() => setEditingTenant(null)}
          onSuccess={() => {
            setEditingTenant(null)
            refreshTenants()
          }}
        />
      )}

      {/* Discount Form Modal */}
      {showDiscountForm && (
        <DiscountForm
          tenantId={showDiscountForm}
          tenantName={tenants.find(t => t.id === showDiscountForm)?.name || ''}
          onClose={() => setShowDiscountForm(null)}
          onSuccess={() => {
            setShowDiscountForm(null)
            refreshTenants()
          }}
        />
      )}
    </Card>
  )
}

export default TenantManagement 