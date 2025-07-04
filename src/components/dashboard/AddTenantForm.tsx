import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, TenantShare } from '../../types'
import { tenantManagement, mockSettings } from '../../data/mockData'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import FormInput from '../ui/FormInput'
import { User as UserIcon, Mail, Calendar, Coins, Percent, X } from 'lucide-react'

interface AddTenantFormProps {
  onClose: () => void
  onSuccess: () => void
}

const AddTenantForm: React.FC<AddTenantFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rentAmount: '',
    utilitiesPercentage: '',
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addNotification } = useNotifications()
  const { currency, formatCurrency } = useCurrency()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Name and email are required')
      }

      if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
        throw new Error('Rent amount must be greater than 0')
      }

      if (!formData.utilitiesPercentage || parseFloat(formData.utilitiesPercentage) < 0) {
        throw new Error('Utilities percentage must be 0 or greater')
      }

      // Check if utilities shares would exceed 100%
      const currentUtilitiesTotal = tenantManagement.getTotalUtilitiesShares()
      const newUtilitiesPercentage = parseFloat(formData.utilitiesPercentage)
      
      if (currentUtilitiesTotal + newUtilitiesPercentage > 100) {
        throw new Error(`Adding ${newUtilitiesPercentage}% would exceed 100% utilities shares (current: ${currentUtilitiesTotal}%)`)
      }

      // Check if rent would exceed total rent budget
      const currentRentTotal = tenantManagement.getTotalRentShares()
      const newRentAmount = parseFloat(formData.rentAmount)
      
      if (currentRentTotal + newRentAmount > mockSettings.totalRent) {
        throw new Error(`Adding ${formatCurrency(newRentAmount)} would exceed total rent budget of ${formatCurrency(mockSettings.totalRent)} (current: ${formatCurrency(currentRentTotal)})`)
      }

      // Check for duplicate email
      const existingTenants = tenantManagement.getTenants()
      if (existingTenants.some(t => t.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('A tenant with this email already exists')
      }

      const share: TenantShare = {
        rentAmount: parseFloat(formData.rentAmount),
        utilitiesPercentage: parseFloat(formData.utilitiesPercentage),
        joinDate: formData.joinDate,
        isActive: true
      }

      const newTenant: Omit<User, 'id'> = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        role: 'subtenant',
        share
      }

      tenantManagement.addTenant(newTenant)

      addNotification({
        type: 'success',
        title: 'Tenant Added',
        message: `${formData.name} has been added successfully`
      })

      onSuccess()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add tenant'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getCurrentRentTotal = () => {
    return tenantManagement.getTotalRentShares()
  }

  const getCurrentUtilitiesTotal = () => {
    return tenantManagement.getTotalUtilitiesShares()
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add New Tenant</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new tenant to your property</p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Personal Information</h4>
                <p className="text-sm text-gray-600">Basic details about the tenant</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField label="Full Name" required>
                  <FormInput
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter tenant's full name"
                    leftIcon={<UserIcon className="w-4 h-4" />}
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter tenant's email"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </FormField>

                <FormField label="Join Date" required>
                  <FormInput
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </FormField>
              </div>
            </div>

            {/* Financial Details Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Financial Details</h4>
                <p className="text-sm text-gray-600">Set rent amount and utility share percentage</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField 
                  label={`Monthly Rent (${currency.symbol})`}
                  hint={`Available: ${formatCurrency(getAvailableRent())} | Current total: ${formatCurrency(getCurrentRentTotal())} of ${formatCurrency(mockSettings.totalRent)}`}
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
                  hint={`Available: ${getAvailableUtilities()}% | Current total: ${getCurrentUtilitiesTotal()}% allocated`}
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
                {isSubmitting ? 'Adding...' : 'Add Tenant'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AddTenantForm 