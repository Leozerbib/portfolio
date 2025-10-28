'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Globe, 
  ExternalLink, 
  Code, 
  Star,
  Zap,
  Database,
  Smartphone,
  Monitor,
  ArrowLeft,
  Beaker,
  Lightbulb,
  Rocket,
  Atom,
  Microscope,
  FlaskConical
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the Lab component
 */
interface LabProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Lab component - Experimental platform for innovative web solutions
 */
export default function Lab({ className, onBack }: LabProps) {
  const projectData = {
    title: "Lab - Experimental Platform",
    subtitle: "Plateforme de recherche et développement",
    description: "Une plateforme de recherche et développement pour tester de nouvelles technologies et créer des solutions web innovantes avec des expériences immersives et des interfaces révolutionnaires.",
    status: "Actif",
    category: "Recherche & Développement",
    technologies: ["WebGL", "Three.js", "WebRTC", "GraphQL", "WebAssembly", "WebXR"],
    features: [
      "Expériences WebGL immersives",
      "Communication temps réel WebRTC",
      "API GraphQL flexible",
      "Réalité virtuelle et augmentée",
      "Calculs haute performance",
      "Interface expérimentale avancée"
    ],
    specifications: {
      "Rendu 3D": "Three.js avec WebGL 2.0",
      "Temps réel": "WebRTC pour communication P2P",
      "API": "GraphQL avec subscriptions",
      "Performance": "WebAssembly pour calculs intensifs",
      "XR": "WebXR pour VR/AR",
      "Déploiement": "Edge computing avec CDN"
    },
    metrics: {
      "FPS moyen": "120 FPS",
      "Latence": "< 10ms",
      "Expériences": "50+",
      "Chercheurs": "15+"
    }
  }

  const experiments = [
    {
      name: "Neural Networks Viz",
      description: "Visualisation interactive de réseaux de neurones",
      status: "Actif",
      icon: "🧠"
    },
    {
      name: "Quantum Simulator",
      description: "Simulateur quantique dans le navigateur",
      status: "Beta",
      icon: "⚛️"
    },
    {
      name: "Holographic UI",
      description: "Interface utilisateur holographique",
      status: "Prototype",
      icon: "🔮"
    }
  ]

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="text-2xl">🧪</div>
          <div>
            <h1 className="text-2xl font-bold">{projectData.title}</h1>
            <p className="text-muted-foreground">{projectData.subtitle}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="default">{projectData.status}</Badge>
          <Badge variant="outline">{projectData.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Vue d ensemble du projet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {projectData.description}
              </p>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technologies utilisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fonctionnalités principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {projectData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Spécifications techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(projectData.specifications).map(([key, value], index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="font-medium text-sm min-w-[120px]">{key}:</div>
                    <div className="text-sm text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Métriques de performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(projectData.metrics).map(([key, value], index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground">{key}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5" />
                Domaines de recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <Atom className="h-8 w-8 mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">Physique Quantique</h4>
                  <p className="text-sm text-muted-foreground">Simulation de systèmes quantiques</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Lightbulb className="h-8 w-8 mb-2 text-yellow-500" />
                  <h4 className="font-semibold mb-1">IA Générative</h4>
                  <p className="text-sm text-muted-foreground">Création de contenu automatisée</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Rocket className="h-8 w-8 mb-2 text-red-500" />
                  <h4 className="font-semibold mb-1">WebXR</h4>
                  <p className="text-sm text-muted-foreground">Réalité virtuelle et augmentée</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Experiments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Expériences actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiments.map((experiment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{experiment.icon}</div>
                      <div>
                        <h4 className="font-semibold">{experiment.name}</h4>
                        <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      </div>
                    </div>
                    <Badge variant={experiment.status === 'Actif' ? 'default' : experiment.status === 'Beta' ? 'secondary' : 'outline'}>
                      {experiment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Aperçu des expériences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Beaker className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Interface de laboratoire</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Atom className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Visualisations 3D</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Explorer le lab
            </Button>
            <Button variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Code source
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Publications
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}