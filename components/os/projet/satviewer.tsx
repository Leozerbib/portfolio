'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  ExternalLink, 
  Code, 
  Satellite,
  Map,
  Layers,
  Activity,
  Radio,
  Wifi
} from 'lucide-react'
import ProjectDisplay from './ProjectDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SatViewerProps {
  className?: string
  onBack?: () => void
}

export default function SatViewer({ className, onBack }: SatViewerProps) {
  const projectData = {
    title: "SatViewer Pro",
    subtitle: "Visualisation de données satellitaires en temps réel",
    description: "Une application de visualisation 3D avancée pour le suivi et l'analyse de données satellitaires en temps réel, permettant aux chercheurs et aux passionnés d'explorer l'orbite terrestre.",
    status: "Beta",
    category: "Aérospatial",
    technologies: ["Cesium.js", "React", "Node.js", "WebSockets", "TLE API", "WebGL"],
    features: [
      "Suivi en temps réel de 15,000+ satellites",
      "Visualisation 3D haute fidélité",
      "Prédiction de trajectoires",
      "Analyse de couverture",
      "Filtres par type et pays",
      "Mode réalité augmentée"
    ],
    specifications: {
      "Moteur 3D": "Cesium.js",
      "Données": "Space-Track.org API",
      "Mise à jour": "Temps réel (< 1s)",
      "Précision": "Haute (SGP4 propagator)",
      "Couverture": "Globale",
      "Compatibilité": "Web & Mobile"
    },
    metrics: {
      "Satellites suivis": "15,400+",
      "FPS moyen": "60",
      "Latence données": "500ms",
      "Utilisateurs": "2,500+"
    }
  }

  const satelliteTypes = [
    { name: "Communication", count: "8,500+", color: "bg-blue-500" },
    { name: "Observation", count: "3,200+", color: "bg-green-500" },
    { name: "Navigation", count: "1,100+", color: "bg-yellow-500" },
    { name: "Scientifique", count: "800+", color: "bg-purple-500" },
    { name: "Débris", count: "1,800+", color: "bg-red-500" }
  ]

  return (
    <ProjectDisplay
      projectData={projectData}
      icon="🛰️"
      className={className}
      onBack={onBack}
      mediaContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Vue orbitale 3D</p>
            </div>
          </div>
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carte de couverture</p>
            </div>
          </div>
        </div>
      }
    >

      {/* 3D Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Visualisation 3D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Moteur de rendu</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Utilisation de Cesium.js pour un rendu photoréaliste de la Terre et des orbites satellitaires.
              </p>
              <div className="flex gap-2">
                <Badge>WebGL 2.0</Badge>
                <Badge>PBR Materials</Badge>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Performance</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Optimisation via WebWorkers pour le calcul des positions de milliers d objets en temps réel.
              </p>
              <div className="flex gap-2">
                <Badge>Multi-threading</Badge>
                <Badge>WASM</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProjectDisplay>
  )
}