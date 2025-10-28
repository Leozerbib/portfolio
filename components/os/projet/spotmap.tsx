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
  Users,
  Shield,
  Zap,
  Database,
  Smartphone,
  Monitor,
  ArrowLeft,
  MapPin,
  Layers,
  Search,
  Camera,
  Wifi,
  Share2,
  Download,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the SpotMap component
 */
interface SpotMapProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * SpotMap component - Advanced mapping and geolocation platform
 */
export default function SpotMap({ className, onBack }: SpotMapProps) {
  const projectData = {
    title: "SpotMap - Cartographie Interactive",
    subtitle: "Plateforme de cartographie et géolocalisation avancée",
    description: "Une application de cartographie interactive complète avec géolocalisation en temps réel, partage de spots, navigation avancée et fonctionnalités collaboratives pour découvrir et partager des lieux d'intérêt.",
    status: "En développement",
    category: "Géolocalisation",
    technologies: ["React Native", "Mapbox", "Node.js", "MongoDB", "Socket.io", "AWS S3"],
    features: [
      "Cartographie interactive haute résolution",
      "Géolocalisation GPS précise",
      "Partage de spots géolocalisés",
      "Navigation turn-by-turn",
      "Mode hors-ligne avec cartes téléchargées",
      "Communauté et évaluations"
    ],
    specifications: {
      "Frontend": "React Native avec Expo",
      "Cartes": "Mapbox GL Native",
      "Backend": "Node.js avec Express",
      "Base de données": "MongoDB Atlas",
      "Stockage": "AWS S3 pour médias",
      "Temps réel": "Socket.io WebSockets"
    },
    metrics: {
      "Spots": "50K+",
      "Utilisateurs": "15K+",
      "Précision GPS": "±3m",
      "Cartes offline": "200+"
    }
  }

  const mapFeatures = [
    {
      name: "Cartes vectorielles",
      description: "Rendu haute qualité avec zoom infini",
      technology: "Mapbox GL",
      performance: "60 FPS",
      icon: "🗺️"
    },
    {
      name: "Géolocalisation",
      description: "Positionnement GPS haute précision",
      technology: "Native GPS",
      accuracy: "±3 mètres",
      icon: "📍"
    },
    {
      name: "Navigation",
      description: "Guidage vocal turn-by-turn",
      technology: "Mapbox Directions",
      features: "Temps réel",
      icon: "🧭"
    },
    {
      name: "Mode offline",
      description: "Cartes téléchargées pour usage hors-ligne",
      technology: "Mapbox Offline",
      storage: "Jusqu'à 5GB",
      icon: "📱"
    }
  ]

  const spotCategories = [
    {
      name: "Nature & Randonnée",
      count: "12,500",
      description: "Sentiers, points de vue, cascades",
      color: "text-green-500",
      icon: "🌲"
    },
    {
      name: "Photographie",
      count: "8,200",
      description: "Spots photo, couchers de soleil",
      color: "text-purple-500",
      icon: "📸"
    },
    {
      name: "Sports & Loisirs",
      count: "6,800",
      description: "Escalade, surf, vélo, ski",
      color: "text-blue-500",
      icon: "🏔️"
    },
    {
      name: "Culture & Histoire",
      count: "4,500",
      description: "Monuments, musées, sites historiques",
      color: "text-orange-500",
      icon: "🏛️"
    },
    {
      name: "Gastronomie",
      count: "9,200",
      description: "Restaurants, bars, marchés locaux",
      color: "text-red-500",
      icon: "🍽️"
    },
    {
      name: "Hébergement",
      count: "3,800",
      description: "Camping, gîtes, hôtels insolites",
      color: "text-cyan-500",
      icon: "🏕️"
    }
  ]

  const communityFeatures = [
    {
      name: "Partage de spots",
      description: "Ajout facile avec photos et descriptions",
      users: "15K contributeurs",
      icon: "📤"
    },
    {
      name: "Évaluations",
      description: "Système de notation et commentaires",
      ratings: "125K avis",
      icon: "⭐"
    },
    {
      name: "Collections",
      description: "Listes personnalisées de spots favoris",
      collections: "8K listes",
      icon: "📋"
    },
    {
      name: "Événements",
      description: "Organisation de sorties communautaires",
      events: "500/mois",
      icon: "🎉"
    }
  ]

  const technicalCapabilities = [
    {
      category: "Performance",
      items: [
        "Rendu vectoriel 60 FPS",
        "Cache intelligent des tuiles",
        "Compression d'images optimisée",
        "Lazy loading des données"
      ]
    },
    {
      category: "Géolocalisation",
      items: [
        "GPS, GLONASS, Galileo",
        "Correction différentielle",
        "Géofencing avancé",
        "Tracking en arrière-plan"
      ]
    },
    {
      category: "Données",
      items: [
        "Synchronisation offline/online",
        "Compression des cartes",
        "API REST complète",
        "Export GPX/KML"
      ]
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
          <div className="text-2xl">🗺️</div>
          <div>
            <h1 className="text-2xl font-bold">{projectData.title}</h1>
            <p className="text-muted-foreground">{projectData.subtitle}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">{projectData.status}</Badge>
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

          {/* Map Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Fonctionnalités cartographiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mapFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{feature.technology}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        {feature.performance || feature.accuracy || feature.features || feature.storage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spot Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Catégories de spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotCategories.map((category, index) => (
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

          {/* Community Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Fonctionnalités communautaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityFeatures.map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {feature.users || feature.ratings || feature.collections || feature.events}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Capacités techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {technicalCapabilities.map((capability, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-3 text-primary">{capability.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {capability.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Expérience mobile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <Camera className="h-8 w-8 mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">Appareil photo intégré</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Capture et géolocalisation automatique des photos
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <Wifi className="h-8 w-8 mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1 text-green-700 dark:text-green-400">Mode hors-ligne</h4>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Fonctionnement complet sans connexion internet
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                  <Share2 className="h-8 w-8 mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1 text-purple-700 dark:text-purple-400">Partage social</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300">
                    Intégration avec les réseaux sociaux populaires
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestion des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">Synchronisation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Sync automatique entre appareils
                    </p>
                    <Badge variant="outline">Temps réel</Badge>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold">Sauvegarde cloud</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Backup automatique sur AWS S3
                    </p>
                    <Badge variant="outline">Chiffré</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">Formats supportés</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">GPX</Badge>
                    <Badge variant="secondary">KML</Badge>
                    <Badge variant="secondary">GeoJSON</Badge>
                    <Badge variant="secondary">Shapefile</Badge>
                    <Badge variant="secondary">CSV</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Interface utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Vue carte interactive</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Search className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Recherche et filtres</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Smartphone className="h-4 w-4 mr-2" />
              Télécharger l app
            </Button>
            <Button variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Code source
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Version web
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}