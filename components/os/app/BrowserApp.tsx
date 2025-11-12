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
  getContentType,
  getPageTitle
} from '@/lib/browser-utils'
import { 
  createTab,
  updateTabContent, 
  findTabById, 
  removeTab, 
  updateTab, 
  getNextActiveTab,
  updateTabUrl,
  navigateBack,
  navigateForward,
  type BrowserTab
} from '@/lib/tab-utils'
import { 
  type SearchSuggestion
} from '@/lib/search-utils'
import { Project } from './browser/ProjectPage'
import { useOS } from '@/hooks/useOS'
import { componentRegistry } from '@/lib/component-registry'

/**
 * Props for the BrowserApp component
 */
export interface BrowserAppProps {
  className?: string
  initialUrl?: string
  onNavigate?: (url: string) => void
  onOpenInBrowser?: (url: string) => void
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
}: BrowserAppProps) {
  const { state, dispatch } = useOS()
  
  // State management for tabs and navigation
  const [tabs, setTabs] = useState<BrowserTab[]>(() => [createTab('home')])
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const projectsNode: any = state.fileSystem.root.children.get('projects')
    if (projectsNode && projectsNode.type === 'folder') {
      const files = Array.from(projectsNode.children.values()).filter((item: any) => item.type === 'file')
      const mapped: Project[] = files.map((f: any) => {
        console.log('🌐 BrowserApp - Processing file:', f)
        const compId = f.metadata?.componentId || f.id
        const info = componentRegistry[compId]
        return {
          id: f.id,
          name: compId,
          description: info?.description || '',
          path: f.path,
          type: f.metadata?.componentType || (info ? 'component' : 'html'),
          technologies: info?.technologies || ['React', 'TypeScript']
        }
      })
      setProjects(mapped)
      console.log('🌐 BrowserApp - Loaded projects:', mapped)
    }
  }, [state.fileSystem.root])
  /**
   * Loads content for a specific tab
   */
  const loadTabContent = useCallback(async (tabId: string, url: string) => {
    console.log('🔄 BrowserApp - loadTabContent called with:', { tabId, url })
    
    // Update the active tab to the one being loaded
    setActiveTabId(tabId)
    
    // Update tab with new URL and set loading state
    setTabs(prevTabs => {
      const tab = findTabById(prevTabs, tabId)
      if (!tab) return prevTabs
      
      const updatedTab = updateTabUrl(tab, url)
      return updateTab(prevTabs, tabId, updatedTab)
    })

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Update loading state to false
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        
        return updateTab(prevTabs, tabId, { ...tab, isLoading: false })
      })
      
    } catch (error) {
      console.error('Error loading tab content:', error)
      
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        
        return updateTab(prevTabs, tabId, { ...tab, isLoading: false })
      })
    }
  }, [])

  const goBack = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tab = findTabById(prevTabs, tabId)
      if (!tab) return prevTabs
      const updated = navigateBack(tab)
      if (!updated) return prevTabs
      return updateTab(prevTabs, tabId, updated)
    })
    setTimeout(() => {
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        return updateTab(prevTabs, tabId, { ...tab, isLoading: false })
      })
    }, 300)
  }, [])

  const goForward = useCallback((tabId: string) => {
    setTabs(prevTabs => {
      const tab = findTabById(prevTabs, tabId)
      if (!tab) return prevTabs
      const updated = navigateForward(tab)
      if (!updated) return prevTabs
      return updateTab(prevTabs, tabId, updated)
    })
    setTimeout(() => {
      setTabs(prevTabs => {
        const tab = findTabById(prevTabs, tabId)
        if (!tab) return prevTabs
        return updateTab(prevTabs, tabId, { ...tab, isLoading: false })
      })
    }, 300)
  }, [])

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

  // Create initial tab on mount
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab(initialUrl || 'home')
    } else if (activeTabId) {
      // Ensure the initial tab actually loads once on mount
      const initialActiveTab = tabs.find(t => t.id === activeTabId)
      if (initialActiveTab && initialActiveTab.isLoading) {
        loadTabContent(initialActiveTab.id, initialActiveTab.url)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle initialUrl changes for existing browser instances
  // Only create a new tab if initialUrl actually changed and is not the same as current tab URL
  useEffect(() => {
    if (initialUrl && initialUrl !== 'home' && tabs.length > 0) {
      const activeTab = tabs.find(tab => tab.id === activeTabId)
      if (activeTab && activeTab.url !== initialUrl) {
        // Create a new tab with the new URL
        createNewTab(initialUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl])

  // Get active tab
  const activeTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTabId), 
    [tabs, activeTabId]
  )

  /**
   * Renders tab content dynamically based on URL
   */
  const renderTabContent = useCallback((tab: BrowserTab) => {
    const contentType = getContentType(tab.url)
    
    if (contentType === 'project') {
      let projectId: string
      
      if (tab.url.startsWith('projects:')) {
        projectId = tab.url.replace('projects:', '')
        if (projectId === 'all') {
          projectId = 'all-projects'
        }
      } else {
        projectId = tab.url.replace('project:', '')
      }
      
      const project = projects.find(p => p.id === projectId)

      
      if (project?.type === 'component') {
        console.log('🌐 BrowserApp - Rendering all-projects component')
        const allProjectsProps = {
          projects: projects.map(p => ({
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
          })),
          onProjectSelect: (project: any) => {
            console.log('🔗 AllProjects - Project clicked:', project.name)
            loadTabContent(tab.id, `project:${project.id}`)
          },
          onOpenInBrowser: (projectId: string) => {
            console.log('🔗 AllProjects - Opening project:', projectId)
            loadTabContent(tab.id, `project:${projectId}`)
          }
        }
        console.log('📘 BrowserApp - Rendering all-projects with props:', { hasOnProjectSelect: !!allProjectsProps.onProjectSelect, hasOnOpenInBrowser: !!allProjectsProps.onOpenInBrowser })
        return (
          <ComponentViewer 
            componentId={project.id}
            props={allProjectsProps}
            onNavigate={(url: string) => loadTabContent(tab.id, url)}
          />
        )
      } else {
        const projectProps = browserUtils.getProjectComponentProps(project)
        if (projectProps) {
          return (
            <ComponentViewer 
              componentId={browserUtils.getProjectComponentId()}
              props={{
                ...projectProps,
                onNavigate: (url: string) => loadTabContent(tab.id, url),
                onBack: () => loadTabContent(tab.id, 'home')
              }}
              onOpenInBrowser={onOpenInBrowser}
            />
          )
        } else {
          return (
            <ComponentViewer 
              componentId={browserUtils.getErrorComponentId()}
              props={browserUtils.getErrorComponentProps('Project not found')}
              onOpenInBrowser={onOpenInBrowser}
            />
          )
        }
      }
    } else if (contentType === 'html') {
      const htmlContent = tab.url.startsWith('data:') ? decodeURIComponent(tab.url.split(',')[1]) : ''
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    } else if (contentType === 'home') {
      return (
        <ComponentViewer 
          componentId={browserUtils.getHomeComponentId()}
          props={{
            ...browserUtils.getHomeComponentProps(),
            onNavigate: (url: string) => loadTabContent(tab.id, url)
          }}
          onOpenInBrowser={onOpenInBrowser}
        />
      )
    } else {
      return (
        <ComponentViewer 
          componentId={browserUtils.getErrorComponentId()}
          props={{
            ...browserUtils.getErrorComponentProps('Page not found'),
            onNavigate: (url: string) => loadTabContent(tab.id, url),
            onRefresh: () => loadTabContent(tab.id, tab.url),
            onBack: () => loadTabContent(tab.id, 'home')
          }}
          onOpenInBrowser={onOpenInBrowser}
        />
      )
    }
  }, [projects, onOpenInBrowser, loadTabContent])

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
              onClick={() => activeTab && goBack(activeTab.id)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!activeTab?.canGoForward}
              className="w-8 h-8 p-0"
              onClick={() => activeTab && goForward(activeTab.id)}
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
              renderTabContent(activeTab)
            )}
          </div>
        )}
      </div>
    </div>
  )
}