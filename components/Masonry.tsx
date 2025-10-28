'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import ProgressiveImage from '@/components/ui/progressive-image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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

// Optimized image preloading with priority queue
const preloadImages = async (urls: string[], priority: number = 5): Promise<void> => {
  const chunks = [];
  for (let i = 0; i < urls.length; i += priority) {
    chunks.push(urls.slice(i, i + priority));
  }
  
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(
        src =>
          new Promise<void>(resolve => {
            const img = new window.Image();
            img.src = src;
            img.onload = img.onerror = () => resolve();
          })
      )
    );
  }
};

// Get image dimensions utility with caching
const imageDimensionsCache = new Map<string, { width: number; height: number }>();

const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  if (imageDimensionsCache.has(src)) {
    return Promise.resolve(imageDimensionsCache.get(src)!);
  }
  
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
      imageDimensionsCache.set(src, dimensions);
      resolve(dimensions);
    };
    img.onerror = () => {
      const fallback = { width: 300, height: 200 };
      imageDimensionsCache.set(src, fallback);
      resolve(fallback);
    };
    img.src = src;
  });
};

// Intersection Observer hook for lazy loading
const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Optimized Image Component with progressive loading
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}> = ({ src, alt, width, height, className, priority = false, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(imageRef, { rootMargin: '100px' });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoaded(true);
  }, []);

  // Ensure we have valid dimensions
  const validWidth = Math.max(width || 0, 1);
  const validHeight = Math.max(height || 0, 1);

  return (
    <div 
      ref={imageRef} 
      className={cn("relative overflow-hidden", className)} 
      style={{ 
        width: validWidth, 
        height: validHeight,
        minWidth: validWidth,
        minHeight: validHeight,
        position: 'relative'
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" 
          style={{ 
            animation: 'shimmer 1.5s ease-in-out infinite',
            width: '100%',
            height: '100%'
          }} 
        />
      )}
      
      {/* Actual image - only load when visible or priority */}
      {(isVisible || priority) && validWidth > 0 && validHeight > 0 && (
        <ProgressiveImage
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            isError && "bg-gray-200"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1400px) 25vw, 20vw"
          priority={priority}
          placeholder="blur"
          onLoad={handleLoad}
          onError={handleError}
          quality={85}
        />
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-sm">Failed to load</div>
        </div>
      )}
    </div>
  );
};

interface MasonryItem {
  id: string;
  src?: string;
  img: string;
  alt?: string;
  name: string;
  url: string;
  title?: string;
  path: string;
  height: number;
  aspectRatio?: number;
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
  virtualScrolling?: boolean;
  overscan?: number;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  gap = 16,
  minItemWidth = 250,
  maxItemWidth = 400,
  animationDuration = 0.6,
  animationEase = 'power2.out',
  staggerDelay = 0.05,
  hoverScale = 1.03,
  className,
  onItemClick,
  scaleOnHover = true,
  virtualScrolling = true,
  overscan = 5,
}) => {
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Calculate responsive columns based on container width
  const columns = useContainerColumns(width, minItemWidth, 5);

  const [imagesReady, setImagesReady] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Map<string, { width: number; height: number }>>(new Map());
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [scrollTop, setScrollTop] = useState(0);
  const hasMounted = useRef(false);

  // Debounced scroll handler for virtual scrolling
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !virtualScrolling) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollElement.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', onScroll);
  }, [handleScroll, virtualScrolling]);

  // Load image dimensions with batching
  useEffect(() => {
    const loadDimensions = async () => {
      const dimensionsMap = new Map();
      
      // Process in batches of 10 for better performance
      const batchSize = 10;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (item) => {
            const imageSrc = item.src || item.img || item.url || '';
            if (imageSrc) {
              const dimensions = await getImageDimensions(imageSrc);
              dimensionsMap.set(item.id, dimensions);
            }
          })
        );
      }
      
      setImageDimensions(dimensionsMap);
      
      // Preload first few images with priority
      const priorityImages = items.slice(0, 6).map(item => item.src || item.img || item.url || '').filter(Boolean);
      await preloadImages(priorityImages, 3);
      
      setImagesReady(true);
    };

    if (items.length > 0) {
      loadDimensions();
    }
  }, [items]);

  // Calculate masonry layout with optimizations
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

  // Virtual scrolling calculations
  const { visibleItems, containerHeight } = useMemo(() => {
    if (!virtualScrolling || grid.length === 0) {
      const maxHeight = grid.reduce((max, item) => Math.max(max, (item.y || 0) + (item.height || 0)), 0);
      return { visibleItems: grid, containerHeight: maxHeight };
    }

    const viewportHeight = scrollRef.current?.clientHeight || 600;
    const startY = scrollTop - overscan * 100;
    const endY = scrollTop + viewportHeight + overscan * 100;

    const visible = grid.filter(item => {
      const itemTop = item.y || 0;
      const itemBottom = itemTop + (item.height || 0);
      return itemBottom >= startY && itemTop <= endY;
    });

    const maxHeight = grid.reduce((max, item) => Math.max(max, (item.y || 0) + (item.height || 0)), 0);

    return { visibleItems: visible, containerHeight: maxHeight };
  }, [grid, scrollTop, virtualScrolling, overscan]);

  // Optimized animation effects
  useLayoutEffect(() => {
    if (!imagesReady || visibleItems.length === 0) return;

    visibleItems.forEach((item, index) => {
      const element = document.querySelector(`[data-masonry-id="${item.id}"]`) as HTMLElement;
      if (!element) return;

      if (!hasMounted.current) {
        // Initial animation with reduced complexity
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: animationDuration,
            ease: animationEase,
            delay: Math.min(index * staggerDelay, 0.5) // Cap total delay
          }
        );
      }
    });

    hasMounted.current = true;
  }, [visibleItems, imagesReady, animationDuration, animationEase, staggerDelay]);

  // Optimized hover handlers with throttling
  const handleMouseEnter = useCallback((id: string) => {
    if (!scaleOnHover) return;
    
    const element = document.querySelector(`[data-masonry-id="${id}"]`);
    if (element) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.2,
        ease: 'power1.out',
        overwrite: true
      });
    }
  }, [hoverScale, scaleOnHover]);

  const handleMouseLeave = useCallback((id: string) => {
    if (!scaleOnHover) return;
    
    const element = document.querySelector(`[data-masonry-id="${id}"]`);
    if (element) {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.out',
        overwrite: true
      });
    }
  }, [scaleOnHover]);

  // Optimized click handler
  const handleClick = useCallback((item: MasonryItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }, [onItemClick]);

  const handleImageLoad = useCallback((itemId: string) => {
    setLoadedImages(prev => new Set(prev).add(itemId));
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full", className)}
    >
      <div
        ref={scrollRef}
        className="w-full"
        style={{ height: virtualScrolling ? 'auto' : 'auto' }}
      >
        <div
          className="relative w-full"
          style={{
            height: `${containerHeight}px`,
            overflow: 'hidden'
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              data-masonry-id={item.id}
              className="absolute cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                willChange: 'transform',
                transformOrigin: 'center center'
              }}
              onClick={() => handleClick(item)}
              onMouseEnter={() => {
                setHoveredImageId(item.id);
                handleMouseEnter(item.id);
              }}
              onMouseLeave={() => {
                setHoveredImageId(null);
                handleMouseLeave(item.id);
              }}
            >
              <div className="relative w-full h-full group">
                <OptimizedImage
                  src={item.src || item.img || item.url || ''}
                  alt={item.alt || item.name || 'Gallery image'}
                  width={item.width}
                  height={item.height}
                  className={cn(
                    "transition-all duration-300 group-hover:scale-105",
                    hoveredImageId && hoveredImageId !== item.id 
                      ? "filter grayscale-[0.3]" 
                      : "filter-none"
                  )}
                  priority={index < 6}
                  onLoad={() => handleImageLoad(item.id)}
                />
                
                {/* Overlay with title */}
                {(item.title || item.name) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-medium truncate">
                        {item.title || item.name}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading indicator */}
      {!imagesReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading images...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Masonry);
