import React from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import Card from '../ui/Card'
import { Bill } from '../../types'
import { format } from 'date-fns'

interface BillHistoryProps {
  bills: Bill[]
}

const BillHistory: React.FC<BillHistoryProps> = ({ bills }) => {
  const { formatCurrency } = useCurrency()
  
  const sortedBills = [...bills].sort((a, b) => 
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  )

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

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
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
      <div className="space-y-3">
        {sortedBills.length > 0 ? (
          sortedBills.map((bill) => (
            <div key={bill.id} className="glass p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg">{getTypeIcon(bill.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">{bill.type}</h3>
                    <p className="text-sm text-gray-600">{bill.description}</p>
                    <p className="text-xs text-gray-500">{bill.month}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(bill.amount)}</div>
                  <div className="text-sm text-gray-600">
                    Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="mt-1">
                    <span className={getStatusBadge(bill.status)}>
                      {bill.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No bills found</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default BillHistory 