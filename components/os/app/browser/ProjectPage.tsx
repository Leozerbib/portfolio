'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ExternalLink, 
  Github, 
  Globe, 
  Code, 
  CheckCircle, 
  Folder,
  Calendar,
  User,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Project interface
 */
export interface Project {
  id: string
  name: string
  description: string
  path: string
  type?: string
  technologies?: string[]
  features?: string[]
  status?: 'completed' | 'in-progress' | 'planned'
  githubUrl?: string
  liveUrl?: string
  createdAt?: string
  author?: string
}

/**
 * Props for the ProjectPage component
 */
export interface ProjectPageProps {
  /** Project data */
  project?: Project
  /** Navigation callback */
  onNavigate?: (url: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * ProjectPage Component
 * Modern TSX replacement for project page HTML generation
 */
export function ProjectPage({ project, onNavigate, className }: ProjectPageProps) {
  if (!project) {
    return (
      <div className={cn("flex flex-col h-full bg-background", className)}>
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Folder className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Project Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested project could not be found or loaded.
            </p>
            {onNavigate && (
              <Button onClick={() => onNavigate('home')} variant="default" size="sm">
                Go Home
              </Button>
            )}
          </Card>
        </div>
      </div>
    )
  }

  const defaultTechnologies = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js']
  const defaultFeatures = [
    'Modern responsive design',
    'Type-safe development with TypeScript',
    'Server-side rendering with Next.js',
    'Component-based architecture',
    'Optimized performance'
  ]

  const technologies = project.technologies || defaultTechnologies
  const features = project.features || defaultFeatures
  const status = project.status || 'completed'

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'in-progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'planned':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Code className="w-4 h-4" />
      case 'planned':
        return <Calendar className="w-4 h-4" />
      default:
        return <Folder className="w-4 h-4" />
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-foreground">
                      {project.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs flex items-center gap-1", getStatusColor(status))}
                      >
                        {getStatusIcon(status)}
                        {status}
                      </Badge>
                      {project.type && (
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {project.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-2 ml-6">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="default" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Project Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {project.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {project.author}
                </div>
              )}
              {project.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.createdAt}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Folder className="w-4 h-4" />
                {project.path}
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Overview */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Project Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This project demonstrates advanced web development techniques and modern 
                  software architecture patterns. It showcases best practices in React 
                  development, TypeScript implementation, and modern UI/UX design principles.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The implementation focuses on performance optimization, accessibility, 
                  and maintainable code structure, making it an excellent example of 
                  professional-grade web development.
                </p>
              </Card>

              {/* Key Features */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Key Features
                </h2>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Project Path */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-primary" />
                  Project Location
                </h2>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  <code className="text-foreground">{project.path}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Full path to the project directory in the development environment
                </p>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technology Stack */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {onNavigate && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => onNavigate('projects:all')}
                      >
                        <Folder className="w-4 h-4 mr-2" />
                        View All Projects
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => onNavigate('home')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Back to Home
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {/* Project Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Project Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getStatusColor(status))}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Technologies</span>
                    <span className="text-sm font-medium">{technologies.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Features</span>
                    <span className="text-sm font-medium">{features.length}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t bg-muted/30 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Project: {project.name}</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage