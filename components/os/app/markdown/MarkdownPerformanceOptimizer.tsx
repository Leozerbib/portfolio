'use client'

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
// import { FixedSizeList as List } from 'react-window'
import { MarkdownRenderer } from './MarkdownRenderer'

interface MarkdownPerformanceOptimizerProps {
  content: string
  zoom: number
  theme: 'light' | 'dark'
  className?: string
  maxChunkSize?: number
  enableVirtualization?: boolean
}

interface MarkdownChunk {
  id: string
  content: string
  startLine: number
  endLine: number
}

// Split markdown content into manageable chunks
function splitMarkdownIntoChunks(content: string, maxChunkSize: number = 1000): MarkdownChunk[] {
  const lines = content.split('\n')
  const chunks: MarkdownChunk[] = []
  
  let currentChunk: string[] = []
  let startLine = 0
  
  for (let i = 0; i < lines.length; i++) {
    currentChunk.push(lines[i])
    
    // Check if we should create a new chunk
    const shouldSplit = 
      currentChunk.length >= maxChunkSize ||
      (currentChunk.length > 100 && lines[i].trim() === '') || // Split on empty lines
      (lines[i].startsWith('#') && currentChunk.length > 50) // Split on headers
    
    if (shouldSplit || i === lines.length - 1) {
      chunks.push({
        id: `chunk-${startLine}-${i}`,
        content: currentChunk.join('\n'),
        startLine,
        endLine: i
      })
      
      currentChunk = []
      startLine = i + 1
    }
  }
  
  return chunks
}

// Virtualized chunk renderer
// interface ChunkRendererProps {
//   index: number
//   style: React.CSSProperties
//   data: {
//     chunks: MarkdownChunk[]
//     zoom: number
//     theme: 'light' | 'dark'
//   }
// }

// const ChunkRenderer: React.FC<ChunkRendererProps> = ({ index, style, data }) => {
//   const { chunks, zoom, theme } = data
//   const chunk = chunks[index]
  
//   return (
//     <div style={style} className="px-6">
//       <MarkdownRenderer
//         content={chunk.content}
//         zoom={zoom}
//         theme={theme}
//         className="min-h-full"
//       />
//     </div>
//   )
// }

// Memoized chunk renderer to prevent unnecessary re-renders
// const MemoizedChunkRenderer = React.memo(ChunkRenderer)

export function MarkdownPerformanceOptimizer({
  content,
  zoom,
  theme,
  className,
  maxChunkSize = 1000,
  enableVirtualization = true
}: MarkdownPerformanceOptimizerProps) {
  const [isLargeFile, setIsLargeFile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Check if file is large enough to need optimization
  useEffect(() => {
    const lineCount = content.split('\n').length
    const charCount = content.length
    
    // Consider it a large file if it has more than 500 lines or 50KB
    setIsLargeFile(lineCount > 500 || charCount > 50000)
  }, [content])
  
  // Split content into chunks for large files
  const chunks = useMemo(() => {
    if (!isLargeFile || !enableVirtualization) return []
    return splitMarkdownIntoChunks(content, maxChunkSize)
  }, [content, maxChunkSize, isLargeFile, enableVirtualization])
  
  // Estimate item height for virtualization
  const estimateItemHeight = useCallback((index: number) => {
    if (!chunks[index]) return 200
    
    const chunk = chunks[index]
    const lineCount = chunk.content.split('\n').length
    const baseHeight = 24 // Base line height
    const estimatedHeight = Math.max(200, lineCount * baseHeight * zoom)
    
    return estimatedHeight
  }, [chunks, zoom])
  
  // For small files or when virtualization is disabled, render normally
  if (!isLargeFile || !enableVirtualization) {
    return (
      <div className={className} style={{ fontSize: `${zoom}%` }}>
        <MarkdownRenderer
          content={content}
          zoom={zoom}
          theme={theme}
          className="min-h-full"
        />
      </div>
    )
  }
  
  // For large files, use simple scrollable div instead of virtualization
  return (
    <div ref={containerRef} className={className} style={{ height: '100%', overflow: 'auto' }}>
      {chunks.map((chunk, index) => (
        <div key={chunk.id} style={{ minHeight: estimateItemHeight(index) }}>
          <MarkdownRenderer
            content={chunk.content}
            zoom={zoom}
            theme={theme}
          />
        </div>
      ))}
    </div>
  )
}

// Hook for performance monitoring
export function useMarkdownPerformance(content: string) {
  const [metrics, setMetrics] = useState({
    lineCount: 0,
    charCount: 0,
    wordCount: 0,
    renderTime: 0,
    isLargeFile: false
  })
  
  useEffect(() => {
    const startTime = performance.now()
    
    const lines = content.split('\n')
    const words = content.split(/\s+/).filter(word => word.length > 0)
    
    const newMetrics = {
      lineCount: lines.length,
      charCount: content.length,
      wordCount: words.length,
      renderTime: performance.now() - startTime,
      isLargeFile: lines.length > 500 || content.length > 50000
    }
    
    setMetrics(newMetrics)
  }, [content])
  
  return metrics
}