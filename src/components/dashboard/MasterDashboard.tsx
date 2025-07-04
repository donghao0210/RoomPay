import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrency } from '../../contexts/CurrencyContext'
import { paymentSubmissionManagement, mockBills, propertySettingsManagement, tenantManagement } from '../../data/mockData'
import Card from '../ui/Card'
import Button from '../ui/Button'
import BillSummary from './BillSummary'
import PaymentStatusGrid from './PaymentStatusGrid'
import BillManagement from './BillManagement'

const MasterDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { formatCurrency } = useCurrency()
  const [showBillManagement, setShowBillManagement] = useState(false)

  // Get property settings for display
  const propertySettings = propertySettingsManagement.getSettings()

  const totalBills = mockBills.length
  const pendingBills = mockBills.filter(bill => bill.status === 'pending').length
  const overdueBills = mockBills.filter(bill => bill.status === 'overdue').length
  const totalRevenue = mockBills.reduce((sum, bill) => sum + bill.amount, 0)

  // Get pending payment submissions
  const pendingPaymentSubmissions = paymentSubmissionManagement.getPendingSubmissions()
  const pendingPaymentCount = pendingPaymentSubmissions.length

  // Get tenant information
  const activeTenants = tenantManagement.getTenants().filter(tenant => tenant.share?.isActive)
  const totalTenants = tenantManagement.getTenants().length
  const totalRentAssigned = tenantManagement.getTotalRentShares()

  const handleGenerateBills = () => {
    setShowBillManagement(true)
  }

  const handleViewPaymentReview = () => {
    navigate('/payment-review')
  }

  const handleViewTenantManagement = () => {
    navigate('/tenant-management')
  }

  if (showBillManagement) {
    return <BillManagement onClose={() => setShowBillManagement(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{propertySettings.unitNo}</h1>
          {propertySettings.propertyName && (
            <p className="text-gray-600 mt-1">{propertySettings.propertyName} • Master Dashboard</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Manage your property and tenants</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleViewPaymentReview}
            variant="secondary" 
            size="sm"
            className="relative"
          >
            Payment Review
            {pendingPaymentCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingPaymentCount}
              </span>
            )}
          </Button>
          <Button onClick={handleGenerateBills} variant="primary" size="sm">
            Manage Bills
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalBills}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Bills</div>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingBills}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Pending Bills</div>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{overdueBills}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Overdue Bills</div>
        </Card>
        <Card className="text-center p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Total Revenue</div>
        </Card>
      </div>

      {/* Pending Payment Reviews Card */}
      {pendingPaymentCount > 0 && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Pending Payment Reviews</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                You have {pendingPaymentCount} payment{pendingPaymentCount > 1 ? 's' : ''} waiting for review
              </p>
              <div className="mt-3 space-y-2">
                {pendingPaymentSubmissions.slice(0, 3).map((submission) => (
                  <div key={submission.id} className="flex items-center text-xs sm:text-sm text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    {submission.tenantName} - {submission.type} ({formatCurrency(submission.amount)})
                  </div>
                ))}
                {pendingPaymentCount > 3 && (
                  <div className="text-xs sm:text-sm text-gray-500">
                    And {pendingPaymentCount - 3} more...
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={handleViewPaymentReview}
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto"
            >
              Review Payments
            </Button>
          </div>
        </Card>
      )}

      {/* Bill Summary */}
      <BillSummary />

      {/* Payment Status Grid */}
      <PaymentStatusGrid />

      {/* Tenant Management Summary */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Tenant Management</h3>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-600">{totalTenants}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Tenants</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">{activeTenants.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-primary-600">{formatCurrency(totalRentAssigned)}</div>
                <div className="text-xs sm:text-sm text-gray-600">Rent Assigned</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Manage tenant information, rent shares, and utilities distribution
            </p>
          </div>
          <Button 
            onClick={handleViewTenantManagement}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Manage Tenants
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default MasterDashboard 