'use client'

import { useOS, osActions } from '@/hooks/useOS'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { state, dispatch } = useOS()

  const handleAppClick = (app: any) => {
    dispatch(osActions.openWindow(app))
    onClose()
  }

  const pinnedApps = state.apps.filter(app => state.taskbarApps.includes(app.id))
  const otherApps = state.apps.filter(app => !state.taskbarApps.includes(app.id))

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Start Menu */}
      <div className="absolute bottom-12 left-2 w-80 bg-background/95 backdrop-blur-md rounded-lg border border-border shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatar.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                P
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-foreground font-semibold">Portfolio OS</h3>
              <p className="text-muted-foreground text-sm">Welcome back!</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              v1.0
            </Badge>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {/* Pinned Applications */}
          {pinnedApps.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Pinned
                </div>
                <Badge variant="outline" className="text-xs">
                  {pinnedApps.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pinnedApps.map((app) => (
                  <Button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    variant="ghost"
                    className={cn(
                      "h-16 p-3 flex flex-col items-center justify-center gap-1",
                      "hover:bg-secondary/80 transition-all duration-200",
                      "border border-transparent hover:border-border"
                    )}
                  >
                    <app.icon className="h-6 w-6" />
                    <span className="text-xs text-center leading-tight">{app.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {pinnedApps.length > 0 && otherApps.length > 0 && (
            <Separator className="mx-3" />
          )}

          {/* All Applications */}
          {otherApps.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  All Apps
                </div>
                <Badge variant="outline" className="text-xs">
                  {otherApps.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {otherApps.map((app) => (
                  <Button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-3",
                      "hover:bg-secondary/80 transition-all duration-200"
                    )}
                  >
                    <app.icon className="h-5 w-5" />
                    <span className="text-sm">{app.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* System Actions */}
          <Separator className="mx-3" />
          <div className="p-3">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-3">
              System
            </div>
            <div className="space-y-1">
              <Button
                onClick={() => {
                  // Add settings functionality here
                  onClose()
                }}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  "hover:bg-secondary/80 transition-all duration-200"
                )}
              >
                <span className="mr-3 text-lg">⚙️</span>
                <span className="text-sm">Settings</span>
              </Button>
              <Button
                onClick={() => {
                  dispatch(osActions.logout())
                  onClose()
                }}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3",
                  "hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                )}
              >
                <span className="mr-3 text-lg">🚪</span>
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}