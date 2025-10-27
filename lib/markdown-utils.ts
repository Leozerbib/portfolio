// Utility functions for markdown file handling and processing

export interface FileValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export interface MarkdownMetadata {
  title?: string
  description?: string
  author?: string
  date?: string
  tags?: string[]
  [key: string]: any
}

/**
 * Validates if a file is a valid markdown file
 */
export function validateMarkdownFile(file: File): FileValidationResult {
  const result: FileValidationResult = { isValid: true, warnings: [] }
  
  // Check file extension
  const validExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn']
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )
  
  if (!hasValidExtension) {
    result.warnings?.push('File does not have a standard markdown extension')
  }
  
  // Check file size (warn if > 10MB, error if > 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  const warnSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    result.isValid = false
    result.error = `File size (${formatFileSize(file.size)}) exceeds maximum limit of ${formatFileSize(maxSize)}`
    return result
  }
  
  if (file.size > warnSize) {
    result.warnings?.push(`Large file size (${formatFileSize(file.size)}) may affect performance`)
  }
  
  // Check MIME type
  const validMimeTypes = ['text/markdown', 'text/plain', 'text/x-markdown']
  if (file.type && !validMimeTypes.includes(file.type)) {
    result.warnings?.push('Unexpected MIME type, but will attempt to process as markdown')
  }
  
  return result
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Formats date in a readable format
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Extracts frontmatter metadata from markdown content
 */
export function extractFrontmatter(content: string): { metadata: MarkdownMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { metadata: {}, content }
  }
  
  const [, frontmatterText, markdownContent] = match
  const metadata: MarkdownMetadata = {}
  
  // Parse YAML-like frontmatter
  const lines = frontmatterText.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '')
      
      // Handle arrays (simple comma-separated values)
      if (cleanValue.includes(',')) {
        metadata[key] = cleanValue.split(',').map(v => v.trim())
      } else {
        metadata[key] = cleanValue
      }
    }
  }
  
  return { metadata, content: markdownContent }
}

/**
 * Generates a table of contents from markdown content
 */
export function generateTableOfContents(content: string): Array<{ level: number; title: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: Array<{ level: number; title: string; id: string }> = []
  
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    toc.push({ level, title, id })
  }
  
  return toc
}

/**
 * Estimates reading time for markdown content
 */
export function estimateReadingTime(content: string): { minutes: number; words: number } {
  // Remove markdown syntax for more accurate word count
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length
  const wordsPerMinute = 200 // Average reading speed
  const minutes = Math.ceil(words / wordsPerMinute)
  
  return { minutes, words }
}

/**
 * Sanitizes filename for safe display
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[<>:"/\\|?*]/g, '_')
}

/**
 * Generates a unique ID for files
 */
export function generateFileId(filename: string, content: string): string {
  // Simple hash function for generating unique IDs
  let hash = 0
  const str = filename + content.substring(0, 100) // Use filename + first 100 chars
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * Checks if content contains potentially problematic markdown
 */
export function analyzeMarkdownComplexity(content: string): {
  hasCodeBlocks: boolean
  hasTables: boolean
  hasImages: boolean
  hasLinks: boolean
  headingCount: number
  complexity: 'low' | 'medium' | 'high'
} {
  const analysis = {
    hasCodeBlocks: /```[\s\S]*?```/.test(content),
    hasTables: /\|.*\|/.test(content),
    hasImages: /!\[.*?\]\(.*?\)/.test(content),
    hasLinks: /\[.*?\]\(.*?\)/.test(content),
    headingCount: (content.match(/^#{1,6}\s/gm) || []).length,
    complexity: 'low' as 'low' | 'medium' | 'high'
  }
  
  // Determine complexity
  let complexityScore = 0
  if (analysis.hasCodeBlocks) complexityScore += 2
  if (analysis.hasTables) complexityScore += 2
  if (analysis.hasImages) complexityScore += 1
  if (analysis.hasLinks) complexityScore += 1
  if (analysis.headingCount > 10) complexityScore += 1
  if (content.length > 50000) complexityScore += 2
  
  if (complexityScore >= 5) {
    analysis.complexity = 'high'
  } else if (complexityScore >= 2) {
    analysis.complexity = 'medium'
  }
  
  return analysis
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null
  
  const debouncedFunc = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
  
  debouncedFunc.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  
  return debouncedFunc
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}