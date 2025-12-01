'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  ExternalLink, 
  Code, 
  MapPin,
  Navigation,
  Users,
  Camera,
  Sun,
  Wind,
  Waves,
  Mountain
} from 'lucide-react'
import ProjectDisplay from './ProjectDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SpotMapProps {
  className?: string
  onBack?: () => void
}

export default function SpotMap({ className, onBack }: SpotMapProps) {
  const projectData = {
    title: "SpotMap - Adventure Guide",
    subtitle: "Guide communautaire de spots d'aventure",
    description: "Une application collaborative pour découvrir, partager et évaluer les meilleurs spots de sport extrême et d'aventure à travers le monde, avec météo en temps réel et fonctionnalités sociales.",
    status: "Actif",
    category: "Voyage & Sport",
    technologies: ["React Native", "Firebase", "Google Maps API", "Redux", "Node.js", "Algolia"],
    features: [
      "Carte interactive mondiale des spots",
      "Système de notation et d'avis communautaire",
      "Météo et conditions en temps réel",
      "Partage de photos et vidéos",
      "Itinéraires et navigation intégrés",
      "Mode hors ligne pour les zones reculées"
    ],
    specifications: {
      "Mobile": "React Native (iOS & Android)",
      "Backend": "Firebase Cloud Functions",
      "Base de données": "Firestore NoSQL",
      "Cartographie": "Google Maps Platform",
      "Recherche": "Algolia InstantSearch",
      "Stockage": "Firebase Storage"
    },
    metrics: {
      "Spots référencés": "12,000+",
      "Utilisateurs actifs": "45,000+",
      "Pays couverts": "85+",
      "Photos partagées": "150,000+"
    }
  }

  const spotCategories = [
    { name: "Surf", count: "3,500+", icon: <Waves className="h-4 w-4" />, color: "bg-blue-500" },
    { name: "Escalade", count: "2,800+", icon: <Mountain className="h-4 w-4" />, color: "bg-stone-500" },
    { name: "Skate", count: "4,200+", icon: <MapPin className="h-4 w-4" />, color: "bg-orange-500" },
    { name: "Parapente", count: "1,500+", icon: <Wind className="h-4 w-4" />, color: "bg-sky-500" }
  ]

  return (
    <ProjectDisplay
      projectData={projectData}
      icon="🗺️"
      className={className}
      onBack={onBack}
      mediaContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Carte interactive</p>
            </div>
          </div>
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Galerie photos</p>
            </div>
          </div>
        </div>
      }
      actionButtons={
        <>
          <Button className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            Télécharger l app
          </Button>
          <Button variant="outline" className="flex-1">
            <Code className="h-4 w-4 mr-2" />
            Code source
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Site web
          </Button>
        </>
      }
    >
      {/* Spot Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Types de spots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {spotCategories.map((category, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card text-center">
                <div className={`w-8 h-8 rounded-full ${category.color} mx-auto mb-2 flex items-center justify-center text-white`}>
                  {category.icon}
                </div>
                <h4 className="font-semibold mb-1">{category.name}</h4>
                <p className="text-sm text-muted-foreground">{category.count}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <Camera className="h-8 w-8 mb-2 text-purple-500" />
              <h4 className="font-semibold mb-1">Partage Media</h4>
              <p className="text-sm text-muted-foreground">Photos et vidéos HD des spots</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Users className="h-8 w-8 mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Groupes</h4>
              <p className="text-sm text-muted-foreground">Organisation de sessions</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Navigation className="h-8 w-8 mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Guides Locaux</h4>
              <p className="text-sm text-muted-foreground">Conseils d experts locaux</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrated Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Services intégrés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Sun className="h-6 w-6 text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Météo en temps réel</h4>
                  <p className="text-sm text-muted-foreground">Conditions précises par spot</p>
                </div>
              </div>
              <Badge>API Météo</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Navigation className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold">Navigation GPS</h4>
                  <p className="text-sm text-muted-foreground">Itinéraires optimisés</p>
                </div>
              </div>
              <Badge>Google Maps</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProjectDisplay>
  )
}