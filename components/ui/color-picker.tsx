'use client';

import * as React from 'react';
import Color from 'color';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { 
  ColorPicker as ShadcnColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerOutput,
  ColorPickerFormat} from '@/components/ui/shadcn-io/color-picker';

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  /**
   * The current color value (hex, rgb, hsl, etc.)
   */
  value?: string;
  /**
   * Default color value
   */
  defaultValue?: string;
  /**
   * Callback when color changes - returns hex string
   */
  onChange?: (color: string) => void;
  /**
   * Label for the color picker
   */
  label?: string;
  /**
   * Whether to show the eye dropper tool
   */
  showEyeDropper?: boolean;
  /**
   * Whether to show the alpha (transparency) slider
   */
  showAlpha?: boolean;
  /**
   * Whether to show the format selector
   */
  showFormat?: boolean;
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean;
}

/**
 * A reusable ColorPicker component that wraps the shadcn-io color picker
 * with a simplified interface and consistent styling.
 */
export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({
    value,
    defaultValue = '#000000',
    onChange,
    label,
    showEyeDropper = true,
    showAlpha = true,
    showFormat = true,
    className,
    disabled = false,
    // Filter out custom props that shouldn't be passed to DOM
    ...domProps
  }, ref) => {
    const handleColorChange = React.useCallback((colorArray: Parameters<typeof Color.rgb>[0]) => {
      if (!onChange || disabled) return;
      
      try {
        // Ensure colorArray is an array before destructuring
        if (!Array.isArray(colorArray)) {
          console.warn('Invalid color array received:', colorArray);
          return;
        }
        
        const [r, g, b, a = 1] = colorArray as [number, number, number, number?];
        
        // Validate color values to prevent NaN
        if (
          typeof r !== 'number' || isNaN(r) || r < 0 || r > 255 ||
          typeof g !== 'number' || isNaN(g) || g < 0 || g > 255 ||
          typeof b !== 'number' || isNaN(b) || b < 0 || b > 255 ||
          typeof a !== 'number' || isNaN(a) || a < 0 || a > 1
        ) {
          console.warn('Invalid color values received:', { r, g, b, a });
          return;
        }
        
        const color = Color.rgb(r, g, b, a);
        const hexColor = a < 1 ? color.hexa() : color.hex();
        onChange(hexColor);
      } catch (error) {
        console.warn('Failed to convert color:', error);
      }
    }, [onChange, disabled]);

    return (
      <div className={cn('space-y-3', className)} ref={ref} {...domProps}>
        {label && (
          <Label className={cn(disabled && 'text-muted-foreground')}>
            {label}
          </Label>
        )}
        
        <div className={cn(
          'rounded-lg  justify-start',
          disabled && 'opacity-50 pointer-events-none'
        )}>
          <ShadcnColorPicker
            value={value}
            defaultValue={defaultValue}
            onChange={handleColorChange}
            className="w-auto justify-start items-start"
          >
            {/* Color Selection Area */}
            <div className="w-full flex justify-start items-center gap-3">
              <ColorPickerSelection className="h-32 w-32 rounded-md" />
              
              {/* Sliders */}
              <div className="space-y-2 flex flex-col justify-center items-center">
                <ColorPickerHue className="w-full" />
                {showAlpha && <ColorPickerAlpha className="w-full" />}
                {/* Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {showEyeDropper && (
                      <ColorPickerEyeDropper 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0"
                      />
                    )}
                    <ColorPickerOutput className="h-8 flex-1 min-w-0" />
                  </div>
                  
                  {showFormat && (
                    <ColorPickerFormat className="flex items-center gap-2" />
                  )}
                </div>
              </div> 
            </div>
          </ShadcnColorPicker>
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

/**
 * A compact version of the ColorPicker for inline use
 */
export const ColorPickerCompact = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({
    value,
    defaultValue = '#000000',
    onChange,
    label,
    className,
    disabled = false,
    ...domProps
  }, ref) => {
    const handleColorChange = React.useCallback((colorArray: Parameters<typeof Color.rgb>[0]) => {
      if (!onChange || disabled) return;
      
      try {
        // Ensure colorArray is an array before destructuring
        if (!Array.isArray(colorArray)) {
          console.warn('Invalid color array received:', colorArray);
          return;
        }
        
        const [r, g, b, a = 1] = colorArray as [number, number, number, number?];
        const color = Color.rgb(r, g, b, a ?? 1);
        const hexColor = a < 1 ? color.hexa() : color.hex();
        onChange(hexColor);
      } catch (error) {
        console.warn('Failed to convert color:', error);
      }
    }, [onChange, disabled]);

    return (
      <div className={cn('flex items-center gap-2', className)} ref={ref} {...domProps}>
        {label && (
          <Label className={cn('text-sm', disabled && 'text-muted-foreground')}>
            {label}
          </Label>
        )}
        
        <ShadcnColorPicker
          value={value}
          defaultValue={defaultValue}
          onChange={handleColorChange}
          className={cn(disabled && 'opacity-50 pointer-events-none')}
        >
          <div className="flex items-center grow gap-2">
            <ColorPickerSelection className="h-16 w-16 rounded border" />
            <ColorPickerHue className="w-auto flex grow" />

          </div>
        </ShadcnColorPicker>
      </div>
    );
  }
);

ColorPickerCompact.displayName = 'ColorPickerCompact';