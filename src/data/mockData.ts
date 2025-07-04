import { User, Bill, Settings, PaymentStatus, TenantShare, TenantDiscount, TenantManagement, PaymentSubmission, PropertySettings } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Master Tenant',
    email: 'master@example.com',
    role: 'master'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'subtenant',
    share: {
      rentAmount: 751,
      utilitiesPercentage: 25,
      joinDate: '2024-01-15',
      isActive: true,
      discount: {
        id: 'd1',
        type: 'percentage',
        value: 10,
        reason: 'Long-term tenant loyalty discount',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        isActive: true,
        appliedBy: '1',
        appliedDate: '2024-12-15'
      }
    }
  },
  {
    id: '3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'subtenant',
    share: {
      rentAmount: 483,
      utilitiesPercentage: 25,
      joinDate: '2024-02-01',
      isActive: true,
      discount: {
        id: 'd2',
        type: 'fixed',
        value: 50,
        reason: 'Maintenance help contribution',
        startDate: '2025-01-01',
        isActive: true,
        appliedBy: '1',
        appliedDate: '2024-12-20'
      }
    }
  },
  {
    id: '4',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'subtenant',
    share: {
      rentAmount: 483,
      utilitiesPercentage: 30,
      joinDate: '2024-03-01',
      isActive: true
    }
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'subtenant',
    share: {
      rentAmount: 483,
      utilitiesPercentage: 20,
      joinDate: '2024-04-01',
      isActive: true
    }
  }
]

export const mockBills: Bill[] = [
  {
    id: 'b1',
    type: 'rent',
    amount: 300,
    dueDate: '2025-02-10',
    status: 'pending',
    issuedBy: '1',
    issuedTo: '2',
    month: 'February 2025',
    description: 'Monthly rent payment'
  },
  {
    id: 'b2',
    type: 'electricity',
    amount: 25,
    dueDate: '2025-02-10',
    status: 'pending',
    issuedBy: '1',
    issuedTo: '2',
    month: 'February 2025',
    description: 'Electricity bill share'
  },
  {
    id: 'b3',
    type: 'water',
    amount: 12.5,
    dueDate: '2025-02-10',
    status: 'paid',
    issuedBy: '1',
    issuedTo: '3',
    month: 'February 2025',
    description: 'Water bill share'
  },
  {
    id: 'b4',
    type: 'internet',
    amount: 15,
    dueDate: '2025-02-10',
    status: 'overdue',
    issuedBy: '1',
    issuedTo: '4',
    month: 'January 2025',
    description: 'Internet bill share'
  }
]

export const mockSettings: Settings = {
  totalRent: 2200,
  currency: {
    code: 'MYR',
    symbol: 'RM',
    name: 'Malaysian Ringgit'
  },
  utilitySplit: {
    electricity: 'equal',
    water: 'equal',
    internet: 'equal'
  },
  reminderDay: 1,
  notifications: {
    webPush: true,
    email: true,
    ntfy: false,
    discord: false
  }
}

// Available currencies for selection
export const availableCurrencies = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
]

export const mockPaymentStatuses: PaymentStatus[] = [
  {
    userId: '2',
    userName: 'Alice Johnson',
    totalDue: 325,
    totalPaid: 300,
    status: 'pending',
    lastPaymentDate: '2025-01-15'
  },
  {
    userId: '3',
    userName: 'Bob Smith',
    totalDue: 312.5,
    totalPaid: 312.5,
    status: 'paid',
    lastPaymentDate: '2025-02-05'
  },
  {
    userId: '4',
    userName: 'Carol Davis',
    totalDue: 315,
    totalPaid: 200,
    status: 'overdue',
    lastPaymentDate: '2024-12-20'
  },
  {
    userId: '5',
    userName: 'David Wilson',
    totalDue: 315,
    totalPaid: 315,
    status: 'paid',
    lastPaymentDate: '2025-02-03'
  }
]

// Tenant management functions
export const tenantManagement: TenantManagement = {
  addTenant: (tenant: Omit<User, 'id'>) => {
    const newId = (Math.max(...mockUsers.map(u => parseInt(u.id))) + 1).toString()
    const newTenant: User = {
      ...tenant,
      id: newId,
      share: tenant.share || {
        rentAmount: 0,
        utilitiesPercentage: 0,
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true
      }
    }
    mockUsers.push(newTenant)
  },
  
  removeTenant: (tenantId: string) => {
    const index = mockUsers.findIndex(u => u.id === tenantId)
    if (index > -1 && mockUsers[index].role === 'subtenant') {
      mockUsers.splice(index, 1)
    }
  },
  
  updateTenantShare: (tenantId: string, share: TenantShare) => {
    const tenant = mockUsers.find(u => u.id === tenantId)
    if (tenant && tenant.role === 'subtenant') {
      tenant.share = share
    }
  },
  
  getTenants: () => {
    return mockUsers.filter(u => u.role === 'subtenant')
  },
  
  getTotalRentShares: () => {
    return mockUsers
      .filter(u => u.role === 'subtenant' && u.share?.isActive)
      .reduce((total, u) => total + (u.share?.rentAmount || 0), 0)
  },

  getTotalUtilitiesShares: () => {
    return mockUsers
      .filter(u => u.role === 'subtenant' && u.share?.isActive)
      .reduce((total, u) => total + (u.share?.utilitiesPercentage || 0), 0)
  },

  addDiscount: (tenantId: string, discount: Omit<TenantDiscount, 'id' | 'appliedDate'>) => {
    const tenant = mockUsers.find(u => u.id === tenantId)
    if (tenant && tenant.role === 'subtenant' && tenant.share) {
      const newDiscount: TenantDiscount = {
        ...discount,
        id: 'd' + Date.now(),
        appliedDate: new Date().toISOString().split('T')[0]
      }
      tenant.share.discount = newDiscount
    }
  },

  updateDiscount: (tenantId: string, discount: TenantDiscount) => {
    const tenant = mockUsers.find(u => u.id === tenantId)
    if (tenant && tenant.role === 'subtenant' && tenant.share) {
      tenant.share.discount = discount
    }
  },

  removeDiscount: (tenantId: string) => {
    const tenant = mockUsers.find(u => u.id === tenantId)
    if (tenant && tenant.role === 'subtenant' && tenant.share) {
      delete tenant.share.discount
    }
  },

  calculateDiscountedRent: (tenantId: string) => {
    const tenant = mockUsers.find(u => u.id === tenantId)
    if (!tenant || !tenant.share || !tenant.share.discount || !tenant.share.discount.isActive) {
      return tenant?.share?.rentAmount || 0
    }

    const { rentAmount, discount } = tenant.share
    if (discount.type === 'percentage') {
      return rentAmount * (1 - discount.value / 100)
    } else {
      return Math.max(0, rentAmount - discount.value)
    }
  }
}

// Mock payment submissions
export const mockPaymentSubmissions: PaymentSubmission[] = [
  {
    id: 'ps1',
    tenantId: '2',
    tenantName: 'Alice Johnson',
    type: 'rent',
    amount: 400,
    month: 'February 2025',
    submissionDate: '2025-02-05',
    status: 'pending',
    notes: 'Monthly rent payment - bank transfer completed',
    proofUrl: 'https://via.placeholder.com/300x200/4ade80/ffffff?text=Bank+Transfer+Receipt'
  },
  {
    id: 'ps2',
    tenantId: '3',
    tenantName: 'Bob Smith',
    type: 'electricity',
    amount: 45,
    month: 'February 2025',
    submissionDate: '2025-02-03',
    status: 'approved',
    notes: 'Electricity bill payment via online banking',
    reviewNotes: 'Payment verified and approved',
    reviewDate: '2025-02-04',
    proofUrl: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Online+Banking+Receipt'
  },
  {
    id: 'ps3',
    tenantId: '4',
    tenantName: 'Carol Davis',
    type: 'water',
    amount: 25,
    month: 'January 2025',
    submissionDate: '2025-01-28',
    status: 'rejected',
    notes: 'Water bill payment - cash payment',
    reviewNotes: 'Receipt not clear, please resubmit with better quality image',
    reviewDate: '2025-01-30'
  },
  {
    id: 'ps4',
    tenantId: '5',
    tenantName: 'David Wilson',
    type: 'internet',
    amount: 20,
    month: 'February 2025',
    submissionDate: '2025-02-06',
    status: 'pending',
    notes: 'Internet bill - paid via mobile banking',
    proofUrl: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Mobile+Banking+Receipt'
  }
]

// Payment submission management functions
export const paymentSubmissionManagement = {
  getSubmissions: () => mockPaymentSubmissions,
  
  getSubmissionsByTenant: (tenantId: string) => {
    return mockPaymentSubmissions.filter(sub => sub.tenantId === tenantId)
  },
  
  getPendingSubmissions: () => {
    return mockPaymentSubmissions.filter(sub => sub.status === 'pending')
  },
  
  addSubmission: (submission: Omit<PaymentSubmission, 'id' | 'submissionDate'>) => {
    const newSubmission: PaymentSubmission = {
      ...submission,
      id: 'ps' + (mockPaymentSubmissions.length + 1),
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    mockPaymentSubmissions.push(newSubmission)
    return newSubmission
  },
  
  approveSubmission: (submissionId: string, reviewNotes?: string) => {
    const submission = mockPaymentSubmissions.find(sub => sub.id === submissionId)
    if (submission) {
      submission.status = 'approved'
      submission.reviewNotes = reviewNotes
      submission.reviewDate = new Date().toISOString().split('T')[0]
    }
  },
  
  rejectSubmission: (submissionId: string, reviewNotes: string) => {
    const submission = mockPaymentSubmissions.find(sub => sub.id === submissionId)
    if (submission) {
      submission.status = 'rejected'
      submission.reviewNotes = reviewNotes
      submission.reviewDate = new Date().toISOString().split('T')[0]
    }
  }
}

// Mock property settings
export const mockPropertySettings: PropertySettings = {
  unitNo: 'Unit A-01-09',
  address: 'Jalan Pipit 4, 47170 Puchong, Selangor, Malaysia',
  propertyName: 'Zefer Hill Residence',
  wifiSSID: 'ZeferHill_A01-09',
  wifiPassword: 'Welcome2025!',
  updatedBy: '1', // master tenant ID
  updatedDate: '2025-01-15'
}

// Property settings management
export const propertySettingsManagement = {
  getSettings: () => mockPropertySettings,
  
  updateSettings: (settings: Omit<PropertySettings, 'updatedDate'>) => {
    Object.assign(mockPropertySettings, {
      ...settings,
      updatedDate: new Date().toISOString().split('T')[0]
    })
    return mockPropertySettings
  }
}

// Bill management functions
export const billManagement = {
  getBills: () => mockBills,
  
  getBillsByMonth: (month: string) => {
    return mockBills.filter(bill => bill.month === month)
  },
  
  getBillsByTenant: (tenantId: string) => {
    return mockBills.filter(bill => bill.issuedTo === tenantId)
  },
  
  getBillsByStatus: (status: string) => {
    return mockBills.filter(bill => bill.status === status)
  },
  
  addBill: (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: 'b' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
    }
    mockBills.push(newBill)
    return newBill
  },
  
  updateBill: (billId: string, updates: Partial<Bill>) => {
    const index = mockBills.findIndex(bill => bill.id === billId)
    if (index > -1) {
      mockBills[index] = { ...mockBills[index], ...updates }
      return mockBills[index]
    }
    return null
  },
  
  deleteBill: (billId: string) => {
    const index = mockBills.findIndex(bill => bill.id === billId)
    if (index > -1) {
      return mockBills.splice(index, 1)[0]
    }
    return null
  },
  
  generateBillsForMonth: (month: string, utilityAmounts: { electricity: number, water: number, internet: number }) => {
    const tenants = tenantManagement.getTenants().filter(t => t.share?.isActive)
    const newBills: Bill[] = []
    
    tenants.forEach(tenant => {
      if (!tenant.share) return
      
      // Generate rent bill
      const discountedRent = tenantManagement.calculateDiscountedRent(tenant.id)
      newBills.push({
        id: `b${Date.now()}_${tenant.id}_rent`,
        type: 'rent',
        amount: discountedRent,
        dueDate: new Date(month + '-10').toISOString().split('T')[0],
        status: 'pending',
        issuedBy: '1',
        issuedTo: tenant.id,
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        description: `Monthly rent payment${tenant.share.discount ? ' (with discount)' : ''}`
      })
      
      // Generate utility bills
      const utilitiesShare = tenant.share.utilitiesPercentage / 100
      
      if (utilityAmounts.electricity > 0) {
        newBills.push({
          id: `b${Date.now()}_${tenant.id}_electricity`,
          type: 'electricity',
          amount: Math.round(utilityAmounts.electricity * utilitiesShare * 100) / 100,
          dueDate: new Date(month + '-10').toISOString().split('T')[0],
          status: 'pending',
          issuedBy: '1',
          issuedTo: tenant.id,
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          description: `Electricity bill share (${tenant.share.utilitiesPercentage}%)`
        })
      }
      
      if (utilityAmounts.water > 0) {
        newBills.push({
          id: `b${Date.now()}_${tenant.id}_water`,
          type: 'water',
          amount: Math.round(utilityAmounts.water * utilitiesShare * 100) / 100,
          dueDate: new Date(month + '-10').toISOString().split('T')[0],
          status: 'pending',
          issuedBy: '1',
          issuedTo: tenant.id,
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          description: `Water bill share (${tenant.share.utilitiesPercentage}%)`
        })
      }
      
      if (utilityAmounts.internet > 0) {
        newBills.push({
          id: `b${Date.now()}_${tenant.id}_internet`,
          type: 'internet',
          amount: Math.round(utilityAmounts.internet * utilitiesShare * 100) / 100,
          dueDate: new Date(month + '-10').toISOString().split('T')[0],
          status: 'pending',
          issuedBy: '1',
          issuedTo: tenant.id,
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          description: `Internet bill share (${tenant.share.utilitiesPercentage}%)`
        })
      }
    })
    
    mockBills.push(...newBills)
    return newBills
  }
} 