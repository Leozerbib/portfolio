import { ComponentType } from 'react';
import Aurora from '@/components/os/background/native/Aurora';
import Dither from '@/components/os/background/native/Dither';
import DotGrid from '@/components/os/background/native/DotGrid';
import FaultyTerminal from '@/components/os/background/native/FaultyTerminal';
import Iridescence from '@/components/os/background/native/Iridescence';
import Particles from '@/components/os/background/native/Particles';
import PixelBlast from '@/components/os/background/native/PixelBlast';
import Plasma from '@/components/os/background/native/Plasma';
import Silk from '@/components/os/background/native/Silk';
import Threads from '@/components/os/background/native/Threads';

export interface ComponentProperty {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'color' | 'select' | 'array';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface BackgroundComponentConfig {
  name: string;
  component: ComponentType<any>;
  description: string;
  properties: ComponentProperty[];
}

export const backgroundComponentsConfig: Record<string, BackgroundComponentConfig> = {
  Dither: {
    name: 'Dither',
    component: Dither,
    description: 'Dithered wave pattern with retro aesthetic',
    properties: [
      {
        name: 'waveSpeed',
        type: 'number',
        defaultValue: 0.05,
        min: 0.01,
        max: 0.2,
        step: 0.01,
        description: 'Speed of wave animation'
      },
      {
        name: 'waveFrequency',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 1,
        description: 'Frequency of wave patterns'
      },
      {
        name: 'waveAmplitude',
        type: 'number',
        defaultValue: 0.3,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: 'Amplitude of wave movement'
      },
      {
        name: 'colorNum',
        type: 'number',
        defaultValue: 4,
        min: 2,
        max: 16,
        step: 1,
        description: 'Number of colors in dither palette'
      }
    ]
  },
  DotGrid: {
    name: 'Dot Grid',
    component: DotGrid,
    description: 'Interactive grid of dots with proximity effects',
    properties: [
      {
        name: 'dotSize',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 10,
        step: 1,
        description: 'Size of individual dots'
      },
      {
        name: 'gap',
        type: 'number',
        defaultValue: 20,
        min: 10,
        max: 50,
        step: 5,
        description: 'Gap between dots'
      },
      {
        name: 'baseColor',
        type: 'color',
        defaultValue: '#666666',
        description: 'Base color of inactive dots'
      },
      {
        name: 'activeColor',
        type: 'color',
        defaultValue: '#ffffff',
        description: 'Color of active/highlighted dots'
      },
      {
        name: 'proximity',
        type: 'number',
        defaultValue: 100,
        min: 50,
        max: 200,
        step: 10,
        description: 'Distance for proximity detection'
      }
    ]
  },
  PixelBlast: {
    name: 'Pixel Blast',
    component: PixelBlast,
    description: 'Dynamic pixel-based visual effects',
    properties: [
      {
        name: 'pixelSize',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 16,
        step: 1,
        description: 'Size of individual pixels'
      },
      {
        name: 'color',
        type: 'color',
        defaultValue: '#ffffff',
        description: 'Primary color of pixels'
      },
      {
        name: 'patternScale',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        max: 5.0,
        step: 0.1,
        description: 'Scale of pattern generation'
      },
      {
        name: 'patternDensity',
        type: 'number',
        defaultValue: 0.5,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: 'Density of pixel patterns'
      },
      {
        name: 'speed',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        max: 5.0,
        step: 0.1,
        description: 'Animation speed'
      }
    ]
  },
  Silk: {
    name: 'Silk',
    component: Silk,
    description: 'Smooth silk-like flowing patterns',
    properties: [
      {
        name: 'speed',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        description: 'Animation speed'
      },
      {
        name: 'scale',
        type: 'number',
        defaultValue: 1,
        min: 0.1,
        max: 5.0,
        step: 0.1,
        description: 'Scale of silk patterns'
      },
      {
        name: 'color',
        type: 'color',
        defaultValue: '#7B7481',
        description: 'Primary silk color'
      },
      {
        name: 'noiseIntensity',
        type: 'number',
        defaultValue: 1.5,
        min: 0.1,
        max: 5.0,
        step: 0.1,
        description: 'Intensity of noise patterns'
      },
      {
        name: 'rotation',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 360,
        step: 15,
        description: 'Rotation angle in degrees'
      }
    ]
  },
  Threads: {
    name: 'Threads',
    component: Threads,
    description: 'Animated thread-like patterns',
    properties: [
      {
        name: 'amplitude',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        max: 3.0,
        step: 0.1,
        description: 'Amplitude of thread movement'
      },
      {
        name: 'distance',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        max: 5.0,
        step: 0.1,
        description: 'Distance between threads'
      },
      {
        name: 'enableMouseInteraction',
        type: 'boolean',
        defaultValue: false,
        description: 'Enable mouse interaction effects'
      }
    ]
  }
};

export const getComponentNames = (): string[] => {
  return Object.keys(backgroundComponentsConfig);
};

export const getComponentConfig = (name: string): BackgroundComponentConfig | undefined => {
  return backgroundComponentsConfig[name];
};

export const getComponentByName = (name: string): ComponentType<any> | undefined => {
  return backgroundComponentsConfig[name]?.component;
};