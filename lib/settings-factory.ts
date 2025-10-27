import { EnhancedSystemSettings, SettingsManager, defaultSettings } from './settings'

/**
 * Settings Factory - Creates and manages settings objects from OS data
 */
export class SettingsFactory {
  /**
   * Creates a complete settings object from OS system settings
   */
  static createFromOSData(osSettings: Partial<EnhancedSystemSettings>): EnhancedSystemSettings {
    return SettingsManager.merge(osSettings)
  }

  /**
   * Creates a settings object with validation
   */
  static createValidated(settings: Partial<EnhancedSystemSettings>): EnhancedSystemSettings {
    const isValid = SettingsManager.validate(settings)
    if (!isValid) {
      throw new Error('Invalid settings provided')
    }
    return SettingsManager.merge(settings)
  }

  /**
   * Creates settings for a specific theme
   */
  static createForTheme(theme: 'light' | 'dark' | 'auto', baseSettings?: Partial<EnhancedSystemSettings>): EnhancedSystemSettings {
    const themeDefaults = {
      light: {
        theme: 'light' as const,
        styleSettings: {
          ...defaultSettings.styleSettings,
          background: {
            type: 'monocolor' as const,
            color: '#ffffff'
          },
          loginBackground: {
            type: 'gradient' as const,
            colors: ['#667eea', '#764ba2'],
            direction: 'to-br' as const
          },
          primaryColor: '#3b82f6',
          secondaryColor: '#8b5cf6'
        }
      },
      dark: {
        theme: 'dark' as const,
        styleSettings: {
          ...defaultSettings.styleSettings,
          background: {
            type: 'monocolor' as const,
            color: '#0f0f23'
          },
          loginBackground: {
            type: 'gradient' as const,
            colors: ['#1e3a8a', '#7c3aed'],
            direction: 'to-br' as const
          },
          primaryColor: '#60a5fa',
          secondaryColor: '#a78bfa'
        }
      },
      auto: {
        theme: 'auto' as const,
        styleSettings: defaultSettings.styleSettings
      }
    }

    const themeSettings = themeDefaults[theme]
    return SettingsManager.merge({ ...baseSettings, ...themeSettings })
  }

  /**
   * Creates settings for a specific locale
   */
  static createForLocale(locale: string, baseSettings?: Partial<EnhancedSystemSettings>): EnhancedSystemSettings {
    const localeMap: Record<string, Partial<EnhancedSystemSettings>> = {
      'en-US': {
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        dateType: 'en-US'
      },
      'en-GB': {
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        dateType: 'en-GB'
      },
      'fr-FR': {
        language: 'fr',
        dateFormat: 'DD/MM/YYYY',
        dateType: 'fr-FR'
      },
      'de-DE': {
        language: 'en', // Using 'en' as fallback since 'de' is not in Language type
        dateFormat: 'DD/MM/YYYY',
        dateType: 'de-DE'
      },
      'es-ES': {
        language: 'en', // Using 'en' as fallback since 'es' is not in Language type
        dateFormat: 'DD/MM/YYYY',
        dateType: 'es-ES'
      }
    }

    const localeSettings = localeMap[locale] || localeMap['en-US']
    return SettingsManager.merge({ ...baseSettings, ...localeSettings })
  }

  /**
   * Creates settings with custom style configuration
   */
  static createWithCustomStyle(
    styleOverrides: Partial<EnhancedSystemSettings['styleSettings']>,
    baseSettings?: Partial<EnhancedSystemSettings>
  ): EnhancedSystemSettings {
    return SettingsManager.merge({
      ...baseSettings,
      styleSettings: {
        ...defaultSettings.styleSettings,
        ...baseSettings?.styleSettings,
        ...styleOverrides
      }
    })
  }

  /**
   * Creates settings from environment or user preferences
   */
  static createFromEnvironment(): EnhancedSystemSettings {
    // Detect system preferences
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    return this.createValidated({
      theme: prefersDark ? 'dark' : 'light',
      dateType: systemLocale as any,
      styleSettings: {
        ...defaultSettings.styleSettings,
        animations: !reducedMotion
      }
    })
  }

  /**
   * Converts legacy OS settings to enhanced settings
   */
  static convertLegacySettings(legacySettings: any): EnhancedSystemSettings {
    return SettingsManager.merge({
      // Map legacy properties to new structure
      theme: legacySettings.theme || 'dark',
      language: legacySettings.language || 'en',
      notificationPreferences: {
        enabled: legacySettings.notifications ?? true,
        sound: legacySettings.sounds ?? true,
        desktop: true,
        email: false,
        push: true,
        categories: {
          system: true,
          apps: true,
          updates: true,
          security: true
        },
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00'
        }
      },
      styleSettings: {
        background: {
          type: 'image',
          url: legacySettings.wallpaper || '/wallpapers/default.jpg'
        },
        loginBackground: {
          type: 'gradient',
          colors: ['#667eea', '#764ba2'],
          direction: 'to-br'
        },
        primaryColor: legacySettings.accentColor || '#3b82f6',
        secondaryColor: legacySettings.secondaryColor || '#8b5cf6',
        borderRadius: legacySettings.borderRadius || 'md',
        fontSize: legacySettings.fontSize || 'medium',
        animations: legacySettings.animations ?? true,
        sounds: true
      }
    })
  }
}

/**
 * Utility functions for working with settings
 */
export const settingsUtils = {
  /**
   * Get current settings from OS context
   */
  getCurrentSettings: (osSettings: any): EnhancedSystemSettings => {
    return SettingsFactory.createFromOSData(osSettings)
  },

  /**
   * Create settings diff for updates
   */
  createDiff: (current: EnhancedSystemSettings, updates: Partial<EnhancedSystemSettings>) => {
    const diff: Partial<EnhancedSystemSettings> = {}
    
    Object.keys(updates).forEach(key => {
      const currentValue = current[key as keyof EnhancedSystemSettings]
      const updateValue = updates[key as keyof EnhancedSystemSettings]
      
      if (JSON.stringify(currentValue) !== JSON.stringify(updateValue)) {
        ;(diff as any)[key] = updateValue
      }
    })
    
    return diff
  },

  /**
   * Export settings to JSON
   */
  exportSettings: (settings: EnhancedSystemSettings): string => {
    return JSON.stringify(settings, null, 2)
  },

  /**
   * Import settings from JSON
   */
  importSettings: (json: string): EnhancedSystemSettings => {
    try {
      const parsed = JSON.parse(json)
      return SettingsFactory.createValidated(parsed)
    } catch (error) {
      console.error('Failed to import settings:', error)
      return defaultSettings
    }
  }
}