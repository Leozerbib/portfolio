'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Hook for calculating columns based on container width
const useContainerColumns = (containerWidth: number, minItemWidth: number = 250, maxColumns: number = 5): number => {
  return useMemo(() => {
    if (containerWidth === 0) return 1;
    
    // Calculate how many columns can fit based on minimum item width
    const maxPossibleColumns = Math.floor(containerWidth / minItemWidth);
    
    // Clamp between 1 and maxColumns
    return Math.max(1, Math.min(maxColumns, maxPossibleColumns));
  }, [containerWidth, minItemWidth, maxColumns]);
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

// Add aspect ratio to MasonryItem interface
interface MasonryItem {
  id: string;
  src?: string;
  img: string; // Made required to match ImageFile interface
  alt?: string;
  name: string; // Made required to match ImageFile interface
  url: string; // Made required to match ImageFile interface
  title?: string;
  path: string; // Made required to match ImageFile interface
  height: number; // Made required to match ImageFile interface
  aspectRatio?: number; // width/height ratio
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
}) => {
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  
  // Calculate responsive columns based on container width instead of screen size
  const columns = useContainerColumns(width, minItemWidth, 5);

  console.log('Current columns:', columns, 'Container width:', width);
  const [imagesReady, setImagesReady] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
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

  // Calculate masonry layout with dynamic heights and proper centering
  const grid = useMemo<GridItem[]>(() => {
    if (!width || !imagesReady || imageDimensions.size === 0) return [];

    const totalGaps = (columns - 1) * gap;
    const availableWidth = width - totalGaps;
    const columnWidth = Math.min(maxItemWidth, Math.max(minItemWidth, availableWidth / columns));
    
    // Calculate total grid width and centering offset
    const totalGridWidth = columns * columnWidth + (columns - 1) * gap;
    const offsetX = Math.max(0, (width - totalGridWidth) / 2);
    
    // Initialize column heights array
    const columnHeights = new Array(columns).fill(0);
    
    return items.map((item) => {
      const dimensions = imageDimensions.get(item.id) || { width: 300, height: 200 };
      const aspectRatio = dimensions.width / dimensions.height;
      
      // Calculate item dimensions maintaining aspect ratio
      const itemWidth = columnWidth;
      const itemHeight = itemWidth / aspectRatio;
      
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Position item in the shortest column with centering offset
      const x = offsetX + shortestColumnIndex * (columnWidth + gap);
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

  // Calculate container height based on tallest column
  const containerHeight = useMemo(() => {
    if (grid.length === 0) return 0;
    
    const columnHeights = new Array(columns).fill(0);
    grid.forEach(item => {
      // Calculate which column this item is in based on its x position and offset
      const gap = 16;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const columnWidth = (containerWidth - gap * (columns - 1)) / columns;
      const totalGridWidth = columns * columnWidth + (columns - 1) * gap;
      const offsetX = Math.max(0, (containerWidth - totalGridWidth) / 2);
      
      const col = Math.round((item.x - offsetX) / (columnWidth + gap));
      if (col >= 0 && col < columns) {
        columnHeights[col] = Math.max(columnHeights[col], (item.y || 0) + (item.height || 0));
      }
    });
    
    return Math.max(...columnHeights);
  }, [grid, columns, containerRef]);

  // Animation effects
  useLayoutEffect(() => {
    if (!imagesReady || items.length === 0) return;

    items.forEach((item, index) => {
      const element = document.querySelector(`[data-masonry-id="${item.id}"]`) as HTMLElement;
      if (!element) return;

      if (!hasMounted.current) {
        // Initial animation
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 50,
            scale: 0.8,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: animationDuration,
            ease: animationEase,
            delay: index * staggerDelay
          }
        );
      } else {
        // Layout change animation - not needed for CSS Grid
        // Grid handles layout changes automatically
      }
    });

    hasMounted.current = true;
  }, [items, imagesReady, animationDuration, animationEase, staggerDelay]);

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
  const handleClick = useCallback((item: MasonryItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full overflow-hidden", className)}
      style={{
        position: 'relative',
        width: '100%',
        height: `${containerHeight}px`,
        overflow: 'hidden'
      }}
    >
      {grid.map((item, index) => (
        <div
          key={item.id || index}
          className="absolute cursor-pointer overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            willChange: 'transform, opacity',
            transformOrigin: 'center center'
          }}
          onClick={() => handleClick(item)}
          onMouseEnter={() => {
            setHoveredImageId(item.id);
            if (scaleOnHover) handleMouseEnter(item.id);
          }}
          onMouseLeave={() => {
            setHoveredImageId(null);
            if (scaleOnHover) handleMouseLeave(item.id);
          }}
        >
          <div className="relative w-full h-full group">
            <Image
              src={item.src || item.img || item.url || ''}
              alt={item.alt || item.name || 'Gallery image'}
              fill
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-110",
                hoveredImageId && hoveredImageId !== item.id 
                  ? "filter grayscale" 
                  : "filter-none"
              )}
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
