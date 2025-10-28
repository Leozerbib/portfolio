'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useOS, osActions, OSWindow } from '@/hooks/useOS'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { WindowContent } from './WindowContent'
import { animate, createDraggable } from 'animejs'
import { cn } from '@/lib/utils'

interface WindowProps {
  baba_window: OSWindow
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export function Window({ baba_window }: WindowProps) {
  const { state, dispatch } = useOS()
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null)
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 })
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<ReturnType<typeof createDraggable> | null>(null)

  const isActive = state.activeWindowId === baba_window.id

  // Emit snap preview to WindowManager
  const emitSnapPreview = useCallback((show: boolean, position?: 'left' | 'right' | 'top' | 'bottom') => {
    const event = new CustomEvent('os:snap-preview', { detail: { show, position } })
    window.dispatchEvent(event)
  }, [])

  // Compute snap candidate based on current window position within container
  const getSnapCandidate = useCallback((): 'left' | 'right' | 'top' | 'bottom' | null => {
    if (!windowRef.current) return null
    const container = document.querySelector('.baba') as HTMLElement | null
    if (!container) return null

    const rect = windowRef.current.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const threshold = 20

    const distLeft = rect.left - containerRect.left
    const distRight = containerRect.right - rect.right
    const distTop = rect.top - containerRect.top
    const distBottom = containerRect.bottom - rect.bottom

    if (distLeft <= threshold) return 'left'
    if (distRight <= threshold) return 'right'
    if (distTop <= threshold) return 'top'
    if (distBottom <= threshold) return 'bottom'
    return null
  }, [])

  // Show snap preview during drag (no state mutation here)
  const handleSnapDetection = useCallback(() => {
    const candidate = getSnapCandidate()
    if (candidate) {
      emitSnapPreview(true, candidate)
    } else {
      emitSnapPreview(false)
    }
  }, [emitSnapPreview, getSnapCandidate])

  // Handle window focus with smooth animation
  const handleFocus = useCallback(() => {
    if (!isActive) {
      dispatch(osActions.focusWindow(baba_window.id))
      // Animate focus effect
      if (windowRef.current) {
        animate(windowRef.current, {
          scale: [0.99, 1],
          duration: 200,
          easing: 'easeOutQuad'
        } as unknown as any)
      }
    }
  }, [isActive, dispatch, baba_window.id])

  // Initialize draggable functionality with snap detection
  useEffect(() => {
    if (windowRef.current && !draggableRef.current && baba_window.isDraggable) {
      const headerEl = windowRef.current.querySelector('.window-header') as HTMLElement | null
      draggableRef.current = createDraggable(windowRef.current, {
        // Use the specific header element to avoid dragging the wrong window
        trigger: headerEl || `.window-header-${baba_window.id}`,
        container: '.baba',
        onGrab: () => {
          // Focus immediately without relying on handleFocus to avoid effect re-init during drag
          dispatch(osActions.focusWindow(baba_window.id))
          setIsDragging(true)
          emitSnapPreview(false)
          // Reset size to initial size when dragging starts, clamped to container size
          const containerEl = document.querySelector('.baba') as HTMLElement | null
          const rect = containerEl?.getBoundingClientRect()
          const maxW = rect?.width ?? window.innerWidth
          const maxH = rect?.height ?? window.innerHeight
          const clampedWidth = Math.min(baba_window.initialSize.width, maxW)
          const clampedHeight = Math.min(baba_window.initialSize.height, maxH)
          dispatch(osActions.resizeWindow(baba_window.id, { width: clampedWidth, height: clampedHeight }))
        },
        containerFriction: 0.8,
        releaseContainerFriction: 1,
        releaseStiffness: 100,
        maxVelocity: 0,
        onDrag: () => {
          handleSnapDetection()
        },
        onRelease: () => {
          setIsDragging(false)
          // Hide preview
          emitSnapPreview(false)
          // End drag animation
          if (windowRef.current) {
            animate(windowRef.current, {
              scale: [1, 1],
              duration: 100,
              easing: 'linear'
            } as unknown as any)
          }
          // Snap or unsnap based on release position
          const candidate = getSnapCandidate()
          const container = document.querySelector('.baba') as HTMLElement | null
          const rect = windowRef.current?.getBoundingClientRect()
          const containerRect = container?.getBoundingClientRect()
          if (candidate) {
            dispatch(osActions.snapWindow(baba_window.id, candidate))
          } else if (rect && containerRect) {
            const isOutside = (
              rect.left < containerRect.left ||
              rect.top < containerRect.top ||
              rect.right > containerRect.right ||
              rect.bottom > containerRect.bottom
            )
            if (isOutside && baba_window.isSnapped) {
              dispatch(osActions.unsnapWindow(baba_window.id))
            }
          }
        }
      })
    }

    return () => {
      if (draggableRef.current) {
        draggableRef.current.disable()
        draggableRef.current = null
      }
    }
  }, [dispatch, baba_window.id, baba_window.isDraggable, baba_window.isMovable, handleSnapDetection, getSnapCandidate, emitSnapPreview, baba_window.initialSize.width, baba_window.initialSize.height, baba_window.isSnapped])

  // Handle resize start with direction
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeOffset({
      x: e.clientX,
      y: e.clientY,
    })
    setInitialSize({
      width: baba_window.size.width,
      height: baba_window.size.height,
    })
    setInitialPosition({
      x: baba_window.position.x,
      y: baba_window.position.y,
    })
    handleFocus()

    // Start resize animation
    if (windowRef.current) {
      animate(windowRef.current, {
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        duration: 150,
        easing: 'easeOutQuad'
      } as unknown as any)
    }
  }, [baba_window.size, baba_window.position, handleFocus])

  // Handle mouse move for resizing with constraints and direction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && !baba_window.isMaximized && resizeDirection) {
        const deltaX = e.clientX - resizeOffset.x
        const deltaY = e.clientY - resizeOffset.y
        
        // Apply min/max size constraints
        const minWidth = baba_window.minSize?.width || 300
        const minHeight = baba_window.minSize?.height || 200
        const containerEl = document.querySelector('.baba') as HTMLElement | null
        const containerRect = containerEl?.getBoundingClientRect()
        const containerWidth = containerRect?.width ?? window.innerWidth
        const containerHeight = containerRect?.height ?? window.innerHeight
        const maxWidth = baba_window.maxSize?.width || containerWidth
        const maxHeight = baba_window.maxSize?.height || containerHeight
        
        let newWidth = initialSize.width
        let newHeight = initialSize.height
        let newX = initialPosition.x
        let newY = initialPosition.y
        
        // Handle different resize directions
        switch (resizeDirection) {
          case 'n': // North (top)
            newHeight = Math.max(minHeight, Math.min(initialSize.height - deltaY, maxHeight))
            newY = initialPosition.y + (initialSize.height - newHeight)
            break
          case 's': // South (bottom)
            newHeight = Math.max(minHeight, Math.min(initialSize.height + deltaY, maxHeight))
            break
          case 'e': // East (right)
            newWidth = Math.max(minWidth, Math.min(initialSize.width + deltaX, maxWidth))
            break
          case 'w': // West (left)
            newWidth = Math.max(minWidth, Math.min(initialSize.width - deltaX, maxWidth))
            newX = initialPosition.x + (initialSize.width - newWidth)
            break
          case 'ne': // Northeast (top-right)
            newWidth = Math.max(minWidth, Math.min(initialSize.width + deltaX, maxWidth))
            newHeight = Math.max(minHeight, Math.min(initialSize.height - deltaY, maxHeight))
            newY = initialPosition.y + (initialSize.height - newHeight)
            break
          case 'nw': // Northwest (top-left)
            newWidth = Math.max(minWidth, Math.min(initialSize.width - deltaX, maxWidth))
            newHeight = Math.max(minHeight, Math.min(initialSize.height - deltaY, maxHeight))
            newX = initialPosition.x + (initialSize.width - newWidth)
            newY = initialPosition.y + (initialSize.height - newHeight)
            break
          case 'se': // Southeast (bottom-right)
            newWidth = Math.max(minWidth, Math.min(initialSize.width + deltaX, maxWidth))
            newHeight = Math.max(minHeight, Math.min(initialSize.height + deltaY, maxHeight))
            break
          case 'sw': // Southwest (bottom-left)
            newWidth = Math.max(minWidth, Math.min(initialSize.width - deltaX, maxWidth))
            newHeight = Math.max(minHeight, Math.min(initialSize.height + deltaY, maxHeight))
            newX = initialPosition.x + (initialSize.width - newWidth)
            break
        }
        
        // Update window size and position
        dispatch(osActions.resizeWindow(baba_window.id, { width: newWidth, height: newHeight }))
        if (newX !== initialPosition.x || newY !== initialPosition.y) {
          dispatch(osActions.moveWindow(baba_window.id, { x: newX, y: newY }))
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection(null)

      // End resize animation
      if (windowRef.current) {
        animate(windowRef.current, {
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          duration: 200,
          easing: 'easeOutQuad'
        } as unknown as any)
      }
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      
      // Set appropriate cursor based on resize direction
      const cursorMap: Record<ResizeDirection, string> = {
        'n': 'n-resize',
        's': 's-resize',
        'e': 'e-resize',
        'w': 'w-resize',
        'ne': 'ne-resize',
        'nw': 'nw-resize',
        'se': 'se-resize',
        'sw': 'sw-resize'
      }
      document.body.style.cursor = cursorMap[resizeDirection!] || 'default'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing, resizeDirection, resizeOffset, initialSize, initialPosition, baba_window, dispatch])

  // Handle maximize with animation
  const handleMaximize = useCallback(() => {
    if (windowRef.current) {      
      animate(windowRef.current, {
        scale: [1, 1],
        duration: 500,
        easing: 'easeOutCirc'
      } as unknown as any)
    }
    
    dispatch(osActions.maximizeWindow(baba_window.id))
  }, [baba_window.id, dispatch])

  // Handle minimize with animation
  const handleMinimize = useCallback(() => {
    if (windowRef.current) {
      animate(windowRef.current, {
        scale: [1, 0.5],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInCirc',
        onComplete: () => {
          dispatch(osActions.minimizeWindow(baba_window.id))
        }
      } as unknown as any)
    }
  }, [baba_window.id, dispatch])

  // Handle close with animation
  const handleClose = useCallback(() => {
    if (windowRef.current) {
      animate(windowRef.current, {
        scale: [1, 0.9],
        opacity: [1, 0.5],
        duration: 250,
        easing: 'easeInCirc',
        onComplete: () => {
          dispatch(osActions.closeWindow(baba_window.id))
        }
      } as unknown as any)
    }
  }, [baba_window.id, dispatch])

  // Window styles with enhanced properties
  const windowStyle = baba_window.isMaximized
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: baba_window.zIndex || 1000,
        opacity: baba_window.opacity || 1,
      }
    : {
        position: 'absolute' as const,
        top: baba_window.position.y || 0,
        left: baba_window.position.x || 0,
        width: baba_window.size.width || 800,
        height: baba_window.size.height || 600,
        zIndex: baba_window.isAlwaysOnTop ? (baba_window.zIndex || 1000) + 10000 : (baba_window.zIndex || 1000),
        opacity: baba_window.opacity || 1,
      }

  return (
    <Card
      ref={windowRef}
      className={cn(
        "pointer-events-auto gap-0",
        isActive 
          ? "border border-primary/50 shadow-2xl" 
          : "shadow-lg hover:shadow-xl",
        baba_window.isMaximized ? "rounded-none" : "rounded-lg",
        baba_window.isAlwaysOnTop && "border-2 border-primary/30",
      )}
      style={windowStyle}
      onClick={handleFocus}
    >
      {/* Window Header */}
      <CardHeader
        data-window-id={baba_window.id}
        className={cn(
          `window-header window-header-${baba_window.id} flex flex-row items-center justify-between h-8 p-3 cursor-move bg-primary/50`,
          baba_window.isMaximized ? "rounded-none" : "rounded-t-lg",
          isActive 
            ? "from-primary to-primary/90 text-primary-foreground" 
            : "from-muted to-muted/90 text-muted-foreground"
        )}
        onMouseDown={(e) => {
          e.stopPropagation()
          console.debug('[Window] header onMouseDown', { id: baba_window.id })
          // For draggable windows, focus is handled in draggable.onGrab to avoid a re-render during mousedown.
          // For non-draggable windows, we still focus on mousedown for immediate interaction.
          if (!baba_window.isDraggable) {
            handleFocus()
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          console.debug('[Window] header onClick', { id: baba_window.id, isDragging })
          // If user clicked (no drag), ensure focus is applied in one click.
          if (!isDragging) {
            handleFocus()
          }
        }}
        onDoubleClick={handleMaximize}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <span className="font-medium text-sm truncate">{baba_window.title}</span>
        </div>
      </CardHeader>
      <div className="flex items-center space-x-1 flex-shrink-0 absolute top-2 right-2">
        {/* Minimize Button */}
        <Button
          onClick={handleMinimize}
          onMouseDown={(e) => e.stopPropagation()}
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white hover:text-white transition-colors"
        >
          <span className="text-xs leading-none"> </span>
        </Button>
        
        {/* Maximize/Restore Button */}
        <Button
          onClick={handleMaximize}
          onMouseDown={(e) => e.stopPropagation()}
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white hover:text-white transition-colors"
        >
          <span className="text-xs leading-none"> </span>
        </Button>
        
        {/* Close Button */}
        <Button
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white hover:text-white transition-colors"
        >
          <span className="text-xs leading-none"> </span>
        </Button>
      </div>
      
      {/* Window Content */}
      <CardContent 
        className={cn(
        "p-0 flex-1 overflow-hidden relative",
        baba_window.isMaximized ? "rounded-none" : "rounded-lg",
      )}>
        <WindowContent window={baba_window} />
      </CardContent>
        

      {/* Resize Handles (only when not maximized and resizable) */}
      {!baba_window.isMaximized && baba_window.isResizable && (
        <>
          {/* Border Resize Handles */}
          {/* Top border */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-n-resize hover:bg-primary/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          {/* Bottom border */}
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize hover:bg-primary/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          {/* Left border */}
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize hover:bg-primary/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          {/* Right border */}
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize hover:bg-primary/20 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          
          {/* Corner Resize Handles */}
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-primary/30 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          {/* Top-right corner */}
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-primary/30 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize hover:bg-primary/30 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize hover:bg-primary/30 transition-colors"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
        </>
      )}
    </Card>
  )
}