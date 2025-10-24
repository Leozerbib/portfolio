'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useSpring } from '@react-spring/core' // removed spring animation
// import { a as three } from '@react-spring/three' // removed
// import { a as web } from '@react-spring/web' // removed
import { Scene } from './Scene'
import { MacBookModel } from './MacBook'
import { TableLamp } from './TableLamp'
import { CameraController } from './CameraController'

interface MacBookSceneProps {
  className?: string
}

export function MacBookScene({ className = "" }: MacBookSceneProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isZoomingToScreen, setIsZoomingToScreen] = useState(false)
  const [isScreenFocused, setIsScreenFocused] = useState(false)
  
  // No spring animation; toggle instantly
  const hinge = open ? -0.25 : 1.575

  // Handle keyboard click to trigger zoom animation
  const handleKeyboardClick = () => {
    if (!isZoomingToScreen && !isScreenFocused) {
      setIsZoomingToScreen(true)
    }
  }

  // Handle animation completion and redirect to OS page
  const handleAnimationComplete = () => {
    setIsZoomingToScreen(false)
    setIsScreenFocused(true)
    
    router.push('/os')

  }

  return (
    <div className={`relative w-full h-screen ${className}`}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-background"
      />

      {/* 3D Scene */}
      <Scene 
        camera={{ position: [0, 5, -30], fov: 35 }}
        className="absolute inset-0"
      >
        {/* Camera Controller for zoom animation */}
        <CameraController 
          shouldZoomToScreen={isZoomingToScreen}
          onAnimationComplete={handleAnimationComplete}
        />
        
        {/* Ambient light for better scene visibility */}
        <ambientLight intensity={0.3} />
        
        {/* Interactive MacBook */}
        <group 
          rotation={[0, Math.PI, 0]} 
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}
        >
          <MacBookModel 
            open={open} 
            hinge={hinge}
            onKeyboardClick={handleKeyboardClick}
          />
        </group>

        {/* Table Lamp positioned to the left of MacBook */}
        <TableLamp 
          position={[10, -0.7, 0.5]} 
          scale={0.3}
          rotation={[Math.PI / 1.95, Math.PI +0.03, Math.PI / 3]}
        />
      </Scene>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-muted-foreground text-sm">
          {isScreenFocused 
            ? 'Redirecting to Portfolio OS...' 
            : isZoomingToScreen 
              ? 'Zooming to screen...' 
              : `Click the MacBook to ${open ? 'close' : 'open'} it, or click the keyboard to enter OS`
          }
        </p>
      </div>
    </div>
  )
}