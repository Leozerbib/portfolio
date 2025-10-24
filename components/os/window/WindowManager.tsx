'use client'

import { useOS } from '@/hooks/useOS'
import { Window } from './Window'
import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { cn } from '@/lib/utils'

export function WindowManager() {
  const { state } = useOS()
  const containerRef = useRef<HTMLDivElement>(null)
  const [snapPreview, setSnapPreview] = useState<{
    show: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
  }>({ show: false })

  // Get the active monitor for window filtering
  const activeMonitor = state.monitors.find(m => m.id === state.activeMonitorId)

  // Filter windows for the active monitor and exclude minimized windows
  const visibleWindows = state.windows.filter(window => 
    !window.isMinimized && 
    window.monitorId === state.activeMonitorId
  )

  // Listen for snap preview events dispatched from Window components
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ show: boolean; position?: 'left' | 'right' | 'top' | 'bottom' }>
      setSnapPreview({ show: ce.detail.show, position: ce.detail.position })
    }
    window.addEventListener('os:snap-preview', handler as EventListener)
    return () => window.removeEventListener('os:snap-preview', handler as EventListener)
  }, [])

  const windowsToRender = visibleWindows

  if (containerRef.current) {
    const pe = getComputedStyle(containerRef.current).pointerEvents
  } 

  // Group windows if any are grouped
  const groupedWindows = state.windowGroups.filter(group => 
    group.windowIds.some(id => visibleWindows.find(w => w.id === id))
  )

  return (
    <div 
      ref={containerRef}
      className={cn(
        'baba absolute inset-0 pointer-events-auto overflow-hidden',
        // Add monitor-specific styling if needed
        activeMonitor && !activeMonitor.isPrimary && 'opacity-90'
      )}
      data-monitor-id={state.activeMonitorId}
    >
      {/* Snap preview overlays */}
      {snapPreview.show && (
        <div className="absolute inset-0 pointer-events-none">
          {snapPreview.position === 'left' && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/50" />
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-primary/10" />
            </>
          )}
          {snapPreview.position === 'right' && (
            <>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary/50" />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-primary/10" />
            </>
          )}
          {snapPreview.position === 'top' && (
            <>
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary/10" />
            </>
          )}
          {snapPreview.position === 'bottom' && (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/50" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-primary/10" />
            </>
          )}
        </div>
      )}

      {/* Render individual windows without sorting to preserve DOM stability */}
      {windowsToRender.map((window) => (
        <Window key={window.id} baba_window={window} />
      ))}

      {/* Render window group indicators if any groups exist */}
      {groupedWindows.length > 0 && (
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {groupedWindows.map((group) => (
            <div
              key={group.id}
              className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs text-muted-foreground"
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: group.color }}
              />
              <span>{group.name}</span>
              <span className="text-xs opacity-60">({group.windowIds.length})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}