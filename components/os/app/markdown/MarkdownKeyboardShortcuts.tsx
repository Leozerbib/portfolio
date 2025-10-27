'use client'

import { useEffect } from 'react'

interface MarkdownKeyboardShortcutsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onThemeToggle: () => void
  onViewModeToggle: () => void
  onOpenFiles: () => void
  disabled?: boolean
}

export function MarkdownKeyboardShortcuts({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onThemeToggle,
  onViewModeToggle,
  onOpenFiles,
  disabled = false
}: MarkdownKeyboardShortcutsProps) {
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input field
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const { ctrlKey, metaKey, key, shiftKey } = event
      const isModifierPressed = ctrlKey || metaKey

      // Prevent default browser shortcuts when we handle them
      let preventDefault = false

      switch (key) {
        case '+':
        case '=':
          if (isModifierPressed) {
            onZoomIn()
            preventDefault = true
          }
          break

        case '-':
          if (isModifierPressed) {
            onZoomOut()
            preventDefault = true
          }
          break

        case '0':
          if (isModifierPressed) {
            onZoomReset()
            preventDefault = true
          }
          break

        case 'd':
        case 'D':
          if (isModifierPressed && shiftKey) {
            onThemeToggle()
            preventDefault = true
          }
          break

        case 'r':
        case 'R':
          if (isModifierPressed && shiftKey) {
            onViewModeToggle()
            preventDefault = true
          }
          break

        case 'o':
        case 'O':
          if (isModifierPressed) {
            onOpenFiles()
            preventDefault = true
          }
          break

        // Help shortcut (could be extended to show help dialog)
        case '?':
          if (shiftKey) {
            // Could show help dialog here
            console.log('Keyboard shortcuts:', {
              'Ctrl/Cmd + O': 'Open files',
              'Ctrl/Cmd + +': 'Zoom in',
              'Ctrl/Cmd + -': 'Zoom out',
              'Ctrl/Cmd + 0': 'Reset zoom',
              'Ctrl/Cmd + Shift + D': 'Toggle theme',
              'Ctrl/Cmd + Shift + R': 'Toggle view mode',
              'Shift + ?': 'Show shortcuts'
            })
            preventDefault = true
          }
          break
      }

      if (preventDefault) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [disabled, onZoomIn, onZoomOut, onZoomReset, onThemeToggle, onViewModeToggle, onOpenFiles])

  // This component doesn't render anything
  return null
}