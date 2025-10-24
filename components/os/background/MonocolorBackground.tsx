'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

export interface MonocolorBackgroundProps {
  color?: string
  className?: string
}

const MonocolorBackground = memo<MonocolorBackgroundProps>(({
  color = '#000000',
  className
}) => {
  return (
    <div 
      className={cn(
        "w-full h-full",
        "transition-colors duration-500 ease-in-out",
        className
      )}
      style={{ backgroundColor: color }}
    />
  )
})

MonocolorBackground.displayName = 'MonocolorBackground'

export default MonocolorBackground