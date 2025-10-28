'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Grid, List, FolderOpen, ImageIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Masonry from '@/components/Masonry'
import ImageCarousel from './gallery/ImageCarousel'
import { cn } from '@/lib/utils'
import { useOS } from '@/hooks/useOS'
import { FileSystemUtils, OSFileSystemItem, OSFile, OSFolder } from '@/hooks/useOS'
import ProgressiveImage from '@/components/ui/progressive-image'

interface GalleryAppProps {
  windowId: string
}

interface ImageFile {
  id: string
  name: string
  path: string
  img: string
  url: string
  src?: string
  alt?: string
  title?: string
  height: number
  aspectRatio?: number
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

// Custom hook for debounced search
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Loading skeleton component for folders
const FolderSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-lg">
    <Skeleton className="h-8 w-8 rounded" />
    <Skeleton className="h-3 w-16 rounded" />
  </div>
)

// Loading skeleton component for list view
const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-3 rounded-lg">
    <Skeleton className="w-12 h-12 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-3 w-24 rounded" />
    </div>
    <Skeleton className="h-4 w-4 rounded" />
  </div>
)

const GalleryApp: React.FC<GalleryAppProps> = React.memo(() => {
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

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Memoized helper function to convert OSFileSystemItem to ImageFile
  const convertToImageFile = useCallback((item: OSFileSystemItem): ImageFile => {
    const file = item as OSFile
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
      src: imageUrl,
      alt: file.name,
      title: file.name,
      height: file.metadata?.height || 300,
      aspectRatio: file.metadata?.aspectRatio || 1,
      size: file.size,
      type: file.extension,
      lastModified: new Date(file.modifiedAt)
    }
  }, [])

  // Memoized helper function to convert OSFileSystemItem to FolderStructure
  const convertToFolderStructure = useCallback((item: OSFileSystemItem): FolderStructure => {
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
  }, [convertToImageFile])

  // Optimized file loading with error handling
  const loadPath = useCallback(async (path: string) => {
    setLoading(true)
    
    try {
      const items = FileSystemUtils.getItemsByPath(state.fileSystem.root, path)
      const currentImages: ImageFile[] = []
      const currentFolders: FolderStructure[] = []
      
      // Process items in batches for better performance
      const batchSize = 20
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize)
        
        batch.forEach(item => {
          if ('children' in item) {
            currentFolders.push(convertToFolderStructure(item))
          } else {
            const file = item as OSFile
            if (file.content && typeof file.content === 'string' && 
                (file.content.includes('.jpg') || file.content.includes('.png') || 
                 file.content.includes('.jpeg') || file.content.includes('.gif') || 
                 file.content.includes('.webp'))) {
              currentImages.push(convertToImageFile(item))
            }
          }
        })
        
        // Allow UI to update between batches
        if (i + batchSize < items.length) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }
      
      setImages(currentImages)
      setFolders(currentFolders)
    } catch (error) {
      console.error('Error loading path:', error)
      setImages([])
      setFolders([])
    } finally {
      setLoading(false)
    }
  }, [state.fileSystem, convertToImageFile, convertToFolderStructure])

  // Load files and folders from OS file system
  useEffect(() => {
    loadPath(currentPath)
  }, [currentPath, loadPath])

  // Memoized filter and sort logic with optimizations
  const filteredAndSortedImages = useMemo(() => {
    if (!debouncedSearchQuery && sortBy === 'name') {
      // Return early for common case to avoid unnecessary sorting
      return images
    }

    let filtered = images
    
    // Apply search filter only if there's a query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = images.filter(image =>
        image.name.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy !== 'name' || debouncedSearchQuery) {
      filtered = [...filtered].sort((a, b) => {
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
    }

    return filtered
  }, [images, debouncedSearchQuery, sortBy])

  // Memoized folder filtering
  const filteredFolders = useMemo(() => {
    if (!debouncedSearchQuery) return folders
    
    const query = debouncedSearchQuery.toLowerCase()
    return folders.filter(folder =>
      folder.name.toLowerCase().includes(query)
    )
  }, [folders, debouncedSearchQuery])

  // Optimized event handlers
  const handleImageClick = useCallback((item: ImageFile) => {
    const imageIndex = filteredAndSortedImages.findIndex(img => img.id === item.id)
    if (imageIndex !== -1) {
      setSelectedImage(imageIndex)
      setIsCarouselOpen(true)
    }
  }, [filteredAndSortedImages])

  const handleFolderClick = useCallback((folder: FolderStructure) => {
    setCurrentPath(folder.path)
  }, [])

  const handleBackClick = useCallback(() => {
    const pathParts = currentPath.split('/').filter(Boolean)
    if (pathParts.length > 1) {
      const parentPath = '/' + pathParts.slice(0, -1).join('/')
      setCurrentPath(parentPath)
    }
  }, [currentPath])

  const handleBreadcrumbClick = useCallback((index: number, pathParts: string[]) => {
    const newPath = '/' + pathParts.slice(0, index + 1).join('/')
    setCurrentPath(newPath)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSortChange = useCallback((value: 'name' | 'date' | 'size') => {
    setSortBy(value)
  }, [])

  const handleViewModeChange = useCallback((mode: 'masonry' | 'list') => {
    setViewMode(mode)
  }, [])

  const handleCarouselClose = useCallback(() => {
    setIsCarouselOpen(false)
  }, [])

  // Memoized utility functions
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const pathBreadcrumbs = useMemo(() => 
    currentPath.split('/').filter(Boolean), 
    [currentPath]
  )

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
                    "cursor-pointer hover:text-primary transition-colors",
                    index === pathBreadcrumbs.length - 1 && "font-medium"
                  )}
                  onClick={() => handleBreadcrumbClick(index, pathBreadcrumbs)}
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
          {loading ? '...' : `${filteredAndSortedImages.length} images`}
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
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={sortBy} onValueChange={handleSortChange}>
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
            onClick={() => handleViewModeChange('masonry')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 space-y-6">
            {/* Folder skeletons */}
            <div>
              <Skeleton className="h-4 w-16 mb-3" />
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <FolderSkeleton key={i} />
                ))}
              </div>
            </div>
            
            {/* Image skeletons */}
            <div>
              <Skeleton className="h-4 w-20 mb-3" />
              {viewMode === 'list' ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ListItemSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
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
                    virtualScrolling={false}
                    animationDuration={0.4}
                    staggerDelay={0.03}
                    className='w-full'
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
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                         <ProgressiveImage
                           src={image.img}
                           alt={image.name}
                           fill
                           className="object-cover"
                           sizes="48px"
                           placeholder="blur"
                         />
                       </div>
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
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>No images found</p>
                {debouncedSearchQuery && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Carousel Modal */}
      <ImageCarousel
        isOpen={isCarouselOpen}
        onClose={handleCarouselClose}
        images={filteredAndSortedImages}
        currentImageIndex={selectedImage || 0}
      />
    </div>
  )
})

GalleryApp.displayName = 'GalleryApp'

export default GalleryApp