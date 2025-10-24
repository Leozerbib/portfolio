'use client'

import { useState, useEffect, useRef } from 'react'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'system'
  content: string
  timestamp: Date
}

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'system',
      content: 'Portfolio OS Terminal v1.0.0',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'system',
      content: 'Type "help" for available commands.',
      timestamp: new Date(),
    },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus()
    }
    
    const terminal = terminalRef.current
    terminal?.addEventListener('click', handleClick)
    
    return () => {
      terminal?.removeEventListener('click', handleClick)
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setLines(prev => [...prev, newLine])
  }

  const executeCommand = (command: string) => {
    const cmd = command.trim().toLowerCase()
    
    // Add command to history
    if (cmd && !commandHistory.includes(cmd)) {
      setCommandHistory(prev => [...prev, cmd])
    }
    
    // Add input line
    addLine('input', `$ ${command}`)
    
    // Execute command
    switch (cmd) {
      case 'help':
        addLine('output', 'Available commands:')
        addLine('output', '  help     - Show this help message')
        addLine('output', '  clear    - Clear the terminal')
        addLine('output', '  whoami   - Display current user')
        addLine('output', '  date     - Show current date and time')
        addLine('output', '  ls       - List directory contents')
        addLine('output', '  pwd      - Print working directory')
        addLine('output', '  about    - About this portfolio')
        addLine('output', '  skills   - List technical skills')
        addLine('output', '  projects - Show recent projects')
        addLine('output', '  contact  - Display contact information')
        break
        
      case 'clear':
        setLines([])
        break
        
      case 'whoami':
        addLine('output', 'portfolio-user')
        break
        
      case 'date':
        addLine('output', new Date().toString())
        break
        
      case 'ls':
        addLine('output', 'total 5')
        addLine('output', 'drwxr-xr-x  2 user user 4096 Dec 15 10:30 projects/')
        addLine('output', 'drwxr-xr-x  2 user user 4096 Dec 15 10:30 skills/')
        addLine('output', '-rw-r--r--  1 user user 1024 Dec 15 10:30 about.txt')
        addLine('output', '-rw-r--r--  1 user user  512 Dec 15 10:30 contact.txt')
        addLine('output', '-rw-r--r--  1 user user 2048 Dec 15 10:30 resume.pdf')
        break
        
      case 'pwd':
        addLine('output', '/home/portfolio-user')
        break
        
      case 'about':
        addLine('output', 'Full-Stack Developer & UI/UX Enthusiast')
        addLine('output', 'Passionate about creating beautiful, functional web applications')
        addLine('output', 'Specializing in React, Next.js, TypeScript, and modern web technologies')
        break
        
      case 'skills':
        addLine('output', 'Technical Skills:')
        addLine('output', '  Frontend: React, Next.js, TypeScript, Tailwind CSS')
        addLine('output', '  Backend: Node.js, Python, PostgreSQL, MongoDB')
        addLine('output', '  Tools: Git, Docker, AWS, Vercel')
        addLine('output', '  Design: Figma, Adobe Creative Suite')
        break
        
      case 'projects':
        addLine('output', 'Recent Projects:')
        addLine('output', '  1. E-commerce Platform - Full-stack Next.js application')
        addLine('output', '  2. Task Management App - React with real-time updates')
        addLine('output', '  3. Portfolio Website - Interactive 3D portfolio (this site!)')
        addLine('output', '  4. API Gateway - Microservices architecture with Node.js')
        break
        
      case 'contact':
        addLine('output', 'Contact Information:')
        addLine('output', '  Email: your.email@example.com')
        addLine('output', '  LinkedIn: linkedin.com/in/yourprofile')
        addLine('output', '  GitHub: github.com/yourusername')
        addLine('output', '  Website: yourportfolio.com')
        break
        
      case '':
        // Empty command, just show prompt
        break
        
      default:
        addLine('output', `Command not found: ${command}`)
        addLine('output', 'Type "help" for available commands.')
        break
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setCurrentInput('')
      setHistoryIndex(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput('')
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm overflow-hidden flex flex-col">
      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {lines.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap">
            {line.type === 'input' && (
              <span className="text-green-400">{line.content}</span>
            )}
            {line.type === 'output' && (
              <span className="text-gray-300">{line.content}</span>
            )}
            {line.type === 'system' && (
              <span className="text-blue-400">{line.content}</span>
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 outline-none border-none"
            autoFocus
            spellCheck={false}
          />
          <span className="animate-pulse text-green-400">|</span>
        </div>
      </div>
    </div>
  )
}