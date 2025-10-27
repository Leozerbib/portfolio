'use client'

import { memo, lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'

export interface ComponentBackgroundProps {
  component?: React.ReactNode | (() => React.ReactNode) | string
  componentProps?: Record<string, any>
  className?: string
}

// Dynamic imports for native background components
const nativeComponents = {
  Aurora: lazy(() => import('./native/Aurora')),
  Dither: lazy(() => import('./native/Dither')),
  DotGrid: lazy(() => import('./native/DotGrid')),
  FaultyTerminal: lazy(() => import('./native/FaultyTerminal')),
  Iridescence: lazy(() => import('./native/Iridescence')),
  Particles: lazy(() => import('./native/Particles')),
  PixelBlast: lazy(() => import('./native/PixelBlast')),
  Plasma: lazy(() => import('./native/Plasma')),
  Silk: lazy(() => import('./native/Silk')),
  Threads: lazy(() => import('./native/Threads'))
}

type NativeComponentName = keyof typeof nativeComponents

const ComponentBackground = memo<ComponentBackgroundProps>(({
  component = 'Aurora',
  componentProps = {},
  className
}) => {
  // If component is a string (componentName), handle it
  if (typeof component === 'string') {
    const Component = nativeComponents[component as NativeComponentName]
    
    if (!Component) {
      console.warn(`Background component "${component}" not found. Available components:`, Object.keys(nativeComponents))
      return (
        <div 
          className={cn(
            "w-full h-full bg-black",
            "flex items-center justify-center text-white/50",
            className
          )}
        >
          Component &quot;{component}&quot; not found
        </div>
      )
    }

    return (
      <div 
        className={cn(
          "w-full h-full",
          className
        )}
      >
        <Suspense 
          fallback={
            <div className="w-full h-full bg-black animate-pulse" />
          }
        >
          <Component {...componentProps} />
        </Suspense>
      </div>
    )
  }

  // If component is a React component or function
  if (component) {
    const ComponentToRender = typeof component === 'function' ? component() : component
    
    return (
      <div 
        className={cn(
          "w-full h-full",
          className
        )}
      >
        {ComponentToRender}
      </div>
    )
  }

  // Default fallback to Aurora
  const DefaultComponent = nativeComponents.Aurora
  
  return (
    <div 
      className={cn(
        "w-full h-full",
        className
      )}
    >
      <Suspense 
        fallback={
          <div className="w-full h-full bg-black animate-pulse" />
        }
      >
        <DefaultComponent {...componentProps} />
      </Suspense>
    </div>
  )
})

ComponentBackground.displayName = 'ComponentBackground'

export default ComponentBackground