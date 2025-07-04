import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  placeholder?: string
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ error, placeholder, options, className = '', children, ...props }, ref) => {
    const baseClasses = `
      w-full px-3 py-2.5 sm:py-3 
      text-sm sm:text-base
      border rounded-lg 
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      bg-white
      appearance-none
      pr-10
    `
    
    const errorClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400'
    
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options ? (
            options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

export default FormSelect