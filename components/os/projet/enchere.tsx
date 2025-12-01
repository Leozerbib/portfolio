'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  ExternalLink, 
  Code, 
  Users,
  Monitor
} from 'lucide-react'
import ProjectDisplay from './ProjectDisplay'

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
    <ProjectDisplay
      projectData={projectData}
      icon="🏆"
      className={className}
      onBack={onBack}
      mediaContent={
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
      }
      actionButtons={
        <>
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
        </>
      }
    />
  )
}