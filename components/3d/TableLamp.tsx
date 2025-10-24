'use client'

import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useTheme } from '@/hooks/useTheme'

type GLTFResult = GLTF & {
  nodes: {
    Switch_Table_Lamp_0: THREE.Mesh
    Lightbulb_Table_Lamp_0: THREE.Mesh
    Base_Table_Lamp_0: THREE.Mesh
  }
  materials: {
    Table_Lamp: THREE.MeshStandardMaterial
  }
}

interface TableLampProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  onClick?: (event: any) => void
}

export function TableLamp({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1,
  ...props 
}: TableLampProps) {
  const group = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF('/table_lamp.glb') as GLTFResult
  const { toggleTheme } = useTheme()
  
  // Lamp state
  const [isLampOn, setIsLampOn] = useState(false)
  const [switchRotation, setSwitchRotation] = useState(0)
  // Cursor state on hover
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Create emissive material for bulb when on
  const bulbMaterial = isLampOn 
    ? new THREE.MeshStandardMaterial({
        ...materials.Table_Lamp,
        emissive: new THREE.Color(0xffff88),
        emissiveIntensity: 0.8
      })
    : materials.Table_Lamp

  // Handle switch click
  const handleSwitchClick = (e: any) => {
    e.stopPropagation()
    setIsLampOn(!isLampOn)
    if (!isLampOn) {
      setSwitchRotation(0.3)
    } else {
      setSwitchRotation(0)
    }
    toggleTheme()
  }

  return (
    <group 
      ref={group} 
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        setShowTooltip(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        setShowTooltip(false)
      }}
      onClick={props.onClick}
      dispose={null}
      {...props}
    >
      {/* Base - render first for proper layering */}
      <mesh 
        geometry={nodes.Base_Table_Lamp_0.geometry} 
        material={materials.Table_Lamp} 
      />
      
      {/* Switch */}
      <mesh
        position={[0, 0, -15.1]} 
        rotation={[switchRotation, 0, 0]}
        geometry={nodes.Switch_Table_Lamp_0.geometry} 
        material={materials.Table_Lamp}
        onClick={handleSwitchClick}
      />
      
      {/* Lightbulb - render last to ensure proper positioning */}
      <mesh 
        position={[-3.05, -7, 10]} 
        geometry={nodes.Lightbulb_Table_Lamp_0.geometry} 
        material={bulbMaterial} 
      />

      {/* Add point light when lamp is on */}
      {isLampOn && (
        <pointLight
          position={[-3.05, -7, 10]}
          intensity={15}
          color={0xffff88}
          distance={20}
          decay={1.5}
        />
      )}

      {/* Tooltip */}
      {showTooltip && (
        <group position={[0, -5, -10]} rotation={[Math.PI / 2, -Math.PI / 3, 0]}>
          {/* Tooltip background */}
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[10, 1.2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          
          {/* Tooltip text */}
          <Text
            position={[0, 0, 0]}
            fontSize={1}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            Click switch
          </Text>
        </group>
      )}
    </group>
  )
}

// Preload the model
useGLTF.preload('/table_lamp.glb')