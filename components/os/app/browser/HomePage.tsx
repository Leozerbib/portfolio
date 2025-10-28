'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Folder, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the HomePage component
 */
export interface HomePageProps {
  /** Navigation callback */
  onNavigate?: (url: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Quick link interface
 */
interface QuickLink {
  id: string
  title: string
  description: string
  url: string
  icon: React.ReactNode
  category: 'project' | 'feature' | 'external'
}

/**
 * HomePage Component
 * Modern TSX replacement for the browser home page
 */
export function HomePage({ onNavigate, className }: HomePageProps) {
  const quickLinks: QuickLink[] = [
    {
      id: 'all-projects',
      title: 'All Projects',
      description: 'Browse all available portfolio projects',
      url: 'projects:all',
      icon: <Folder className="w-5 h-5" />,
      category: 'project'
    }
  ]

  const handleLinkClick = (url: string) => {
    if (onNavigate) {
      onNavigate(url)
    }
  }

  const getCategoryColor = (category: QuickLink['category']) => {
    switch (category) {
      case 'project':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'feature':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'external':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-background to-muted/20", className)}>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 gap-6 mb-12">
            {quickLinks.map((link) => (
              <Card 
                key={link.id}
                className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm"
                onClick={() => handleLinkClick(link.url)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {link.icon}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getCategoryColor(link.category))}
                    >
                      {link.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {link.description}
                  </p>
                  
                  <div className="flex items-center mt-4 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open in browser
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage