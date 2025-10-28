'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Plus, X, Home, ArrowLeft, ArrowRight, RotateCcw, Globe, Star, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ComponentViewer } from './browser/ComponentViewer'
import AllProjects from '../projet/AllProjects'
import * as browserUtils from '@/lib/browser-utils'
import { 
  getContentType
} from '@/lib/browser-utils'
import { 
  createTab,
  updateTabContent, 
  findTabById, 
  removeTab, 
  updateTab, 
  getNextActiveTab,
  type BrowserTab
} from '@/lib/tab-utils'
import { 
  type SearchSuggestion
} from '@/lib/search-utils'

/**
 * Props for the BrowserApp component
 */
export interface BrowserAppProps {
  className?: string
  initialUrl?: string
  onNavigate?: (url: string) => void
  onOpenInBrowser?: (url: string) => void
  projects?: Array<{
    id: string
    name: string
    description: string
    path: string
    htmlContent?: string
    componentId?: string
    type?: 'component' | 'html'
    technologies?: string[]
    demoUrl?: string
    githubUrl?: string
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
  onOpenInBrowser,
  projects = []
}: BrowserAppProps) {
  // State management for tabs and navigation
  const [tabs, setTabs] = useState<BrowserTab[]>(() => [createTab('home')])
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  /**
   * Loads content for a specific tab
   */
  const loadTabContent = useCallback(async (tabId: string, url: string) => {
    console.log('🔄 BrowserApp - loadTabContent called with:', { tabId, url })
    
    setTabs(prevTabs => {
      const tab = findTabById(prevTabs, tabId)
      if (!tab) return prevTabs
      
      return updateTab(prevTabs, tabId, { ...tab, isLoading: true })
    })

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let content: React.ReactNode = null
      const contentType = getContentType(url)
      console.log('🔄 BrowserApp - Content type:', contentType)
      
      if (contentType === 'project') {
        let projectId: string
        
        // Handle special case for "projects:all" - redirect to all-projects component
        if (url.startsWith('projects:')) {
          projectId = url.replace('projects:', '')
          if (projectId === 'all') {
            projectId = 'all-projects'
          }
        } else {
          projectId = url.replace('project:', '')
        }
        
        console.log('🔄 BrowserApp - Looking for project ID:', projectId)
        console.log('🔄 BrowserApp - Available projects:', projects.map(p => ({ id: p.id, type: p.type, componentId: p.componentId })))
        
        const project = projects.find(p => p.id === projectId)
        console.log('🔄 BrowserApp - Found project:', project)
        
        if (project?.type === 'component' && project.componentId) {
          // For TSX components, render ComponentViewer
          content = (
            <ComponentViewer 
              componentId={project.componentId} 
              onOpenInBrowser={onOpenInBrowser}
            />
          )
        } else if (projectId === 'all-projects') {
          // Render AllProjects component
          content = (
            <AllProjects 
              projects={projects.map(p => ({
                id: p.id,
                name: p.name,
                title: p.name,
                description: p.description,
                technologies: p.technologies || ['React', 'TypeScript'],
                category: 'web' as const,
                status: 'active' as const,
                lastUpdated: '2024-01-15',
                size: 2048,
                path: p.path,
                icon: '🚀'
              }))}
              onProjectSelect={(project) => {
                console.log('🔗 AllProjects - Project clicked:', project.name)
                console.log('🔗 AllProjects - Using tabId:', tabId)
                console.log('🔗 AllProjects - About to call loadTabContent with:', tabId, `project:${project.id}`)
                // Use the same pattern as HomePage - use tabId from loadTabContent context
                loadTabContent(tabId, `project:${project.id}`)
              }}
              onOpenInBrowser={(projectId) => {
                console.log('🔗 AllProjects - Opening project in browser:', projectId)
                console.log('🔗 AllProjects - Using tabId:', tabId)
                console.log('🔗 AllProjects - About to call loadTabContent with:', tabId, `project:${projectId}`)
                // Use the same pattern as HomePage - use tabId from loadTabContent context
                loadTabContent(tabId, `project:${projectId}`)
              }}
            />
          )
        } else {
          // Use ComponentViewer for project pages
          console.log('🔍 BrowserApp - Looking for project:', projectId)
          console.log('🔍 BrowserApp - Available projects:', projects.map(p => p.id))
          const project = projects.find(p => p.id === projectId)
          console.log('🔍 BrowserApp - Found project:', project)
          
          const projectProps = browserUtils.getProjectComponentProps(project)
          if (projectProps) {
            content = (
              <ComponentViewer 
                componentId={browserUtils.getProjectComponentId()}
                props={{
                  ...projectProps,
                  onNavigate: (url: string) => {
                    loadTabContent(tabId, url)
                  },
                  onBack: () => {
                    // Navigate back to home or previous page
                    loadTabContent(tabId, 'home')
                  }
                }}
                onOpenInBrowser={onOpenInBrowser}
              />
            )
          } else {
            // Show error if project not found
            content = (
              <ComponentViewer 
                componentId={browserUtils.getErrorComponentId()}
                props={browserUtils.getErrorComponentProps('Project not found')}
                onOpenInBrowser={onOpenInBrowser}
              />
            )
          }
        }
      } else if (contentType === 'html') {
        const htmlContent = url.startsWith('data:') ? decodeURIComponent(url.split(',')[1]) : ''
        content = <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      } else if (contentType === 'home') {
        // Use ComponentViewer for home page
        content = (
          <ComponentViewer 
            componentId={browserUtils.getHomeComponentId()}
            props={{
              ...browserUtils.getHomeComponentProps(),
              onNavigate: (url: string) => {
                loadTabContent(tabId, url)
              }
            }}
            onOpenInBrowser={onOpenInBrowser}
          />
        )
      } else {
        // Use ComponentViewer for error pages
        content = (
          <ComponentViewer 
            componentId={browserUtils.getErrorComponentId()}
            props={{
              ...browserUtils.getErrorComponentProps('Page not found'),
              onNavigate: (url: string) => {
                loadTabContent(tabId, url)
              },
              onRefresh: () => {
                loadTabContent(tabId, url)
              },
              onBack: () => {
                loadTabContent(tabId, 'home')
              }
            }}
            onOpenInBrowser={onOpenInBrowser}
          />
        )
      }

      // Update tab with loaded content
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        
        const updatedTab = updateTabContent(tab, content)
        return updateTab(prevTabs, tabId, updatedTab)
      })
      
    } catch (error) {
      console.error('Error loading tab content:', error)
      const errorContent = (
        <ComponentViewer 
          componentId={browserUtils.getErrorComponentId()}
          props={browserUtils.getErrorComponentProps('Error loading content')}
          onOpenInBrowser={onOpenInBrowser}
        />
      )
      
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        
        const updatedTab = updateTabContent(tab, errorContent)
        return updateTab(prevTabs, tabId, updatedTab)
      })
    }
  }, [projects, onOpenInBrowser])

  /**
   * Creates a new browser tab
   */
  const createNewTab = useCallback((url: string = 'home') => {
    const newTab = createTab(url)
    setTabs(prevTabs => [...prevTabs, newTab])
    setActiveTabId(newTab.id)
    // Load content after tab is created
    setTimeout(() => {
      loadTabContent(newTab.id, url)
    }, 0)
  }, [loadTabContent])

  /**
   * Closes a browser tab
   */
  const closeTab = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const nextActiveTabId = getNextActiveTab(prevTabs, tabId, activeTabId)
      
      if (nextActiveTabId === null) {
        // Create a new home tab if all tabs are closed
        setTimeout(() => createNewTab('home'), 0)
        return []
      }

      setActiveTabId(nextActiveTabId)
      return removeTab(prevTabs, tabId)
    })
  }, [activeTabId, createNewTab])
  /**
   * Switches to a specific tab
   */
  const switchToTab = useCallback((tabId: string) => {
    setActiveTabId(tabId)
  }, [])

  // Effect to handle projects prop changes
  useEffect(() => {
    if (projects && projects.length > 0) {
      // Only log once when projects are first loaded
      if (tabs.length === 0) {
        console.log('BrowserApp - Projects loaded:', projects.length)
        console.log('BrowserApp - Project IDs:', projects.map(p => p.id))
      }
    }
  }, [projects, projects.length, tabs.length])

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

  // Create initial tab
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab(initialUrl)
    }
  }, [tabs.length, initialUrl, createNewTab])

  // Handle initialUrl changes for existing browser instances
  useEffect(() => {
    if (initialUrl && initialUrl !== 'home' && tabs.length > 0) {
      // Create a new tab with the new URL
      createNewTab(initialUrl)
    }
  }, [createNewTab, initialUrl, tabs.length])

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
      <div className="flex-1 overflow-auto">
        {activeTab && (
          <div className="h-full">
            {activeTab.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              activeTab.content
            )}
          </div>
        )}
      </div>
    </div>
  )
}