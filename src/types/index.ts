export interface User {
  id: string
  name: string
  email: string
  role: 'master' | 'subtenant'
  share?: TenantShare // Optional for master tenant
}

export interface TenantDiscount {
  id: string
  type: 'percentage' | 'fixed' // percentage off or fixed amount off
  value: number // percentage (0-100) or fixed amount
  reason: string
  startDate: string
  endDate?: string // optional end date
  isActive: boolean
  appliedBy: string // master tenant ID
  appliedDate: string
}

export interface TenantShare {
  rentAmount: number // Fixed amount for rent
  utilitiesPercentage: number // Percentage of utilities (0-100)
  joinDate: string
  isActive: boolean
  discount?: TenantDiscount // Optional discount
}

export interface PropertySettings {
  unitNo: string
  address: string
  propertyName?: string
  wifiSSID?: string
  wifiPassword?: string
  updatedBy: string
  updatedDate: string
}

export interface PaymentSubmission {
  id: string
  tenantId: string
  tenantName: string
  type: 'rent' | 'electricity' | 'water' | 'internet' | 'other'
  amount: number
  month: string
  submissionDate: string
  status: 'pending' | 'approved' | 'rejected'
  proofUrl?: string // URL or base64 of receipt/proof image
  notes?: string
  reviewNotes?: string
  reviewDate?: string
}

export interface TenantManagement {
  addTenant: (tenant: Omit<User, 'id'>) => void
  removeTenant: (tenantId: string) => void
  updateTenantShare: (tenantId: string, share: TenantShare) => void
  addDiscount: (tenantId: string, discount: Omit<TenantDiscount, 'id' | 'appliedDate'>) => void
  updateDiscount: (tenantId: string, discount: TenantDiscount) => void
  removeDiscount: (tenantId: string) => void
  getTenants: () => User[]
  getTotalRentShares: () => number
  getTotalUtilitiesShares: () => number
  calculateDiscountedRent: (tenantId: string) => number
}

export interface Bill {
  id: string
  type: 'rent' | 'electricity' | 'water' | 'internet' | 'other'
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  issuedBy: string
  issuedTo: string
  month: string
  description?: string
}

export interface Settings {
  totalRent: number
  currency: {
    code: string
    symbol: string
    name: string
  }
  utilitySplit: {
    electricity: 'equal' | 'custom'
    water: 'equal' | 'custom'
    internet: 'equal' | 'custom'
  }
  reminderDay: number
  notifications: {
    webPush: boolean
    email: boolean
    ntfy: boolean
    discord: boolean
  }
}

export interface PaymentStatus {
  userId: string
  userName: string
  totalDue: number
  totalPaid: number
  status: 'paid' | 'pending' | 'overdue'
  lastPaymentDate?: string
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
} 