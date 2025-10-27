'use client'

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageCarouselProps {
  isOpen: boolean
  onClose: () => void
  images: Array<{
    id: string
    img: string
    url: string
    height: number
    name?: string
  }>
  currentImageIndex: number
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  isOpen,
  onClose,
  images,
  currentImageIndex
}) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (api && isOpen) {
      api.scrollTo(currentImageIndex)
    }
  }, [api, currentImageIndex, isOpen])

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[current - 1] || images[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70vw] flex flex-col w-[70vw] h-[90vh] p-0 bg-background/95 border-none z-[15000]">
        <div className='flex h-[10%] p-4'>
          <DialogTitle className="text-white text-2xl font-bold">
            {currentImage.name || `Image ${current}`}
          </DialogTitle>
        </div>
        


        <div className="flex flex-col h-[90%] w-full justify-center items-center">
          
          {/* Thumbnail navigation */}
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  current - 1 === index
                    ? 'border-white shadow-lg'
                    : 'border-white/30 hover:border-white/60'
                )}
              >
                <Image
                  src={image.img}
                  width={100}
                  height={100}
                  alt={image.name || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Main carousel area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <Carousel
              setApi={setApi}
              className="w-full max-w-5xl"
              opts={{
                align: 'center',
                loop: true,
                startIndex: currentImageIndex
              }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image.id} className="basis-full">
                    <div className="flex items-center justify-center h-full">
                      <Image
                        width={100}
                        height={100}
                        src={image.img}
                        alt={image.name || `Image ${index + 1}`}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 border-white/20 text-white hover:bg-black/70" />
              <CarouselNext className="right-4 bg-black/50 border-white/20 text-white hover:bg-black/70" />
            </Carousel>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCarousel