'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Folder, 
  FileText, 
  ArrowLeft, 
  Search, 
  SortAsc,
  SortDesc,
  Grid,
  List,
  Home
} from 'lucide-react'
import { useOS } from '@/hooks/useOS'
import { OSFileSystemItem, OSFile, FileSystemUtils } from '@/hooks/useOS'
import { cn } from '@/lib/utils'

interface FileBrowserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFileSelect: (file: OSFile) => void
  fileFilter?: (file: OSFile) => boolean
  title?: string
  allowMultiSelect?: boolean
}

interface BreadcrumbItem {
  name: string
  path: string
}

export function FileBrowserDialog({
  open,
  onOpenChange,
  onFileSelect,
  fileFilter = (file) => file.extension === 'md',
  title = 'Select File',
  allowMultiSelect = false
}: FileBrowserDialogProps) {
  const { state } = useOS()
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy] = useState<'name' | 'date' | 'size' | 'type'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [filteredItems, setFilteredItems] = useState<OSFileSystemItem[]>([])

  // Get current directory items
  const getCurrentItems = useCallback(() => {
    const items = FileSystemUtils.getItemsByPath(state.fileSystem.root, currentPath)
    return items.filter(item => {
      // Type guard to check if item is a folder
      if ('children' in item) return true
      // Type guard to check if item is a file
      if ('extension' in item) {
        const file = item as OSFile
        return fileFilter(file)
      }
      return false
    })
  }, [state.fileSystem.root, currentPath, fileFilter])

  // Filter and sort items
  useEffect(() => {
    let items = getCurrentItems()

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort items
    items = FileSystemUtils.sortItems(items, sortBy, sortOrder)

    setFilteredItems(items)
  }, [getCurrentItems, searchQuery, sortBy, sortOrder])

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = FileSystemUtils.buildBreadcrumbs(currentPath)

  // Handle navigation
  const navigateToPath = useCallback((path: string) => {
    setCurrentPath(path)
    setSelectedItems(new Set())
  }, [])

  const navigateUp = useCallback(() => {
    const parentPath = FileSystemUtils.getParentPath(currentPath)
    navigateToPath(parentPath)
  }, [currentPath, navigateToPath])

  // Handle item selection
  const handleItemClick = useCallback((item: OSFileSystemItem) => {
    if ('children' in item) {
      navigateToPath(item.path)
    } else {
      const file = item as OSFile
      if (allowMultiSelect) {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(item.id)) {
          newSelected.delete(item.id)
        } else {
          newSelected.add(item.id)
        }
        setSelectedItems(newSelected)
      } else {
        onFileSelect(file)
        onOpenChange(false)
      }
    }
  }, [allowMultiSelect, selectedItems, navigateToPath, onFileSelect, onOpenChange])

  // Handle multi-select confirmation
  const handleConfirmSelection = useCallback(() => {
    if (selectedItems.size > 0) {
      const selectedFiles = filteredItems
        .filter(item => selectedItems.has(item.id) && 'extension' in item)
        .map(item => item as OSFile)
      
      selectedFiles.forEach(file => onFileSelect(file))
      onOpenChange(false)
    }
  }, [selectedItems, filteredItems, onFileSelect, onOpenChange])

  // Format file size
  const formatFileSize = (bytes: number) => FileSystemUtils.formatFileSize(bytes)

  // Format date
  const formatDate = (timestamp: number) => FileSystemUtils.formatDate(timestamp)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] z-[15000] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateUp}
            disabled={currentPath === '/'}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPath('/')}
          >
            <Home className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-1">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-sm"
                  onClick={() => navigateToPath(crumb.path)}
                >
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>

        {/* File List */}
        <ScrollArea className="flex-1 border rounded-lg">
          <div className={cn(
            "p-2",
            viewMode === 'grid' ? "grid grid-cols-4 gap-2" : "space-y-1"
          )}>
            {filteredItems.map((item) => {
              const isSelected = selectedItems.has(item.id)
              const Icon = 'children' in item ? Folder : FileText

              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                    isSelected && "bg-accent",
                    viewMode === 'grid' && "flex-col text-center"
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <Icon className={cn(
                    "w-5 h-5 text-muted-foreground",
                    'children' in item && "text-blue-500"
                  )} />
                  
                  <div className={cn(
                    "flex-1 min-w-0",
                    viewMode === 'grid' && "text-center"
                  )}>
                    <div className="font-medium truncate">{item.name}</div>
                    {viewMode === 'list' && 'extension' in item && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{formatFileSize((item as OSFile).size)}</span>
                        <span>•</span>
                        <span>{formatDate(item.modifiedAt)}</span>
                      </div>
                    )}
                  </div>

                  {'extension' in item && (
                    <Badge variant="secondary" className="text-xs">
                      {(item as OSFile).extension.toUpperCase()}
                    </Badge>
                  )}
                </div>
              )
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No files found</p>
                {searchQuery && (
                  <p className="text-sm">Try adjusting your search query</p>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {allowMultiSelect && (
          <DialogFooter>
            <div className="flex items-center gap-2 flex-1">
              {selectedItems.size > 0 && (
                <Badge variant="secondary">
                  {selectedItems.size} file{selectedItems.size !== 1 ? 's' : ''} selected
                </Badge>
              )}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedItems.size === 0}
            >
              Open Selected
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}