'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { useOS } from '@/hooks/useOS'
import { BackgroundConfig } from '@/lib/settings'
import ImageBackground from './ImageBackground'
import MonocolorBackground from './MonocolorBackground'
import GradientBackground from './GradientBackground'
import ComponentBackground from './ComponentBackground'

export interface BackgroundProps {
  className?: string
}

const Background = memo<BackgroundProps>(({ className }) => {
  const { state } = useOS()
  // Use the new styleSettings structure, fallback to legacy backgroundConfig
  const config = state.systemSettings.styleSettings?.background || state.systemSettings.backgroundConfig as BackgroundConfig

  const renderBackground = () => {
    
    switch (config.type) {
      case 'image':
        return (
          <ImageBackground
            imageUrl={config.url}
            position={config.position}
            size={config.size as 'cover' | 'contain' | 'auto'}
            repeat={config.repeat}
          />
        )
      
      case 'monocolor':
        return (
          <MonocolorBackground
            color={config.color}
          />
        )
      
      case 'gradient':
        return (
          <GradientBackground
            direction={config.direction}
            colors={config.colors}
            stops={config.stops}
          />
        )
      
      case 'component':
        return (
          <ComponentBackground
            component={config.component}
            componentProps={config.props}
          />
        )
      
      default:
        return (
          <MonocolorBackground
            color="#000000"
          />
        )
    }
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 w-full h-full overflow-hidden",
        "pointer-events-none select-none",
        className
      )}
    >
      {renderBackground()}
    </div>
  )
})

Background.displayName = 'Background'

export default Background