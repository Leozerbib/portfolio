'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AlertCircle, RefreshCw, ExternalLink, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Props for the HTMLViewer component
 */
export interface HTMLViewerProps {
  /** HTML content to display */
  content: string
  /** Loading state */
  isLoading?: boolean
  /** Current URL being displayed */
  url?: string
  /** Navigation callback */
  onNavigate?: (url: string) => void
  /** Additional CSS classes */
  className?: string
  /** Enable/disable sandbox mode */
  sandbox?: boolean
  /** Custom error message */
  errorMessage?: string
}

/**
 * Error boundary state interface
 */
interface ErrorState {
  hasError: boolean
  error?: Error
  errorInfo?: string
}

/**
 * HTML Viewer Component
 * Renders HTML content with error handling, navigation controls, and security features
 */
export function HTMLViewer({
  content,
  isLoading = false,
  url = '',
  onNavigate,
  className,
  sandbox = true,
  errorMessage
}: HTMLViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<ErrorState>({ hasError: false })
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [contentStats, setContentStats] = useState({
    size: 0,
    loadTime: 0
  })

  // Reset error state when content changes
  useEffect(() => {
    setError({ hasError: false })
    setIsContentLoaded(false)
    const startTime = Date.now()
    
    if (content) {
      setContentStats(prev => ({
        ...prev,
        size: new Blob([content]).size,
        loadTime: Date.now() - startTime
      }))
    }
  }, [content])

  /**
   * Handles iframe load events
   */
  const handleIframeLoad = useCallback(() => {
    setIsContentLoaded(true)
    
    try {
      const iframe = iframeRef.current
      if (!iframe || !iframe.contentWindow) return

      // Add click event listener to handle internal navigation
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
      if (iframeDoc) {
        // Handle link clicks for navigation
        const links = iframeDoc.querySelectorAll('a[href]')
        links.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault()
            const href = link.getAttribute('href')
            if (href && onNavigate) {
              onNavigate(href)
            }
          })
        })

        // Add custom styles for better integration
        const style = iframeDoc.createElement('style')
        style.textContent = `
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          a {
            color: #1a73e8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          pre {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
          }
          code {
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
        `
        iframeDoc.head.appendChild(style)
      }
    } catch (err) {
      console.warn('Could not access iframe content:', err)
    }
  }, [onNavigate])

  /**
   * Handles iframe errors
   */
  const handleIframeError = useCallback((error: Error) => {
    setError({
      hasError: true,
      error,
      errorInfo: error.message
    })
    setIsContentLoaded(false)
  }, [])

  /**
   * Refreshes the content
   */
  const handleRefresh = useCallback(() => {
    setError({ hasError: false })
    setIsContentLoaded(false)
    
    if (iframeRef.current) {
      // Force reload by updating src
      const iframe = iframeRef.current
      const currentSrc = iframe.src
      iframe.src = 'about:blank'
      setTimeout(() => {
        iframe.src = currentSrc
      }, 100)
    }
  }, [])

  /**
   * Copies content to clipboard
   */
  const handleCopyContent = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }, [content])

  /**
   * Downloads content as HTML file
   */
  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `page-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download content:', err)
    }
  }, [content])

  /**
   * Formats file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
        <div className="flex-1 p-8 space-y-4">
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
          <div className="space-y-2 pt-4">
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-24" />
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error.hasError || errorMessage) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium">Error Loading Content</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="w-8 h-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Content Error</h3>
            <p className="text-muted-foreground mb-4">
              {errorMessage || error.errorInfo || 'Failed to load HTML content'}
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              {onNavigate && (
                <Button 
                  onClick={() => onNavigate('home')} 
                  variant="default" 
                  size="sm"
                >
                  Go Home
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Show empty state
  if (!content) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-muted" />
            <span className="text-sm text-muted-foreground">No content</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Content</h3>
            <p className="text-muted-foreground mb-4">
              No HTML content available to display
            </p>
            {onNavigate && (
              <Button onClick={() => onNavigate('home')} variant="default" size="sm">
                Go Home
              </Button>
            )}
          </Card>
        </div>
      </div>
    )
  }

  // Create data URL for iframe
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(content)}`

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Content Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isContentLoaded ? "bg-green-500" : "bg-yellow-500"
          )} />
          <span className="text-sm font-medium truncate max-w-xs">
            {url || 'HTML Content'}
          </span>
          {contentStats.size > 0 && (
            <Badge variant="secondary" className="text-xs">
              {formatFileSize(contentStats.size)}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="w-8 h-8 p-0"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyContent}
            className="w-8 h-8 p-0"
            title="Copy HTML"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="w-8 h-8 p-0"
            title="Download HTML"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Display */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          ref={iframeRef}
          src={dataUrl}
          className="w-full h-full border-0"
          sandbox={sandbox ? "allow-same-origin allow-scripts allow-forms allow-popups" : undefined}
          onLoad={handleIframeLoad}
          onError={(e) => handleIframeError(new Error('Iframe failed to load'))}
          title="HTML Content Viewer"
        />
        
        {/* Loading overlay */}
        {!isContentLoaded && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading content...</span>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          {contentStats.loadTime > 0 && (
            <span>Loaded in {contentStats.loadTime}ms</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {sandbox && (
            <Badge variant="outline" className="text-xs">
              Sandboxed
            </Badge>
          )}
          <span>HTML</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Error Boundary Component for HTMLViewer
 */
export class HTMLViewerErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return {
      hasError: true,
      error,
      errorInfo: error.message
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HTMLViewer Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to render HTML content: {this.state.errorInfo}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}