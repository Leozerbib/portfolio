'use client'

import React from 'react'
import { 
  Folder, 
  File, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Archive,
  Code,
  MoreVertical,
  Edit3,
  Copy,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { FileItemProps } from './types'
import { OSFile } from '@/hooks/useOS'

// File type icon mapping
const getFileIcon = (fileName: string, isFolder: boolean) => {
  if (isFolder) return Folder
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'txt':
    case 'md':
    case 'doc':
    case 'docx':
      return FileText
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return Image
    case 'mp3':
    case 'wav':
    case 'flac':
      return Music
    case 'mp4':
    case 'avi':
    case 'mov':
      return Video
    case 'zip':
    case 'rar':
    case '7z':
      return Archive
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'html':
    case 'css':
    case 'py':
    case 'java':
      return Code
    default:
      return File
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export default function FileItem({
  item,
  isSelected,
  viewMode,
  onSelect,
  onDoubleClick,
  onRename,
  onDelete,
  onCopy
}: FileItemProps) {
  
  const isFolder = 'children' in item
  const Icon = getFileIcon(item.name, isFolder)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onSelect(e.ctrlKey || e.metaKey)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onDoubleClick()
  }

  const contextMenuItems = (
    <>
      <ContextMenuItem onClick={onRename}>
        <Edit3 className="h-4 w-4 mr-2" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem onClick={onCopy}>
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onDelete} className="text-destructive">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </ContextMenuItem>
    </>
  )

  if (viewMode === 'grid') {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 border-transparent cursor-pointer hover:bg-accent/50 transition-colors",
              isSelected && "bg-accent border-primary"
            )}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
          >
            <Icon className={cn(
              "h-12 w-12 mb-2",
              isFolder ? "text-blue-500" : "text-muted-foreground"
            )} />
            <span className="text-sm text-center break-words max-w-full">
              {item.name}
            </span>
            {!isFolder && (item as OSFile).size && (
              <span className="text-xs text-muted-foreground mt-1">
                {formatFileSize((item as OSFile).size)}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {contextMenuItems}
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  // List view
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors",
            isSelected && "bg-accent"
          )}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <Icon className={cn(
            "h-5 w-5 flex-shrink-0",
            isFolder ? "text-blue-500" : "text-muted-foreground"
          )} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">{item.name}</span>
              {item.isHidden && (
                <Badge variant="outline" className="text-xs">Hidden</Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {!isFolder && (item as OSFile).size && (
              <span className="w-20 text-right">
                {formatFileSize((item as OSFile).size)}
              </span>
            )}
            <span className="w-32 text-right">
              {formatDate(new Date(item.modifiedAt))}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRename}>
                <Edit3 className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {contextMenuItems}
      </ContextMenuContent>
    </ContextMenu>
  )
}