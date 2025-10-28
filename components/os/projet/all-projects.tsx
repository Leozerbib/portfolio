'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Calendar, Users, Star } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  category: string
  status: 'active' | 'development' | 'completed'
  image?: string
  demoUrl?: string
  githubUrl?: string
  date: string
  team?: string[]
  featured?: boolean
}

const projects: Project[] = [
  {
    id: 'enchere',
    title: 'Système d\'Enchères',
    description: 'A comprehensive online auction system with real-time bidding, user authentication, and payment processing.',
    technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
    category: 'Web Application',
    status: 'completed',
    date: '2024-01',
    featured: true
  },
  {
    id: 'gile',
    title: 'Gile - File Manager',
    description: 'Modern file management system with cloud integration, advanced search, and collaborative features.',
    technologies: ['TypeScript', 'Electron', 'AWS S3', 'Redis'],
    category: 'Desktop Application',
    status: 'active',
    date: '2024-02',
    featured: true
  },
  {
    id: 'helixir',
    title: 'Helixir - Code Editor',
    description: 'Advanced code editor with AI-powered suggestions, collaborative editing, and extensive plugin system.',
    technologies: ['Rust', 'WebAssembly', 'TypeScript', 'Monaco Editor'],
    category: 'Development Tool',
    status: 'development',
    date: '2024-03'
  },
  {
    id: 'lab',
    title: 'Research Lab Platform',
    description: 'Digital platform for research collaboration, experiment tracking, and data visualization.',
    technologies: ['Python', 'Django', 'D3.js', 'PostgreSQL'],
    category: 'Research Platform',
    status: 'completed',
    date: '2023-12'
  },
  {
    id: 'optimisationPostgres',
    title: 'PostgreSQL Optimizer',
    description: 'Performance optimization toolkit for PostgreSQL databases with automated tuning and monitoring.',
    technologies: ['Go', 'PostgreSQL', 'Grafana', 'Docker'],
    category: 'Database Tool',
    status: 'active',
    date: '2024-01'
  },
  {
    id: 'satviewer',
    title: 'Satellite Viewer',
    description: 'Real-time satellite tracking and visualization platform with orbital prediction capabilities.',
    technologies: ['Three.js', 'WebGL', 'Node.js', 'Satellite APIs'],
    category: 'Visualization',
    status: 'completed',
    date: '2023-11',
    featured: true
  },
  {
    id: 'spotmap',
    title: 'SpotMap - Location Intelligence',
    description: 'Advanced mapping and location analytics platform with real-time data processing.',
    technologies: ['React', 'Mapbox', 'Python', 'Machine Learning'],
    category: 'GIS Application',
    status: 'active',
    date: '2024-02'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'development':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export default function AllProjects() {
  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Project Portfolio
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A collection of innovative projects showcasing expertise in modern web development, 
            system architecture, and cutting-edge technologies.
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Featured Projects
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-2 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {project.category}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {project.date}
                      </div>
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <Github className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            All Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {project.category}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {project.date}
                    </div>
                    <div className="flex gap-2">
                      {project.demoUrl && (
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button size="sm" variant="outline" className="h-7 px-2">
                          <Github className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mt-12 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {projects.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Projects
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Completed
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projects.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {projects.filter(p => p.status === 'development').length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                In Development
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}