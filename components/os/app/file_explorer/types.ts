'use client'

import { OSFileSystemItem } from '@/hooks/useOS'

// Main File Explorer Interfaces
export interface FileExplorerAppProps {
  className?: string
  initialPath?: string
}

export interface FileExplorerState {
  currentPath: string
  selectedItems: Set<string>
  viewMode: 'list' | 'grid'
  sortBy: 'name' | 'date' | 'size' | 'type'
  sortOrder: 'asc' | 'desc'
  searchQuery: string
  showHidden: boolean
  history: string[]
  historyIndex: number
}

// Dialog State Interfaces
export interface CreateItemDialogState {
  isOpen: boolean
  type: 'file' | 'folder'
  name: string
  error?: string
}

export interface RenameDialogState {
  isOpen: boolean
  item: OSFileSystemItem | null
  newName: string
  error?: string
}

export interface DeleteDialogState {
  isOpen: boolean
  items: OSFileSystemItem[]
}

// Component Props Interfaces
export interface TopBarProps {
  explorerState: FileExplorerState
  setExplorerState: React.Dispatch<React.SetStateAction<FileExplorerState>>
  canGoBack: boolean
  canGoForward: boolean
  breadcrumbs: Array<{ name: string; path: string }>
  selectedItemsCount: number
  onGoBack: () => void
  onGoForward: () => void
  onGoUp: () => void
  onRefresh: () => void
  onNavigateToPath: (path: string) => void
  onCreateItem: (type: 'file' | 'folder') => void
  onCopySelected: () => void
  onDeleteSelected: () => void
  onClearSelection: () => void
}

export interface SidebarProps {
  currentPath: string
  onNavigateToPath: (path: string) => void
  className?: string
}

export interface FileItemProps {
  item: OSFileSystemItem
  isSelected: boolean
  viewMode: 'list' | 'grid'
  onSelect: (isCtrlClick?: boolean) => void
  onDoubleClick: () => void
  onRename: () => void
  onDelete: () => void
  onCopy: () => void
}

export interface ContentAreaProps {
  items: OSFileSystemItem[]
  selectedItems: Set<string>
  viewMode: 'list' | 'grid'
  searchQuery: string
  onItemSelect: (itemId: string, isCtrlClick?: boolean) => void
  onItemDoubleClick: (item: OSFileSystemItem) => void
  onItemRename: (item: OSFileSystemItem) => void
  onItemDelete: (item: OSFileSystemItem) => void
  onItemCopy: (item: OSFileSystemItem) => void
}

export interface DialogsProps {
  createDialog: CreateItemDialogState
  renameDialog: RenameDialogState
  deleteDialog: DeleteDialogState
  onCreateItem: () => void
  onRenameItem: () => void
  onDeleteItems: () => void
  onCloseCreateDialog: () => void
  onCloseRenameDialog: () => void
  onCloseDeleteDialog: () => void
  onUpdateCreateDialog: (updates: Partial<CreateItemDialogState>) => void
  onUpdateRenameDialog: (updates: Partial<RenameDialogState>) => void
}

// Utility Types
export type SortBy = 'name' | 'date' | 'size' | 'type'
export type SortOrder = 'asc' | 'desc'
export type ViewMode = 'list' | 'grid'

// Breadcrumb Type
export interface BreadcrumbItem {
  name: string
  path: string
}