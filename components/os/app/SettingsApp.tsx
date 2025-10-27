"use client"

import { useCallback, useMemo, useEffect, useState } from "react"
import { useOS } from "@/hooks/useOS"
import { useTheme } from "@/hooks/useTheme"
import { 
  EnhancedSystemSettings, 
  BackgroundConfig, 
  StyleSettings,
  DateFormat, 
  LocaleType, 
  Language, 
  Theme, 
  FontSize, 
  BorderRadius 
} from "@/lib/settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { backgroundComponentsConfig, getComponentConfig, } from '@/lib/background-components-config'
import ComponentBackground from '@/components/os/background/ComponentBackground'
import ImageBackground from '@/components/os/background/ImageBackground'
import MonocolorBackground from '@/components/os/background/MonocolorBackground'
import GradientBackground from '@/components/os/background/GradientBackground'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ColorPicker, ColorPickerCompact } from '@/components/ui/color-picker'
import { ImageSelectorDialog } from '@/components/ui/image-selector-dialog'
import { ImageIcon } from 'lucide-react'
import Image from "next/image"

export default function SettingsApp() {
  const { state, actions } = useOS()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, setTheme } = useTheme()

  // Local state for form management
  const [localSettings, setLocalSettings] = useState<Partial<EnhancedSystemSettings>>({})

  // Get current settings from OS state
  const currentSettings = useMemo(() => {
    return state.systemSettings as EnhancedSystemSettings
  }, [state.systemSettings])

  // Initialize local settings when component mounts or OS settings change
  useEffect(() => {
    setLocalSettings(currentSettings)
  }, [currentSettings])

  // Console log settings when page loads
  useEffect(() => {
    console.log('SettingsApp loaded with current settings:', currentSettings)
    console.log('Raw OS settings:', state.systemSettings)
  }, [currentSettings, state.systemSettings])

  // Helper function to get current style settings with defaults
  const getCurrentStyleSettings = useCallback((): StyleSettings => {
    const defaultStyleSettings: StyleSettings = {
      background: { type: 'monocolor', color: '#000000' },
      loginBackground: { type: 'monocolor', color: '#000000' },
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      borderRadius: 'md',
      fontSize: 'medium',
      animations: true,
      sounds: true
    }
    
    return {
      ...defaultStyleSettings,
      ...(localSettings.styleSettings || currentSettings.styleSettings || {})
    }
  }, [localSettings.styleSettings, currentSettings.styleSettings])

  const handleLocalUpdate = useCallback((updates: Partial<EnhancedSystemSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  const handleStyleSettingsUpdate = useCallback((updates: Partial<StyleSettings>) => {
    const currentStyleSettings = getCurrentStyleSettings()
    
    handleLocalUpdate({
      styleSettings: {
        ...currentStyleSettings,
        ...updates
      }
    })
  }, [getCurrentStyleSettings, handleLocalUpdate])

  const applySettings = useCallback(() => {
    console.log('Applying settings:', localSettings)
    actions.updateSystemSettings(localSettings)
  }, [localSettings, actions])

  const resetSettings = useCallback(() => {
    setLocalSettings(currentSettings)
  }, [currentSettings])

  const handleThemeChange = useCallback((newTheme: Theme) => {
    // Update both local state and theme hook
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme)
    }
    handleLocalUpdate({ theme: newTheme })
  }, [setTheme, handleLocalUpdate])

  const handleBackgroundTypeChange = useCallback((type: BackgroundConfig['type']) => {
    const newBackground: BackgroundConfig = (() => {
      switch (type) {
        case 'monocolor':
          return { type: 'monocolor', color: '#000000' }
        case 'image':
          return { type: 'image', url: '/image_os/background/default.jpg' }
        case 'gradient':
          return { type: 'gradient', colors: ['#3b82f6', '#8b5cf6'] }
        case 'component':
          return { type: 'component', component: 'Dither', props: {} }
        default:
          return { type: 'monocolor', color: '#000000' }
      }
    })()

    handleStyleSettingsUpdate({ background: newBackground })
  }, [handleStyleSettingsUpdate])

  const handleBackgroundComponentChange = useCallback((componentName: string) => {
    const componentConfig = getComponentConfig(componentName)
    
    // Initialize props with default values
    const defaultProps: Record<string, any> = {}
    if (componentConfig) {
      componentConfig.properties.forEach(prop => {
        defaultProps[prop.name] = prop.defaultValue
      })
    }

    const updatedBackground: BackgroundConfig = {
      type: 'component',
      component: componentName,
      props: defaultProps
    }

    handleStyleSettingsUpdate({ background: updatedBackground })
  }, [handleStyleSettingsUpdate])

  const handleComponentPropertyChange = useCallback((propertyName: string, value: any) => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background

    if (currentBackground.type === 'component') {
      const updatedBackground: BackgroundConfig = {
        ...currentBackground,
        props: {
          ...currentBackground.props,
          [propertyName]: value
        }
      }

      handleStyleSettingsUpdate({ background: updatedBackground })
    }
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  const handleBackgroundValueChange = useCallback((value: string) => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background

    let updatedBackground: BackgroundConfig
    
    switch (currentBackground.type) {
      case 'monocolor':
        updatedBackground = { ...currentBackground, color: value }
        break
      case 'image':
        updatedBackground = { ...currentBackground, url: value }
        break
      case 'gradient':
        // For gradient, we'll update the first color
        const colors = [...(currentBackground.colors || ['#3b82f6', '#8b5cf6'])]
        colors[0] = value
        updatedBackground = { ...currentBackground, colors }
        break
      default:
        updatedBackground = currentBackground
    }

    handleStyleSettingsUpdate({ background: updatedBackground })
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  // Color change handlers for ColorPicker components
  const handlePrimaryColorChange = useCallback((hex: string) => {
    // ColorPicker already returns a hex string
    handleStyleSettingsUpdate({ primaryColor: hex })
  }, [handleStyleSettingsUpdate])

  const handleSecondaryColorChange = useCallback((hex: string) => {
    // ColorPicker already returns a hex string
    handleStyleSettingsUpdate({ secondaryColor: hex })
  }, [handleStyleSettingsUpdate])

  // Gradient color change handlers
  const handleGradientColorChange = useCallback((colorIndex: number, hex: string) => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background
    
    if (currentBackground.type === 'gradient') {
      const updatedColors = [...(currentBackground.colors || ['#3b82f6', '#8b5cf6'])]
      updatedColors[colorIndex] = hex
      
      const updatedBackground: BackgroundConfig = {
        ...currentBackground,
        colors: updatedColors
      }
      
      handleStyleSettingsUpdate({ background: updatedBackground })
    }
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  const handleMonocolorChange = useCallback((hex: string) => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background
    
    if (currentBackground.type === 'monocolor') {
      const updatedBackground: BackgroundConfig = {
        ...currentBackground,
        color: hex
      }
      
      handleStyleSettingsUpdate({ background: updatedBackground })
    }
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  const addGradientColor = useCallback(() => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background
    
    if (currentBackground.type === 'gradient') {
      const updatedColors = [...(currentBackground.colors || ['#3b82f6', '#8b5cf6']), '#ffffff']
      
      const updatedBackground: BackgroundConfig = {
        ...currentBackground,
        colors: updatedColors
      }
      
      handleStyleSettingsUpdate({ background: updatedBackground })
    }
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  const removeGradientColor = useCallback((colorIndex: number) => {
    const currentStyleSettings = getCurrentStyleSettings()
    const currentBackground = currentStyleSettings.background
    
    if (currentBackground.type === 'gradient' && currentBackground.colors && currentBackground.colors.length > 2) {
      const updatedColors = currentBackground.colors.filter((_, index) => index !== colorIndex)
      
      const updatedBackground: BackgroundConfig = {
        ...currentBackground,
        colors: updatedColors
      }
      
      handleStyleSettingsUpdate({ background: updatedBackground })
    }
  }, [getCurrentStyleSettings, handleStyleSettingsUpdate])

  // Get current background component and its properties
  const currentBackground = useMemo(() => {
    const styleSettings = getCurrentStyleSettings()
    return styleSettings.background
  }, [getCurrentStyleSettings])

  // Get current style settings for display
  const currentStyleSettings = useMemo(() => {
    return getCurrentStyleSettings()
  }, [getCurrentStyleSettings])

  return (
    <div className="p-4 space-y-6 flex h-full flex-col w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure your system preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            Reset
          </Button>
          <Button onClick={applySettings}>
            Apply Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full h-full overflow-hidden">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-auto overflow-hidden p-3">
          <TabsContent value="general" className="space-y-6">
          <Card className="p-3">
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Configure your language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={localSettings.language || 'en'} 
                  onValueChange={(v: Language) => handleLocalUpdate({ language: v })}
                >
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Locale Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="locale">Locale</Label>
                <Select 
                  value={localSettings.dateType || 'en-US'} 
                  onValueChange={(v: LocaleType) => handleLocalUpdate({ dateType: v })}
                >
                  <SelectTrigger id="locale" className="w-full">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="fr-FR">Français (France)</SelectItem>
                    <SelectItem value="de-DE">Deutsch (Deutschland)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                    <SelectItem value="it-IT">Italiano (Italia)</SelectItem>
                    <SelectItem value="ja-JP">日本語 (日本)</SelectItem>
                    <SelectItem value="zh-CN">中文 (中国)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="date-format">Date Format</Label>
                <Select 
                  value={localSettings.dateFormat || 'DD/MM/YYYY'} 
                  onValueChange={(v: DateFormat) => handleLocalUpdate({ dateFormat: v })}
                >
                  <SelectTrigger id="date-format" className="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="p-3">
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>General system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="theme">Theme</Label>
                <Select value={localSettings.theme || 'dark'} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme" className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="animations">Enable Animations</Label>
                <Switch
                  id="animations"
                  checked={currentStyleSettings.animations}
                  onCheckedChange={(checked) => handleStyleSettingsUpdate({ animations: checked })}
                />
              </div>

              {/* Sounds */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Label htmlFor="sounds">Enable Sounds</Label>
                <Switch
                  id="sounds"
                  checked={currentStyleSettings.sounds}
                  onCheckedChange={(checked) => handleStyleSettingsUpdate({ sounds: checked })}
                />
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            {/* Color Settings */}
            <Card className="p-3">
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>
                  Customize your system colors and theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Color */}
                <div className="space-y-3">
                  <ColorPicker 
                    value={currentStyleSettings.primaryColor}
                    onChange={handlePrimaryColorChange}
                    label="Primary Color"
                    showEyeDropper={false}
                    showAlpha={true}
                    showFormat={true}
                  />
                </div>

                {/* Secondary Color */}
                <div className="space-y-3">
                  <ColorPicker 
                    value={currentStyleSettings.secondaryColor}
                    onChange={handleSecondaryColorChange}
                    label="Secondary Color"
                    showEyeDropper={false}
                    showAlpha={true}
                    showFormat={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Background Settings */}
            <Card className="p-3">
                <CardHeader>
                  <CardTitle>Background Settings</CardTitle>
                  <CardDescription>
                    Customize your desktop background appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Two-column layout: Settings on left, Preview on right */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Settings Column */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="background-type">Background Type</Label>
                        <Select
                          value={currentBackground.type}
                          onValueChange={handleBackgroundTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select background type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monocolor">Solid Color</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="component">Animated Component</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Background Value Input for non-component types */}
                      {currentBackground.type === 'image' && (
                        <div className="space-y-2">
                          <Label htmlFor="background-value">Background Image</Label>
                          <ImageSelectorDialog
                            selectedImage={currentBackground.url || ''}
                            onImageSelect={handleBackgroundValueChange}
                            title="Select Background Image"
                            description="Choose from our collection of beautiful background images"
                          >
                            <Button 
                              variant="outline" 
                              className="w-full justify-start h-auto p-3"
                            >
                              <div className="flex items-center gap-3 w-full">
                                {currentBackground.url ? (
                                  <>
                                    <div className="w-12 h-8 rounded border overflow-hidden flex-shrink-0">
                                      <Image
                                        src={currentBackground.url}
                                        alt="?"
                                        width={100}
                                        height={100}
                                        className="w-full h-full flex items-center justify-center object-cover"
                                      />
                                    </div>
                                    <span className="text-sm truncate">
                                      {currentBackground.url.split('/').pop()?.replace(/\.(webp|jpg|jpeg|png)$/i, '') || 'Selected Image'}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-12 h-8 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      Select background image...
                                    </span>
                                  </>
                                )}
                              </div>
                            </Button>
                          </ImageSelectorDialog>
                        </div>
                      )}

                      {/* Monocolor Background */}
                      {currentBackground.type === 'monocolor' && (
                        <div className="space-y-3">
                          <ColorPicker 
                            value={currentBackground.color || '#000000'}
                            onChange={handleMonocolorChange}
                            label="Background Color"
                            showEyeDropper={false}
                            showAlpha={true}
                            showFormat={true}
                          />
                        </div>
                      )}

                      {/* Gradient Background */}
                      {currentBackground.type === 'gradient' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Gradient Colors</Label>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={addGradientColor}
                              disabled={(currentBackground.colors?.length || 0) >= 5}
                            >
                              Add Color
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {(currentBackground.colors || ['#3b82f6', '#8b5cf6']).map((color, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="flex-1">
                                  <ColorPickerCompact 
                                    value={color}
                                    onChange={(newColor) => handleGradientColorChange(index, newColor)}
                                    showEyeDropper={false}
                                    showAlpha={false}
                                    showFormat={false}
                                  />
                                </div>
                                {(currentBackground.colors?.length || 0) > 2 && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => removeGradientColor(index)}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {currentBackground.type === 'component' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="component-select">Component</Label>
                            <Select
                              value={currentBackground.component as string}
                              onValueChange={handleBackgroundComponentChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select component" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(backgroundComponentsConfig).map((componentName) => (
                                  <SelectItem key={componentName} value={componentName}>
                                    {backgroundComponentsConfig[componentName].name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Component Description */}
                          <p className="text-xs text-muted-foreground">
                            {getComponentConfig(currentBackground.component as string)?.description}
                          </p>

                          {/* Component Properties */}
                          {(() => {
                            const componentConfig = getComponentConfig(currentBackground.component as string)
                            if (!componentConfig) return null

                            return (
                              <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                  <AccordionTrigger>Properties</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <Label className="text-sm font-medium">Component Properties</Label>
                                      <div className="space-y-3 pl-4 border-l-2 border-border">
                                        {componentConfig.properties.map((property) => {
                                          const currentValue = currentBackground.props?.[property.name] ?? property.defaultValue

                                          switch (property.type) {
                                            case 'number':
                                              return (
                                                <div key={property.name} className="space-y-1">
                                                  <div className="flex justify-between items-center">
                                                    <Label className="text-xs">{property.name}</Label>
                                                    <span className="text-xs text-muted-foreground">{currentValue}</span>
                                                  </div>
                                                  <Slider
                                                    value={[currentValue]}
                                                    onValueChange={([value]) => handleComponentPropertyChange(property.name, value)}
                                                    min={property.min || 0}
                                                    max={property.max || 100}
                                                    step={property.step || 1}
                                                    className="w-full"
                                                  />
                                                  {property.description && (
                                                    <p className="text-xs text-muted-foreground">{property.description}</p>
                                                  )}
                                                </div>
                                              )

                                            case 'boolean':
                                              return (
                                                <div key={property.name} className="flex items-center justify-between">
                                                  <div className="space-y-0.5">
                                                    <Label className="text-xs">{property.name}</Label>
                                                    {property.description && (
                                                      <p className="text-xs text-muted-foreground">{property.description}</p>
                                                    )}
                                                  </div>
                                                  <Switch
                                                    checked={currentValue}
                                                    onCheckedChange={(checked) => handleComponentPropertyChange(property.name, checked)}
                                                  />
                                                </div>
                                              )

                                            case 'color':
                                              return (
                                                <div key={property.name} className="space-y-1">
                                                  <ColorPickerCompact
                                                    value={currentValue}
                                                    onChange={(hex) => {
                                                      // ColorPicker already returns a hex string, no conversion needed
                                                      handleComponentPropertyChange(property.name, hex)
                                                    }}
                                                  />
                                                </div>
                                              )

                                            case 'select':
                                              return (
                                                <div key={property.name} className="space-y-1">
                                                  <Label className="text-xs">{property.name}</Label>
                                                  <Select
                                                    value={currentValue}
                                                    onValueChange={(value) => handleComponentPropertyChange(property.name, value)}
                                                  >
                                                    <SelectTrigger className="h-8">
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      {property.options?.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                          {option.label}
                                                        </SelectItem>
                                                      ))}
                                                    </SelectContent>
                                                  </Select>
                                                  {property.description && (
                                                    <p className="text-xs text-muted-foreground">{property.description}</p>
                                                  )}
                                                </div>
                                              )

                                            case 'array':
                                              if (property.name === 'colorStops') {
                                                return (
                                                  <div key={property.name} className="space-y-1">
                                                    <Label className="text-xs">{property.name}</Label>
                                                    <Input
                                                      type="text"
                                                      value={Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
                                                      onChange={(e) => {
                                                        const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c)
                                                        handleComponentPropertyChange(property.name, colors)
                                                      }}
                                                      className="text-xs"
                                                      placeholder="#5227FF, #7cff67, #5227FF"
                                                    />
                                                    {property.description && (
                                                      <p className="text-xs text-muted-foreground">{property.description}</p>
                                                    )}
                                                  </div>
                                                )
                                              }
                                              return null

                                            default:
                                              return (
                                                <div key={property.name} className="space-y-1">
                                                  <Label className="text-xs">{property.name}</Label>
                                                  <Input
                                                    type="text"
                                                    value={currentValue}
                                                    onChange={(e) => handleComponentPropertyChange(property.name, e.target.value)}
                                                    className="text-xs"
                                                  />
                                                  {property.description && (
                                                    <p className="text-xs text-muted-foreground">{property.description}</p>
                                                  )}
                                                </div>
                                              )
                                          }
                                        })}
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Preview Column */}
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden border border-border">
                        <div className="relative w-full h-full">
                          {/* Render preview based on background type */}
                          {currentBackground.type === 'monocolor' && (
                            <MonocolorBackground color={currentBackground.color} />
                          )}
                          
                          {currentBackground.type === 'image' && (
                            <ImageBackground
                              imageUrl={currentBackground.url}
                              position={"center"}
                              size={"cover"}
                              repeat={currentBackground.repeat}
                            />
                          )}
                          
                          {currentBackground.type === 'gradient' && (
                            <GradientBackground
                              direction={currentBackground.direction}
                              colors={currentBackground.colors}
                              stops={currentBackground.stops}
                            />
                          )}
                          
                          {currentBackground.type === 'component' && (
                            <ComponentBackground
                              component={currentBackground.component as string}
                              componentProps={currentBackground.props || {}}
                              className="w-full h-full"
                            />
                          )}
                          
                          {/* Overlay border for better visual definition */}
                          <div className="absolute inset-0 pointer-events-none border border-border rounded-lg" />
                        </div>
                      </AspectRatio>
                      <p className="text-xs text-muted-foreground text-center">
                        Live preview of your background settings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

          <Card className="p-3">
              <CardHeader>
                <CardTitle>UI Preferences</CardTitle>
                <CardDescription>Customize the user interface appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Font size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select 
                    value={currentStyleSettings.fontSize} 
                    onValueChange={(v: FontSize) => handleStyleSettingsUpdate({ fontSize: v })}
                  >
                    <SelectTrigger id="font-size" className="w-full">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Border radius */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <Select 
                    value={currentStyleSettings.borderRadius} 
                    onValueChange={(v: BorderRadius) => handleStyleSettingsUpdate({ borderRadius: v })}
                  >
                    <SelectTrigger id="border-radius" className="w-full">
                      <SelectValue placeholder="Select border radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                      <SelectItem value="2xl">2X Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
          <Card className="p-3">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                  <Switch
                    id="notifications-enabled"
                    checked={localSettings.notificationPreferences?.enabled ?? true}
                    onCheckedChange={(checked) => {
                      const defaultPrefs = {
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
                      };
                      
                      handleLocalUpdate({ 
                        notificationPreferences: { 
                          ...defaultPrefs,
                          ...localSettings.notificationPreferences,
                          enabled: checked 
                        } 
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="notifications-sound">Sound Notifications</Label>
                  <Switch
                    id="notifications-sound"
                    checked={localSettings.notificationPreferences?.sound ?? true}
                    onCheckedChange={(checked) => {
                      const defaultPrefs = {
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
                      };
                      
                      handleLocalUpdate({ 
                        notificationPreferences: { 
                          ...defaultPrefs,
                          ...localSettings.notificationPreferences,
                          sound: checked 
                        } 
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="notifications-desktop">Desktop Notifications</Label>
                  <Switch
                    id="notifications-desktop"
                    checked={localSettings.notificationPreferences?.desktop ?? true}
                    onCheckedChange={(checked) => {
                      const defaultPrefs = {
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
                      };
                      
                      handleLocalUpdate({ 
                        notificationPreferences: { 
                          ...defaultPrefs,
                          ...localSettings.notificationPreferences,
                          desktop: checked 
                        } 
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <Label htmlFor="notifications-push">Push Notifications</Label>
                  <Switch
                    id="notifications-push"
                    checked={localSettings.notificationPreferences?.push ?? true}
                    onCheckedChange={(checked) => {
                      const defaultPrefs = {
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
                      };
                      
                      handleLocalUpdate({ 
                        notificationPreferences: { 
                          ...defaultPrefs,
                          ...localSettings.notificationPreferences,
                          push: checked 
                        } 
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}