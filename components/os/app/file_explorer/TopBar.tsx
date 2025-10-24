'use client'

import React from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  RefreshCw,
  FolderPlus,
  FilePlus,
  Search,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Copy,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { TopBarProps } from './types'

export default function TopBar({
  explorerState,
  setExplorerState,
  canGoBack,
  canGoForward,
  breadcrumbs,
  selectedItemsCount,
  onGoBack,
  onGoForward,
  onGoUp,
  onRefresh,
  onNavigateToPath,
  onCreateItem,
  onCopySelected,
  onDeleteSelected,
  onClearSelection
}: TopBarProps) {
  
  const toggleViewMode = () => {
    setExplorerState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'list' ? 'grid' : 'list'
    }))
  }

  const changeSortBy = (sortBy: 'name' | 'date' | 'size' | 'type') => {
    setExplorerState(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  return (
    <div className="p-2 space-y-3">
      {/* Main Toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            disabled={!canGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoForward}
            disabled={!canGoForward}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoUp}
            disabled={explorerState.currentPath === '/'}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Create Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateItem('folder')}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateItem('file')}
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleViewMode}
          >
            {explorerState.viewMode === 'list' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {explorerState.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeSortBy('name')}>
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortBy('date')}>
                Sort by Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortBy('size')}>
                Sort by Size
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeSortBy('type')}>
                Sort by Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={explorerState.searchQuery}
              onChange={(e) => setExplorerState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-2 h-6 p-2'>
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      onClick={() => onNavigateToPath(crumb.path)}
                      className="cursor-pointer"
                    >
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Selection Info */}
        {selectedItemsCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              {selectedItemsCount} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopySelected}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}