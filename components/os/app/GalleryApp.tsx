'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Grid, List, FolderOpen, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Masonry from '@/components/Masonry'
import ImageCarousel from './gallery/ImageCarousel'
import { cn } from '@/lib/utils'

interface GalleryAppProps {
  windowId: string
}

interface ImageFile {
  id: string
  name: string
  path: string
  img: string
  url: string
  height: number
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

const GalleryApp: React.FC<GalleryAppProps> = ({ windowId }) => {
  const [currentPath, setCurrentPath] = useState('/images')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'masonry' | 'list'>('masonry')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [loading, setLoading] = useState(true)

  // Gallery file system data based on actual files in public/image_os/gallery/
  const mockFileSystem: FolderStructure = {
    name: 'images',
    path: '/images',
    type: 'folder',
    children: [
      {
        name: 'europe',
        path: '/images/europe',
        type: 'folder',
        children: [
          { id: 'eu1', name: 'Albany - 2024 (11).webp', path: '/images/europe/Albany - 2024 (11).webp', img: '/image_os/gallery/europe/Albany - 2024 (11).webp', url: '/image_os/gallery/europe/Albany - 2024 (11).webp', height: 280, type: 'image/webp', size: 245760, lastModified: new Date('2024-01-15') },
          { id: 'eu2', name: 'Albany - 2024 (110).webp', path: '/images/europe/Albany - 2024 (110).webp', img: '/image_os/gallery/europe/Albany - 2024 (110).webp', url: '/image_os/gallery/europe/Albany - 2024 (110).webp', height: 320, type: 'image/webp', size: 198432, lastModified: new Date('2024-01-16') },
          { id: 'eu3', name: 'Dresde - 2023 (11).webp', path: '/images/europe/Dresde - 2023 (11).webp', img: '/image_os/gallery/europe/Dresde - 2023 (11).webp', url: '/image_os/gallery/europe/Dresde - 2023 (11).webp', height: 290, type: 'image/webp', size: 312576, lastModified: new Date('2023-08-11') },
          { id: 'eu4', name: 'Dresde - 2023 (12).webp', path: '/images/europe/Dresde - 2023 (12).webp', img: '/image_os/gallery/europe/Dresde - 2023 (12).webp', url: '/image_os/gallery/europe/Dresde - 2023 (12).webp', height: 310, type: 'image/webp', size: 267890, lastModified: new Date('2023-08-12') },
          { id: 'eu5', name: 'Dresde - 2023 (13).webp', path: '/images/europe/Dresde - 2023 (13).webp', img: '/image_os/gallery/europe/Dresde - 2023 (13).webp', url: '/image_os/gallery/europe/Dresde - 2023 (13).webp', height: 300, type: 'image/webp', size: 289123, lastModified: new Date('2023-08-13') },
          { id: 'eu6', name: 'Grece - 2024 (22).webp', path: '/images/europe/Grece - 2024 (22).webp', img: '/image_os/gallery/europe/Grece - 2024 (22).webp', url: '/image_os/gallery/europe/Grece - 2024 (22).webp', height: 330, type: 'image/webp', size: 234567, lastModified: new Date('2024-06-22') },
          { id: 'eu7', name: 'Grece - 2024 (78).webp', path: '/images/europe/Grece - 2024 (78).webp', img: '/image_os/gallery/europe/Grece - 2024 (78).webp', url: '/image_os/gallery/europe/Grece - 2024 (78).webp', height: 270, type: 'image/webp', size: 345678, lastModified: new Date('2024-06-25') },
          { id: 'eu8', name: 'Grece - 2024 - nb (13).webp', path: '/images/europe/Grece - 2024 - nb (13).webp', img: '/image_os/gallery/europe/Grece - 2024 - nb (13).webp', url: '/image_os/gallery/europe/Grece - 2024 - nb (13).webp', height: 295, type: 'image/webp', size: 198765, lastModified: new Date('2024-06-20') },
          { id: 'eu9', name: 'Sicile - 2023 (1).webp', path: '/images/europe/Sicile - 2023 (1).webp', img: '/image_os/gallery/europe/Sicile - 2023 (1).webp', url: '/image_os/gallery/europe/Sicile - 2023 (1).webp', height: 285, type: 'image/webp', size: 276543, lastModified: new Date('2023-09-01') },
          { id: 'eu10', name: 'Sicile - 2023 (15).webp', path: '/images/europe/Sicile - 2023 (15).webp', img: '/image_os/gallery/europe/Sicile - 2023 (15).webp', url: '/image_os/gallery/europe/Sicile - 2023 (15).webp', height: 305, type: 'image/webp', size: 321098, lastModified: new Date('2023-09-15') }
        ]
      },
      {
        name: 'france',
        path: '/images/france',
        type: 'folder',
        children: [
          { id: 'fr1', name: 'Avignon - 2024 (10).webp', path: '/images/france/Avignon - 2024 (10).webp', img: '/image_os/gallery/france/Avignon - 2024 (10).webp', url: '/image_os/gallery/france/Avignon - 2024 (10).webp', height: 290, type: 'image/webp', size: 245760, lastModified: new Date('2024-07-10') },
          { id: 'fr2', name: 'Baden - 2023 (11).webp', path: '/images/france/Baden - 2023 (11).webp', img: '/image_os/gallery/france/Baden - 2023 (11).webp', url: '/image_os/gallery/france/Baden - 2023 (11).webp', height: 310, type: 'image/webp', size: 198432, lastModified: new Date('2023-08-11') },
          { id: 'fr3', name: 'GP Mathilde - 2024 (17).webp', path: '/images/france/GP Mathilde - 2024 (17).webp', img: '/image_os/gallery/france/GP Mathilde - 2024 (17).webp', url: '/image_os/gallery/france/GP Mathilde - 2024 (17).webp', height: 280, type: 'image/webp', size: 312576, lastModified: new Date('2024-05-17') },
          { id: 'fr4', name: 'Paris - 2024 (204).webp', path: '/images/france/Paris - 2024 (204).webp', img: '/image_os/gallery/france/Paris - 2024 (204).webp', url: '/image_os/gallery/france/Paris - 2024 (204).webp', height: 320, type: 'image/webp', size: 267890, lastModified: new Date('2024-03-15') },
          { id: 'fr5', name: 'Ski courchevel - 2024 (27).webp', path: '/images/france/Ski courchevel - 2024 (27).webp', img: '/image_os/gallery/france/Ski courchevel - 2024 (27).webp', url: '/image_os/gallery/france/Ski courchevel - 2024 (27).webp', height: 300, type: 'image/webp', size: 289123, lastModified: new Date('2024-02-27') },
          { id: 'fr6', name: 'Toulon - 2023 (15).webp', path: '/images/france/Toulon - 2023 (15).webp', img: '/image_os/gallery/france/Toulon - 2023 (15).webp', url: '/image_os/gallery/france/Toulon - 2023 (15).webp', height: 295, type: 'image/webp', size: 234567, lastModified: new Date('2023-07-15') },
          { id: 'fr7', name: 'Trek - 2024  (10).webp', path: '/images/france/Trek - 2024  (10).webp', img: '/image_os/gallery/france/Trek - 2024  (10).webp', url: '/image_os/gallery/france/Trek - 2024  (10).webp', height: 285, type: 'image/webp', size: 345678, lastModified: new Date('2024-08-10') }
        ]
      },
      {
        name: 'inde',
        path: '/images/inde',
        type: 'folder',
        children: [
          { id: 'in1', name: '000001680037.webp', path: '/images/inde/000001680037.webp', img: '/image_os/gallery/inde/000001680037.webp', url: '/image_os/gallery/inde/000001680037.webp', height: 300, type: 'image/webp', size: 245760, lastModified: new Date('2025-02-09') },
          { id: 'in2', name: '20250209 - Bangalore [081].webp', path: '/images/inde/20250209 - Bangalore [081].webp', img: '/image_os/gallery/inde/20250209 - Bangalore [081].webp', url: '/image_os/gallery/inde/20250209 - Bangalore [081].webp', height: 280, type: 'image/webp', size: 198432, lastModified: new Date('2025-02-09') },
          { id: 'in3', name: '20250221 - Andaman [46].webp', path: '/images/inde/20250221 - Andaman [46].webp', img: '/image_os/gallery/inde/20250221 - Andaman [46].webp', url: '/image_os/gallery/inde/20250221 - Andaman [46].webp', height: 320, type: 'image/webp', size: 312576, lastModified: new Date('2025-02-21') },
          { id: 'in4', name: '20250321 - Meghalaya [52].webp', path: '/images/inde/20250321 - Meghalaya [52].webp', img: '/image_os/gallery/inde/20250321 - Meghalaya [52].webp', url: '/image_os/gallery/inde/20250321 - Meghalaya [52].webp', height: 290, type: 'image/webp', size: 267890, lastModified: new Date('2025-03-21') },
          { id: 'in5', name: '20250412 - Jaipur [28].webp', path: '/images/inde/20250412 - Jaipur [28].webp', img: '/image_os/gallery/inde/20250412 - Jaipur [28].webp', url: '/image_os/gallery/inde/20250412 - Jaipur [28].webp', height: 310, type: 'image/webp', size: 289123, lastModified: new Date('2025-04-12') },
          { id: 'in6', name: '20250419 - Udaipur [01].webp', path: '/images/inde/20250419 - Udaipur [01].webp', img: '/image_os/gallery/inde/20250419 - Udaipur [01].webp', url: '/image_os/gallery/inde/20250419 - Udaipur [01].webp', height: 295, type: 'image/webp', size: 234567, lastModified: new Date('2025-04-19') },
          { id: 'in7', name: '20250420 - Jodhpur [29].webp', path: '/images/inde/20250420 - Jodhpur [29].webp', img: '/image_os/gallery/inde/20250420 - Jodhpur [29].webp', url: '/image_os/gallery/inde/20250420 - Jodhpur [29].webp', height: 285, type: 'image/webp', size: 345678, lastModified: new Date('2025-04-20') },
          { id: 'in8', name: '20250428 - Goa [01].webp', path: '/images/inde/20250428 - Goa [01].webp', img: '/image_os/gallery/inde/20250428 - Goa [01].webp', url: '/image_os/gallery/inde/20250428 - Goa [01].webp', height: 305, type: 'image/webp', size: 198765, lastModified: new Date('2025-04-28') }
        ]
      },
      {
        name: 'maroc',
        path: '/images/maroc',
        type: 'folder',
        children: [
          { id: 'ma1', name: 'Maroc - 2024 (129).webp', path: '/images/maroc/Maroc - 2024 (129).webp', img: '/image_os/gallery/maroc/Maroc - 2024 (129).webp', url: '/image_os/gallery/maroc/Maroc - 2024 (129).webp', height: 290, type: 'image/webp', size: 245760, lastModified: new Date('2024-10-15') },
          { id: 'ma2', name: 'Maroc - 2024 (130).webp', path: '/images/maroc/Maroc - 2024 (130).webp', img: '/image_os/gallery/maroc/Maroc - 2024 (130).webp', url: '/image_os/gallery/maroc/Maroc - 2024 (130).webp', height: 310, type: 'image/webp', size: 198432, lastModified: new Date('2024-10-16') },
          { id: 'ma3', name: 'Maroc - 2024 (58).webp', path: '/images/maroc/Maroc - 2024 (58).webp', img: '/image_os/gallery/maroc/Maroc - 2024 (58).webp', url: '/image_os/gallery/maroc/Maroc - 2024 (58).webp', height: 280, type: 'image/webp', size: 312576, lastModified: new Date('2024-10-10') },
          { id: 'ma4', name: 'Maroc - 2024 (84).webp', path: '/images/maroc/Maroc - 2024 (84).webp', img: '/image_os/gallery/maroc/Maroc - 2024 (84).webp', url: '/image_os/gallery/maroc/Maroc - 2024 (84).webp', height: 320, type: 'image/webp', size: 267890, lastModified: new Date('2024-10-12') }
        ]
      },
      {
        name: 'new york',
        path: '/images/new york',
        type: 'folder',
        children: [
          { id: 'ny1', name: 'NYC - 2024 (149).webp', path: '/images/new york/NYC - 2024 (149).webp', img: '/image_os/gallery/new york/NYC - 2024 (149).webp', url: '/image_os/gallery/new york/NYC - 2024 (149).webp', height: 300, type: 'image/webp', size: 245760, lastModified: new Date('2024-09-15') },
          { id: 'ny2', name: 'NYC - 2024 (154).webp', path: '/images/new york/NYC - 2024 (154).webp', img: '/image_os/gallery/new york/NYC - 2024 (154).webp', url: '/image_os/gallery/new york/NYC - 2024 (154).webp', height: 285, type: 'image/webp', size: 198432, lastModified: new Date('2024-09-16') },
          { id: 'ny3', name: 'NYC - 2024 (77).webp', path: '/images/new york/NYC - 2024 (77).webp', img: '/image_os/gallery/new york/NYC - 2024 (77).webp', url: '/image_os/gallery/new york/NYC - 2024 (77).webp', height: 310, type: 'image/webp', size: 312576, lastModified: new Date('2024-09-10') },
          { id: 'ny4', name: 'NYC - 2024 (87).webp', path: '/images/new york/NYC - 2024 (87).webp', img: '/image_os/gallery/new york/NYC - 2024 (87).webp', url: '/image_os/gallery/new york/NYC - 2024 (87).webp', height: 295, type: 'image/webp', size: 267890, lastModified: new Date('2024-09-12') }
        ]
      },
      {
        name: 'thailande',
        path: '/images/thailande',
        type: 'folder',
        children: [
          { id: 'th1', name: '20250302 - Thailande [134].webp', path: '/images/thailande/20250302 - Thailande [134].webp', img: '/image_os/gallery/thailande/20250302 - Thailande [134].webp', url: '/image_os/gallery/thailande/20250302 - Thailande [134].webp', height: 290, type: 'image/webp', size: 245760, lastModified: new Date('2025-03-02') },
          { id: 'th2', name: '20250302 - Thailande [138].webp', path: '/images/thailande/20250302 - Thailande [138].webp', img: '/image_os/gallery/thailande/20250302 - Thailande [138].webp', url: '/image_os/gallery/thailande/20250302 - Thailande [138].webp', height: 305, type: 'image/webp', size: 198432, lastModified: new Date('2025-03-02') },
          { id: 'th3', name: '20250303 - Thailande [125].webp', path: '/images/thailande/20250303 - Thailande [125].webp', img: '/image_os/gallery/thailande/20250303 - Thailande [125].webp', url: '/image_os/gallery/thailande/20250303 - Thailande [125].webp', height: 280, type: 'image/webp', size: 312576, lastModified: new Date('2025-03-03') },
          { id: 'th4', name: '20250312 - Thailande [061].webp', path: '/images/thailande/20250312 - Thailande [061].webp', img: '/image_os/gallery/thailande/20250312 - Thailande [061].webp', url: '/image_os/gallery/thailande/20250312 - Thailande [061].webp', height: 315, type: 'image/webp', size: 267890, lastModified: new Date('2025-03-12') }
        ]
      }
    ]
  }

  // Load files and folders for current path
  useEffect(() => {
    setLoading(true)
    
    const loadPath = (path: string) => {
      const pathParts = path.split('/').filter(Boolean)
      let currentNode = mockFileSystem
      
      // Navigate to the current path
      for (const part of pathParts.slice(1)) { // Skip 'images' as it's the root
        const found = currentNode.children.find(
          child => child.name === part && child.type === 'folder'
        ) as FolderStructure
        if (found) {
          currentNode = found
        }
      }
      
      const currentImages: ImageFile[] = []
      const currentFolders: FolderStructure[] = []
      
      currentNode.children.forEach(child => {
        if (child.type === 'folder') {
          currentFolders.push(child as FolderStructure)
        } else {
          currentImages.push(child as ImageFile)
        }
      })
      
      setImages(currentImages)
      setFolders(currentFolders)
    }
    
    loadPath(currentPath)
    setLoading(false)
  }, [currentPath])

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
                      <img
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