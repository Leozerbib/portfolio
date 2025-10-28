import { ComponentType } from 'react'

// Import all project components
import Enchere from '@/components/os/projet/enchere'
import Gile from '@/components/os/projet/gile'
import Helixir from '@/components/os/projet/helixir'
import Lab from '@/components/os/projet/lab'
import OptimisationPostgres from '@/components/os/projet/optimisationPostgres'
import Satviewer from '@/components/os/projet/satviewer'
import Spotmap from '@/components/os/projet/spotmap'
import AllProjects from '@/components/os/projet/AllProjects'

// Import browser page components
import HomePage from '@/components/os/app/browser/HomePage'
import ProjectPage from '@/components/os/app/browser/ProjectPage'
import ErrorPage from '@/components/os/app/browser/ErrorPage'

// Component registry interface
export interface ComponentInfo {
  id: string
  name: string
  component: ComponentType<any>
  title: string
  description: string
  technologies: string[]
  category: string
  status: 'active' | 'development' | 'completed'
}

// Component registry
export const componentRegistry: Record<string, ComponentInfo> = {
  enchere: {
    id: 'enchere',
    name: 'enchere',
    component: Enchere,
    title: 'Système d\'Enchères',
    description: 'A comprehensive online auction system with real-time bidding, user authentication, and payment processing.',
    technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
    category: 'Web Application',
    status: 'completed'
  },
  gile: {
    id: 'gile',
    name: 'gile',
    component: Gile,
    title: 'Gile - File Manager',
    description: 'Modern file management system with cloud integration, advanced search, and collaborative features.',
    technologies: ['TypeScript', 'Electron', 'AWS S3', 'Redis'],
    category: 'Desktop Application',
    status: 'active'
  },
  helixir: {
    id: 'helixir',
    name: 'helixir',
    component: Helixir,
    title: 'Helixir - Code Editor',
    description: 'Next-generation code editor with AI assistance, collaborative editing, and advanced debugging tools.',
    technologies: ['Monaco Editor', 'WebAssembly', 'AI/ML', 'Docker'],
    category: 'Development Tool',
    status: 'development'
  },
  lab: {
    id: 'lab',
    name: 'lab',
    component: Lab,
    title: 'Lab - Experimental Platform',
    description: 'Research and development platform for testing new technologies and innovative web solutions.',
    technologies: ['WebGL', 'Three.js', 'WebRTC', 'Machine Learning'],
    category: 'Research',
    status: 'active'
  },
  optimisationPostgres: {
    id: 'optimisationPostgres',
    name: 'optimisationPostgres',
    component: OptimisationPostgres,
    title: 'Optimisation PostgreSQL',
    description: 'Database optimization tools and performance monitoring for PostgreSQL databases.',
    technologies: ['PostgreSQL', 'Performance Monitoring', 'SQL Optimization', 'Analytics'],
    category: 'Database Tool',
    status: 'completed'
  },
  satviewer: {
    id: 'satviewer',
    name: 'satviewer',
    component: Satviewer,
    title: 'SatViewer - Satellite Tracking',
    description: 'Real-time satellite tracking and visualization system with orbital predictions.',
    technologies: ['WebGL', 'Satellite APIs', 'Real-time Data', 'Orbital Mechanics'],
    category: 'Visualization',
    status: 'active'
  },
  spotmap: {
    id: 'spotmap',
    name: 'spotmap',
    component: Spotmap,
    title: 'SpotMap - Location Discovery',
    description: 'Interactive location discovery platform with user-generated content and social features.',
    technologies: ['Maps API', 'Geolocation', 'Social Features', 'Mobile-First'],
    category: 'Mobile Application',
    status: 'completed'
  },
  'all-projects': {
    id: 'all-projects',
    name: 'all-projects',
    component: AllProjects,
    title: 'All Projects Overview',
    description: 'Comprehensive portfolio overview showcasing all projects with detailed information and statistics.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    category: 'Portfolio',
    status: 'active'
  },
  'browser-home': {
    id: 'browser-home',
    name: 'browser-home',
    component: HomePage,
    title: 'Browser Home Page',
    description: 'Modern browser home page with quick links and navigation.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    category: 'Browser',
    status: 'active'
  },
  'browser-project': {
    id: 'browser-project',
    name: 'browser-project',
    component: ProjectPage,
    title: 'Browser Project Page',
    description: 'Project detail page for browser display with rich content and navigation.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    category: 'Browser',
    status: 'active'
  },
  'browser-error': {
    id: 'browser-error',
    name: 'browser-error',
    component: ErrorPage,
    title: 'Browser Error Page',
    description: 'Error page for browser with customizable error types and recovery options.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    category: 'Browser',
    status: 'active'
  }
}

// Helper function to get component by ID
export const getComponent = (id: string): ComponentInfo | null => {
  return componentRegistry[id] || null
}

// Helper function to get all components
export const getAllComponents = (): ComponentInfo[] => {
  return Object.values(componentRegistry)
}

// Helper function to get components by category
export const getComponentsByCategory = (category: string): ComponentInfo[] => {
  return Object.values(componentRegistry).filter(comp => comp.category === category)
}

// Helper function to get components by status
export const getComponentsByStatus = (status: string): ComponentInfo[] => {
  return Object.values(componentRegistry).filter(comp => comp.status === status)
}