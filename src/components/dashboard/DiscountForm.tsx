import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TenantDiscount } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { tenantManagement } from '../../data/mockData'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'
import { Percent, Coins, Calendar, X } from 'lucide-react'

interface DiscountFormProps {
  tenantId: string
  tenantName: string
  onClose: () => void
  onSuccess: () => void
}

const DiscountForm: React.FC<DiscountFormProps> = ({ tenantId, tenantName, onClose, onSuccess }) => {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const { formatCurrency } = useCurrency()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    reason: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate inputs
      const value = parseFloat(formData.value)
      if (isNaN(value) || value <= 0) {
        addNotification({
          type: 'error',
          title: 'Invalid Value',
          message: 'Please enter a valid positive number'
        })
        return
      }

      if (formData.type === 'percentage' && value > 100) {
        addNotification({
          type: 'error',
          title: 'Invalid Percentage',
          message: 'Percentage cannot exceed 100%'
        })
        return
      }

      if (!formData.reason.trim()) {
        addNotification({
          type: 'error',
          title: 'Missing Reason',
          message: 'Please provide a reason for the discount'
        })
        return
      }

      // Add discount
      const discount: Omit<TenantDiscount, 'id' | 'appliedDate'> = {
        type: formData.type,
        value: value,
        reason: formData.reason.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: formData.isActive,
        appliedBy: currentUser?.id || '1'
      }

      tenantManagement.addDiscount(tenantId, discount)

      addNotification({
        type: 'success',
        title: 'Discount Added',
        message: `${formData.type === 'percentage' ? `${value}% discount` : `${formatCurrency(value)} discount`} added for ${tenantName}`
      })

      onSuccess()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error Adding Discount',
        message: 'Failed to add discount. Please try again.'
      })
    } finally {
      setLoading(false)
    }
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add Discount</h3>
            <p className="text-sm text-gray-600 mt-1">Add a discount for {tenantName}</p>
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
            {/* Discount Type Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Discount Type</h4>
                <p className="text-sm text-gray-600">Choose the type of discount to apply</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'percentage' }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'percentage'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'fixed' }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.type === 'fixed'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  Fixed Amount
                </button>
              </div>
            </div>

            {/* Discount Value Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Discount Value</h4>
                <p className="text-sm text-gray-600">Enter the discount amount</p>
              </div>
              
              <FormField
                label={formData.type === 'percentage' ? 'Percentage (%)' : 'Amount'}
                required
              >
                <FormInput
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={formData.type === 'percentage' ? 'e.g., 10' : 'e.g., 50.00'}
                  min="0"
                  max={formData.type === 'percentage' ? "100" : undefined}
                  step={formData.type === 'percentage' ? "1" : "0.01"}
                  leftIcon={formData.type === 'percentage' ? <Percent className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                />
              </FormField>
            </div>

            {/* Reason Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Reason for Discount</h4>
                <p className="text-sm text-gray-600">Provide a reason for this discount</p>
              </div>
              
              <FormField label="Reason" required>
                <FormTextarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., Long-term loyalty, Maintenance help, Early payment..."
                  rows={3}
                  resize="none"
                />
              </FormField>
            </div>

            {/* Date Range Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Validity Period</h4>
                <p className="text-sm text-gray-600">Set the discount period</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Start Date" required>
                  <FormInput
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </FormField>
                <FormField label="End Date" hint="Leave empty for permanent discount">
                  <FormInput
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    min={formData.startDate}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </FormField>
              </div>
            </div>

            {/* Status Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Discount Status</h4>
                <p className="text-sm text-gray-600">Set the discount activation status</p>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-700">Activate discount immediately</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.isActive ? 'This discount will take effect immediately' : 'This discount will be inactive until manually activated'}
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Discount'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default DiscountForm 