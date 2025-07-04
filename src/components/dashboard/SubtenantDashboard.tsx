import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useNotifications } from '../../contexts/NotificationContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import BillHistory from './BillHistory'
import PaymentSubmissionForm from './PaymentSubmissionForm'
import { mockBills, mockPaymentStatuses, paymentSubmissionManagement, propertySettingsManagement, tenantManagement, mockUsers } from '../../data/mockData'
import { format } from 'date-fns'

const SubtenantDashboard: React.FC = () => {
  const { currentUser } = useAuth()
  const { formatCurrency } = useCurrency()
  const { addNotification } = useNotifications()
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showWifiPassword, setShowWifiPassword] = useState(false)
  const [paymentSubmissions, setPaymentSubmissions] = useState(
    paymentSubmissionManagement.getSubmissionsByTenant(currentUser?.id || '')
  )

  // Get property settings for display
  const propertySettings = propertySettingsManagement.getSettings()

  // Get current user's tenant information
  const currentTenant = mockUsers.find(user => user.id === currentUser?.id)

  // Filter bills for current user
  const userBills = mockBills.filter(bill => bill.issuedTo === currentUser?.id)
  const userPaymentStatus = mockPaymentStatuses.find(status => status.userId === currentUser?.id)

  const totalDue = userBills.reduce((sum, bill) => 
    bill.status === 'pending' || bill.status === 'overdue' ? sum + bill.amount : sum, 0
  )

  const nextDueDate = userBills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]?.dueDate

  const refreshSubmissions = () => {
    setPaymentSubmissions(paymentSubmissionManagement.getSubmissionsByTenant(currentUser?.id || ''))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent': return '🏠'
      case 'electricity': return '💡'
      case 'water': return '💧'
      case 'internet': return '🌐'
      default: return '📄'
    }
  }

  const getDiscountedRent = () => {
    if (!currentUser?.id) return 0
    return tenantManagement.calculateDiscountedRent(currentUser.id)
  }

  const formatDiscountDisplay = (discount: any) => {
    if (discount.type === 'percentage') {
      return `${discount.value}% off`
    } else {
      return `${formatCurrency(discount.value)} off`
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{propertySettings.unitNo}</h1>
          {propertySettings.propertyName && (
            <p className="text-sm sm:text-base text-gray-600 mt-1">{propertySettings.propertyName}</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{propertySettings.address}</p>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setShowPaymentForm(true)}
          className="w-full sm:w-auto"
        >
          Submit Payment
        </Button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="text-center p-3 sm:p-4">
          <div className="text-lg sm:text-xl font-bold text-primary-600">{formatCurrency(totalDue)}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Amount Due</div>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <div className="text-lg sm:text-xl font-bold text-secondary-600">
            {nextDueDate ? format(new Date(nextDueDate), 'MMM dd') : 'N/A'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Next Due Date</div>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <div className={`text-lg sm:text-xl font-bold ${
            userPaymentStatus?.status === 'paid' ? 'text-green-600' : 
            userPaymentStatus?.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {userPaymentStatus?.status?.toUpperCase() || 'UNKNOWN'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Payment Status</div>
        </Card>
      </div>

      {/* WiFi Information */}
      {(propertySettings.wifiSSID || propertySettings.wifiPassword) && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">📶</div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">WiFi Network</h2>
          </div>
          <div className="space-y-3">
            {propertySettings.wifiSSID && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">🌐</div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Network Name (SSID)</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">{propertySettings.wifiSSID}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(propertySettings.wifiSSID || '')
                    addNotification({
                      type: 'success',
                      title: 'Copied!',
                      message: 'WiFi network name copied to clipboard'
                    })
                  }}
                  className="mt-2 sm:mt-0 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Copy
                </button>
              </div>
            )}
            {propertySettings.wifiPassword && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 glass rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-lg">🔐</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm sm:text-base font-mono font-semibold text-gray-900 break-all">
                        {showWifiPassword ? propertySettings.wifiPassword : '••••••••••••'}
                      </p>
                      <button
                        onClick={() => setShowWifiPassword(!showWifiPassword)}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        {showWifiPassword ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122a3 3 0 013.182-.162M12 12l4.242 4.242M12 12v6" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(propertySettings.wifiPassword || '')
                    addNotification({
                      type: 'success',
                      title: 'Copied!',
                      message: 'WiFi password copied to clipboard'
                    })
                  }}
                  className="mt-2 sm:mt-0 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Tap the eye icon to show/hide password. Tap "Copy" to copy credentials to your clipboard for easy WiFi setup.
            </div>
          </div>
        </Card>
      )}

      {/* Rent Details */}
      {currentTenant?.share && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-2xl">🏠</div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Rent Details</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Rent */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Monthly Rent</h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(currentTenant.share.rentAmount)}
                </p>
                {currentTenant.share.discount && currentTenant.share.discount.isActive && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <p className="text-sm text-green-600 font-medium">
                        {formatDiscountDisplay(currentTenant.share.discount)}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-700">
                      Final: {formatCurrency(getDiscountedRent())}
                    </p>
                    <p className="text-xs text-green-600">
                      Savings: {formatCurrency(currentTenant.share.rentAmount - getDiscountedRent())}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Utilities Share */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Utilities Share</h3>
              <p className="text-xl font-bold text-gray-900">
                {currentTenant.share.utilitiesPercentage}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Of total utilities costs
              </p>
            </div>
          </div>

          {/* Discount Details */}
          {currentTenant.share.discount && currentTenant.share.discount.isActive && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-lg">🎉</div>
                <h4 className="text-sm font-semibold text-green-800">Active Discount</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  <strong>Reason:</strong> {currentTenant.share.discount.reason}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-green-600">
                  <span>
                    Started: {new Date(currentTenant.share.discount.startDate).toLocaleDateString()}
                  </span>
                  {currentTenant.share.discount.endDate && (
                    <span>
                      Ends: {new Date(currentTenant.share.discount.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Recent Payment Submissions */}
      {paymentSubmissions.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Payment Submissions</h2>
          <div className="space-y-2 sm:space-y-3">
            {paymentSubmissions.slice(-5).reverse().map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 sm:p-4 glass rounded-lg">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="text-lg sm:text-xl">{getTypeIcon(submission.type)}</div>
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{submission.type}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{submission.month}</p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(submission.submissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{formatCurrency(submission.amount)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                  {submission.status === 'rejected' && submission.reviewNotes && (
                    <p className="text-xs text-red-600 mt-1 max-w-xs">
                      {submission.reviewNotes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Bills */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Current Bills</h2>
        <div className="space-y-2 sm:space-y-3">
          {userBills.filter(bill => bill.status !== 'paid').map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-3 sm:p-4 glass rounded-lg">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  bill.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900 capitalize">{bill.type}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{bill.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base font-semibold text-gray-900">{formatCurrency(bill.amount)}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Due {format(new Date(bill.dueDate), 'MMM dd')}
                </p>
              </div>
            </div>
          ))}
          {userBills.filter(bill => bill.status !== 'paid').length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p className="text-sm sm:text-base">No outstanding bills</p>
            </div>
          )}
        </div>
      </Card>

      {/* Bill History */}
      <BillHistory bills={userBills} />

      {/* Payment Submission Form */}
      {showPaymentForm && (
        <PaymentSubmissionForm
          onClose={() => setShowPaymentForm(false)}
          onSuccess={() => {
            setShowPaymentForm(false)
            refreshSubmissions()
          }}
        />
      )}
    </div>
  )
}

export default SubtenantDashboard 