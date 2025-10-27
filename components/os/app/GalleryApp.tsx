'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Grid, List, FolderOpen, ImageIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Masonry from '@/components/Masonry'
import ImageCarousel from './gallery/ImageCarousel'
import { cn } from '@/lib/utils'
import { useOS } from '@/hooks/useOS'
import { FileSystemUtils, OSFileSystemItem, OSFile, OSFolder } from '@/hooks/useOS'
import Image from 'next/image'

interface GalleryAppProps {
  windowId: string
}

interface ImageFile {
  id: string
  name: string
  path: string
  img: string
  url: string
  src?: string // Added for MasonryItem compatibility
  alt?: string // Added for MasonryItem compatibility
  title?: string // Added for MasonryItem compatibility
  height: number
  aspectRatio?: number // Added for MasonryItem compatibility
  size?: number
  type?: string
  lastModified?: Date
}

interface FolderStructure {
  name: string
  path: string
  children: (FolderStructure | ImageFile)[]
  type: 'folder' | 'file'
}

const GalleryApp: React.FC<GalleryAppProps> = () => {
  const { state } = useOS()
  const [currentPath, setCurrentPath] = useState('/Images/gallery')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'masonry' | 'list'>('masonry')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to convert OSFileSystemItem to ImageFile (compatible with MasonryItem)
  const convertToImageFile = (item: OSFileSystemItem): ImageFile => {
    const file = item as OSFile
    // Get image URL from content (where it's stored) or fallback to metadata
    const imageUrl = file.content as string || 
                     file.metadata?.url || 
                     file.metadata?.img || 
                     ''
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      img: imageUrl,
      url: imageUrl,
      src: imageUrl, // Added for MasonryItem compatibility
      alt: file.name, // Added for MasonryItem compatibility
      title: file.name, // Added for MasonryItem compatibility
      height: file.metadata?.height || 300,
      aspectRatio: file.metadata?.aspectRatio || 1, // Added for MasonryItem compatibility
      size: file.size,
      type: file.extension,
      lastModified: new Date(file.modifiedAt)
    }
  }

  // Helper function to convert OSFileSystemItem to FolderStructure
  const convertToFolderStructure = (item: OSFileSystemItem): FolderStructure => {
    const folder = item as OSFolder
    return {
      name: folder.name,
      path: folder.path,
      type: folder.type as 'folder' | 'file',
      children: Array.from(folder.children.values()).map(child => 
        'children' in child
          ? convertToFolderStructure(child)
          : convertToImageFile(child)
      )
    }
  }

  // Load files and folders from OS file system
  useEffect(() => {
    setLoading(true)
    
    const loadPath = (path: string) => {
      // Use the same pattern as FileExplorerApp
      const items = FileSystemUtils.getItemsByPath(state.fileSystem.root, path)
      const currentImages: ImageFile[] = []
      const currentFolders: FolderStructure[] = []
      
      items.forEach(item => {
        if ('children' in item) {
          // It's a folder
          currentFolders.push(convertToFolderStructure(item))
        } else {
          // It's a file - check if it's an image
          const file = item as OSFile
          if (file.content && typeof file.content === 'string' && (file.content.includes('.jpg') || file.content.includes('.png') || file.content.includes('.jpeg') || file.content.includes('.gif') || file.content.includes('.webp'))) {
            // It's an image file
            currentImages.push(convertToImageFile(item))
          }
        }
      })
      
      setImages(currentImages)
      setFolders(currentFolders)
    }
    
    loadPath(currentPath)
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, state.fileSystem])

  // Filter and sort images
  const filteredAndSortedImages = useMemo(() => {
    const filtered = images.filter(image =>
      image.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0)
        case 'size':
          return (b.size || 0) - (a.size || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [images, searchQuery, sortBy])

  // Filter folders
  const filteredFolders = useMemo(() => {
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [folders, searchQuery])

  const handleImageClick = (item: ImageFile) => {
    const imageIndex = filteredAndSortedImages.findIndex(img => img.id === item.id)
    if (imageIndex !== -1) {
      setSelectedImage(imageIndex)
      setIsCarouselOpen(true)
    }
  }

  const handleFolderClick = (folder: FolderStructure) => {
    setCurrentPath(folder.path)
  }

  const handleBackClick = () => {
    const pathParts = currentPath.split('/').filter(Boolean)
    if (pathParts.length > 1) {
      const parentPath = '/' + pathParts.slice(0, -1).join('/')
      setCurrentPath(parentPath)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const pathBreadcrumbs = currentPath.split('/').filter(Boolean)

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="flex items-center gap-2">
          {pathBreadcrumbs.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm">
            {pathBreadcrumbs.map((part, index) => (
              <React.Fragment key={index}>
                <span
                  className={cn(
                    "cursor-pointer hover:text-primary",
                    index === pathBreadcrumbs.length - 1 && "font-medium"
                  )}
                  onClick={() => {
                    const newPath = '/' + pathBreadcrumbs.slice(0, index + 1).join('/')
                    setCurrentPath(newPath)
                  }}
                >
                  {part}
                </span>
                {index < pathBreadcrumbs.length - 1 && (
                  <span className="text-muted-foreground">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex-1" />
        
        <Badge variant="secondary">
          {filteredAndSortedImages.length} images
        </Badge>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'size') => setSortBy(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="size">Size</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'masonry' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('masonry')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <>
            {/* Folders */}
            {filteredFolders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {filteredFolders.map((folder) => (
                    <button
                      key={folder.path}
                      onClick={() => handleFolderClick(folder)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FolderOpen className="h-8 w-8 text-blue-500" />
                      <span className="text-xs text-center truncate w-full">
                        {folder.name}
                      </span>
                    </button>
                  ))}
                </div>
                {filteredAndSortedImages.length > 0 && (
                  <Separator className="mt-6" />
                )}
              </div>
            )}

            {/* Images */}
            {filteredAndSortedImages.length > 0 ? (
              viewMode === 'masonry' ? (
                <div className='flex w-full justify-center items-center'>
                  <Masonry
                  items={filteredAndSortedImages}
                  onItemClick={handleImageClick}
                  scaleOnHover={true}
                  colorShiftOnHover={false}
                  className=''
                />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSortedImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleImageClick(image)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                    >
                      <Image
                        width={128}
                        height={128}
                        src={image.img}
                        alt={image.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{image.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {image.size && formatFileSize(image.size)} • {image.type}
                        </div>
                      </div>
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>No images found</p>
                {searchQuery && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Carousel Modal */}
      <ImageCarousel
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        images={filteredAndSortedImages}
        currentImageIndex={selectedImage || 0}
      />
    </div>
  )
}

export default GalleryApp