'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Globe, 
  Calendar, 
  Code, 
  Star,
  Grid3X3,
  List,
  ArrowUpRight,
  Monitor
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Project interface defining the structure of each project
 */
interface Project {
  id: string
  name: string
  title: string
  description: string
  technologies: string[]
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'database' | 'tools'
  status: 'active' | 'completed' | 'in-progress' | 'archived'
  lastUpdated: string
  size: number
  path: string
  icon: string
  featured?: boolean
}

/**
 * Props for the AllProjects component
 */
interface AllProjectsProps {
  /** Optional className for styling */
  className?: string
  /** Callback when a project is selected */
  onProjectSelect?: (project: Project) => void
  /** View mode for the project list */
  viewMode?: 'grid' | 'list'
  /** Callback to open project in browser */
  onOpenInBrowser?: (projectId: string) => void
  /** Optional projects array to display instead of mock data */
  projects?: Project[]
}

/**
 * AllProjects component that displays a comprehensive list of all portfolio projects
 * with search, filtering, and dynamic routing capabilities
 */
export default function AllProjects({ 
  className, 
  onProjectSelect,
  viewMode: initialViewMode = 'grid',
  onOpenInBrowser,
  projects: externalProjects
}: AllProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [isLoading, setIsLoading] = useState(true)

  // Project data with all created components - integrated with BrowserApp
  const mockProjects: Project[] = [
    {
      id: 'enchere',
      name: 'Système d\'Enchères',
      title: 'Système d\'Enchères',
      description: 'A comprehensive online auction system with real-time bidding, user authentication, payment processing, and advanced security features.',
      technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL', 'Stripe', 'Redis'],
      category: 'web',
      status: 'completed',
      lastUpdated: '2024-01-15',
      size: 2048,
      path: '/Projects/enchere.tsx',
      icon: '🏆',
      featured: true
    },
    {
      id: 'gile',
      name: 'Gile - File Manager',
      title: 'Gile - File Manager',
      description: 'Modern file management system with cloud integration, advanced search, collaborative features, and cross-platform support.',
      technologies: ['TypeScript', 'Electron', 'AWS S3', 'Redis', 'SQLite', 'React'],
      category: 'desktop',
      status: 'active',
      lastUpdated: '2024-01-20',
      size: 1856,
      path: '/Projects/gile.tsx',
      icon: '📁',
      featured: true
    },
    {
      id: 'helixir',
      name: 'Helixir - Code Editor',
      title: 'Helixir - Code Editor',
      description: 'Next-generation code editor with AI assistance, collaborative editing, advanced debugging tools, and modern interface.',
      technologies: ['Monaco Editor', 'WebAssembly', 'AI/ML', 'Docker', 'TypeScript', 'Rust'],
      category: 'tools',
      status: 'in-progress',
      lastUpdated: '2024-01-18',
      size: 2304,
      path: '/Projects/helixir.tsx',
      icon: '⚡',
      featured: true
    },
    {
      id: 'lab',
      name: 'Lab - Experimental Platform',
      title: 'Lab - Experimental Platform',
      description: 'Research and development platform for testing new technologies, innovative web solutions, and cutting-edge experiments.',
      technologies: ['WebGL', 'Three.js', 'WebRTC', 'GraphQL', 'WebAssembly', 'WebXR'],
      category: 'web',
      status: 'active',
      lastUpdated: '2024-01-22',
      size: 1920,
      path: '/Projects/lab.tsx',
      icon: '🧪'
    },
    {
      id: 'optimisationPostgres',
      name: 'PostgreSQL Optimization',
      title: 'PostgreSQL Optimization',
      description: 'Advanced database optimization toolkit with performance monitoring, query analysis, and real-time metrics dashboard.',
      technologies: ['PostgreSQL', 'Python', 'Go', 'Grafana', 'Prometheus', 'Docker'],
      category: 'database',
      status: 'completed',
      lastUpdated: '2024-01-10',
      size: 1792,
      path: '/Projects/optimisationPostgres.tsx',
      icon: '🐘'
    },
    {
      id: 'satviewer',
      name: 'SatViewer - Satellite Tracking',
      title: 'SatViewer - Satellite Tracking',
      description: 'Real-time satellite tracking application with 3D visualization, orbital predictions, and comprehensive space data.',
      technologies: ['React', 'Three.js', 'WebGL', 'Node.js', 'Socket.io', 'PostgreSQL'],
      category: 'web',
      status: 'completed',
      lastUpdated: '2024-01-12',
      size: 2176,
      path: '/Projects/satviewer.tsx',
      icon: '🛰️',
      featured: true
    },
    {
      id: 'spotmap',
      name: 'SpotMap - Location Discovery',
      title: 'SpotMap - Location Discovery',
      description: 'Interactive mapping application for discovering and sharing interesting locations, hidden gems, and community-driven content.',
      technologies: ['React Native', 'Mapbox', 'Node.js', 'MongoDB', 'Socket.io', 'AWS S3'],
      category: 'mobile',
      status: 'active',
      lastUpdated: '2024-01-25',
      size: 1984,
      path: '/Projects/spotmap.tsx',
      icon: '📍'
    }
  ]

  // Initialize projects
  useEffect(() => {
    setIsLoading(true)
    
    // Use external projects if provided, otherwise use mock data
    const projectsToUse = externalProjects && externalProjects.length > 0 ? externalProjects : mockProjects
    console.log('🎯 AllProjects - Using projects:', projectsToUse.length, 'external:', !!externalProjects)
    
    // Simulate API call delay
    setTimeout(() => {
      setProjects(projectsToUse)
      setFilteredProjects(projectsToUse)
      setIsLoading(false)
    }, 500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalProjects])

  // Filter projects based on search query, category, and status
  useEffect(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus)
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, selectedCategory, selectedStatus])

  const handleProjectClick = (project: Project) => {
    console.log('🎯 AllProjects - Project clicked:', project.id)
    
    if (onOpenInBrowser) {
      console.log('🎯 AllProjects - Calling onOpenInBrowser with:', project.id)
      onOpenInBrowser(project.id)
    } else if (onProjectSelect) {
      console.log('🎯 AllProjects - Calling onProjectSelect with:', project)
      onProjectSelect(project)
    } else {
      console.log('🎯 AllProjects - No callback available')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return <Globe className="h-4 w-4" />
      case 'mobile': return <Globe className="h-4 w-4" />
      case 'desktop': return <Code className="h-4 w-4" />
      case 'ai': return <Star className="h-4 w-4" />
      case 'database': return <Code className="h-4 w-4" />
      case 'tools': return <Code className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const categories = ['all', 'web', 'mobile', 'desktop', 'ai', 'database', 'tools']
  const statuses = ['all', 'active', 'completed', 'in-progress', 'archived']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6 space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🚀 All Projects
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore my complete portfolio of web applications, tools, and experiments. 
          Each project showcases different technologies and innovative solutions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        {filteredProjects.some(p => p.featured) && (
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            Featured Projects Available
          </Badge>
        )}
      </div>

      <Separator />

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                project.featured && "ring-2 ring-primary/20",
                viewMode === 'list' && "flex flex-row"
              )}
              onClick={() => handleProjectClick(project)}
            >
              <CardHeader className={cn(viewMode === 'list' && "flex-1")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.icon}</span>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {project.title}
                        {project.featured && (
                          <Star className="inline h-4 w-4 ml-2 text-yellow-500 fill-current" />
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(project.category)}
                        <span className="text-sm text-muted-foreground capitalize">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {(project.size / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {onOpenInBrowser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenInBrowser(project.id)
                        }}
                        title="Open in Browser"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className={cn("pt-0", viewMode === 'list' && "flex-2")}>
                <CardDescription className="mb-4 line-clamp-2">
                  {project.description}
                </CardDescription>

                <div className="space-y-3">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Status and Date */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(project.status))} />
                      <span className="capitalize text-muted-foreground">{project.status}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">
              {new Set(projects.flatMap(p => p.technologies)).size}+
            </div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">2024</div>
            <div className="text-sm text-muted-foreground">Current Year</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}