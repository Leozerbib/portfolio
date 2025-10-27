'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useOS, osActions } from '@/hooks/useOS'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { StartMenu } from './StartMenu'
import { Volleyball, LogOut, Settings, Sun, Moon, Monitor, Globe, Folder } from 'lucide-react'
import { DateFormat, LocaleType, Language, Theme } from '@/lib/settings'
import { useTheme } from '@/hooks/useTheme'

export function TopBar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, setTheme } = useTheme()
  const { state, dispatch } = useOS()
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const topBarRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear timeouts helper
  const clearTimeouts = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
  }, [])

  // Show top bar
  const showTopBar = useCallback(() => {
    clearTimeouts()
    setIsVisible(true)
  }, [clearTimeouts])

  // Hide top bar with delay
  const hideTopBar = useCallback(() => {
    clearTimeouts()
    if (!isHovering && !showStartMenu) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 300) // 1 second delay
    }
  }, [isHovering, showStartMenu, clearTimeouts])

  // Handle mouse movement to detect top area
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const mouseY = e.clientY
    const triggerZone = 10 // pixels from top to trigger show
    
    if (mouseY <= triggerZone) {
      showTopBar()
    } else if (mouseY > 50 && !isHovering && !showStartMenu) {
      // Only hide if mouse is away from top bar area and not hovering
      hideTopBar()
    }
  }, [showTopBar, hideTopBar, isHovering, showStartMenu])

  // Handle top bar hover
  const handleTopBarMouseEnter = useCallback(() => {
    setIsHovering(true)
    clearTimeouts()
  }, [clearTimeouts])

  const handleTopBarMouseLeave = useCallback(() => {
    setIsHovering(false)
    hideTopBar()
  }, [hideTopBar])

  // Set mounted state and update time every second
  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 300)

    return () => clearInterval(timer)
  }, [])

  // Mouse movement listener
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearTimeouts()
    }
  }, [handleMouseMove, clearTimeouts])

  // Handle start menu visibility changes
  useEffect(() => {
    if (showStartMenu) {
      showTopBar()
    } else if (!isHovering) {
      hideTopBar()
    }
  }, [showStartMenu, isHovering, showTopBar, hideTopBar])

  const formatTime = (date: Date, locale: LocaleType) => {
    return date.toLocaleTimeString(locale, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date, dateFormat: DateFormat, locale: LocaleType) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }

    // Handle different date formats
    switch (dateFormat) {
      case 'DD/MM/YYYY':
        options.day = '2-digit'
        options.month = '2-digit'
        options.year = 'numeric'
        break
      case 'MM/DD/YYYY':
        options.day = '2-digit'
        options.month = '2-digit'
        options.year = 'numeric'
        break
      default:
        // Keep default options for weekday display
        break
    }

    return date.toLocaleDateString(locale, options)
  }

  const getLanguageDisplayName = (language: Language): string => {
    const languageNames: Record<Language, string> = {
      'en': 'EN',
      'fr': 'FR'
    }
    return languageNames[language] || 'EN'
  }

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      case 'auto':
        return Monitor
      default:
        return Monitor
    }
  }

  const handleThemeToggle = () => {
    const currentTheme = state.systemSettings.theme
    let newTheme: Theme
    
    switch (currentTheme) {
      case 'light':
        newTheme = 'dark'
        break
      case 'dark':
        newTheme = 'auto'
        break
      case 'auto':
        newTheme = 'light'
        break
      default:
        newTheme = 'dark'
      
      setTheme(newTheme)
    }

    dispatch(osActions.updateSystemSettings({
      theme: newTheme
    }))
  }

  const handleLogout = () => {
    dispatch(osActions.logout())
  }

  const handleOpenApp = (appId: string) => {
    const app = state.apps.find(a => a.id === appId)
    if (!app) return
    const existingWindow = state.windows.find(w => w.component === app.component)
    if (existingWindow) {
      dispatch(osActions.focusWindow(existingWindow.id))
    } else {
      dispatch(osActions.openWindow(app))
    }
  }

  return (
    <>
      {showStartMenu && (
        <StartMenu onClose={() => setShowStartMenu(false)} />
      )}
      
      <div
        ref={topBarRef}
        onMouseEnter={handleTopBarMouseEnter}
        onMouseLeave={handleTopBarMouseLeave}
        className={cn(
          "fixed top-0 left-0 right-0 h-8 bg-background/95 backdrop-blur-sm border-b border-border/50 transition-all duration-300 ease-in-out",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
          "z-[9999]" // Ensure it's above all windows
        )}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - Start Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStartMenu(!showStartMenu)}
              className="flex items-center space-x-2 hover:bg-accent/50"
            >
              <Volleyball className="h-4 w-4" />
              <span className="text-sm font-medium">Start</span>
            </Button>

            {/* Settings button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenApp('settings')}
              className="flex items-center space-x-2 hover:bg-accent/50"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </Button>

            {/* File Explorer button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenApp('files')}
              className="flex items-center space-x-2 hover:bg-accent/50"
            >
              <Folder className="h-4 w-4" />
              <span className="text-sm font-medium">Files</span>
            </Button>
          </div>

          {/* Right section - System Tray */}
          <div className="flex items-center space-x-3">
            {/* Running Apps Count */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {state.windows.length} apps
              </Badge>
            </div>

                        <Separator orientation="vertical" className="h-6" />

            {/* Language Display */}
            <div className="flex items-center">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                {getLanguageDisplayName(state.systemSettings.language)}
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              className="text-muted-foreground hover:text-foreground p-1"
              title={`Current theme: ${state.systemSettings.theme}`}
            >
              {(() => {
                const ThemeIcon = getThemeIcon(state.systemSettings.theme)
                return <ThemeIcon className="h-4 w-4" />
              })()}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Time and Date */}
            {isMounted && (
              <div className="text-sm text-muted-foreground text-right flex justify-center items-center gap-2">
                <div className="text-xs">{formatDate(currentTime, state.systemSettings.dateFormat, state.systemSettings.dateType)}</div>
                <div className="font-medium">{formatTime(currentTime, state.systemSettings.dateType)}</div>
              </div>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}