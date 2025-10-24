'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

export interface GradientBackgroundProps {
  type?: 'linear' | 'radial' | 'conic'
  direction?: string
  colors?: string[]
  stops?: number[]
  className?: string
}

const GradientBackground = memo<GradientBackgroundProps>(({
  type = 'linear',
  direction = 'to bottom right',
  colors = ['#3b82f6', '#8b5cf6'],
  stops,
  className
}) => {
  const generateGradient = () => {
    let gradientColors: string[]
    
    if (stops && stops.length === colors.length) {
      gradientColors = colors.map((color, index) => `${color} ${stops[index]}%`)
    } else {
      gradientColors = colors
    }
    
    const colorString = gradientColors.join(', ')
    
    switch (type) {
      case 'linear':
        return `linear-gradient(${direction}, ${colorString})`
      
      case 'radial':
        return `radial-gradient(${direction || 'circle at center'}, ${colorString})`
      
      case 'conic':
        return `conic-gradient(${direction || 'from 0deg at center'}, ${colorString})`
      
      default:
        return `linear-gradient(${direction}, ${colorString})`
    }
  }

  return (
    <div 
      className={cn(
        "w-full h-full",
        "transition-all duration-500 ease-in-out",
        className
      )}
      style={{ 
        background: generateGradient()
      }}
    />
  )
})

GradientBackground.displayName = 'GradientBackground'

export default GradientBackground