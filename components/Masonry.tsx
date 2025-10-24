'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Hook for responsive breakpoints
const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

// Hook for measuring container dimensions
const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

// Image preloading utility
const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new window.Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

// Get image dimensions utility
const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 300, height: 200 }); // fallback dimensions
    img.src = src;
  });
};

interface MasonryItem {
  id: string;
  src?: string;
  img?: string;
  alt?: string;
  name?: string;
  url?: string;
  title?: string;
  height?: number;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
}

interface MasonryProps {
  items: MasonryItem[];
  gap?: number;
  minItemWidth?: number;
  maxItemWidth?: number;
  animationDuration?: number;
  animationEase?: string;
  staggerDelay?: number;
  hoverScale?: number;
  className?: string;
  onItemClick?: (item: MasonryItem) => void;
  scaleOnHover?: boolean;
  colorShiftOnHover?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  gap = 16,
  minItemWidth = 250,
  maxItemWidth = 400,
  animationDuration = 0.8,
  animationEase = 'power3.out',
  staggerDelay = 0.1,
  hoverScale = 1.05,
  className,
  onItemClick,
  scaleOnHover = true,
  colorShiftOnHover = false
}) => {
  // Responsive columns based on screen size (1-5 columns)
  const columns = useMedia(
    ['(min-width: 1536px)', '(min-width: 1280px)', '(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)'],
    [5, 4, 3, 2, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const hasMounted = useRef(false);

  // Load image dimensions
  useEffect(() => {
    const loadDimensions = async () => {
      const dimensionsMap = new Map();
      
      await Promise.all(
        items.map(async (item) => {
          const imageSrc = item.src || item.img || item.url || '';
          const dimensions = await getImageDimensions(imageSrc);
          dimensionsMap.set(item.id, dimensions);
        })
      );
      
      setImageDimensions(dimensionsMap);
      await preloadImages(items.map(item => item.src || item.img || item.url || ''));
      setImagesReady(true);
    };

    loadDimensions();
  }, [items]);

  // Calculate grid layout
  const grid = useMemo<GridItem[]>(() => {
    if (!width || !imagesReady || imageDimensions.size === 0) return [];

    const totalGaps = (columns - 1) * gap;
    const availableWidth = width - totalGaps;
    const columnWidth = Math.min(maxItemWidth, Math.max(minItemWidth, availableWidth / columns));
    
    // Calculate total grid width for centering
    const totalGridWidth = columns * columnWidth + totalGaps;
    const offsetX = Math.max(0, (width - totalGridWidth) / 2);
    
    // Ensure grid doesn't exceed container bounds
    const maxX = width - columnWidth;
    const safeOffsetX = Math.min(offsetX, maxX - (columns - 1) * (columnWidth + gap));
    
    // Initialize column heights
    const columnHeights = new Array(columns).fill(0);
    
    return items.map((item) => {
      const dimensions = imageDimensions.get(item.id) || { width: 300, height: 200 };
      const aspectRatio = dimensions.width / dimensions.height;
      
      // Calculate item dimensions maintaining aspect ratio
      const itemWidth = columnWidth;
      const itemHeight = itemWidth / aspectRatio;
      
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Calculate position with safe centering offset
      const x = Math.max(0, Math.min(safeOffsetX + shortestColumnIndex * (columnWidth + gap), maxX));
      const y = columnHeights[shortestColumnIndex];
      
      // Update column height
      columnHeights[shortestColumnIndex] += itemHeight + gap;
      
      return {
        ...item,
        x,
        y,
        width: itemWidth,
        height: itemHeight,
        aspectRatio
      };
    });
  }, [columns, items, width, gap, minItemWidth, maxItemWidth, imagesReady, imageDimensions]);

  // Animation effects
  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return;

    grid.forEach((item, index) => {
      const element = document.querySelector(`[data-masonry-id="${item.id}"]`) as HTMLElement;
      if (!element) return;

      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height
      };

      if (!hasMounted.current) {
        // Set initial position immediately to prevent stacking
        gsap.set(element, {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height
        });

        // Initial animation from bottom
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: item.y + 100,
            scale: 0.8,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            y: item.y,
            scale: 1,
            filter: 'blur(0px)',
            duration: animationDuration,
            ease: animationEase,
            delay: index * staggerDelay
          }
        );
      } else {
        // Layout change animation
        gsap.to(element, {
          ...animationProps,
          duration: animationDuration * 0.6,
          ease: animationEase,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, animationDuration, animationEase, staggerDelay]);

  // Hover handlers
  const handleMouseEnter = useCallback((id: string) => {
    const element = document.querySelector(`[data-masonry-id="${id}"]`);
    if (element) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
        zIndex: 10
      });
    }
  }, [hoverScale]);

  const handleMouseLeave = useCallback((id: string) => {
    const element = document.querySelector(`[data-masonry-id="${id}"]`);
    if (element) {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        zIndex: 1
      });
    }
  }, []);

  // Click handler
  const handleClick = useCallback((item: GridItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative w-full overflow-hidden", className)}
      style={{ 
        height: grid.length > 0 ? Math.max(...grid.map(item => item.y + item.height)) + gap : 'auto'
      }}
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-id={item.id}
          className="absolute cursor-pointer overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
          style={{
            width: item.width,
            height: item.height,
            willChange: 'transform, opacity',
            transformOrigin: 'center center'
          }}
          onClick={() => handleClick(item)}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={() => handleMouseLeave(item.id)}
        >
          <div className="relative w-full h-full group">
            <Image
              src={item.src || item.img || item.url || ''}
              alt={item.alt || item.name || 'Gallery image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1400px) 25vw, 20vw`}
              priority={false}
            />
            
            {/* Overlay with title */}
            {(item.title || item.name) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-sm font-medium truncate">
                    {item.title || item.name}
                  </h3>
                </div>
              </div>
            )}
            
            {/* Loading placeholder */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse group-hover:bg-gray-300 transition-colors duration-300" 
                 style={{ zIndex: -1 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
