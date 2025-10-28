import { BrowserTab } from './tab-utils'

/**
 * Browser utility functions for URL handling, content generation, and page title logic
 */

/**
 * Generates a page title based on the URL
 */
export function getPageTitle(url: string): string {
  if (url === 'home' || url === '') return 'Home'
  if (url.startsWith('project:')) {
    const projectId = url.replace('project:', '')
    return `Project: ${projectId}`
  }
  if (url.startsWith('projects:')) {
    const projectId = url.replace('projects:', '')
    if (projectId === 'all') return 'All Projects'
    return `Projects: ${projectId}`
  }
  if (url.startsWith('search:')) {
    const query = url.replace('search:', '')
    return `Search: ${query}`
  }
  return 'Browser'
}

/**
 * Determines the content type based on URL
 */
export function getContentType(url: string): BrowserTab['contentType'] {
  if (url === 'home' || url === '') return 'home'
  if (url.startsWith('project:') || url.startsWith('projects:')) return 'project'
  if (url.startsWith('search:')) return 'search'
  if (url.startsWith('data:text/html') || url.startsWith('http')) return 'html'
  return 'home'
}

/**
 * Gets the component ID for home page content
 */
export function getHomeComponentId(): string {
  return 'browser-home'
}

/**
 * Gets the component ID for project page content
 */
export function getProjectComponentId(): string {
  return 'browser-project'
}

/**
 * Gets the component ID for error page content
 */
export function getErrorComponentId(): string {
  return 'browser-error'
}

/**
 * Gets component props for home page
 */
export function getHomeComponentProps() {
  return {
    onNavigate: (url: string) => {
      // This will be handled by the parent component
      console.log('Navigate to:', url)
    },
    quickLinks: [
      {
        title: 'All Projects',
        description: 'Browse all available projects',
        url: 'projects:all',
        category: 'Projects'
      },
      {
        title: 'Enchere Project',
        description: 'Auction system implementation',
        url: 'project:enchere',
        category: 'Projects'
      },
      {
        title: 'Gile Project',
        description: 'Project management system',
        url: 'project:gile',
        category: 'Projects'
      },
      {
        title: 'Helixir Project',
        description: 'Advanced web application',
        url: 'project:helixir',
        category: 'Projects'
      }
    ]
  }
}

/**
 * Gets component props for project page
 */
export function getProjectComponentProps(project?: { id: string; name: string; description: string; path: string }) {
  if (!project) {
    return null
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      path: project.path,
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
      features: [
        'Modern responsive design',
        'Type-safe development with TypeScript',
        'Server-side rendering with Next.js',
        'Component-based architecture',
        'Optimized performance'
      ]
    },
    onNavigate: (url: string) => {
      console.log('Navigate to:', url)
    },
    onBack: () => {
      console.log('Go back')
    }
  }
}

/**
 * Gets component props for error page
 */
export function getErrorComponentProps(message: string = 'Page not found', errorType: string = '404') {
  return {
    errorType: errorType as 'network' | 'timeout' | 'permission' | 'generic' | '404' | '500',
    message,
    details: 'The page you\'re looking for could not be found.',
    onNavigate: (url: string) => {
      console.log('Navigate to:', url)
    },
    onRefresh: () => {
      console.log('Refresh page')
    },
    onBack: () => {
      console.log('Go back')
    }
  }
}