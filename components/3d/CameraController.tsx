'use client'

import { useEffect } from 'react'
import { useCameraAnimation } from '@/hooks/useCameraAnimation'
import { useThree } from '@react-three/fiber'

interface CameraControllerProps {
  shouldZoomToScreen: boolean
  onAnimationComplete?: () => void
}

export function CameraController({ shouldZoomToScreen, onAnimationComplete }: CameraControllerProps) {
  const { animateCamera, isAnimating } = useCameraAnimation()
  const { viewport } = useThree()

  useEffect(() => {
    if (shouldZoomToScreen && !isAnimating) {
      // Calculate target position to focus on MacBook screen
      // The MacBook is positioned at [0, -5.3, 0] with rotation [0, Math.PI, 0]
      // The screen is at the top part when the MacBook is open
      
      // Calculate the distance needed for the screen to fill 100% of viewport height
      // MacBook screen dimensions are approximately 3 units high
      const screenHeight = 3
      const targetDistance = (screenHeight / 2) / Math.tan((35 * Math.PI / 180) / 2)
      
      // Target position: positioned to view the screen straight on
      // MacBook screen is at approximately y: -2.3 (MacBook base at -5.3 + screen offset)
      const targetPosition: [number, number, number] = [0, -2.3, -targetDistance * 0.7]
      
      // Target rotation: looking straight at the screen with slight downward angle
      const targetRotation: [number, number, number] = [0, 0, 0]
      
      animateCamera(targetPosition, targetRotation, 2.5, onAnimationComplete)
    }
  }, [shouldZoomToScreen, isAnimating, animateCamera, onAnimationComplete, viewport])

  // This component doesn't render anything, it just controls the camera
  return null
}