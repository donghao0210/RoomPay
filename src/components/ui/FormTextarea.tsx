import React, { forwardRef } from 'react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ error, resize = 'vertical', className = '', ...props }, ref) => {
    const baseClasses = `
      w-full px-3 py-2.5 sm:py-3 
      text-sm sm:text-base
      border rounded-lg 
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      placeholder:text-gray-400
      min-h-[80px]
    `
    
    const errorClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400'
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }
    
    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${resizeClasses[resize]} ${className}`}
        {...props}
      />
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea