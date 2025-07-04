import React, { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface FormFieldProps {
  label?: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  children, 
  error, 
  hint, 
  required = false,
  className = '' 
}) => {
  return (
    <div className={`space-y-1.5 sm:space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-xs sm:text-sm text-red-600">
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="text-xs sm:text-sm text-gray-500">{hint}</p>
      )}
    </div>
  )
}

export default FormField