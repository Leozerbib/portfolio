import React from 'react'
import { getPageTitle, getContentType } from './browser-utils'

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
  content?: React.ReactNode
  contentType: 'html' | 'project' | 'search' | 'home'
  history: string[]
  historyIndex: number
  isActive?: boolean
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
 * Tab management utility functions for browser operations
 */

/**
 * Creates a new browser tab
 */
export function createTab(url: string, id?: string): BrowserTab {
  return {
    id: id || `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    url,
    title: getPageTitle(url),
    contentType: getContentType(url),
    content: null,
    isLoading: true,
    canGoBack: false,
    canGoForward: false,
    history: [url],
    historyIndex: 0
  }
}

/**
 * Updates a tab's URL and related properties
 */
export function updateTabUrl(tab: BrowserTab, newUrl: string): BrowserTab {
  const updatedHistory = [...tab.history.slice(0, tab.historyIndex + 1), newUrl]
  
  return {
    ...tab,
    url: newUrl,
    title: getPageTitle(newUrl),
    contentType: getContentType(newUrl),
    isLoading: true,
    history: updatedHistory,
    historyIndex: updatedHistory.length - 1,
    canGoBack: updatedHistory.length > 1,
    canGoForward: false
  }
}

/**
 * Navigates back in tab history
 */
export function navigateBack(tab: BrowserTab): BrowserTab | null {
  if (!tab.canGoBack || tab.historyIndex <= 0) return null
  
  const newIndex = tab.historyIndex - 1
  const newUrl = tab.history[newIndex]
  
  return {
    ...tab,
    url: newUrl,
    title: getPageTitle(newUrl),
    contentType: getContentType(newUrl),
    isLoading: true,
    historyIndex: newIndex,
    canGoBack: newIndex > 0,
    canGoForward: true
  }
}

/**
 * Navigates forward in tab history
 */
export function navigateForward(tab: BrowserTab): BrowserTab | null {
  if (!tab.canGoForward || tab.historyIndex >= tab.history.length - 1) return null
  
  const newIndex = tab.historyIndex + 1
  const newUrl = tab.history[newIndex]
  
  return {
    ...tab,
    url: newUrl,
    title: getPageTitle(newUrl),
    contentType: getContentType(newUrl),
    isLoading: true,
    historyIndex: newIndex,
    canGoBack: true,
    canGoForward: newIndex < tab.history.length - 1
  }
}

/**
 * Updates tab content and loading state
 */
export function updateTabContent(tab: BrowserTab, content: React.ReactNode): BrowserTab {
  return {
    ...tab,
    content,
    isLoading: false
  }
}

/**
 * Finds a tab by ID in the tabs array
 */
export function findTabById(tabs: BrowserTab[], tabId: string): BrowserTab | undefined {
  return tabs.find(tab => tab.id === tabId)
}

/**
 * Finds the index of a tab by ID
 */
export function findTabIndexById(tabs: BrowserTab[], tabId: string): number {
  return tabs.findIndex(tab => tab.id === tabId)
}

/**
 * Removes a tab from the tabs array
 */
export function removeTab(tabs: BrowserTab[], tabId: string): BrowserTab[] {
  return tabs.filter(tab => tab.id !== tabId)
}

/**
 * Updates a specific tab in the tabs array
 */
export function updateTab(tabs: BrowserTab[], tabId: string, updatedTab: BrowserTab): BrowserTab[] {
  return tabs.map(tab => tab.id === tabId ? updatedTab : tab)
}

/**
 * Gets the next active tab when closing a tab
 */
export function getNextActiveTab(tabs: BrowserTab[], closingTabId: string, currentActiveTabId: string): string | null {
  if (tabs.length <= 1) return null
  
  const closingIndex = findTabIndexById(tabs, closingTabId)
  if (closingIndex === -1) return currentActiveTabId
  
  // If we're not closing the active tab, keep the current active tab
  if (closingTabId !== currentActiveTabId) return currentActiveTabId
  
  // If closing the active tab, select the next tab or previous if it's the last
  const remainingTabs = removeTab(tabs, closingTabId)
  if (remainingTabs.length === 0) return null
  
  // Select the tab at the same index, or the last tab if we were at the end
  const nextIndex = Math.min(closingIndex, remainingTabs.length - 1)
  return remainingTabs[nextIndex].id
}