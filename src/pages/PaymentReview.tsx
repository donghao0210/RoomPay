import React from 'react'
import PaymentReviewPanel from '../components/dashboard/PaymentReviewPanel'

const PaymentReview: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Review</h1>
        <p className="text-gray-600 mt-2">Review and manage tenant payment submissions</p>
      </div>
      <PaymentReviewPanel />
    </div>
  )
}

export default PaymentReview 