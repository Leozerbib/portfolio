'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  FileText, 
  FolderOpen, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Eye,
  Code,
  Info,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown/MarkdownRenderer'
import { MarkdownKeyboardShortcuts } from './markdown/MarkdownKeyboardShortcuts'
import { MarkdownErrorBoundary } from './markdown/MarkdownErrorBoundary'
import { FileBrowserDialog } from './FileBrowserDialog'
import { OSFile } from '@/hooks/useOS'

// TypeScript interfaces
interface MarkdownFile {
  id: string
  name: string
  content: string
  size: number
  lastModified: Date
  path: string
}

interface FileInfo {
  name: string
  size: string
  lastModified: string
  path: string
}

interface ViewSettings {
  zoom: number
  theme: 'light' | 'dark'
  viewMode: 'rendered' | 'raw'
}

interface MarkdownAppProps {
  className?: string
}

export function MarkdownApp({ className }: MarkdownAppProps) {
  // State management
  const [openFiles, setOpenFiles] = useState<MarkdownFile[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    zoom: 100,
    theme: 'light',
    viewMode: 'rendered'
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFileBrowser, setShowFileBrowser] = useState(false)

  // Handle OS file selection
  const handleOSFileSelect = useCallback((osFile: OSFile) => {
    setLoading(true)
    setError(null)

    try {
      const content = typeof osFile.content === 'string' ? osFile.content : ''
      
      const markdownFile: MarkdownFile = {
        id: `${osFile.id}-${Date.now()}`,
        name: osFile.name,
        content,
        size: osFile.size,
        lastModified: new Date(osFile.modifiedAt),
        path: osFile.path
      }

      setOpenFiles(prev => {
        // Check if file is already open
        const existingFile = prev.find(f => f.path === osFile.path)
        if (existingFile) {
          setActiveTab(existingFile.id)
          return prev
        }
        
        const newFiles = [...prev, markdownFile]
        setActiveTab(markdownFile.id)
        return newFiles
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle file browser open
  const handleFileOpen = useCallback(() => {
    setShowFileBrowser(true)
  }, [])

  const handleTabClose = useCallback((fileId: string) => {
    setOpenFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId)
      
      // If closing the active tab, switch to another tab
      if (activeTab === fileId) {
        const currentIndex = prev.findIndex(f => f.id === fileId)
        if (newFiles.length > 0) {
          // Try to activate the next tab, or the previous one if it was the last
          const nextIndex = currentIndex < newFiles.length ? currentIndex : currentIndex - 1
          setActiveTab(newFiles[nextIndex]?.id || '')
        } else {
          setActiveTab('')
        }
      }
      
      return newFiles
    })
  }, [activeTab])

  // View settings handlers
  const handleZoomIn = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 10, 200)
    }))
  }, [])

  const handleZoomOut = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 10, 50)
    }))
  }, [])

  const handleZoomReset = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: 100
    }))
  }, [])

  const handleViewModeToggle = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'rendered' ? 'raw' : 'rendered'
    }))
  }, [])

  // Get file info for display
  const getFileInfo = useCallback((file: MarkdownFile): FileInfo => {
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return {
      name: file.name,
      size: formatSize(file.size),
      lastModified: file.lastModified.toLocaleString(),
      path: file.path
    }
  }, [])

  const activeFile = openFiles.find(f => f.id === activeTab)

  const handleDownload = useCallback((format: 'md' | 'txt' | 'html') => {
    // Get the current active file at the time of download
    const currentActiveFile = openFiles.find(f => f.id === activeTab)
    
    if (!currentActiveFile) {
      console.warn('No active file to download')
      setError('No file selected for download')
      return
    }

    try {
      const content = currentActiveFile.content
      const fileName = currentActiveFile.name.replace(/\.[^/.]+$/, '') // Remove existing extension
      
      let fileExtension: string
      let mimeType: string
      let downloadContent = content

      console.log('Processing download for:', fileName, 'format:', format)

      switch (format) {
        case 'md':
          fileExtension = '.md'
          mimeType = 'text/markdown'
          downloadContent = content
          break
          
        case 'txt':
          fileExtension = '.txt'
          mimeType = 'text/plain'
          // Simple markdown to text conversion - remove markdown syntax
          downloadContent = content
            .replace(/^#{1,6}\s+/gm, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`(.*?)`/g, '$1') // Remove inline code
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
            .replace(/^\s*[-*+]\s+/gm, '• ') // Convert lists to bullets
            .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists to bullets
          break
          
        case 'html':
          fileExtension = '.html'
          mimeType = 'text/html'
          // Basic markdown to HTML conversion
          downloadContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
        h2 { font-size: 1.5em; }
        h3 { font-size: 1.25em; }
        code { background-color: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, monospace; }
        pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        pre code { background: none; padding: 0; }
        blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin-left: 0; color: #6a737d; }
        ul, ol { padding-left: 30px; }
        li { margin-bottom: 4px; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #dfe2e5; padding: 8px 12px; text-align: left; }
        th { background-color: #f6f8fa; font-weight: 600; }
    </style>
</head>
<body>
${content
  .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
  .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
  .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
  .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
  .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
  .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/`(.*?)`/g, '<code>$1</code>')
  .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
  .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
  .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
  .replace(/^(.+)$/gm, '<p>$1</p>')
  .replace(/<p><\/p>/g, '')
  .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
  .replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1')
  .replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1')
}
</body>
</html>`
          break
          
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      const fullFileName = `${fileName}${fileExtension}`

      // Create blob and download
      const blob = new Blob([downloadContent], { type: mimeType })
      
      const url = URL.createObjectURL(blob)

      // Create and configure download link
      const link = document.createElement('a')
      link.href = url
      link.download = fullFileName
      link.style.display = 'none'
      
      // Force the download
      link.click()
      
      // Cleanup after a short delay to ensure download starts
      setTimeout(() => {
        console.log('Cleaning up download link')
        if (document.body.contains(link)) {
          document.body.removeChild(link)
        }
        URL.revokeObjectURL(url)
      }, 1000) // Increased timeout to 1 second
      
      // Clear any previous errors on successful download
      if (error) {
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file'
      console.error('Download failed:', err)
      setError(`Download failed: ${errorMessage}`)
    }
  }, [openFiles, activeTab, error])

  return (
    <div className={cn(
      "h-full flex flex-col bg-background text-foreground transition-colors duration-200",
      viewSettings.theme === 'dark' && "dark",
      className
    )}>
      {/* Keyboard shortcuts handler */}
      <MarkdownKeyboardShortcuts
        onOpenFiles={handleFileOpen}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onThemeToggle={() => {}} // No-op since we removed theme toggle
        onViewModeToggle={handleViewModeToggle}
        disabled={loading}
      />
      
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/50 min-h-[60px]">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileOpen}
            disabled={loading}
            className="flex items-center gap-2"
            aria-label="Open markdown files"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Open Files</span>
          </Button>
          
          {openFiles.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {openFiles.length} file{openFiles.length !== 1 ? 's' : ''} open
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={viewSettings.zoom <= 50}
              title="Zoom out (Ctrl + -)"
              className="h-7 w-7 p-0"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              title="Reset zoom (Ctrl + 0)"
              className="min-w-[50px] h-7 text-xs"
              aria-label={`Current zoom level: ${viewSettings.zoom}%`}
            >
              {viewSettings.zoom}%
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={viewSettings.zoom >= 200}
              title="Zoom in (Ctrl + +)"
              className="h-7 w-7 p-0"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Download button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                title="Download file"
                disabled={!activeFile}
                className="h-8 w-8 p-0"
                aria-label="Download file"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='z-[15000]' align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Markdown download clicked')
                  handleDownload('md')
                }}
              >
                Download as Markdown (.md)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('HTML download clicked')
                  handleDownload('html')
                }}
              >
                Download as HTML (.html)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Text download clicked')
                  handleDownload('txt')
                }}
              >
                Download as Text (.txt)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewModeToggle}
            title={`Switch to ${viewSettings.viewMode === 'rendered' ? 'raw' : 'rendered'} view`}
            disabled={!activeFile}
            className="h-8 w-8 p-0"
            aria-label={`Switch to ${viewSettings.viewMode === 'rendered' ? 'raw' : 'rendered'} view`}
          >
            {viewSettings.viewMode === 'rendered' ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border-b border-destructive/20 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {openFiles.length === 0 ? (
          // Empty state
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No markdown files open</h3>
            <p className="text-sm text-center mb-4 max-w-md">
              Click Open Files to select .md files from your computer and start viewing them with syntax highlighting and formatting.
            </p>
            <Button onClick={handleFileOpen} className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Open Markdown Files
            </Button>
          </div>
        ) : (
          // Tabs interface
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto overflow-x-auto">
              <ScrollArea className="w-full">
                <div className="flex">
                  {openFiles.map((file) => (
                    <div key={file.id} className="flex items-center group shrink-0">
                      <TabsTrigger
                        value={file.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                        aria-label={`Switch to ${file.name}`}
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="max-w-[120px] sm:max-w-[150px] truncate">{file.name}</span>
                      </TabsTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTabClose(file.id)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                        title={`Close ${file.name}`}
                        aria-label={`Close ${file.name}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsList>

            {openFiles.map((file) => (
              <TabsContent key={file.id} value={file.id} className="flex-1 m-0 overflow-hidden">
                <div className="h-full flex">
                  {/* Main content */}
                  <div className="flex-1 overflow-hidden">
                    <MarkdownErrorBoundary
                      onError={(error, errorInfo) => {
                        console.error('Markdown rendering error:', error, errorInfo)
                        setError(`Failed to render markdown: ${error.message}`)
                      }}
                    >
                      <ScrollArea className="h-full">
                        <div 
                          className="p-6"
                          style={{ fontSize: `${viewSettings.zoom}%` }}
                        >
                          {/* Rendered markdown content */}
                          {viewSettings.viewMode === 'raw' ? (
                            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                              {file.content}
                            </pre>
                          ) : (
                            <MarkdownRenderer
                              content={file.content}
                              zoom={viewSettings.zoom}
                              theme={viewSettings.theme}
                              className="min-h-full"
                            />
                          )}
                        </div>
                      </ScrollArea>
                    </MarkdownErrorBoundary>
                  </div>

                  {/* File info sidebar */}
                  <div className="w-64 lg:w-72 border-l bg-muted/30 p-4 hidden md:block">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="h-4 w-4" />
                      <h4 className="font-semibold text-sm">File Information</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="font-medium text-muted-foreground block mb-1">Name:</label>
                        <p className="break-all text-xs">{getFileInfo(file).name}</p>
                      </div>
                      
                      <div>
                        <label className="font-medium text-muted-foreground block mb-1">Size:</label>
                        <p className="text-xs">{getFileInfo(file).size}</p>
                      </div>
                      
                      <div>
                        <label className="font-medium text-muted-foreground block mb-1">Modified:</label>
                        <p className="text-xs">{getFileInfo(file).lastModified}</p>
                      </div>
                      
                      <div>
                        <label className="font-medium text-muted-foreground block mb-1">Path:</label>
                        <p className="break-all text-xs font-mono bg-muted/50 p-2 rounded">
                          {getFileInfo(file).path}
                        </p>
                      </div>

                      {/* Quick stats */}
                      <div className="pt-2 border-t">
                        <label className="font-medium text-muted-foreground block mb-2">Statistics:</label>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Lines:</span>
                            <span>{file.content.split('\n').length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Words:</span>
                            <span>{file.content.split(/\s+/).filter(word => word.length > 0).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Characters:</span>
                            <span>{file.content.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
            <span className="text-sm">Loading files...</span>
          </div>
        </div>
      )}

      {/* File Browser Dialog */}
      <FileBrowserDialog
        open={showFileBrowser}
        onOpenChange={setShowFileBrowser}
        onFileSelect={handleOSFileSelect}
        fileFilter={(file) => file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown')}
        title="Select Markdown File"
      />
    </div>
  )
}