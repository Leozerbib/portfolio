'use client'

import { useOS } from '@/hooks/useOS'
import { Taskbar } from '../task/Taskbar'
import { TopBar } from '../task/TopBar'
import { WindowManager } from '../window/WindowManager'
import { DesktopIcons } from './DesktopIcons'
import { Background } from '../background'

export function DesktopScreen() {
  const { state } = useOS()

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background */}
      <Background />
      
      {/* Top Bar */}
      <TopBar />
      
      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Window Manager */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}