'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Bug,
  FileX,
  Wifi,
  Server
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Error type definitions
 */
export type ErrorType = 
  | '404' 
  | '500' 
  | 'network' 
  | 'timeout' 
  | 'permission' 
  | 'generic'

/**
 * Props for the ErrorPage component
 */
export interface ErrorPageProps {
  /** Error type */
  errorType?: ErrorType
  /** Custom error message */
  message?: string
  /** Additional error details */
  details?: string
  /** Navigation callback */
  onNavigate?: (url: string) => void
  /** Refresh callback */
  onRefresh?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Error configuration interface
 */
interface ErrorConfig {
  code: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  suggestions: string[]
}

/**
 * ErrorPage Component
 * Modern TSX replacement for error page HTML generation
 */
export function ErrorPage({ 
  errorType = '404', 
  message, 
  details,
  onNavigate, 
  onRefresh,
  className 
}: ErrorPageProps) {
  
  const errorConfigs: Record<ErrorType, ErrorConfig> = {
    '404': {
      code: '404',
      title: 'Page Not Found',
      description: 'The page you\'re looking for could not be found.',
      icon: <FileX className="w-12 h-12" />,
      color: 'text-orange-500',
      suggestions: [
        'Check the URL for typos',
        'Navigate back to the home page',
        'Browse available projects'
      ]
    },
    '500': {
      code: '500',
      title: 'Server Error',
      description: 'Something went wrong on our end. Please try again later.',
      icon: <Server className="w-12 h-12" />,
      color: 'text-red-500',
      suggestions: [
        'Refresh the page',
        'Try again in a few minutes',
        'Contact support if the problem persists'
      ]
    },
    'network': {
      code: 'NET',
      title: 'Network Error',
      description: 'Unable to connect to the server. Check your internet connection.',
      icon: <Wifi className="w-12 h-12" />,
      color: 'text-blue-500',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable any VPN or proxy'
      ]
    },
    'timeout': {
      code: 'TIME',
      title: 'Request Timeout',
      description: 'The request took too long to complete.',
      icon: <RefreshCw className="w-12 h-12" />,
      color: 'text-yellow-500',
      suggestions: [
        'Try refreshing the page',
        'Check your internet speed',
        'Try again later'
      ]
    },
    'permission': {
      code: '403',
      title: 'Access Denied',
      description: 'You don\'t have permission to access this resource.',
      icon: <AlertTriangle className="w-12 h-12" />,
      color: 'text-purple-500',
      suggestions: [
        'Check if you\'re logged in',
        'Contact an administrator',
        'Navigate to a public page'
      ]
    },
    'generic': {
      code: 'ERR',
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred.',
      icon: <Bug className="w-12 h-12" />,
      color: 'text-gray-500',
      suggestions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Try again later'
      ]
    }
  }

  const config = errorConfigs[errorType]
  const displayMessage = message || config.description
  
  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('home')
    }
  }

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-background to-muted/20", className)}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl text-center">
          {/* Error Icon and Code */}
          <div className="mb-8">
            <div className={cn("inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6", config.color)}>
              {config.icon}
            </div>
            <div className="text-6xl font-light text-muted-foreground mb-2">
              {config.code}
            </div>
          </div>

          {/* Error Content */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-4">
              {config.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {displayMessage}
            </p>
            {details && (
              <p className="text-sm text-muted-foreground/80">
                {details}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button onClick={handleRefresh} variant="default" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>

          {/* Suggestions Card */}
          <Card className="p-6 text-left bg-card/50 backdrop-blur-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              What you can try:
            </h3>
            <ul className="space-y-2">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-xs text-muted-foreground">
            <Badge variant="outline" className="mb-2">
              Error Type: {errorType.toUpperCase()}
            </Badge>
            <p>
              If this problem persists, please contact support with the error details above.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Error {config.code} - {config.title}</span>
          <span>Portfolio OS Browser</span>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage