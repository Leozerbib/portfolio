'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface ImageBackgroundProps {
  imageUrl?: string
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  size?: 'cover' | 'contain' | 'auto'
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  className?: string
}

const ImageBackground = memo<ImageBackgroundProps>(({
  imageUrl = '',
  position = 'center',
  size = 'cover',
  repeat = 'no-repeat',
  className
}) => {

  return (
    <Image
      height={2000}
      width={2000}
      alt='Background image'
      src={imageUrl}
      className={cn( "w-full h-full flex items-center justify-center", position, size, repeat, className)}  
    />
  )
})

ImageBackground.displayName = 'ImageBackground'

export default ImageBackground