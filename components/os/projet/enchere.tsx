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
  Zap,
  Database,
  Smartphone,
  Monitor,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the Enchere component
 */
interface EnchereProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Enchere component - Comprehensive online auction system project
 */
export default function Enchere({ className, onBack }: EnchereProps) {
  const projectData = {
    title: "Système d'Enchères",
    subtitle: "Plateforme d'enchères en ligne complète",
    description: "Un système d'enchères sophistiqué avec enchères en temps réel, authentification utilisateur, traitement des paiements et gestion avancée des ventes aux enchères.",
    status: "Terminé",
    category: "Application Web",
    technologies: ["React", "Node.js", "WebSocket", "PostgreSQL", "Stripe", "Redis"],
    features: [
      "Enchères en temps réel avec WebSocket",
      "Système d'authentification sécurisé",
      "Traitement des paiements intégré",
      "Interface d'administration complète",
      "Notifications push en temps réel",
      "Historique des enchères détaillé"
    ],
    specifications: {
      "Architecture": "Microservices avec API REST",
      "Base de données": "PostgreSQL avec Redis pour le cache",
      "Authentification": "JWT avec refresh tokens",
      "Paiements": "Intégration Stripe",
      "Temps réel": "WebSocket avec Socket.io",
      "Déploiement": "Docker + Kubernetes"
    },
    metrics: {
      "Utilisateurs": "10,000+",
      "Enchères simultanées": "500+",
      "Temps de réponse": "< 100ms",
      "Disponibilité": "99.9%"
    }
  }

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
          <div className="text-2xl">🏆</div>
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

          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Aperçu de l interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Interface principale</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dashboard admin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Voir la démo
            </Button>
            <Button variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Code source
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}