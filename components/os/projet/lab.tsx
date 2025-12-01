'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  ExternalLink, 
  Code, 
  Beaker,
  Lightbulb,
  Rocket,
  Atom,
  Microscope,
  FlaskConical
} from 'lucide-react'
import ProjectDisplay from './ProjectDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <ProjectDisplay
      projectData={projectData}
      icon="🧪"
      className={className}
      onBack={onBack}
      mediaContent={
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
      }
      actionButtons={
        <>
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
        </>
      }
    >
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
    </ProjectDisplay>
  )
}