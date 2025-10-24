'use client'

import React from 'react'
import { 
  Home, 
  Folder, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Download,
  Trash2,
  Star,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SidebarProps } from './types'

const quickAccessItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Documents', path: '/Documents', icon: FileText },
  { name: 'Pictures', path: '/Images', icon: Image },
  { name: 'Downloads', path: '/Downloads', icon: Download },
]

const recentItems = [
  { name: 'Recent Projects', path: '/Documents/Projects' },
  { name: 'Screenshots', path: '/Pictures/Screenshots' },
  { name: 'Work Files', path: '/Documents/Work' },
]

export default function Sidebar({ 
  currentPath, 
  onNavigateToPath, 
  className 
}: SidebarProps) {
  
  return (
    <div className={cn("w-64 border-r", className)}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Quick Access */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Quick Access
            </h3>
            <div className="space-y-1">
              {quickAccessItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPath === item.path
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "bg-primary/50 text-primary-foreground"
                    )}
                    onClick={() => onNavigateToPath(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Favorites */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Favorites
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onNavigateToPath('/Documents/Projects')}
              >
                <Folder className="h-4 w-4" />
                Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onNavigateToPath('/Images/gallery')}
              >
                <Image className="h-4 w-4" />
                Gallery
              </Button>
            </div>
          </div>

          <Separator />

          {/* System */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              System
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onNavigateToPath('/Trash')}
              >
                <Trash2 className="h-4 w-4" />
                Trash
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}