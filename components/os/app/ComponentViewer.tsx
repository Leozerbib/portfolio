'use client'

import React, { useState, useCallback, Suspense } from 'react'
import { AlertCircle, RefreshCw, ExternalLink, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { componentRegistry } from '@/lib/component-registry'

/**
 * Props for the ComponentViewer component
 */
export interface ComponentViewerProps {
  /** Component ID to render */
  componentId?: string
  /** Content type */
  contentType?: 'component' | 'html' | 'home' | 'project'
  /** HTML content fallback */
  htmlContent?: string
  /** Loading state */
  isLoading?: boolean
  /** Current URL being displayed */
  url?: string
  /** Navigation callback */
  onNavigate?: (url: string) => void
  /** Additional CSS classes */
  className?: string
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
 * Component Viewer
 * Renders TSX components or falls back to HTML content
 */
export function ComponentViewer({
  componentId,
  contentType = 'component',
  htmlContent,
  isLoading = false,
  url = '',
  onNavigate,
  className,
  errorMessage
}: ComponentViewerProps) {
  const [error, setError] = useState<ErrorState>({ hasError: false })

  /**
   * Refreshes the content
   */
  const handleRefresh = useCallback(() => {
    setError({ hasError: false })
    // Force re-render by updating key or triggering parent refresh
    if (onNavigate && url) {
      onNavigate(url)
    }
  }, [onNavigate, url])

  /**
   * Copies content to clipboard
   */
  const handleCopyContent = useCallback(async () => {
    try {
      const content = componentId ? `Component: ${componentId}` : htmlContent || ''
      await navigator.clipboard.writeText(content)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }, [componentId, htmlContent])

  /**
   * Downloads content
   */
  const handleDownload = useCallback(() => {
    try {
      const content = componentId ? `Component: ${componentId}` : htmlContent || ''
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${componentId || 'content'}-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download content:', err)
    }
  }, [componentId, htmlContent])

  /**
   * Renders the component content
   */
  const renderContent = useCallback(() => {
    if (contentType === 'component' && componentId) {
      try {
        const componentInfo = componentRegistry[componentId]
        if (!componentInfo) {
          throw new Error(`Component "${componentId}" not found in registry`)
        }
        const Component = componentInfo.component
        return <Component />
      } catch (err) {
        setError({
          hasError: true,
          error: err as Error,
          errorInfo: `Failed to render component: ${componentId}`
        })
        return null
      }
    }

    if (contentType === 'html' && htmlContent) {
      // Fallback to HTML rendering using iframe
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
      return (
        <iframe
          src={dataUrl}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          title="HTML Content Viewer"
        />
      )
    }

    if (contentType === 'home') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-light text-primary mb-6">Portfolio Browser</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to your portfolio operating system browser
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => onNavigate?.('project:all-projects')}>
                <h3 className="font-semibold mb-2">All Projects</h3>
                <p className="text-sm text-muted-foreground">Browse all portfolio projects</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onNavigate?.('project:enchere')}>
                <h3 className="font-semibold mb-2">Featured Project</h3>
                <p className="text-sm text-muted-foreground">Système d'Enchères</p>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return null
  }, [contentType, componentId, htmlContent, onNavigate])

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
              {errorMessage || error.errorInfo || 'Failed to load content'}
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
  if (!componentId && !htmlContent && contentType !== 'home') {
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
              No content available to display
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

  const displayName = componentId || url || 'Content'
  const contentSize = componentId ? `Component: ${componentId}` : htmlContent?.length || 0

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Content Display */}
      <div className="flex-1 relative overflow-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading component...</span>
            </div>
          </div>
        }>
          <div className="w-full h-full">
            {renderContent()}
          </div>
        </Suspense>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {contentType === 'component' ? 'React Component' : 'HTML'}
          </Badge>
        </div>
      </div>
    </div>
  )
}

/**
 * Error Boundary Component for ComponentViewer
 */
export class ComponentViewerErrorBoundary extends React.Component<
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
    console.error('ComponentViewer Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to render component: {this.state.errorInfo}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}