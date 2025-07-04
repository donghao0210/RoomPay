import React, { createContext, useContext, useState, ReactNode } from 'react'
import { mockSettings, availableCurrencies } from '../data/mockData'

interface Currency {
  code: string
  symbol: string
  name: string
}

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  availableCurrencies: Currency[]
  formatCurrency: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

interface CurrencyProviderProps {
  children: ReactNode
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(mockSettings.currency)

  const formatCurrency = (amount: number): string => {
    // Format the number with appropriate decimal places
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount)
    
    return `${currency.symbol}${formattedAmount}`
  }

  const value = {
    currency,
    setCurrency,
    availableCurrencies,
    formatCurrency
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
} 