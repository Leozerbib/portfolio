import { ReactNode } from 'react'

// Enhanced background configuration types
export type BackgroundType = 'monocolor' | 'image' | 'component' | 'gradient'

export interface MonocolorBackground {
  type: 'monocolor'
  color: string
}

export interface ImageBackground {
  type: 'image'
  url: string
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  size?: 'auto' | 'cover' | 'contain' | string
}

export interface ComponentBackground {
  type: 'component'
  component: ReactNode | (() => ReactNode)
  props?: Record<string, any>
}

export interface GradientBackground {
  type: 'gradient'
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl'
  colors: string[]
  stops?: number[]
}

export type BackgroundConfig = 
  | MonocolorBackground 
  | ImageBackground 
  | ComponentBackground 
  | GradientBackground

// Date and locale configuration
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY'
export type LocaleType = 'en-US' | 'en-GB' | 'fr-FR' | 'de-DE' | 'es-ES' | 'it-IT' | 'ja-JP' | 'zh-CN'
export type Language = 'en' | 'fr'
export type Theme = 'light' | 'dark' | 'auto'
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Notification preferences
export interface NotificationPreferences {
  enabled: boolean
  sound: boolean
  desktop: boolean
  email: boolean
  push: boolean
  categories: {
    system: boolean
    apps: boolean
    updates: boolean
    security: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string   // HH:MM format
  }
}

// Style settings structure
export interface StyleSettings {
  background: BackgroundConfig
  loginBackground: BackgroundConfig
  primaryColor: string
  secondaryColor: string
  borderRadius: BorderRadius
  fontSize: FontSize
  animations: boolean
  sounds: boolean
}

// Enhanced system settings interface
export interface EnhancedSystemSettings {
  // Date and locale
  dateFormat: DateFormat
  dateType: LocaleType
  language: Language
  
  // Theme
  theme: Theme
  
  // Notifications
  notificationPreferences: NotificationPreferences
  
  // Style settings
  styleSettings: StyleSettings
  
  // Legacy compatibility (for existing OS state)
  wallpaper?: string
  accentColor?: string
  secondaryColor?: string
  fontSize?: 'small' | 'medium' | 'large'
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animations?: boolean
  sounds?: boolean
  notifications?: boolean
  autoLogin?: boolean
  
  // Background configuration
  backgroundConfig: BackgroundConfig
}

// Default settings configuration
export const defaultSettings: EnhancedSystemSettings = {
  // Date and locale
  dateFormat: 'DD/MM/YYYY',
  dateType: 'fr-FR',
  language: 'fr',
  
  // Theme
  theme: 'dark',
  
  // Notifications
  notificationPreferences: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    push: true,
    categories: {
      system: true,
      apps: true,
      updates: true,
      security: true,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  },
  
  // Style settings
  styleSettings: {
    background: {
      type: "monocolor",
      color: "#000000",
    },
    loginBackground: {
      type: 'image',
      url: '',
      position: 'center',
      repeat: 'no-repeat',
      size: 'cover'
    },
    primaryColor: '#3b82f6',
    secondaryColor: '#a855f7',
    borderRadius: 'md',
    fontSize: 'medium',
    animations: true,
    sounds: true,
  },
  
  // Legacy compatibility
  wallpaper: '/wallpapers/default.jpg',
  accentColor: '#3b82f6',
  secondaryColor: '#a855f7',
  fontSize: 'medium',
  borderRadius: 'md',
  animations: true,
  sounds: true,
  notifications: true,
  autoLogin: false,
  
  // Background configuration
  backgroundConfig: {
    type: 'monocolor',
    color: '#1a1a1a'
  }
}

// Utility functions for settings management
export class SettingsManager {
  /**
   * Creates a settings object from OS data
   */
  static createFromOSData(osSettings: any): EnhancedSystemSettings {
    return {
      // Date and locale (with fallbacks)
      dateFormat: osSettings.dateFormat || defaultSettings.dateFormat,
      dateType: osSettings.dateType || defaultSettings.dateType,
      language: osSettings.language || defaultSettings.language,
      
      // Theme
      theme: osSettings.theme || defaultSettings.theme,
      
      // Notifications
      notificationPreferences: {
        enabled: osSettings.notifications ?? defaultSettings.notificationPreferences.enabled,
        sound: osSettings.sounds ?? defaultSettings.notificationPreferences.sound,
        desktop: osSettings.notificationPreferences?.desktop ?? defaultSettings.notificationPreferences.desktop,
        email: osSettings.notificationPreferences?.email ?? defaultSettings.notificationPreferences.email,
        push: osSettings.notificationPreferences?.push ?? defaultSettings.notificationPreferences.push,
        categories: {
          system: osSettings.notificationPreferences?.categories?.system ?? defaultSettings.notificationPreferences.categories.system,
          apps: osSettings.notificationPreferences?.categories?.apps ?? defaultSettings.notificationPreferences.categories.apps,
          updates: osSettings.notificationPreferences?.categories?.updates ?? defaultSettings.notificationPreferences.categories.updates,
          security: osSettings.notificationPreferences?.categories?.security ?? defaultSettings.notificationPreferences.categories.security,
        },
        quietHours: {
          enabled: osSettings.notificationPreferences?.quietHours?.enabled ?? defaultSettings.notificationPreferences.quietHours.enabled,
          start: osSettings.notificationPreferences?.quietHours?.start ?? defaultSettings.notificationPreferences.quietHours.start,
          end: osSettings.notificationPreferences?.quietHours?.end ?? defaultSettings.notificationPreferences.quietHours.end,
        },
      },
      
      // Style settings
      styleSettings: {
        background: osSettings.styleSettings?.background || {
          type: 'monocolor',
          color: osSettings.wallpaper || defaultSettings.styleSettings.background,
        },
        loginBackground: osSettings.styleSettings?.loginBackground || defaultSettings.styleSettings.loginBackground,
        primaryColor: osSettings.styleSettings?.primaryColor || osSettings.accentColor || defaultSettings.styleSettings.primaryColor,
        secondaryColor: osSettings.styleSettings?.secondaryColor || osSettings.secondaryColor || defaultSettings.styleSettings.secondaryColor,
        borderRadius: osSettings.styleSettings?.borderRadius || osSettings.borderRadius || defaultSettings.styleSettings.borderRadius,
        fontSize: osSettings.styleSettings?.fontSize || osSettings.fontSize || defaultSettings.styleSettings.fontSize,
        animations: osSettings.styleSettings?.animations ?? osSettings.animations ?? defaultSettings.styleSettings.animations,
        sounds: osSettings.styleSettings?.sounds ?? osSettings.sounds ?? defaultSettings.styleSettings.sounds,
      },
      
      // Legacy compatibility
      wallpaper: osSettings.wallpaper,
      accentColor: osSettings.accentColor,
      secondaryColor: osSettings.secondaryColor,
      fontSize: osSettings.fontSize,
      borderRadius: osSettings.borderRadius,
      animations: osSettings.animations,
      sounds: osSettings.sounds,
      notifications: osSettings.notifications,
      autoLogin: osSettings.autoLogin,
      
      // Background configuration (for legacy compatibility)
      backgroundConfig: osSettings.styleSettings?.background || osSettings.backgroundConfig || defaultSettings.backgroundConfig,
    }
  }

  /**
   * Converts enhanced settings back to OS-compatible format
   */
  static toOSFormat(settings: EnhancedSystemSettings): any {
    return {
      // Enhanced properties
      dateFormat: settings.dateFormat,
      dateType: settings.dateType,
      language: settings.language,
      theme: settings.theme,
      notificationPreferences: settings.notificationPreferences,
      styleSettings: settings.styleSettings,
      
      // Legacy properties for backward compatibility
      wallpaper: settings.wallpaper || (
        settings.styleSettings.background.type === 'image' 
          ? (settings.styleSettings.background as ImageBackground).url 
          : '/wallpapers/default.jpg'
      ),
      accentColor: settings.accentColor || settings.styleSettings.primaryColor,
      secondaryColor: settings.secondaryColor || settings.styleSettings.secondaryColor,
      fontSize: settings.fontSize || settings.styleSettings.fontSize,
      borderRadius: settings.borderRadius || settings.styleSettings.borderRadius,
      animations: settings.animations ?? settings.styleSettings.animations,
      sounds: settings.sounds ?? settings.styleSettings.sounds,
      notifications: settings.notifications ?? settings.notificationPreferences.enabled,
      autoLogin: settings.autoLogin || false,
    }
  }

  /**
   * Validates settings object
   */
  static validate(settings: Partial<EnhancedSystemSettings>): boolean {
    try {
      // Basic validation - can be extended
      if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
        return false
      }
      
      if (settings.language && !['en', 'fr', 'de', 'es', 'it', 'ja', 'zh'].includes(settings.language)) {
        return false
      }
      
      if (settings.dateFormat && !['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'].includes(settings.dateFormat)) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }

  /**
   * Merges settings with defaults
   */
  static merge(settings: Partial<EnhancedSystemSettings>): EnhancedSystemSettings {
    return {
      ...defaultSettings,
      ...settings,
      notificationPreferences: {
        ...defaultSettings.notificationPreferences,
        ...settings.notificationPreferences,
        categories: {
          ...defaultSettings.notificationPreferences.categories,
          ...settings.notificationPreferences?.categories,
        },
        quietHours: {
          ...defaultSettings.notificationPreferences.quietHours,
          ...settings.notificationPreferences?.quietHours,
        },
      },
      styleSettings: {
        ...defaultSettings.styleSettings,
        ...settings.styleSettings,
      },
    }
  }
}

// Helper functions for background rendering
export const renderBackground = (background: BackgroundConfig): string => {
  switch (background.type) {
    case 'monocolor':
      return `background-color: ${background.color};`
    
    case 'image':
      return `
        background-image: url('${background.url}');
        background-position: ${background.position || 'center'};
        background-repeat: ${background.repeat || 'no-repeat'};
        background-size: ${background.size || 'cover'};
      `
    
    case 'gradient':
      const colors = background.colors.join(', ')
      const direction = background.direction || 'to-br'
      return `background: linear-gradient(${direction}, ${colors});`
    
    case 'component':
      // Component backgrounds need to be handled in React context
      return ''
    
    default:
      return ''
  }
}

export const getBackgroundClasses = (background: BackgroundConfig): string => {
  switch (background.type) {
    case 'gradient':
      const directionClass = `bg-gradient-${background.direction || 'to-br'}`
      return directionClass
    
    case 'image':
      return 'bg-cover bg-center bg-no-repeat'
    
    default:
      return ''
  }
}