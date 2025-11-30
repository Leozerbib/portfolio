'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'

interface SceneProps {
  children: React.ReactNode
  camera?: {
    position?: [number, number, number]
    fov?: number
  }
  shadows?: boolean
  environment?: 'none' | string
  envFiles?: string | string[]
  className?: string
}

export function Scene({ 
  children, 
  camera = { position: [0, 0, -30], fov: 35 },
  shadows = true,
  environment = "none",
  envFiles,
  className = ""
}: SceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        dpr={[1, 2]}
        camera={camera}
        shadows={shadows}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {children}
          {envFiles ? (
            <Environment files={envFiles} />
          ) : environment !== 'none' ? (
            <Environment preset={environment as any} />
          ) : null}
        </Suspense>
        {shadows && (
          <ContactShadows 
            position={[0, -4.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={1.75} 
            far={4.5} 
          />
        )}
      </Canvas>
    </div>
  )
}