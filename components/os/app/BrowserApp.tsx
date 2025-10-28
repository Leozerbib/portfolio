'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Plus, X, Home, ArrowLeft, ArrowRight, RotateCcw, Globe, Star, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HTMLViewer } from './html/HTMLViewer'
import { ComponentViewer } from './ComponentViewer'

/**
 * Interface for browser tab management
 */
export interface BrowserTab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  isActive: boolean
  content?: string
  contentType: 'html' | 'project' | 'search' | 'home'
  project?: {
    id: string
    name: string
    description: string
    path: string
    htmlContent?: string
    componentId?: string
    type?: 'component' | 'html'
  }
}

/**
 * Interface for search suggestions
 */
export interface SearchSuggestion {
  id: string
  text: string
  type: 'search' | 'url' | 'project' | 'history'
  icon?: React.ReactNode
}

/**
 * Props for the BrowserApp component
 */
export interface BrowserAppProps {
  className?: string
  initialUrl?: string
  onNavigate?: (url: string) => void
  projects?: Array<{
    id: string
    name: string
    description: string
    path: string
    htmlContent?: string
    componentId?: string
    type?: 'component' | 'html'
  }>
}

/**
 * Main Browser Application Component
 * Simulates a Google Chrome-like browser with tab management, search functionality,
 * and HTML content viewing capabilities
 */
export function BrowserApp({ 
  className, 
  initialUrl = 'home', 
  onNavigate,
  projects = []
}: BrowserAppProps) {
  console.log('BrowserApp - Received projects:', projects)
  // State management for tabs and navigation
  const [tabs, setTabs] = useState<BrowserTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Create initial tab
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab(initialUrl)
    }
  }, [initialUrl])

  /**
   * Creates a new browser tab
   */
  const createNewTab = useCallback((url: string = 'home', title?: string) => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}-${Math.random()}`,
      title: title || getPageTitle(url),
      url,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isActive: true,
      contentType: getContentType(url)
    }

    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({ ...tab, isActive: false }))
      return [...updatedTabs, newTab]
    })
    setActiveTabId(newTab.id)
    loadTabContent(newTab.id, url)
  }, [])

  /**
   * Closes a browser tab
   */
  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId)
      
      if (filteredTabs.length === 0) {
        // Create a new home tab if all tabs are closed
        setTimeout(() => createNewTab('home'), 0)
        return []
      }

      // If closing active tab, activate the next available tab
      if (activeTabId === tabId) {
        const activeIndex = prevTabs.findIndex(tab => tab.id === tabId)
        const nextTab = filteredTabs[Math.min(activeIndex, filteredTabs.length - 1)]
        setActiveTabId(nextTab.id)
        return filteredTabs.map(tab => ({
          ...tab,
          isActive: tab.id === nextTab.id
        }))
      }

      return filteredTabs
    })
  }, [activeTabId, createNewTab])

  /**
   * Switches to a specific tab
   */
  const switchToTab = useCallback((tabId: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    )
    setActiveTabId(tabId)
  }, [])

  /**
   * Loads content for a specific tab
   */
  const loadTabContent = useCallback(async (tabId: string, url: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === tabId 
          ? { ...tab, isLoading: true, url, title: getPageTitle(url) }
          : tab
      )
    )

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let content = ''
      const contentType = getContentType(url)
      let projectId: string | undefined = undefined
      
      if (contentType === 'project') {
        projectId = url.replace('project:', '')
        
        console.log('BrowserApp - Processing project URL:', url)
        console.log('BrowserApp - Extracted projectId:', projectId)
        console.log('BrowserApp - Available projects for lookup:', projects)
        
        // Handle special case for "projects:all"
        if (url.startsWith('projects:')) {
          projectId = url.replace('projects:', '')
        }
        
        const project = projects.find(p => p.id === projectId)
        console.log('BrowserApp - Found project:', project)
        
        if (project?.type === 'component' && project.componentId) {
          // For TSX components, we'll handle this in the ComponentViewer
          content = '' // ComponentViewer will handle the component rendering
        } else {
          content = project?.htmlContent || generateProjectHTML(project)
        }
      } else if (contentType === 'html') {
        content = url.startsWith('data:') ? decodeURIComponent(url.split(',')[1]) : ''
      } else if (contentType === 'home') {
        content = generateHomeHTML()
      }

      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId 
            ? { 
                ...tab, 
                isLoading: false, 
                content,
                contentType,
                canGoBack: true,
                project: contentType === 'project' && projectId ? projects.find(p => p.id === projectId) : undefined
              }
            : tab
        )
      )
    } catch (error) {
      console.error('Failed to load tab content:', error)
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === tabId 
            ? { ...tab, isLoading: false, content: generateErrorHTML() }
            : tab
        )
      )
    }
  }, [projects])

  /**
   * Handles search input and generates suggestions
   */
  const handleSearchInput = useCallback((query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const newSuggestions: SearchSuggestion[] = []

    // Add project suggestions
    projects
      .filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .forEach(project => {
        newSuggestions.push({
          id: `project-${project.id}`,
          text: project.name,
          type: 'project',
          icon: <Globe className="w-4 h-4" />
        })
      })

    // Add search suggestions
    const searchSuggestions = [
      `${query} tutorial`,
      `${query} documentation`,
      `${query} examples`,
      `how to ${query}`,
      `${query} best practices`
    ].slice(0, 5 - newSuggestions.length)

    searchSuggestions.forEach((suggestion, index) => {
      newSuggestions.push({
        id: `search-${index}`,
        text: suggestion,
        type: 'search',
        icon: <Search className="w-4 h-4" />
      })
    })

    setSuggestions(newSuggestions)
    setShowSuggestions(true)
  }, [projects])

  /**
   * Handles search submission
   */
  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return

    const activeTab = tabs.find(tab => tab.id === activeTabId)
    if (activeTab) {
      const searchUrl = `search:${encodeURIComponent(query)}`
      loadTabContent(activeTabId, searchUrl)
    }
    setShowSuggestions(false)
    onNavigate?.(query)
  }, [activeTabId, tabs, loadTabContent, onNavigate])

  /**
   * Handles suggestion selection
   */
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'project') {
      const projectId = suggestion.id.replace('project-', '')
      const projectUrl = `project:${projectId}`
      loadTabContent(activeTabId, projectUrl)
    } else {
      handleSearch(suggestion.text)
    }
    setShowSuggestions(false)
  }, [activeTabId, loadTabContent, handleSearch])

  // Get active tab
  const activeTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTabId), 
    [tabs, activeTabId]
  )

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Browser Header */}
      <div className="flex flex-col border-b bg-card">
        {/* Tab Bar */}
        <div className="flex items-center px-2 pt-2 min-h-[40px]">
          <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer min-w-[120px] max-w-[200px] group",
                  tab.isActive 
                    ? "bg-background border-t border-l border-r" 
                    : "bg-muted/50 hover:bg-muted"
                )}
                onClick={() => switchToTab(tab.id)}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate flex-1">
                  {tab.title}
                </span>
                {tabs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(tab.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => createNewTab()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-2 p-3">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={!activeTab?.canGoBack}
              className="w-8 h-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!activeTab?.canGoForward}
              className="w-8 h-8 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => activeTab && loadTabContent(activeTab.id, activeTab.url)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => createNewTab('home')}
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative max-w-2xl mx-auto">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery)
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
                placeholder="Search or enter address"
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.icon}
                      <span className="text-sm">{suggestion.text}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {suggestion.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Star className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => createNewTab()}>
                  New Tab
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => createNewTab('home')}>
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => createNewTab('projects:all')}>
                  All Projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab && (
          activeTab.project?.type === 'component' ? (
            <ComponentViewer
              componentId={activeTab.project.componentId}
              contentType="component"
              htmlContent={activeTab.content}
              isLoading={activeTab.isLoading}
              url={activeTab.url}
              onNavigate={(url) => loadTabContent(activeTab.id, url)}
              className="h-full"
            />
          ) : activeTab.contentType === 'home' ? (
            <ComponentViewer
              contentType="home"
              isLoading={activeTab.isLoading}
              url={activeTab.url}
              onNavigate={(url) => loadTabContent(activeTab.id, url)}
              className="h-full"
            />
          ) : (
            <HTMLViewer
              content={activeTab.content || ''}
              isLoading={activeTab.isLoading}
              url={activeTab.url}
              onNavigate={(url) => loadTabContent(activeTab.id, url)}
              className="h-full"
            />
          )
        )}
      </div>
    </div>
  )
}

// Helper functions
function getPageTitle(url: string): string {
  if (url === 'home') return 'Home'
  if (url.startsWith('project:')) return url.replace('project:', '').replace(/([A-Z])/g, ' $1').trim()
  if (url.startsWith('search:')) return `Search: ${decodeURIComponent(url.replace('search:', ''))}`
  if (url.startsWith('projects:')) return 'All Projects'
  return 'New Tab'
}

function getContentType(url: string): BrowserTab['contentType'] {
  if (url === 'home') return 'home'
  if (url.startsWith('project:')) return 'project'
  if (url.startsWith('projects:')) return 'project' // Handle "projects:all" as project type
  if (url.startsWith('search:')) return 'search'
  return 'html'
}

function generateHomeHTML(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Portfolio OS Browser</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; padding: 40px; background: #f8f9fa; 
        }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        .logo { font-size: 48px; font-weight: 300; color: #1a73e8; margin-bottom: 20px; }
        .search-box { 
          width: 100%; max-width: 500px; padding: 12px 20px; 
          border: 1px solid #dfe1e5; border-radius: 24px; 
          font-size: 16px; margin: 20px auto; display: block;
        }
        .quick-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 40px; }
        .link-card { 
          background: white; padding: 20px; border-radius: 8px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-decoration: none; color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .link-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .link-title { font-weight: 600; margin-bottom: 8px; }
        .link-desc { color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Portfolio Browser</div>
        <p>Welcome to your portfolio operating system browser</p>
        
        <div class="quick-links">
          <a href="projects:all" class="link-card">
            <div class="link-title">All Projects</div>
            <div class="link-desc">Browse all available projects</div>
          </a>
          <a href="project:enchere" class="link-card">
            <div class="link-title">Enchere Project</div>
            <div class="link-desc">Auction system implementation</div>
          </a>
          <a href="project:gile" class="link-card">
            <div class="link-title">Gile Project</div>
            <div class="link-desc">Project management system</div>
          </a>
          <a href="project:helixir" class="link-card">
            <div class="link-title">Helixir Project</div>
            <div class="link-desc">Advanced web application</div>
          </a>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateProjectHTML(project?: { id: string; name: string; description: string; path: string }): string {
  if (!project) {
    return generateErrorHTML('Project not found')
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${project.name}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; padding: 40px; background: #f8f9fa; line-height: 1.6;
        }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 32px; font-weight: 600; color: #1a73e8; margin-bottom: 10px; }
        .description { color: #666; font-size: 18px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 20px; font-weight: 600; margin-bottom: 15px; color: #333; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 8px; }
        .tech-tag { background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 14px; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .feature-list li:before { content: "✓"; color: #34a853; font-weight: bold; margin-right: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">${project.name}</h1>
          <p class="description">${project.description}</p>
        </div>
        
        <div class="section">
          <h2 class="section-title">Project Overview</h2>
          <p>This project demonstrates advanced web development techniques and modern software architecture patterns.</p>
        </div>
        
        <div class="section">
          <h2 class="section-title">Technology Stack</h2>
          <div class="tech-stack">
            <span class="tech-tag">React</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Next.js</span>
            <span class="tech-tag">Tailwind CSS</span>
            <span class="tech-tag">Node.js</span>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Key Features</h2>
          <ul class="feature-list">
            <li>Modern responsive design</li>
            <li>Type-safe development with TypeScript</li>
            <li>Server-side rendering with Next.js</li>
            <li>Component-based architecture</li>
            <li>Optimized performance</li>
          </ul>
        </div>
        
        <div class="section">
          <h2 class="section-title">Project Path</h2>
          <code style="background: #f5f5f5; padding: 10px; border-radius: 4px; display: block;">${project.path}</code>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateErrorHTML(message: string = 'Page not found'): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0; padding: 40px; background: #f8f9fa; text-align: center;
        }
        .error-container { max-width: 500px; margin: 100px auto; }
        .error-code { font-size: 72px; font-weight: 300; color: #ea4335; margin-bottom: 20px; }
        .error-message { font-size: 24px; color: #333; margin-bottom: 20px; }
        .error-description { color: #666; margin-bottom: 30px; }
        .back-button { 
          background: #1a73e8; color: white; padding: 12px 24px; 
          border: none; border-radius: 4px; font-size: 16px; cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-code">404</div>
        <div class="error-message">${message}</div>
        <div class="error-description">The page you're looking for could not be found.</div>
        <button class="back-button" onclick="history.back()">Go Back</button>
      </div>
    </body>
    </html>
  `
}