import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, TenantShare } from '../../types'
import { tenantManagement, mockSettings } from '../../data/mockData'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import FormInput from '../ui/FormInput'
import { Calendar, Coins, Percent, X } from 'lucide-react'

interface EditTenantFormProps {
  tenant: User
  onClose: () => void
  onSuccess: () => void
}

const EditTenantForm: React.FC<EditTenantFormProps> = ({ tenant, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    rentAmount: tenant.share?.rentAmount.toString() || '0',
    utilitiesPercentage: tenant.share?.utilitiesPercentage.toString() || '0',
    joinDate: tenant.share?.joinDate || new Date().toISOString().split('T')[0],
    isActive: tenant.share?.isActive ?? true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotifications()
  const { currency, formatCurrency } = useCurrency()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.rentAmount || parseFloat(formData.rentAmount) < 0) {
        throw new Error('Rent amount must be 0 or greater')
      }

      if (!formData.utilitiesPercentage || parseFloat(formData.utilitiesPercentage) < 0) {
        throw new Error('Utilities percentage must be 0 or greater')
      }

      // Check if utilities shares would exceed 100% (excluding current tenant's share)
      const currentUtilitiesTotal = tenantManagement.getTotalUtilitiesShares() - (tenant.share?.utilitiesPercentage || 0)
      const newUtilitiesPercentage = parseFloat(formData.utilitiesPercentage)
      
      if (currentUtilitiesTotal + newUtilitiesPercentage > 100) {
        throw new Error(`Setting ${newUtilitiesPercentage}% would exceed 100% utilities shares (current others: ${currentUtilitiesTotal}%)`)
      }

      // Check if rent would exceed total rent budget (excluding current tenant's share)
      const currentRentTotal = tenantManagement.getTotalRentShares() - (tenant.share?.rentAmount || 0)
      const newRentAmount = parseFloat(formData.rentAmount)
      
      if (currentRentTotal + newRentAmount > mockSettings.totalRent) {
        throw new Error(`Setting ${formatCurrency(newRentAmount)} would exceed total rent budget of ${formatCurrency(mockSettings.totalRent)} (current others: ${formatCurrency(currentRentTotal)})`)
      }

      const updatedShare: TenantShare = {
        rentAmount: parseFloat(formData.rentAmount),
        utilitiesPercentage: parseFloat(formData.utilitiesPercentage),
        joinDate: formData.joinDate,
        isActive: formData.isActive
      }

      tenantManagement.updateTenantShare(tenant.id, updatedShare)

      addNotification({
        type: 'success',
        title: 'Tenant Updated',
        message: `${tenant.name}'s share has been updated successfully`
      })

      onSuccess()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update tenant'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getCurrentRentTotal = () => {
    // Exclude current tenant's share from total
    return tenantManagement.getTotalRentShares() - (tenant.share?.rentAmount || 0)
  }

  const getCurrentUtilitiesTotal = () => {
    // Exclude current tenant's share from total
    return tenantManagement.getTotalUtilitiesShares() - (tenant.share?.utilitiesPercentage || 0)
  }

  const getAvailableRent = () => {
    return Math.max(0, mockSettings.totalRent - getCurrentRentTotal())
  }

  const getAvailableUtilities = () => {
    return Math.max(0, 100 - getCurrentUtilitiesTotal())
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg border max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit Tenant Share</h3>
            <p className="text-sm text-gray-600 mt-1">Update {tenant.name}'s share details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Tenant Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{tenant.name}</p>
                <p className="text-sm text-gray-600">{tenant.email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant Details Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Tenant Details</h4>
                <p className="text-sm text-gray-600">Update basic tenant information</p>
              </div>
              
              <FormField label="Join Date" required>
                <FormInput
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />
              </FormField>
            </div>

            {/* Financial Details Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Financial Details</h4>
                <p className="text-sm text-gray-600">Update rent amount and utility share percentage</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={`Monthly Rent (${currency.symbol})`}
                  hint={`Available: ${formatCurrency(getAvailableRent())} | Current others: ${formatCurrency(getCurrentRentTotal())} of ${formatCurrency(mockSettings.totalRent)}`}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.rentAmount}
                    onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max={getAvailableRent()}
                    step="0.01"
                    leftIcon={<Coins className="w-4 h-4" />}
                  />
                </FormField>

                <FormField
                  label="Utilities Share (%)"
                  hint={`Available: ${getAvailableUtilities()}% | Current others: ${getCurrentUtilitiesTotal()}% allocated`}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.utilitiesPercentage}
                    onChange={(e) => handleInputChange('utilitiesPercentage', e.target.value)}
                    placeholder="0"
                    min="0"
                    max={getAvailableUtilities()}
                    step="0.1"
                    leftIcon={<Percent className="w-4 h-4" />}
                  />
                </FormField>
              </div>
            </div>

            {/* Status Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Tenant Status</h4>
                <p className="text-sm text-gray-600">Set the tenant's active status</p>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-700">Active Tenant</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.isActive ? 'This tenant will be included in bill calculations' : 'This tenant will not be included in bill calculations'}
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Tenant'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default EditTenantForm 