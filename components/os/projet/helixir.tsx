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
  Terminal,
  Cpu,
  Brain,
  GitBranch,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for the Helixir component
 */
interface HelixirProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Helixir component - Next-generation code editor project
 */
export default function Helixir({ className, onBack }: HelixirProps) {
  const projectData = {
    title: "Helixir - Code Editor",
    subtitle: "Éditeur de code nouvelle génération avec IA",
    description: "Un éditeur de code révolutionnaire avec assistance IA, édition collaborative, outils de débogage avancés et interface moderne pour une expérience de développement optimale.",
    status: "En cours",
    category: "Outils de développement",
    technologies: ["Monaco Editor", "WebAssembly", "AI/ML", "Docker", "TypeScript", "Rust"],
    features: [
      "Assistance IA pour l'autocomplétion intelligente",
      "Édition collaborative en temps réel",
      "Débogage intégré multi-langages",
      "Extensions et plugins personnalisables",
      "Interface moderne et personnalisable",
      "Intégration Git avancée"
    ],
    specifications: {
      "Moteur d'édition": "Monaco Editor avec extensions custom",
      "IA/ML": "Modèles Transformer pour code completion",
      "Performance": "WebAssembly pour calculs intensifs",
      "Collaboration": "WebRTC + WebSocket",
      "Langages supportés": "50+ langages de programmation",
      "Plateformes": "Web, Desktop (Electron)"
    },
    metrics: {
      "Vitesse d'édition": "60 FPS",
      "Temps de démarrage": "< 2s",
      "Précision IA": "94%",
      "Utilisateurs beta": "5,000+"
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
          <div className="text-2xl">⚡</div>
          <div>
            <h1 className="text-2xl font-bold">{projectData.title}</h1>
            <p className="text-muted-foreground">{projectData.subtitle}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="destructive">{projectData.status}</Badge>
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

          {/* Innovation Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Innovations technologiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <Brain className="h-8 w-8 mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1">IA Intégrée</h4>
                  <p className="text-sm text-muted-foreground">Assistance intelligente pour le code</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Cpu className="h-8 w-8 mb-2 text-orange-500" />
                  <h4 className="font-semibold mb-1">WebAssembly</h4>
                  <p className="text-sm text-muted-foreground">Performance native dans le navigateur</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <GitBranch className="h-8 w-8 mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Git Avancé</h4>
                  <p className="text-sm text-muted-foreground">Gestion de version intelligente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Progression du développement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Moteur d édition</span>
                  <span className="text-sm text-muted-foreground">95%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Intégration IA</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collaboration</span>
                  <span className="text-sm text-muted-foreground">70%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
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
                    <Terminal className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Interface d édition</p>
                  </div>
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Palette className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Thèmes personnalisés</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Essayer la beta
            </Button>
            <Button variant="outline" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Code source
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Roadmap
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}