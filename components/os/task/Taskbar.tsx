'use client'

import { useMemo, useState } from 'react'
import { useOS, osActions } from '@/hooks/useOS'
import { useTaskbarAutoHide } from '@/hooks/useTaskbarAutoHide'
import { MacOSDock, type DockApp } from '@/components/ui/shadcn-io/mac-os-dock'
import { cn } from '@/lib/utils'

export function Taskbar() {
  const { state, dispatch } = useOS()
  const { isHidden } = useTaskbarAutoHide()
  const [ showTaskbar, setShowTaskbar ] = useState(false)

  const handleTaskbarAppClick = (appId: string) => {
    const app = state.apps.find(a => a.id === appId)
    if (!app) return
    const existingWindow = state.windows.find(w => w.component === app.component)
    if (existingWindow) {
      // Focus the existing window (this also un-minimizes it via reducer)
      dispatch(osActions.focusWindow(existingWindow.id))
    } else {
      // Open a new window for the app
      dispatch(osActions.openWindow(app))
    }
  }

  // Transform apps to DockApp format (include pinned taskbar apps + currently open apps from state)
  const dockApps: DockApp[] = useMemo(() => {
    const openAppIds = state.windows
      .map(w => {
        const app = state.apps.find(a => a.component === w.component)
        return app?.id
      })
      .filter(Boolean) as string[]

    const dockAppIds = Array.from(new Set([...state.taskbarApps, ...openAppIds]))

    return dockAppIds
      .map(appId => {
        const app = state.apps.find(a => a.id === appId)
        if (!app) return null
        return {
          id: app.id,
          name: app.name,
          icon: app.icon
        }
      })
      .filter(Boolean) as DockApp[]
  }, [state.taskbarApps, state.apps, state.windows])

  // Get open apps for dock indicators (include minimized and visible windows)
  const openApps = useMemo(() => {
    const openIds = state.windows
      .map(w => {
        const app = state.apps.find(a => a.component === w.component)
        return app?.id
      })
      .filter(Boolean) as string[]
    return Array.from(new Set(openIds))
  }, [state.windows, state.apps])
  
  return (
    <div
      onMouseEnter={() => setShowTaskbar(true)}
      onMouseLeave={() => setTimeout(() => setShowTaskbar(false), 1000)} 
      className={cn(
        "absolute bottom-0 left-1/3 max-h-16 min-h-2 flex items-center z-[15000] justify-center",
        "transition-transform duration-300 ease-in-out group w-auto max-w-1/2 min-w-1/3",
        isHidden && !showTaskbar ? "bg-primary/30 m-0.5 rounded-lg" : "p-4"      
      )}
    >
      {/* macOS Dock */}
      {dockApps.length > 0 && (showTaskbar || !isHidden) && (
        <MacOSDock
          apps={dockApps}
          onAppClick={handleTaskbarAppClick}
          openApps={openApps}
          className={cn("shadow-lg")}
        />
      )}
    </div>
  )
}