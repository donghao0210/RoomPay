import React, { ReactNode } from 'react'

interface FormContainerProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  children, 
  title, 
  subtitle, 
  className = '',
  maxWidth = 'lg'
}) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-lg'
      case 'xl': return 'max-w-xl'
      case 'full': return 'max-w-full'
      default: return 'max-w-lg'
    }
  }

  return (
    <div className={`w-full ${getMaxWidthClass()} mx-auto ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6 text-center sm:text-left">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}

export default FormContainer