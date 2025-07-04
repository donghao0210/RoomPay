import React from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import { mockPaymentStatuses } from '../../data/mockData'
import Card from '../ui/Card'
import { format } from 'date-fns'

const PaymentStatusGrid: React.FC = () => {
  const { formatCurrency } = useCurrency()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return '✅'
      case 'overdue':
        return '❌'
      default:
        return '⏳'
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tenant Payment Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {mockPaymentStatuses.map((status) => (
          <div key={status.userId} className="glass p-3 sm:p-4 rounded-lg">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-900">{status.userName}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Tenant ID: {status.userId}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.status)}`}>
                {getStatusIcon(status.status)} {status.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Total Due:</span>
                <span className="font-medium">{formatCurrency(status.totalDue)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Paid:</span>
                <span className="font-medium text-green-600">{formatCurrency(status.totalPaid)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Outstanding:</span>
                <span className={`font-medium ${
                  status.totalDue - status.totalPaid > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(status.totalDue - status.totalPaid)}
                </span>
              </div>
              {status.lastPaymentDate && (
                <div className="text-xs text-gray-500 mt-2">
                  Last payment: {format(new Date(status.lastPaymentDate), 'MMM dd, yyyy')}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-2 sm:mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div 
                  className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((status.totalPaid / status.totalDue) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((status.totalPaid / status.totalDue) * 100)}% paid
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default PaymentStatusGrid 