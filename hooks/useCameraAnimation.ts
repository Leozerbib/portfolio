'use client'

import { useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraAnimationState {
  isAnimating: boolean
  startPosition: THREE.Vector3
  startRotation: THREE.Euler
  targetPosition: THREE.Vector3
  targetRotation: THREE.Euler
  progress: number
  duration: number
  onComplete?: () => void
}

export function useCameraAnimation() {
  const { camera } = useThree()
  const animationState = useRef<CameraAnimationState | null>(null)

  // Animation frame handler
  useFrame((state, delta) => {
    if (!animationState.current?.isAnimating) return

    const anim = animationState.current
    anim.progress += delta / anim.duration

    if (anim.progress >= 1) {
      // Animation complete
      anim.progress = 1
      anim.isAnimating = false
      
      // Set final position and rotation
      //camera.position.copy(anim.targetPosition)
      camera.rotation.copy(anim.targetRotation)
      
      // Call completion callback
      if (anim.onComplete) {
        anim.onComplete()
      }
      
      animationState.current = null
    } else {
      // Smooth easing function (easeInOutCubic)
      const easeProgress = anim.progress < 0.5
        ? 4 * anim.progress * anim.progress * anim.progress
        : 1 - Math.pow(-2 * anim.progress + 2, 3) / 2

      // Interpolate position
      camera.position.lerpVectors(anim.startPosition, anim.targetPosition, easeProgress)
      

    }
  })

  const animateCamera = useCallback((
    targetPosition: [number, number, number],
    targetRotation: [number, number, number],
    duration: number = 2.0,
    onComplete?: () => void
  ) => {
    // Don't start new animation if one is already running
    if (animationState.current?.isAnimating) return

    animationState.current = {
      isAnimating: true,
      startPosition: camera.position.clone(),
      startRotation: camera.rotation.clone(),
      targetPosition: new THREE.Vector3(...targetPosition),
      targetRotation: new THREE.Euler(...targetRotation),
      progress: 0,
      duration,
      onComplete
    }
  }, [camera])

  const isAnimating = animationState.current?.isAnimating ?? false

  return {
    animateCamera,
    isAnimating
  }
}