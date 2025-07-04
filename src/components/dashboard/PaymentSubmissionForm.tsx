import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PaymentSubmission } from '../../types'
import { paymentSubmissionManagement } from '../../data/mockData'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import FormInput from '../ui/FormInput'
import FormSelect from '../ui/FormSelect'
import FormTextarea from '../ui/FormTextarea'
import { Upload, Coins, Calendar, X } from 'lucide-react'

interface PaymentSubmissionFormProps {
  onClose: () => void
  onSuccess: () => void
}

const PaymentSubmissionForm: React.FC<PaymentSubmissionFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'rent' as PaymentSubmission['type'],
    amount: '',
    month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    notes: '',
    proofFile: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const { addNotification } = useNotifications()
  const { formatCurrency } = useCurrency()
  const { currentUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      if (!currentUser) {
        throw new Error('User not found')
      }

      // Convert file to base64 for demo (in real app, upload to server)
      let proofUrl = undefined
      if (formData.proofFile) {
        proofUrl = await fileToBase64(formData.proofFile)
      }

      const submission: Omit<PaymentSubmission, 'id' | 'submissionDate'> = {
        tenantId: currentUser.id,
        tenantName: currentUser.name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        month: formData.month,
        status: 'pending',
        notes: formData.notes.trim() || undefined,
        proofUrl
      }

      paymentSubmissionManagement.addSubmission(submission)

      addNotification({
        type: 'success',
        title: 'Payment Submitted',
        message: `Your ${formData.type} payment of ${formatCurrency(parseFloat(formData.amount))} has been submitted for review`
      })

      onSuccess()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to submit payment'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification({
          type: 'error',
          title: 'File Too Large',
          message: 'Please select a file smaller than 5MB'
        })
        return
      }

      setFormData(prev => ({ ...prev, proofFile: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProofPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const paymentTypes = [
    { value: 'rent', label: 'Rent' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'water', label: 'Water' },
    { value: 'internet', label: 'Internet' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg border max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Submit Payment</h3>
            <p className="text-sm text-gray-600 mt-1">Upload your payment proof for review</p>
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
            {/* Payment Details Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Payment Details</h4>
                <p className="text-sm text-gray-600">Specify what you're paying for</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Payment Type" required>
                  <FormSelect
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    options={paymentTypes}
                  />
                </FormField>

                <FormField label="Amount" required>
                  <FormInput
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    leftIcon={<Coins className="w-4 h-4" />}
                  />
                </FormField>
              </div>
            </div>

            <FormField 
              label="Billing Period" 
              hint="Which month/period is this payment for?"
              required
            >
              <FormInput
                type="text"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                placeholder="e.g., February 2025"
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </FormField>

            {/* Payment Proof Section */}
            <div>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Payment Proof</h4>
                <p className="text-sm text-gray-600">Upload receipt or payment confirmation</p>
              </div>
              
              <FormField 
                label="Upload Receipt/Screenshot" 
                hint="Accepted formats: JPG, PNG, PDF (max 5MB)"
              >
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="proof-upload"
                  />
                  <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formData.proofFile ? formData.proofFile.name : 'Choose file or drag here'}
                      </span>
                    </div>
                  </div>
                </div>
              </FormField>

              {proofPreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative">
                    <img
                      src={proofPreview}
                      alt="Payment proof preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProofPreview(null)
                        setFormData(prev => ({ ...prev, proofFile: null }))
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <FormField 
              label="Additional Notes" 
              hint="Optional: Add any extra information about this payment"
            >
              <FormTextarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="e.g., Paid via bank transfer, reference number: ABC123..."
                rows={3}
                resize="none"
              />
            </FormField>

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
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                disabled={isSubmitting || !formData.amount || parseFloat(formData.amount) <= 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Payment'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentSubmissionForm 