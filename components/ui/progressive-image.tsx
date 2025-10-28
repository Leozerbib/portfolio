'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ProgressiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  quality?: number
}

// Generate a simple blur placeholder
const generateBlurDataURL = (width: number = 10, height: number = 6): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return ''
  
  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(0.5, '#e5e7eb')
  gradient.addColorStop(1, '#d1d5db')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', 0.1)
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  sizes,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  quality = 85,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [blurData, setBlurData] = useState<string>('')
  const imageRef = useRef<HTMLImageElement>(null)

  // Generate blur placeholder on mount
  useEffect(() => {
    if (placeholder === 'blur' && !blurDataURL) {
      try {
        const blur = generateBlurDataURL(width || 10, height || 6)
        setBlurData(blur)
      } catch (error) {
        console.warn('Failed to generate blur placeholder:', error)
      }
    }
  }, [placeholder, blurDataURL, width, height])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }, [onError])

  const finalBlurDataURL = blurDataURL || blurData

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center">
          <div className="text-xs opacity-60">Failed to load</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden h-full", className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton 
          className={cn(
            "absolute inset-0 z-10",
            fill ? "w-full h-full" : ""
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}
      
      {/* Main image */}
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder === 'blur' && finalBlurDataURL ? 'blur' : 'empty'}
        blurDataURL={finalBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  )
}

export default ProgressiveImage