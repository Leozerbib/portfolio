'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  validateMarkdownFile, 
  formatFileSize, 
  formatDate, 
  extractFrontmatter,
  generateFileId,
  analyzeMarkdownComplexity,
  debounce
} from '@/lib/markdown-utils'

export interface MarkdownFile {
  id: string
  name: string
  content: string
  size: number
  lastModified: Date
  path: string
  metadata?: Record<string, any>
  complexity?: 'low' | 'medium' | 'high'
}

export interface ViewSettings {
  zoom: number
  theme: 'light' | 'dark'
  viewMode: 'rendered' | 'raw'
}

export interface FileInfo {
  name: string
  size: string
  lastModified: string
  path: string
}

export function useMarkdownViewer() {
  const [openFiles, setOpenFiles] = useState<MarkdownFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    zoom: 1,
    theme: 'light',
    viewMode: 'rendered'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get the currently active file
  const activeFile = openFiles.find(file => file.id === activeFileId) || null
  
  // Debounced error clearing
  const clearErrorDebounced = useCallback(
    debounce(() => setError(null), 5000),
    []
  )
  
  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])
  
  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    setLoading(true)
    setError(null)
    
    try {
      const newFiles: MarkdownFile[] = []
      
      for (const file of Array.from(files)) {
        // Validate file
        const validation = validateMarkdownFile(file)
        if (!validation.isValid) {
          setError(validation.error || 'Invalid file')
          continue
        }
        
        // Show warnings if any
        if (validation.warnings && validation.warnings.length > 0) {
          console.warn('File warnings:', validation.warnings)
        }
        
        // Read file content
        const content = await readFileContent(file)
        const { metadata, content: cleanContent } = extractFrontmatter(content)
        const complexity = analyzeMarkdownComplexity(cleanContent)
        
        const markdownFile: MarkdownFile = {
          id: generateFileId(file.name, content),
          name: file.name,
          content: cleanContent,
          size: file.size,
          lastModified: new Date(file.lastModified),
          path: file.webkitRelativePath || file.name,
          metadata,
          complexity: complexity.complexity
        }
        
        newFiles.push(markdownFile)
      }
      
      if (newFiles.length > 0) {
        setOpenFiles(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(f => f.id))
          const uniqueNewFiles = newFiles.filter(f => !existingIds.has(f.id))
          
          const updated = [...prev, ...uniqueNewFiles]
          
          // Set the first new file as active if no file is currently active
          if (!activeFileId && uniqueNewFiles.length > 0) {
            setActiveFileId(uniqueNewFiles[0].id)
          }
          
          return updated
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [activeFileId])
  
  // Close a file
  const closeFile = useCallback((fileId: string) => {
    setOpenFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId)
      
      // If the closed file was active, switch to another file
      if (fileId === activeFileId) {
        const remainingFiles = updated
        if (remainingFiles.length > 0) {
          // Try to activate the next file, or the previous one
          const closedIndex = prev.findIndex(f => f.id === fileId)
          const nextFile = remainingFiles[Math.min(closedIndex, remainingFiles.length - 1)]
          setActiveFileId(nextFile.id)
        } else {
          setActiveFileId(null)
        }
      }
      
      return updated
    })
  }, [activeFileId])
  
  // Select a file as active
  const selectFile = useCallback((fileId: string) => {
    setActiveFileId(fileId)
  }, [])
  
  // Update view settings
  const updateViewSettings = useCallback((updates: Partial<ViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...updates }))
  }, [])
  
  // Zoom controls
  const zoomIn = useCallback(() => {
    updateViewSettings({ zoom: Math.min(viewSettings.zoom + 0.1, 3) })
  }, [viewSettings.zoom, updateViewSettings])
  
  const zoomOut = useCallback(() => {
    updateViewSettings({ zoom: Math.max(viewSettings.zoom - 0.1, 0.5) })
  }, [viewSettings.zoom, updateViewSettings])
  
  const resetZoom = useCallback(() => {
    updateViewSettings({ zoom: 1 })
  }, [updateViewSettings])
  
  // Theme toggle
  const toggleTheme = useCallback(() => {
    updateViewSettings({ 
      theme: viewSettings.theme === 'light' ? 'dark' : 'light' 
    })
  }, [viewSettings.theme, updateViewSettings])
  
  // View mode toggle
  const toggleViewMode = useCallback(() => {
    updateViewSettings({ 
      viewMode: viewSettings.viewMode === 'rendered' ? 'raw' : 'rendered' 
    })
  }, [viewSettings.viewMode, updateViewSettings])
  
  // Get file info for display
  const getFileInfo = useCallback((file: MarkdownFile): FileInfo => {
    return {
      name: file.name,
      size: formatFileSize(file.size),
      lastModified: formatDate(file.lastModified),
      path: file.path
    }
  }, [])
  
  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      clearErrorDebounced()
    }
  }, [error, clearErrorDebounced])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any pending debounced calls
      clearErrorDebounced.cancel()
    }
  }, [clearErrorDebounced])
  
  return {
    // State
    openFiles,
    activeFile,
    activeFileId,
    viewSettings,
    loading,
    error,
    
    // Refs
    fileInputRef,
    
    // Actions
    openFileDialog,
    handleFileSelect,
    closeFile,
    selectFile,
    updateViewSettings,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleTheme,
    toggleViewMode,
    getFileInfo,
    clearError
  }
}

// Helper function to read file content
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        resolve(content)
      } else {
        reject(new Error('Failed to read file as text'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsText(file, 'utf-8')
  })
}