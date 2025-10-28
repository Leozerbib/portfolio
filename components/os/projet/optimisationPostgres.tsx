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
  BarChart3,
  TrendingUp,
  Clock,
  Server,
  Gauge,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the OptimisationPostgres component
 */
interface OptimisationPostgresProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * OptimisationPostgres component - Advanced PostgreSQL performance optimization toolkit
 */
export default function OptimisationPostgres({ className, onBack }: OptimisationPostgresProps) {
  const projectData = {
    title: "Optimisation PostgreSQL",
    subtitle: "Toolkit d'optimisation de performance",
    description: "Un ensemble d'outils et de techniques avancées pour optimiser les performances des bases de données PostgreSQL, incluant l'analyse des requêtes, l'optimisation des index, et le monitoring en temps réel.",
    status: "Production",
    category: "Base de données",
    technologies: ["PostgreSQL", "Python", "Go", "Grafana", "Prometheus", "Docker"],
    features: [
      "Analyse automatique des requêtes lentes",
      "Optimisation intelligente des index",
      "Monitoring en temps réel",
      "Recommandations de performance",
      "Alertes proactives",
      "Rapports détaillés de performance"
    ],
    specifications: {
      "Base de données": "PostgreSQL 15+",
      "Monitoring": "Prometheus + Grafana",
      "Backend": "Go avec Gin framework",
      "Scripts": "Python 3.11+",
      "Conteneurisation": "Docker & Docker Compose",
      "Déploiement": "Kubernetes ready"
    },
    metrics: {
      "Amélioration": "+85%",
      "Requêtes/sec": "50K+",
      "Temps de réponse": "< 50ms",
      "Disponibilité": "99.9%"
    }
  }

  const optimizations = [
    {
      name: "Index Optimization",
      description: "Analyse et création automatique d'index optimaux",
      impact: "Haute",
      improvement: "+70%",
      icon: "🔍"
    },
    {
      name: "Query Rewriting",
      description: "Réécriture intelligente des requêtes SQL",
      impact: "Très haute",
      improvement: "+120%",
      icon: "✏️"
    },
    {
      name: "Connection Pooling",
      description: "Optimisation des pools de connexions",
      impact: "Moyenne",
      improvement: "+40%",
      icon: "🔗"
    },
    {
      name: "Vacuum Tuning",
      description: "Configuration automatique du VACUUM",
      impact: "Haute",
      improvement: "+60%",
      icon: "🧹"
    }
  ]

  const performanceMetrics = [
    { name: "Throughput", value: "50,000", unit: "req/s", trend: "+25%" },
    { name: "Latence P95", value: "45", unit: "ms", trend: "-60%" },
    { name: "CPU Usage", value: "35", unit: "%", trend: "-40%" },
    { name: "Memory", value: "2.1", unit: "GB", trend: "-30%" }
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
          <div className="text-2xl">🐘</div>
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

          {/* Optimization Techniques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Techniques d optimisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((optimization, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{optimization.icon}</div>
                      <div>
                        <h4 className="font-semibold">{optimization.name}</h4>
                        <p className="text-sm text-muted-foreground">{optimization.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={optimization.impact === 'Très haute' ? 'default' : optimization.impact === 'Haute' ? 'secondary' : 'outline'}>
                        {optimization.impact}
                      </Badge>
                      <div className="text-sm font-semibold text-green-600 mt-1">
                        {optimization.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{metric.name}</h4>
                      <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Architecture Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Architecture du système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">PostgreSQL Core</h4>
                  <p className="text-sm text-muted-foreground">Moteur de base de données optimisé</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <BarChart3 className="h-8 w-8 mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Surveillance continue des performances</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Gauge className="h-8 w-8 mb-2 text-orange-500" />
                  <h4 className="font-semibold mb-1">Auto-tuning</h4>
                  <p className="text-sm text-muted-foreground">Optimisation automatique</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Résultats d optimisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-green-700 dark:text-green-400">Amélioration globale</div>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600">60%</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">Réduction latence</div>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="text-3xl font-bold text-purple-600">40%</div>
                    <div className="text-sm text-purple-700 dark:text-purple-400">Économie ressources</div>
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
                Tableaux de bord
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Dashboard Grafana</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Monitoring temps réel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Voir les dashboards
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