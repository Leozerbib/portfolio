/**
 * Search utility functions for browser search functionality
 */

import React from 'react'

/**
 * Interface for search suggestions
 */
export interface SearchSuggestion {
  id: string
  text: string
  type: 'search' | 'url' | 'project' | 'history'
  icon?: React.ReactNode
  url?: string
}

/**
 * Generates search suggestions based on query
 */
export function getSearchSuggestions(query: string, projects: any[] = []): SearchSuggestion[] {
  if (!query.trim()) return []
  
  const suggestions: SearchSuggestion[] = []
  const lowerQuery = query.toLowerCase()
  
  // Add project suggestions
  projects.forEach(project => {
    if (project.name.toLowerCase().includes(lowerQuery) || 
        project.description.toLowerCase().includes(lowerQuery)) {
      suggestions.push({
        id: `project-${project.id}`,
        text: project.name,
        type: 'project',
        url: `project:${project.id}`
      })
    }
  })
  
  // Add special pages
  if ('home'.includes(lowerQuery)) {
    suggestions.push({
      id: 'home',
      text: 'Home',
      type: 'url',
      url: 'home'
    })
  }
  
  if ('all projects'.includes(lowerQuery) || 'projects'.includes(lowerQuery)) {
    suggestions.push({
      id: 'all-projects',
      text: 'All Projects',
      type: 'url',
      url: 'projects:all'
    })
  }
  
  // Add search suggestion
  suggestions.push({
    id: `search-${query}`,
    text: `Search for "${query}"`,
    type: 'search',
    url: `search:${encodeURIComponent(query)}`
  })
  
  return suggestions.slice(0, 8) // Limit to 8 suggestions
}

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return false
  }
}

/**
 * Processes search input and returns appropriate URL
 */
export function processSearchInput(input: string): string {
  const trimmed = input.trim()
  
  if (!trimmed) return 'home'
  
  // Check if it's a direct URL
  if (isValidUrl(trimmed)) {
    return trimmed
  }
  
  // Check if it's a protocol-less URL
  if (trimmed.includes('.') && !trimmed.includes(' ')) {
    return `https://${trimmed}`
  }
  
  // Check for special commands
  if (trimmed === 'home') return 'home'
  if (trimmed === 'projects' || trimmed === 'all projects') return 'projects:all'
  
  // Check if it matches a project pattern
  if (trimmed.startsWith('project:') || trimmed.startsWith('projects:')) {
    return trimmed
  }
  
  // Default to search
  return `search:${encodeURIComponent(trimmed)}`
}

/**
 * Extracts search query from search URL
 */
export function extractSearchQuery(url: string): string {
  if (!url.startsWith('search:')) return ''
  return decodeURIComponent(url.replace('search:', ''))
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}