'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

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

  const currentImage = images[current - 1]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
        <DialogHeader className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full">
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
                      <img
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

          {/* Image info and navigation */}
          <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 p-6">
            <div className="max-w-5xl mx-auto">
              {/* Image title and counter */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-white">
                  <h3 className="text-lg font-semibold">
                    {currentImage?.name || `Image ${current}`}
                  </h3>
                  <p className="text-sm text-white/70">
                    {current} of {count}
                  </p>
                </div>
              </div>

              {/* Thumbnail navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
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
                    <img
                      src={image.img}
                      alt={image.name || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCarousel