'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useOS } from '@/hooks/useOS'
import { FileSystemUtils, OSFileSystemItem, OSFile, OSFolder } from '@/hooks/useOS'
import { cn } from '@/lib/utils'

// Import modular components
import TopBar from './file_explorer/TopBar'
import Sidebar from './file_explorer/Sidebar'
import ContentArea from './file_explorer/ContentArea'
import Dialogs from './file_explorer/Dialogs'
import { 
  FileExplorerAppProps, 
  FileExplorerState, 
  CreateItemDialogState, 
  RenameDialogState, 
  DeleteDialogState 
} from './file_explorer/types'

export default function FileExplorerApp({ className, initialPath = '/' }: FileExplorerAppProps) {
  const { state, dispatch } = useOS()
  
  // Component State
  const [explorerState, setExplorerState] = useState<FileExplorerState>({
    currentPath: initialPath,
    selectedItems: new Set(),
    viewMode: 'list',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    showHidden: false,
    history: [initialPath],
    historyIndex: 0
  })

  const [createDialog, setCreateDialog] = useState<CreateItemDialogState>({
    isOpen: false,
    type: 'file',
    name: '',
    error: undefined
  })

  const [renameDialog, setRenameDialog] = useState<RenameDialogState>({
    isOpen: false,
    item: null,
    newName: '',
    error: undefined
  })

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    items: []
  })

  // Computed Values
  const currentItems = useMemo(() => {
    const items = FileSystemUtils.getItemsByPath(state.fileSystem.root, explorerState.currentPath)
    
    // Filter by search query
    let filteredItems = explorerState.searchQuery
      ? items.filter(item => 
          item.name.toLowerCase().includes(explorerState.searchQuery.toLowerCase())
        )
      : items

    // Filter hidden items
    if (!explorerState.showHidden) {
      filteredItems = filteredItems.filter(item => !item.isHidden)
    }

    // Sort items
    return FileSystemUtils.sortItems(filteredItems, explorerState.sortBy, explorerState.sortOrder)
  }, [state.fileSystem.root, explorerState.currentPath, explorerState.searchQuery, explorerState.showHidden, explorerState.sortBy, explorerState.sortOrder])

  const breadcrumbs = useMemo(() => {
    return FileSystemUtils.buildBreadcrumbs(explorerState.currentPath)
  }, [explorerState.currentPath])

  const selectedItemsArray = useMemo(() => {
    return Array.from(explorerState.selectedItems).map(id => 
      currentItems.find(item => item.id === id)
    ).filter(Boolean) as OSFileSystemItem[]
  }, [explorerState.selectedItems, currentItems])

  const canGoBack = explorerState.historyIndex > 0
  const canGoForward = explorerState.historyIndex < explorerState.history.length - 1

  // Navigation Functions
  const navigateToPath = useCallback((path: string, addToHistory = true) => {
    setExplorerState(prev => {
      const newHistory = addToHistory 
        ? [...prev.history.slice(0, prev.historyIndex + 1), path]
        : prev.history
      const newIndex = addToHistory ? newHistory.length - 1 : prev.historyIndex

      return {
        ...prev,
        currentPath: path,
        selectedItems: new Set(),
        history: newHistory,
        historyIndex: newIndex
      }
    })

    // Update current directory in OS state
    dispatch({
      type: 'CHANGE_DIRECTORY',
      payload: { path }
    })
  }, [dispatch])

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = explorerState.historyIndex - 1
      const path = explorerState.history[newIndex]
      setExplorerState(prev => ({
        ...prev,
        currentPath: path,
        historyIndex: newIndex,
        selectedItems: new Set()
      }))
      dispatch({ 
        type: 'CHANGE_DIRECTORY', 
        payload: { path } 
      })
    }
  }, [canGoBack, explorerState.historyIndex, explorerState.history, dispatch])

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = explorerState.historyIndex + 1
      const path = explorerState.history[newIndex]
      setExplorerState(prev => ({
        ...prev,
        currentPath: path,
        historyIndex: newIndex,
        selectedItems: new Set()
      }))
      dispatch({ 
        type: 'CHANGE_DIRECTORY', 
        payload: { path } 
      })
    }
  }, [canGoForward, explorerState.historyIndex, explorerState.history, dispatch])

  const goUp = useCallback(() => {
    const parentPath = FileSystemUtils.getParentPath(explorerState.currentPath)
    if (parentPath !== explorerState.currentPath) {
      navigateToPath(parentPath)
    }
  }, [explorerState.currentPath, navigateToPath])

  const refresh = useCallback(() => {
    // Force re-render by updating a timestamp or similar
    setExplorerState(prev => ({ ...prev, selectedItems: new Set() }))
  }, [])

  // Selection Functions
  const toggleItemSelection = useCallback((itemId: string, isCtrlClick = false) => {
    setExplorerState(prev => {
      const newSelected = new Set(prev.selectedItems)
      
      if (isCtrlClick) {
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId)
        } else {
          newSelected.add(itemId)
        }
      } else {
        newSelected.clear()
        newSelected.add(itemId)
      }
      
      return { ...prev, selectedItems: newSelected }
    })
  }, [])

  const selectAll = useCallback(() => {
    setExplorerState(prev => ({
      ...prev,
      selectedItems: new Set(currentItems.map(item => item.id))
    }))
  }, [currentItems])

  const clearSelection = useCallback(() => {
    setExplorerState(prev => ({
      ...prev,
      selectedItems: new Set()
    }))
  }, [])

  // File Operations
  const handleDoubleClick = useCallback((item: OSFileSystemItem) => {
    const isFolder = 'children' in item
    if (isFolder) {
      navigateToPath(item.path)
    } else {
      // Open file with associated app
      const file = item as OSFile
      if (file.associatedApp) {
        dispatch({
          type: 'OPEN_WINDOW',
          payload: { 
            appId: file.associatedApp,
            args: { filePath: file.path }
          }
        })
      }
    }
  }, [navigateToPath, dispatch])

  const openCreateDialog = useCallback((type: 'file' | 'folder') => {
    setCreateDialog({
      isOpen: true,
      type,
      name: '',
      error: undefined
    })
  }, [])

  const openRenameDialog = useCallback((item: OSFileSystemItem) => {
    setRenameDialog({
      isOpen: true,
      item,
      newName: item.name,
      error: undefined
    })
  }, [])

  const openDeleteDialog = useCallback((items: OSFileSystemItem[]) => {
    setDeleteDialog({
      isOpen: true,
      items
    })
  }, [])

  // Dialog handlers
  const handleCreateItem = useCallback(() => {
    const validation = FileSystemUtils.validateFileName(createDialog.name)
    if (!validation.valid) {
      setCreateDialog(prev => ({ ...prev, error: validation.error }))
      return
    }

    if (createDialog.type === 'folder') {
      dispatch({
        type: 'CREATE_FOLDER',
        payload: {
          name: createDialog.name,
          parentPath: explorerState.currentPath
        }
      })
    } else {
      dispatch({
        type: 'CREATE_FILE',
        payload: {
          name: createDialog.name,
          parentPath: explorerState.currentPath,
          content: ''
        }
      })
    }

    setCreateDialog({ isOpen: false, type: 'file', name: '', error: undefined })
  }, [createDialog, explorerState.currentPath, dispatch])

  const handleRenameItem = useCallback(() => {
    if (!renameDialog.item) return

    const validation = FileSystemUtils.validateFileName(renameDialog.newName)
    if (!validation.valid) {
      setRenameDialog(prev => ({ ...prev, error: validation.error }))
      return
    }

    dispatch({
      type: 'RENAME_FILE',
      payload: {
        itemId: renameDialog.item.id,
        newName: renameDialog.newName
      }
    })

    setRenameDialog({ isOpen: false, item: null, newName: '', error: undefined })
  }, [renameDialog, dispatch])

  const handleDeleteItems = useCallback(() => {
    deleteDialog.items.forEach(item => {
      dispatch({
        type: 'DELETE_FILE',
        payload: { itemId: item.id }
      })
    })

    setDeleteDialog({ isOpen: false, items: [] })
    clearSelection()
  }, [deleteDialog.items, dispatch, clearSelection])

  return (
    <Card className={cn("flex h-full border-0 gap-0", className)}>
      {/* Top Bar */}
      <CardHeader className="p-0 border-b pb-0">
        <TopBar
          explorerState={explorerState}
          setExplorerState={setExplorerState}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          breadcrumbs={breadcrumbs}
          selectedItemsCount={explorerState.selectedItems.size}
          onGoBack={goBack}
          onGoForward={goForward}
          onGoUp={goUp}
          onRefresh={refresh}
          onNavigateToPath={navigateToPath}
          onCreateItem={openCreateDialog}
          onCopySelected={() => console.log('Copy selected items')}
          onDeleteSelected={() => openDeleteDialog(selectedItemsArray)}
          onClearSelection={clearSelection}
        />
      </CardHeader>
      
      
      {/* Main Content */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          currentPath={explorerState.currentPath}
          onNavigateToPath={navigateToPath}
        />

        {/* Content Area */}
        <CardContent className="flex-1 p-0 overflow-scroll">
          <ContentArea
            items={currentItems}
            selectedItems={explorerState.selectedItems}
            viewMode={explorerState.viewMode}
            searchQuery={explorerState.searchQuery}
            onItemSelect={toggleItemSelection}
            onItemDoubleClick={handleDoubleClick}
            onItemRename={openRenameDialog}
            onItemDelete={(item) => openDeleteDialog([item])}
            onItemCopy={(item) => copyToClipboard([item])}
          />
        </CardContent>
      </div>

      {/* Dialogs */}
      <Dialogs
        createDialog={createDialog}
        renameDialog={renameDialog}
        deleteDialog={deleteDialog}
        onCreateItem={handleCreateItem}
        onRenameItem={handleRenameItem}
        onDeleteItems={handleDeleteItems}
        onCloseCreateDialog={() => setCreateDialog(prev => ({ ...prev, isOpen: false }))}
        onCloseRenameDialog={() => setRenameDialog(prev => ({ ...prev, isOpen: false }))}
        onCloseDeleteDialog={() => setDeleteDialog(prev => ({ ...prev, isOpen: false }))}
        onUpdateCreateDialog={(updates) => setCreateDialog(prev => ({ ...prev, ...updates }))}
        onUpdateRenameDialog={(updates) => setRenameDialog(prev => ({ ...prev, ...updates }))}
      />
    </Card>
  )
}