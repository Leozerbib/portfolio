'use client'

import { useOS, osActions } from '@/hooks/useOS'

export function DesktopIcons() {
  const { state, dispatch } = useOS()

  const handleDoubleClick = (app: any) => {
    dispatch(osActions.openWindow(app))
  }

  // Desktop apps (subset of all apps)
  const desktopApps = state.apps.filter(app => 
    ['terminal', 'portfolio', 'projects'].includes(app.id)
  )

  return (
    <div className="absolute top-8 space-y-6 p-6">
      {desktopApps.map((app) => (
        <div
          key={app.id}
          className="flex flex-col items-center cursor-pointer group rounded-lg"
          onDoubleClick={() => handleDoubleClick(app)}
        >
          <div className="w-16 h-16 bg-secondary/80 backdrop-blur-sm rounded-lg text-primary border border-primary flex items-center justify-center text-2xl group-hover:bg-primary/80 group-hover:text-secondary group-hover:border-secondary transition-all duration-200 group-hover:scale-105">
            <app.icon className="h-6 w-6"/>
          </div>
        </div>
      ))}
    </div>
  )
}