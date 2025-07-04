import React from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import { mockBills } from '../../data/mockData'
import Card from '../ui/Card'
import { format } from 'date-fns'

const BillSummary: React.FC = () => {
  const { formatCurrency } = useCurrency()
  
  const billsByType = mockBills.reduce((acc, bill) => {
    if (!acc[bill.type]) {
      acc[bill.type] = { total: 0, count: 0, pending: 0, paid: 0, overdue: 0 }
    }
    acc[bill.type].total += bill.amount
    acc[bill.type].count += 1
    acc[bill.type][bill.status] += 1
    return acc
  }, {} as Record<string, { total: number, count: number, pending: number, paid: number, overdue: number }>)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent':
        return '🏠'
      case 'electricity':
        return '⚡'
      case 'water':
        return '💧'
      case 'internet':
        return '🌐'
      default:
        return '📄'
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Bill Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(billsByType).map(([type, data]) => (
          <div key={type} className="glass p-3 sm:p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">{getTypeIcon(type)}</span>
                <span className="text-sm sm:text-base font-medium text-gray-900 capitalize">{type}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">{data.count} bills</span>
            </div>
            <div className="space-y-1">
              <div className="text-base sm:text-lg font-semibold text-gray-900">{formatCurrency(data.total)}</div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
                <span className="text-green-600">✓ {data.paid} paid</span>
                <span className="text-yellow-600">⏳ {data.pending} pending</span>
                {data.overdue > 0 && (
                  <span className="text-red-600">⚠ {data.overdue} overdue</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default BillSummary 