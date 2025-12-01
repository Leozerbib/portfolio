'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Globe,
  ExternalLink,
  Code,
  FolderOpen,
  Cloud,
  Search,
  Lock
} from 'lucide-react'
import ProjectDisplay from './ProjectDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Props for the Gile component
 */
interface GileProps {
  /** Optional className for styling */
  className?: string
  /** Callback when back button is clicked */
  onBack?: () => void
}

/**
 * Gile component - Modern file management system project
 */
export default function Gile({ className, onBack }: GileProps) {
  const projectData = {
    title: "Gile - File Manager",
    subtitle: "Gestionnaire de fichiers moderne et intelligent",
    description: "Un système de gestion de fichiers moderne avec intégration cloud, recherche avancée, fonctionnalités collaboratives et interface utilisateur intuitive pour une productivité maximale.",
    status: "Actif",
    category: "Application Desktop",
    technologies: ["TypeScript", "Electron", "AWS S3", "Redis", "SQLite", "React"],
    features: [
      "Interface utilisateur moderne et intuitive",
      "Synchronisation cloud multi-plateforme",
      "Recherche avancée avec indexation",
      "Partage et collaboration en temps réel",
      "Prévisualisation de fichiers intégrée",
      "Gestion des versions et historique"
    ],
    specifications: {
      "Framework": "Electron avec React + TypeScript",
      "Stockage cloud": "AWS S3 avec chiffrement",
      "Base de données": "SQLite pour métadonnées locales",
      "Cache": "Redis pour performances optimales",
      "Sécurité": "Chiffrement AES-256",
      "Plateformes": "Windows, macOS, Linux"
    },
    metrics: {
      "Fichiers gérés": "1M+",
      "Vitesse de sync": "50MB/s",
      "Temps de recherche": "< 50ms",
      "Utilisateurs actifs": "25,000+"
    }
  }

  return (
    <ProjectDisplay
      projectData={projectData}
      icon="📁"
      className={className}
      onBack={onBack}
      mediaContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Interface principale</p>
            </div>
          </div>
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <div className="text-center">
              <Cloud className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Gestion cloud</p>
            </div>
          </div>
        </div>
      }
      actionButtons={
        <>
          <Button className="flex-1">
            <Globe className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" className="flex-1">
            <Code className="h-4 w-4 mr-2" />
            Code source
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </>
      }
    >
      {/* Feature Highlights */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Fonctionnalités avancées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <Cloud className="h-8 w-8 mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Sync Cloud</h4>
              <p className="text-sm text-muted-foreground">Synchronisation automatique avec AWS S3</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Search className="h-8 w-8 mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Recherche IA</h4>
              <p className="text-sm text-muted-foreground">Recherche intelligente par contenu</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <Lock className="h-8 w-8 mb-2 text-red-500" />
              <h4 className="font-semibold mb-1">Sécurité</h4>
              <p className="text-sm text-muted-foreground">Chiffrement bout en bout</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProjectDisplay>
  )
}