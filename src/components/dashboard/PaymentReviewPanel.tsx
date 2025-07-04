import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PaymentSubmission } from '../../types'
import { paymentSubmissionManagement } from '../../data/mockData'
import { useNotifications } from '../../contexts/NotificationContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import FormTextarea from '../ui/FormTextarea'
import { 
  Home, 
  Zap, 
  Droplets, 
  Wifi, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  X,
  User,
  Calendar,
  Coins,
  Eye,
  MessageSquare
} from 'lucide-react'

const PaymentReviewPanel: React.FC = () => {
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(
    paymentSubmissionManagement.getSubmissions()
  )
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { addNotification } = useNotifications()
  const { formatCurrency } = useCurrency()

  const refreshSubmissions = () => {
    setSubmissions(paymentSubmissionManagement.getSubmissions())
  }

  const handleApprove = async (submissionId: string) => {
    setIsProcessing(true)
    try {
      paymentSubmissionManagement.approveSubmission(submissionId, reviewNotes.trim() || undefined)
      refreshSubmissions()
      
      const submission = submissions.find(s => s.id === submissionId)
      addNotification({
        type: 'success',
        title: 'Payment Approved',
        message: `${submission?.tenantName}'s ${submission?.type} payment has been approved`
      })
      
      setSelectedSubmission(null)
      setReviewNotes('')
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to approve payment'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (submissionId: string) => {
    if (!reviewNotes.trim()) {
      addNotification({
        type: 'error',
        title: 'Review Notes Required',
        message: 'Please provide a reason for rejecting this payment'
      })
      return
    }

    setIsProcessing(true)
    try {
      paymentSubmissionManagement.rejectSubmission(submissionId, reviewNotes.trim())
      refreshSubmissions()
      
      const submission = submissions.find(s => s.id === submissionId)
      addNotification({
        type: 'info',
        title: 'Payment Rejected',
        message: `${submission?.tenantName}'s ${submission?.type} payment has been rejected`
      })
      
      setSelectedSubmission(null)
      setReviewNotes('')
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to reject payment'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: PaymentSubmission['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: PaymentSubmission['type']) => {
    switch (type) {
      case 'rent': return <Home className="w-4 h-4" />
      case 'electricity': return <Zap className="w-4 h-4" />
      case 'water': return <Droplets className="w-4 h-4" />
      case 'internet': return <Wifi className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: PaymentSubmission['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')
  const recentSubmissions = submissions.slice(-10) // Show last 10 submissions

  return (
    <>
      <Card className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Review</h2>
          <p className="text-sm text-gray-600 mt-1">Review and approve tenant payment submissions</p>
        </div>
        {pendingSubmissions.length > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {pendingSubmissions.length} pending
            </span>
          </div>
        )}
      </div>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Review
          </h3>
          <div className="space-y-3">
            {pendingSubmissions.map((submission) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Mobile: Stack vertically */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-yellow-200 rounded-lg flex-shrink-0">
                      {getTypeIcon(submission.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 truncate">
                        {submission.tenantName}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {submission.type} • {formatCurrency(submission.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {submission.month}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <Button size="sm" variant="primary" className="w-full sm:w-auto flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          Recent Submissions
        </h3>
        <div className="space-y-3">
          {recentSubmissions.map((submission) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    {getTypeIcon(submission.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 truncate">
                      {submission.tenantName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {submission.type} • {formatCurrency(submission.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {getStatusIcon(submission.status)}
                    <span className="capitalize">{submission.status}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="sm:hidden">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base sm:text-lg">No payment submissions yet</p>
          <p className="text-gray-400 text-sm mt-2">Tenant payment submissions will appear here</p>
        </div>
      )}
      </Card>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg border max-h-[95vh] sm:max-h-[90vh] overflow-hidden mt-2 sm:mt-0 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(selectedSubmission.type)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Review Payment</h3>
                  <p className="text-sm text-gray-600">{selectedSubmission.tenantName}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null)
                  setReviewNotes('')
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-medium text-gray-600">Amount</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(selectedSubmission.amount)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <p className="text-xs font-medium text-gray-600">Period</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{selectedSubmission.month}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Payment Details
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Tenant
                        </p>
                        <p className="text-sm text-gray-800 font-medium">{selectedSubmission.tenantName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Type</p>
                        <p className="text-sm text-gray-800 font-medium capitalize">{selectedSubmission.type}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Submitted
                      </p>
                      <p className="text-sm text-gray-800">
                        {new Date(selectedSubmission.submissionDate).toLocaleDateString()}
                      </p>
                    </div>

                    {selectedSubmission.notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Tenant Notes
                        </p>
                        <p className="text-sm text-gray-800 bg-white p-2 rounded border">{selectedSubmission.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Proof */}
                {selectedSubmission.proofUrl && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Payment Proof
                    </h4>
                    <div className="relative">
                      <img
                        src={selectedSubmission.proofUrl}
                        alt="Payment proof"
                        className="w-full h-48 sm:h-56 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Review Notes Section */}
                {selectedSubmission.status === 'pending' && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Review Notes
                    </h4>
                    <FormField 
                      label="Add Review Notes" 
                      hint={selectedSubmission.status === 'pending' ? 'Required for rejection, optional for approval' : ''}
                    >
                      <FormTextarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about this payment review..."
                        rows={3}
                        resize="none"
                      />
                    </FormField>
                  </div>
                )}

                {/* Existing Review Notes */}
                {selectedSubmission.reviewNotes && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-800">Previous Review</p>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">{selectedSubmission.reviewNotes}</p>
                    {selectedSubmission.reviewDate && (
                      <p className="text-xs text-blue-600">
                        Reviewed: {new Date(selectedSubmission.reviewDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedSubmission.status === 'pending' && (
              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    onClick={() => handleReject(selectedSubmission.id)}
                    variant="secondary"
                    className="w-full sm:w-auto text-red-600 hover:bg-red-50 border-red-200 flex items-center justify-center"
                    disabled={isProcessing}
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="ml-2">{isProcessing ? 'Processing...' : 'Reject'}</span>
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedSubmission.id)}
                    variant="primary"
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 flex items-center justify-center"
                    disabled={isProcessing}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="ml-2">{isProcessing ? 'Processing...' : 'Approve'}</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default PaymentReviewPanel 