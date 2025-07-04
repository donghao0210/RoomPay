import React, { useState } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { mockBills, tenantManagement, billManagement } from '../../data/mockData'
import { Bill } from '../../types'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import FormField from '../ui/FormField'
import FormInput from '../ui/FormInput'
import FormSelect from '../ui/FormSelect'
import FormTextarea from '../ui/FormTextarea'
import { 
  Home, 
  Zap, 
  Droplets, 
  Wifi, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Calendar,
  Coins,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator
} from 'lucide-react'

interface BillManagementProps {
  onClose: () => void
}

const BillManagement: React.FC<BillManagementProps> = ({ onClose }) => {
  const { formatCurrency } = useCurrency()
  const { addNotification } = useNotifications()
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [utilityAmounts, setUtilityAmounts] = useState({
    electricity: '',
    water: '',
    internet: ''
  })

  const getBillIcon = (type: string) => {
    switch (type) {
      case 'rent': return <Home className="w-4 h-4" />
      case 'electricity': return <Zap className="w-4 h-4" />
      case 'water': return <Droplets className="w-4 h-4" />
      case 'internet': return <Wifi className="w-4 h-4" />
      default: return <Coins className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const generateBillsForMonth = () => {
    const numericUtilityAmounts = {
      electricity: parseFloat(utilityAmounts.electricity) || 0,
      water: parseFloat(utilityAmounts.water) || 0,
      internet: parseFloat(utilityAmounts.internet) || 0
    }
    
    const newBills = billManagement.generateBillsForMonth(selectedMonth, numericUtilityAmounts)
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    setShowGenerateModal(false)
    setUtilityAmounts({ electricity: '', water: '', internet: '' })
    addNotification({
      type: 'success',
      title: 'Bills Generated',
      message: `Generated ${newBills.length} bills for ${monthName}`
    })
  }

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill)
    setShowEditModal(true)
  }

  const handleDeleteBill = (billId: string) => {
    const deletedBill = billManagement.deleteBill(billId)
    if (deletedBill) {
      addNotification({
        type: 'success',
        title: 'Bill Deleted',
        message: 'Bill has been successfully deleted'
      })
    }
  }

  const handleUpdateBill = (updatedBill: Bill) => {
    const updated = billManagement.updateBill(updatedBill.id, updatedBill)
    if (updated) {
      setShowEditModal(false)
      setSelectedBill(null)
      addNotification({
        type: 'success',
        title: 'Bill Updated',
        message: 'Bill has been successfully updated'
      })
    }
  }

  const tenants = tenantManagement.getTenants()
  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant?.name || 'Unknown Tenant'
  }

  const billsByMonth = mockBills.reduce((acc, bill) => {
    const month = bill.month || 'Unknown Month'
    if (!acc[month]) acc[month] = []
    acc[month].push(bill)
    return acc
  }, {} as Record<string, Bill[]>)

  const months = Object.keys(billsByMonth).sort().reverse()

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bill Management</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Generate and manage bills for all tenants</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button 
              onClick={() => setShowGenerateModal(true)}
              variant="primary"
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Generate Bills
            </Button>
            <Button 
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{mockBills.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Bills</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {mockBills.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {mockBills.filter(b => b.status === 'paid').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Paid</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  {mockBills.filter(b => b.status === 'overdue').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bills by Month */}
        <div className="space-y-4 sm:space-y-6">
          {months.map(month => (
            <Card key={month} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{month}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    {billsByMonth[month].length} bills
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(billsByMonth[month].reduce((sum, bill) => sum + bill.amount, 0))}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {billsByMonth[month].map(bill => (
                  <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    {/* Mobile: Stack vertically */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getBillIcon(bill.type)}
                        <span className="font-medium text-gray-900 capitalize">{bill.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{getTenantName(bill.issuedTo)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Mobile: Stack amount and actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                      <div className="text-left sm:text-right">
                        <div className="font-semibold text-gray-900">{formatCurrency(bill.amount)}</div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bill.status)}`}>
                          {getStatusIcon(bill.status)}
                          <span className="capitalize">{bill.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditBill(bill)}
                          className="p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBill(bill.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {mockBills.length === 0 && (
          <Card className="p-6 sm:p-8 text-center">
            <Calculator className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Bills Generated</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Generate your first set of bills to get started with bill management.
            </p>
            <Button 
              onClick={() => setShowGenerateModal(true)}
              variant="primary"
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Generate Bills
            </Button>
          </Card>
        )}
      </div>

      {/* Generate Bills Modal */}
      <Modal 
        isOpen={showGenerateModal} 
        onClose={() => {
          setShowGenerateModal(false)
          setUtilityAmounts({ electricity: '', water: '', internet: '' })
        }}
        title="Generate Bills"
        size="lg"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Month Selection */}
          <FormField 
            label="Billing Period" 
            hint="Select the month for which you want to generate bills"
            required
          >
            <FormInput
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </FormField>
          
          {/* Utility Bills Section */}
          <div>
            <div className="mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Utility Bills</h3>
              <p className="text-xs sm:text-sm text-gray-600">Enter total amounts to split among tenants</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <FormField 
                label="Electricity" 
                hint="Total amount"
              >
                <FormInput
                  type="number"
                  step="0.01"
                  value={utilityAmounts.electricity}
                  onChange={(e) => setUtilityAmounts(prev => ({ ...prev, electricity: e.target.value }))}
                  placeholder="0.00"
                  leftIcon={<Zap className="w-4 h-4" />}
                />
              </FormField>
              
              <FormField 
                label="Water" 
                hint="Total amount"
              >
                <FormInput
                  type="number"
                  step="0.01"
                  value={utilityAmounts.water}
                  onChange={(e) => setUtilityAmounts(prev => ({ ...prev, water: e.target.value }))}
                  placeholder="0.00"
                  leftIcon={<Droplets className="w-4 h-4" />}
                />
              </FormField>
              
              <FormField 
                label="Internet" 
                hint="Total amount"
              >
                <FormInput
                  type="number"
                  step="0.01"
                  value={utilityAmounts.internet}
                  onChange={(e) => setUtilityAmounts(prev => ({ ...prev, internet: e.target.value }))}
                  placeholder="0.00"
                  leftIcon={<Wifi className="w-4 h-4" />}
                />
              </FormField>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <h4 className="text-sm sm:text-base font-semibold text-blue-900">Preview</h4>
            </div>
            <div className="space-y-2 sm:space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Active Tenants:</span>
                <span className="font-medium text-blue-900">
                  {tenantManagement.getTenants().filter(t => t.share?.isActive).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Billing Month:</span>
                <span className="font-medium text-blue-900">
                  {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Due Date:</span>
                <span className="font-medium text-blue-900">
                  {new Date(selectedMonth + '-10').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-1 sm:pt-2">
            <Button 
              onClick={() => {
                setShowGenerateModal(false)
                setUtilityAmounts({ electricity: '', water: '', internet: '' })
              }}
              variant="secondary"
              className="w-full sm:w-auto"
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={generateBillsForMonth}
              variant="primary"
              className="w-full sm:w-auto"
              size="sm"
            >
              Generate Bills
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Bill Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Bill"
        size="md"
      >
        {selectedBill && (
          <div className="space-y-6">
            {/* Bill Details Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Bill Details</h3>
                <p className="text-sm text-gray-600">Update the bill information as needed</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Bill Type" required>
                  <FormSelect
                    value={selectedBill.type}
                    onChange={(e) => setSelectedBill(prev => prev ? { ...prev, type: e.target.value as Bill['type'] } : null)}
                    options={[
                      { value: 'rent', label: 'Rent' },
                      { value: 'electricity', label: 'Electricity' },
                      { value: 'water', label: 'Water' },
                      { value: 'internet', label: 'Internet' }
                    ]}
                  />
                </FormField>
                
                <FormField label="Amount" required>
                  <FormInput
                    type="number"
                    step="0.01"
                    value={selectedBill.amount}
                    onChange={(e) => setSelectedBill(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)}
                    leftIcon={<Coins className="w-4 h-4" />}
                    placeholder="0.00"
                  />
                </FormField>
              </div>
            </div>
            
            {/* Bill Status Section */}
            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Bill Status</h3>
                <p className="text-sm text-gray-600">Set the due date and payment status</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Due Date" required>
                  <FormInput
                    type="date"
                    value={selectedBill.dueDate}
                    onChange={(e) => setSelectedBill(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </FormField>
                
                <FormField label="Payment Status" required>
                  <FormSelect
                    value={selectedBill.status}
                    onChange={(e) => setSelectedBill(prev => prev ? { ...prev, status: e.target.value as Bill['status'] } : null)}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'paid', label: 'Paid' },
                      { value: 'overdue', label: 'Overdue' }
                    ]}
                  />
                </FormField>
              </div>
            </div>
            
            {/* Description Section */}
            <FormField 
              label="Description" 
              hint="Optional notes about this bill"
            >
              <FormTextarea
                value={selectedBill.description}
                onChange={(e) => setSelectedBill(prev => prev ? { ...prev, description: e.target.value } : null)}
                rows={3}
                placeholder="Add any additional notes about this bill..."
                resize="none"
              />
            </FormField>
            
            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button 
                onClick={() => setShowEditModal(false)}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateBill(selectedBill)}
                variant="primary"
                className="w-full sm:w-auto"
              >
                Update Bill
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default BillManagement