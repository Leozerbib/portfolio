'use client'

import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Types for markdown rendering
interface MarkdownRendererProps {
  content: string
  className?: string
  zoom?: number
  theme?: 'light' | 'dark'
}

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  id?: string
}

// Simple syntax highlighter for code blocks
const CodeBlock = memo(({ children, className, language }: CodeBlockProps) => {
  const lang = language || className?.replace('language-', '') || 'text'
  
  // Basic syntax highlighting patterns
  const highlightCode = (code: string, lang: string): string => {
    if (!code) return ''
    
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
      case 'jsx':
        return code
          .replace(/(\/\/.*$)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
          .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2$3</span>')
          .replace(/\b(\d+)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
        
      case 'typescript':
      case 'ts':
      case 'tsx':
        return code
          .replace(/(\/\/.*$)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|interface|type|enum|namespace)\b/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
          .replace(/\b(string|number|boolean|object|any|void|null|undefined)\b/g, '<span class="text-cyan-600 dark:text-cyan-400 font-semibold">$1</span>')
          .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2$3</span>')
          .replace(/\b(\d+)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
        
      case 'python':
      case 'py':
        return code
          .replace(/(#.*$)/gm, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/\b(def|class|import|from|return|if|else|elif|for|while|try|except|finally|with|as|pass|break|continue)\b/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>')
          .replace(/\b(str|int|float|bool|list|dict|tuple|set|None|True|False)\b/g, '<span class="text-cyan-600 dark:text-cyan-400 font-semibold">$1</span>')
          .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2$3</span>')
          .replace(/\b(\d+)\b/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>')
        
      case 'html':
        return code
          .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/(&lt;\/?)([\w-]+)([^&gt;]*?)(&gt;)/g, '<span class="text-blue-600 dark:text-blue-400">$1</span><span class="text-red-600 dark:text-red-400 font-semibold">$2</span><span class="text-green-600 dark:text-green-400">$3</span><span class="text-blue-600 dark:text-blue-400">$4</span>')
          .replace(/([\w-]+)(=)(['"`])(.*?)(\3)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span><span class="text-gray-600 dark:text-gray-400">$2</span><span class="text-orange-600 dark:text-orange-400">$3$4$5</span>')
        
      case 'css':
        return code
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
          .replace(/([.#]?[\w-]+)(\s*{)/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>$2')
          .replace(/([\w-]+)(\s*:)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>$2')
          .replace(/(:)(\s*[^;]+)(;)/g, '$1<span class="text-orange-600 dark:text-orange-400">$2</span>$3')
        
      case 'json':
        return code
          .replace(/("[\w-]+")\s*:/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>:')
          .replace(/:\s*(".*?")/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
          .replace(/:\s*(\d+)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
          .replace(/:\s*(true|false|null)/g, ': <span class="text-cyan-600 dark:text-cyan-400 font-semibold">$1</span>')
        
      default:
        return code
    }
  }

  const highlightedCode = useMemo(() => {
    return highlightCode(children, lang)
  }, [children, lang])

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
          {lang}
        </span>
        <button
          onClick={() => navigator.clipboard?.writeText(children)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="Copy code"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto bg-muted/50 p-4 rounded-b-lg">
        <code 
          className="text-sm font-mono leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'

// Heading component with anchor links
const Heading = memo(({ level, children, id }: HeadingProps) => {
  const Tag = `h${level}` as any
  const headingId = id || (typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined)
  
  const sizeClasses = {
    1: 'text-3xl font-bold mt-8 mb-4',
    2: 'text-2xl font-semibold mt-6 mb-3',
    3: 'text-xl font-semibold mt-5 mb-3',
    4: 'text-lg font-semibold mt-4 mb-2',
    5: 'text-base font-semibold mt-3 mb-2',
    6: 'text-sm font-semibold mt-2 mb-2'
  }

  return (
    <Tag 
      id={headingId}
      className={cn(
        sizeClasses[level],
        'scroll-mt-4 group flex items-center gap-2'
      )}
    >
      {children}
      {headingId && (
        <a
          href={`#${headingId}`}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
          aria-label="Link to heading"
        >
          #
        </a>
      )}
    </Tag>
  )
})

Heading.displayName = 'Heading'

// Simple markdown parser
const parseMarkdown = (content: string): string => {
  if (!content) return ''
  
  let html = content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Code blocks (must be before inline code)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre data-language="${lang || 'text'}"><code>${code.trim()}</code></pre>`
    })
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-muted-foreground/20 pl-4 italic text-muted-foreground my-4">$1</blockquote>')
    
    // Unordered lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li class="ml-4">.*<\/li>)/g, '<ul class="list-disc list-inside space-y-1 my-4">$1</ul>')

    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li class="ml-4">.*<\/li>)/g, '<ol class="list-decimal list-inside space-y-1 my-4">$1</ol>')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br />')
    
  // Wrap in paragraphs
  html = '<p class="mb-4">' + html + '</p>'
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-4"><\/p>/g, '')
  
  return html
}

export const MarkdownRenderer = memo(({ content, className, zoom = 100, theme = 'light' }: MarkdownRendererProps) => {
  const parsedContent = useMemo(() => {
    return parseMarkdown(content)
  }, [content])

  // Extract code blocks for special rendering
  const renderContent = useMemo(() => {
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    
    // Find code blocks
    const codeBlockRegex = /<pre data-language="([^"]*?)"><code>([\s\S]*?)<\/code><\/pre>/g
    let match
    let keyIndex = 0
    
    while ((match = codeBlockRegex.exec(parsedContent)) !== null) {
      // Add content before code block
      if (match.index > lastIndex) {
        const beforeContent = parsedContent.slice(lastIndex, match.index)
        if (beforeContent.trim()) {
          parts.push(
            <div 
              key={`content-${keyIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforeContent }}
            />
          )
        }
      }
      
      // Add code block
      parts.push(
        <CodeBlock
          key={`code-${keyIndex++}`}
          language={match[1]}
          // eslint-disable-next-line react/no-children-prop
          children={match[2]}
        />
      )
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining content
    if (lastIndex < parsedContent.length) {
      const remainingContent = parsedContent.slice(lastIndex)
      if (remainingContent.trim()) {
        parts.push(
          <div 
            key={`content-${keyIndex++}`}
            dangerouslySetInnerHTML={{ __html: remainingContent }}
          />
        )
      }
    }
    
    // If no code blocks found, render all content
    if (parts.length === 0) {
      parts.push(
        <div 
          key="all-content"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
      )
    }
    
    return parts
  }, [parsedContent])

  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:scroll-mt-4",
        "prose-pre:p-0 prose-pre:bg-transparent",
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
        theme === 'dark' && "prose-invert",
        className
      )}
      style={{ fontSize: `${zoom}%` }}
    >
      {renderContent}
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'