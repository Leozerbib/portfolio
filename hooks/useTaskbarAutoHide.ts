'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useOS } from './useOS'

interface TaskbarAutoHideConfig {
  taskbarHeight: number
  hideDelay: number
}

interface TaskbarAutoHideState {
  isHidden: boolean
  windowOverlapping: boolean
}

const defaultConfig: TaskbarAutoHideConfig = {
  taskbarHeight: 64, // 16 * 4 (h-16 in Tailwind)
  hideDelay: 500
}

export function useTaskbarAutoHide(config: Partial<TaskbarAutoHideConfig> = {}) {
  const { state } = useOS()
  const finalConfig = { ...defaultConfig, ...config }
  
  const [autoHideState, setAutoHideState] = useState<TaskbarAutoHideState>({
    isHidden: false,
    windowOverlapping: false
  })
  
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Check if any window overlaps with taskbar area
  const checkWindowOverlap = useCallback(() => {
    const visibleWindows = state.windows.filter(window => 
      !window.isMinimized && 
      window.monitorId === state.activeMonitorId
    )
    
    if (visibleWindows.length === 0) return false
    
    const screenHeight = window.innerHeight
    const taskbarTop = screenHeight - finalConfig.taskbarHeight
    
    const hasOverlap = visibleWindows.some(window => {

      const windowBottom = window.position.y + window.size.height
      
      // Check if window intersects with taskbar area
      return (
        windowBottom > taskbarTop
      )
    })
    
    return hasOverlap
  }, [state.windows, state.activeMonitorId, finalConfig.taskbarHeight])
  
  // Update window overlap detection
  useEffect(() => {
    const hasOverlap = checkWindowOverlap()
    setAutoHideState(prev => ({
      ...prev,
      windowOverlapping: hasOverlap
    }))
  }, [checkWindowOverlap])
  
  // Handle auto-hide logic
  useEffect(() => {
    const { windowOverlapping } = autoHideState
    
    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    
    if (windowOverlapping) {
      // Hide taskbar when window overlaps
      hideTimeoutRef.current = setTimeout(() => {
        setAutoHideState(prev => ({
          ...prev,
          isHidden: true
        }))
      }, finalConfig.hideDelay)
    } else {
      // Show taskbar immediately when no window overlap
      setAutoHideState(prev => ({
        ...prev,
        isHidden: false
      }))
    }
    console.log(autoHideState.isHidden)
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [autoHideState.windowOverlapping, finalConfig.hideDelay])
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])
  
  return {
    isHidden: autoHideState.isHidden,
    windowOverlapping: autoHideState.windowOverlapping
  }
}