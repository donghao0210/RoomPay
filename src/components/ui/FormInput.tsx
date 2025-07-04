import React, { forwardRef, ReactNode } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'default' | 'search'
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, leftIcon, rightIcon, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = `
      w-full px-3 py-2.5 sm:py-3 
      text-sm sm:text-base
      border rounded-lg 
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      placeholder:text-gray-400
    `
    
    const variantClasses = {
      default: `
        border-gray-300 
        focus:border-blue-500 focus:ring-blue-500/20
        hover:border-gray-400
      `,
      search: `
        border-gray-200 
        bg-gray-50
        focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white
        hover:bg-white hover:border-gray-300
      `
    }
    
    const errorClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : variantClasses[variant]
    
    const paddingClasses = `
      ${leftIcon ? 'pl-10 sm:pl-11' : ''}
      ${rightIcon ? 'pr-10 sm:pr-11' : ''}
    `
    
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput