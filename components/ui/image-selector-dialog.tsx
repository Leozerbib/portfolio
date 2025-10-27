"use client"

import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ImageIcon, CheckIcon } from "lucide-react"
import Image from "next/image"

interface ImageSelectorDialogProps {
  children: React.ReactNode
  selectedImage?: string
  onImageSelect: (imageUrl: string) => void
  title?: string
  description?: string
}

// Available background images
const BACKGROUND_IMAGES = [
  { url: '/image_os/background/BG (1).WEBP', name: 'Background 1' },
  { url: '/image_os/background/BG (2).WEBP', name: 'Background 2' },
  { url: '/image_os/background/BG (3).WEBP', name: 'Background 3' },
  { url: '/image_os/background/BG (4).WEBP', name: 'Background 4' },
  { url: '/image_os/background/BG (5).WEBP', name: 'Background 5' },
  { url: '/image_os/background/BG (6).WEBP', name: 'Background 6' },
  { url: '/image_os/background/BG (7).WEBP', name: 'Background 7' },
  { url: '/image_os/background/BG (8).WEBP', name: 'Background 8' },
  { url: '/image_os/background/BG (9).WEBP', name: 'Background 9' },
  { url: '/image_os/background/BG (10).WEBP', name: 'Background 10' },
]

export function ImageSelectorDialog({
  children,
  selectedImage,
  onImageSelect,
  title = "Select Background Image",
  description = "Choose from our collection of beautiful background images"
}: ImageSelectorDialogProps) {
  const [open, setOpen] = useState(false)
  const [tempSelectedImage, setTempSelectedImage] = useState<string>(selectedImage || '')

  const handleImageClick = useCallback((imageUrl: string) => {
    setTempSelectedImage(imageUrl)
  }, [])

  const handleConfirm = useCallback(() => {
    if (tempSelectedImage) {
      onImageSelect(tempSelectedImage)
    }
    setOpen(false)
  }, [tempSelectedImage, onImageSelect])

  const handleCancel = useCallback(() => {
    setTempSelectedImage(selectedImage || '')
    setOpen(false)
  }, [selectedImage])

  // Reset temp selection when dialog opens
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      setTempSelectedImage(selectedImage || '')
    }
    setOpen(newOpen)
  }, [selectedImage])

  const selectedImageData = useMemo(() => {
    return BACKGROUND_IMAGES.find(img => img.url === tempSelectedImage)
  }, [tempSelectedImage])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[80vw] sm:max-w-[80vw] h-[90vh] flex flex-col z-[16000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-row gap-6 w-full min-h-0">
          {/* Selected Image Preview */}
          {tempSelectedImage && (
            <div className="p-2 flex flex-col gap-3">
              <div className="flex gap-2 items-center justify-between">
                <h3 className="text-sm font-medium">Selected Image</h3>
                {selectedImageData && (
                  <Badge variant="secondary">{selectedImageData.name}</Badge>
                )}
              </div>
              <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                <Image
                  src={tempSelectedImage}
                  alt="?"
                  width={500}
                  height={500}
                  className="w-full h-full flex items-center justify-center object-cover"
                />
              </AspectRatio>
            </div>
          )}

          {/* Image Grid */}
          <div className="flex-1 min-h-0 h-full p-3">
            <h3 className="text-sm font-medium">Available Images</h3>
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 gap-3 p-4">
                {BACKGROUND_IMAGES.map((image) => (
                  <div
                    key={image.url}
                    className={cn(
                      "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-101",
                      tempSelectedImage === image.url
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                      {tempSelectedImage === image.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <CheckIcon className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </AspectRatio>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">
                        {image.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!tempSelectedImage}
          >
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}