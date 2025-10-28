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
  Satellite,
  Radio,
  MapPin,
  Orbit,
  Radar,
  Telescope,
  Navigation,
  Signal
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the SatViewer component
 */
interface SatViewerProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * SatViewer component - Real-time satellite tracking and visualization platform
 */
export default function SatViewer({ className, onBack }: SatViewerProps) {
  const projectData = {
    title: "SatViewer - Satellite Tracker",
    subtitle: "Plateforme de suivi satellitaire en temps réel",
    description: "Une application web avancée pour le suivi et la visualisation en temps réel des satellites en orbite terrestre, avec des prédictions de passage, des cartes interactives et des données télémétriques détaillées.",
    status: "Actif",
    category: "Aérospatial",
    technologies: ["React", "Three.js", "WebGL", "Node.js", "Socket.io", "PostgreSQL"],
    features: [
      "Suivi en temps réel de 25,000+ satellites",
      "Visualisation 3D de la Terre et des orbites",
      "Prédictions de passage précises",
      "Cartes interactives avec trajectoires",
      "Alertes de passage personnalisées",
      "Données télémétriques en direct"
    ],
    specifications: {
      "Frontend": "React 18 avec Three.js",
      "Backend": "Node.js avec Express",
      "Base de données": "PostgreSQL + Redis",
      "Temps réel": "Socket.io WebSockets",
      "Cartes": "Mapbox GL JS",
      "Calculs orbitaux": "Satellite.js + SGP4"
    },
    metrics: {
      "Satellites": "25K+",
      "Précision": "99.8%",
      "Latence": "< 100ms",
      "Utilisateurs": "10K+"
    }
  }

  const satelliteCategories = [
    {
      name: "ISS & Stations",
      count: "15",
      description: "Stations spatiales habitées",
      color: "text-blue-500",
      icon: "🏠"
    },
    {
      name: "Communication",
      count: "8,500",
      description: "Satellites de télécommunication",
      color: "text-green-500",
      icon: "📡"
    },
    {
      name: "Navigation",
      count: "120",
      description: "GPS, GLONASS, Galileo",
      color: "text-purple-500",
      icon: "🧭"
    },
    {
      name: "Observation",
      count: "2,800",
      description: "Satellites d'observation terrestre",
      color: "text-orange-500",
      icon: "🛰️"
    },
    {
      name: "Météo",
      count: "450",
      description: "Satellites météorologiques",
      color: "text-cyan-500",
      icon: "🌤️"
    },
    {
      name: "Militaire",
      count: "1,200",
      description: "Satellites de défense",
      color: "text-red-500",
      icon: "🛡️"
    }
  ]

  const trackingFeatures = [
    {
      name: "Prédiction de passage",
      description: "Calcul précis des passages visibles",
      accuracy: "99.8%",
      icon: "⏰"
    },
    {
      name: "Visualisation 3D",
      description: "Rendu 3D temps réel des orbites",
      performance: "60 FPS",
      icon: "🌍"
    },
    {
      name: "Alertes personnalisées",
      description: "Notifications de passage configurables",
      delivery: "< 1s",
      icon: "🔔"
    },
    {
      name: "Données TLE",
      description: "Mise à jour automatique des éléments orbitaux",
      frequency: "2x/jour",
      icon: "📊"
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
          <div className="text-2xl">🛰️</div>
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

          {/* Satellite Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5" />
                Catégories de satellites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {satelliteCategories.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h4 className="font-semibold">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${category.color}`}>
                      {category.count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5" />
                Fonctionnalités de suivi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        {feature.accuracy || feature.performance || feature.delivery || feature.frequency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="h-5 w-5" />
                Sources de données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <Radio className="h-8 w-8 mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">NORAD TLE</h4>
                  <p className="text-sm text-muted-foreground">Éléments orbitaux officiels</p>
                  <Badge variant="outline" className="mt-2">Temps réel</Badge>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Telescope className="h-8 w-8 mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Space-Track.org</h4>
                  <p className="text-sm text-muted-foreground">Base de données spatiale</p>
                  <Badge variant="outline" className="mt-2">2x/jour</Badge>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Navigation className="h-8 w-8 mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1">Celestrak</h4>
                  <p className="text-sm text-muted-foreground">Données supplémentaires</p>
                  <Badge variant="outline" className="mt-2">Quotidien</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orbital Mechanics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Orbit className="h-5 w-5" />
                Mécanique orbitale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Modèle SGP4</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Propagation orbitale haute précision pour les objets en orbite terrestre
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Prédictions</h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Calcul des passages visibles avec précision sub-seconde
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Paramètres orbitaux calculés</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Altitude</div>
                      <div className="text-muted-foreground">Périgée/Apogée</div>
                    </div>
                    <div>
                      <div className="font-medium">Inclinaison</div>
                      <div className="text-muted-foreground">Angle orbital</div>
                    </div>
                    <div>
                      <div className="font-medium">Période</div>
                      <div className="text-muted-foreground">Temps de révolution</div>
                    </div>
                    <div>
                      <div className="font-medium">Vitesse</div>
                      <div className="text-muted-foreground">Vitesse orbitale</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Interface utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Vue 3D interactive</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cartes de trajectoires</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Lancer SatViewer
            </Button>
            <Button variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Code source
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              API Documentation
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}