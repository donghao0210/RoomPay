import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animate?: boolean
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  animate = true 
}) => {
  const cardContent = (
    <div className={`glass-card p-6 ${hover ? 'hover:shadow-glass-lg' : ''} ${className}`}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -2 } : {}}
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
}

export default Card 