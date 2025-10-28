'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { LucideIcon, Globe, Terminal, Mail, User, Code, Briefcase, Rocket, Phone, Settings, Folder, Image, Music, Video, FileText, Download, Package, Monitor } from 'lucide-react'
import { EnhancedSystemSettings, SettingsManager, defaultSettings } from '@/lib/settings'
import { BackgroundConfig, BackgroundType } from '@/lib/settings'

// Types for OS state management
// Enhanced interfaces for advanced window management
export interface OSWindow {
  id: string
  title: string
  component: string
  isMinimized: boolean
  isMaximized: boolean
  isFullscreen: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  initialSize: { width: number; height: number }
  zIndex: number
  isResizable: boolean
  isDraggable: boolean
  parentId?: string // For child windows/dialogs
  // Enhanced window properties
  isSnapped: boolean
  snapPosition?: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  monitorId: string
  groupId?: string
  isMovable: boolean
  minSize: { width: number; height: number }
  maxSize?: { width: number; height: number }
  opacity: number
  isAlwaysOnTop: boolean
  lastPosition?: { x: number; y: number }
  lastSize?: { width: number; height: number }
}

export interface OSMonitor {
  id: string
  name: string
  isPrimary: boolean
  resolution: { width: number; height: number }
  position: { x: number; y: number }
  scaleFactor: number
  isActive: boolean
}

export interface OSWindowGroup {
  id: string
  name: string
  windowIds: string[]
  isMinimized: boolean
  color: string
  icon?: string
}

export interface OSApp {
  id: string
  name: string
  icon: LucideIcon
  component: string
  category: 'productivity' | 'entertainment' | 'system' | 'development' | 'communication'
  isSystemApp: boolean
}

export interface OSNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  isRead: boolean
  actions?: Array<{ label: string; action: string }>
}

// Enhanced File System Interfaces
export interface OSFileSystemItem {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  createdAt: number
  modifiedAt: number
  accessedAt: number
  permissions: {
    read: boolean
    write: boolean
    execute: boolean
  }
  owner: string
  isHidden: boolean
  isSystem: boolean
  tags: string[]
  metadata: Record<string, any>
}

export interface OSFile extends OSFileSystemItem {
  type: 'file'
  extension: string
  size: number
  mimeType: string
  content?: string | ArrayBuffer
  encoding?: string
  icon: LucideIcon
  thumbnail?: string
  checksum?: string
  isExecutable: boolean
  associatedApp?: string
}

export interface OSFolder extends OSFileSystemItem {
  type: 'folder'
  children: Map<string, OSFileSystemItem>
  icon: LucideIcon
  isExpanded: boolean
  itemCount: number
  totalSize: number
  color?: string
  sortBy: 'name' | 'date' | 'size' | 'type'
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid' | 'icons'
}

export type OSFileSystemNode = OSFile | OSFolder

// File System Tree Structure
export interface OSFileSystemTree {
  root: OSFolder
  currentPath: string
  selectedItems: Set<string>
  clipboardItems: {
    items: OSFileSystemItem[]
    operation: 'copy' | 'cut'
  } | null
  searchResults: OSFileSystemItem[]
  recentItems: OSFileSystemItem[]
  bookmarks: string[]
  trash: OSFileSystemItem[]
}

// Enhanced File System Utility Functions
export class FileSystemUtils {
  static createFolder(
    id: string,
    name: string,
    path: string,
    icon: LucideIcon = Folder,
    owner: string = 'user'
  ): OSFolder {
    const now = Date.now()
    return {
      id,
      name,
      path,
      type: 'folder',
      children: new Map(),
      icon,
      isExpanded: false,
      itemCount: 0,
      totalSize: 0,
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      permissions: { read: true, write: true, execute: true },
      owner,
      isHidden: false,
      isSystem: false,
      tags: [],
      metadata: {},
      sortBy: 'name',
      sortOrder: 'asc',
      viewMode: 'list'
    }
  }

  static createFile(
    id: string,
    name: string,
    path: string,
    extension: string,
    size: number,
    content: string | ArrayBuffer = '',
    icon: LucideIcon,
    owner: string = 'user'
  ): OSFile {
    const now = Date.now()
    const mimeType = FileSystemUtils.getMimeType(extension)
    
    return {
      id,
      name,
      path,
      type: 'file',
      extension,
      size,
      mimeType,
      content,
      icon,
      createdAt: now,
      modifiedAt: now,
      accessedAt: now,
      permissions: { read: true, write: true, execute: extension === 'exe' },
      owner,
      isHidden: false,
      isSystem: false,
      tags: [],
      metadata: {},
      encoding: 'utf-8',
      isExecutable: extension === 'exe',
      associatedApp: FileSystemUtils.getAssociatedApp(extension)
    }
  }

  static getMimeType(extension: string): string {
    // Ensure extension is a string and handle null/undefined cases
    if (!extension || typeof extension !== 'string') {
      return 'application/octet-stream'
    }
    
    const mimeTypes: Record<string, string> = {
      'txt': 'text/plain',
      'md': 'text/markdown',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'pdf': 'application/pdf',
      'exe': 'application/x-executable',
      'zip': 'application/zip'
    }
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
  }

  static getAssociatedApp(extension: string): string | undefined {
    const associations: Record<string, string> = {
      'txt': 'markdown',
      'md': 'markdown',
      'html': 'browser',
      'tsx': 'browser',
      'css': 'vscode',
      'js': 'vscode',
      'json': 'vscode',
      'jpg': 'gallery',
      'jpeg': 'gallery',
      'png': 'gallery',
      'webp': 'gallery',
      'gif': 'gallery',
      'mp3': 'music',
      'mp4': 'video',
      'exe': 'system'
    }
    return associations[extension.toLowerCase()]
  }

  static addToFolder(folder: OSFolder, item: OSFileSystemItem): void {
    folder.children.set(item.id, item)
    folder.itemCount = folder.children.size
    if (item.type === 'file') {
      folder.totalSize += (item as OSFile).size
    }
    folder.modifiedAt = Date.now()
  }

  static removeFromFolder(folder: OSFolder, itemId: string): OSFileSystemItem | null {
    const item = folder.children.get(itemId)
    if (item) {
      folder.children.delete(itemId)
      folder.itemCount = folder.children.size
      if (item.type === 'file') {
        folder.totalSize -= (item as OSFile).size
      }
      folder.modifiedAt = Date.now()
      return item
    }
    return null
  }

  static findItemByPath(root: OSFolder, path: string): OSFileSystemItem | null {
    if (path === '/' || path === '') return root
    
    const parts = path.split('/').filter(Boolean)
    let current: OSFileSystemItem = root
    
    for (const part of parts) {
      if (current.type !== 'folder') return null
      const folder = current as OSFolder
      const found = Array.from(folder.children.values()).find(item => item.name === part)
      if (!found) return null
      current = found
    }
    
    return current
  }

  static getItemsByPath(root: OSFolder, path: string): OSFileSystemItem[] {
    const folder = FileSystemUtils.findItemByPath(root, path)
    if (!folder || folder.type !== 'folder') return []
    return Array.from((folder as OSFolder).children.values())
  }

  // Advanced utility functions for tree navigation and operations
  static getParentPath(path: string): string {
    if (path === '/' || path === '') return '/'
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    return parts.length === 0 ? '/' : '/' + parts.join('/')
  }

  static getItemName(path: string): string {
    if (path === '/' || path === '') return 'Root'
    const parts = path.split('/').filter(Boolean)
    return parts[parts.length - 1] || 'Root'
  }

  static buildBreadcrumbs(path: string): Array<{ name: string; path: string }> {
    if (path === '/' || path === '') {
      return [{ name: 'Root', path: '/' }]
    }

    const parts = path.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Root', path: '/' }]
    
    let currentPath = ''
    for (const part of parts) {
      currentPath += '/' + part
      breadcrumbs.push({ name: part, path: currentPath })
    }
    
    return breadcrumbs
  }

  static searchItems(
    root: OSFolder, 
    query: string, 
    options: {
      caseSensitive?: boolean
      includeHidden?: boolean
      fileTypesOnly?: string[]
      maxResults?: number
    } = {}
  ): OSFileSystemItem[] {
    const {
      caseSensitive = false,
      includeHidden = false,
      fileTypesOnly = [],
      maxResults = 50
    } = options

    const results: OSFileSystemItem[] = []
    const searchQuery = caseSensitive ? query : query.toLowerCase()

    const searchRecursive = (folder: OSFolder) => {
      if (results.length >= maxResults) return

      for (const item of folder.children.values()) {
        if (results.length >= maxResults) break
        
        // Skip hidden items if not included
        if (!includeHidden && item.isHidden) continue
        
        // Filter by file types if specified
        if (fileTypesOnly.length > 0 && item.type === 'file') {
          const file = item as OSFile
          if (!fileTypesOnly.includes(file.extension)) continue
        }

        // Check if item matches search query
        const itemName = caseSensitive ? item.name : item.name.toLowerCase()
        if (itemName.includes(searchQuery)) {
          results.push(item)
        }

        // Search recursively in folders
        if (item.type === 'folder') {
          searchRecursive(item as OSFolder)
        }
      }
    }

    searchRecursive(root)
    return results
  }

  static sortItems(
    items: OSFileSystemItem[], 
    sortBy: 'name' | 'date' | 'size' | 'type' = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): OSFileSystemItem[] {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = a.modifiedAt - b.modifiedAt
          break
        case 'size':
          const aSize = a.type === 'file' ? (a as OSFile).size : (a as OSFolder).totalSize
          const bSize = b.type === 'file' ? (b as OSFile).size : (b as OSFolder).totalSize
          comparison = aSize - bSize
          break
        case 'type':
          // Folders first, then files by extension
          if (a.type !== b.type) {
            comparison = a.type === 'folder' ? -1 : 1
          } else if (a.type === 'file' && b.type === 'file') {
            comparison = (a as OSFile).extension.localeCompare((b as OSFile).extension)
          }
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  static getFileIcon(extension: string): LucideIcon {
    const iconMap: Record<string, LucideIcon> = {
      'txt': FileText,
      'md': FileText,
      'html': Globe,
      'css': Code,
      'js': Code,
      'json': Code,
      'jpg': Image,
      'jpeg': Image,
      'png': Image,
      'webp': Image,
      'gif': Image,
      'svg': Image,
      'mp3': Music,
      'mp4': Video,
      'exe': Package,
      'zip': Package
    }
    return iconMap[extension.toLowerCase()] || FileText
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  static validateFileName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'File name cannot be empty' }
    }

    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(name)) {
      return { valid: false, error: 'File name contains invalid characters' }
    }

    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
    if (reservedNames.includes(name.toUpperCase())) {
      return { valid: false, error: 'File name is reserved by the system' }
    }

    if (name.length > 255) {
      return { valid: false, error: 'File name is too long (max 255 characters)' }
    }

    return { valid: true }
  }

  static duplicateItem(item: OSFileSystemItem, newName?: string): OSFileSystemItem {
    const timestamp = Date.now()
    const duplicatedItem = {
      ...item,
      id: `${item.type}-${timestamp}-${Math.random()}`,
      name: newName || `${item.name} - Copy`,
      createdAt: timestamp,
      modifiedAt: timestamp,
      accessedAt: timestamp
    }

    // If it's a folder, recursively duplicate children
    if (item.type === 'folder') {
      const folder = item as OSFolder
      const duplicatedFolder = duplicatedItem as OSFolder
      duplicatedFolder.children = new Map()
      
      for (const child of folder.children.values()) {
        const duplicatedChild = FileSystemUtils.duplicateItem(child)
        duplicatedFolder.children.set(duplicatedChild.id, duplicatedChild)
      }
    }

    return duplicatedItem
  }

  static getAllFiles(root: OSFolder): OSFile[] {
    const files: OSFile[] = []
    
    const collectFiles = (folder: OSFolder) => {
      for (const item of folder.children.values()) {
        if (item.type === 'file') {
          files.push(item as OSFile)
        } else if (item.type === 'folder') {
          collectFiles(item as OSFolder)
        }
      }
    }
    
    collectFiles(root)
    return files
  }
}

export interface OSSystemSettings extends EnhancedSystemSettings {
  // Legacy compatibility maintained
  // Background configuration
  backgroundConfig: BackgroundConfig
}

export interface OSClipboard {
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: number
}

export interface OSState {
  // Authentication & Screen
  isLoggedIn: boolean
  currentScreen: 'login' | 'desktop' | 'lockscreen'
  userName: string
  userAvatar: string
  
  // Window Management
  windows: OSWindow[]
  activeWindowId: string | null
  nextZIndex: number
  windowGroups: OSWindowGroup[]
  monitors: OSMonitor[]
  activeMonitorId: string
  
  // Applications
  apps: OSApp[]
  taskbarApps: string[]
  recentApps: string[]
  
  // Notifications
  notifications: OSNotification[]
  unreadNotifications: number
  notificationCenter: boolean
  
  // Enhanced File System
  fileSystem: OSFileSystemTree
  
  // System
  systemSettings: OSSystemSettings
  systemTime: number
  isOnline: boolean
  batteryLevel: number
  wifiStrength: number
  
  // Utilities
  clipboard: OSClipboard[]
  recentFiles: string[]
  searchHistory: string[]
  
  // Desktop
  desktopIcons: string[]
  wallpapers: string[]
  shortcuts: Record<string, string>
}

// Actions for OS state management
type OSAction =
  // Authentication & Screen
  | { type: 'LOGIN'; payload: { password: string; userName?: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOCK_SCREEN' }
  | { type: 'UNLOCK_SCREEN'; payload: { password: string } }
  
  // Window Management
  | { type: 'OPEN_WINDOW'; payload: { app: OSApp } }
  | { type: 'CLOSE_WINDOW'; payload: { windowId: string } }
  | { type: 'MINIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'MAXIMIZE_WINDOW'; payload: { windowId: string } }
  | { type: 'FULLSCREEN_WINDOW'; payload: { windowId: string } }
  | { type: 'RESTORE_WINDOW'; payload: { windowId: string } }
  | { type: 'MOVE_WINDOW'; payload: { windowId: string; position: { x: number; y: number } } }
  | { type: 'RESIZE_WINDOW'; payload: { windowId: string; size: { width: number; height: number } } }
  | { type: 'FOCUS_WINDOW'; payload: { windowId: string } }
  
  // Taskbar & Apps
  | { type: 'ADD_TO_TASKBAR'; payload: { appId: string } }
  | { type: 'REMOVE_FROM_TASKBAR'; payload: { appId: string } }
  | { type: 'ADD_RECENT_APP'; payload: { appId: string } }
  
  // Notifications
  | { type: 'ADD_NOTIFICATION'; payload: { notification: Omit<OSNotification, 'id' | 'timestamp'> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { notificationId: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: { notificationId: string } }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'TOGGLE_NOTIFICATION_CENTER' }
  
  // File System
  | { type: 'CREATE_FILE'; payload: { parentPath: string; file: Omit<OSFile, 'id' | 'createdAt' | 'modifiedAt'> } }
  | { type: 'CREATE_FOLDER'; payload: { parentPath: string; folderName: string; icon?: LucideIcon } }
  | { type: 'DELETE_FILE'; payload: { fileId: string; itemPath: string } }
  | { type: 'RENAME_FILE'; payload: { fileId: string; itemPath: string; newName: string } }
  | { type: 'MOVE_FILE'; payload: { fileId: string; sourcePath: string; targetPath: string; newParentId: string } }
  | { type: 'SELECT_FILE'; payload: { fileId: string; multiSelect?: boolean } }
  | { type: 'DESELECT_ALL_FILES' }
  | { type: 'NAVIGATE_TO'; payload: { path: string } }
  | { type: 'TOGGLE_FOLDER_EXPANSION'; payload: { folderPath: string } }
  | { type: 'COPY_TO_CLIPBOARD'; payload: { itemPaths: string[]; operation: 'copy' | 'cut' } }
  | { type: 'PASTE_FROM_CLIPBOARD'; payload: { targetPath: string } }
  | { type: 'CHANGE_DIRECTORY'; payload: { directoryId: string } }
  
  // System Settings
  | { type: 'UPDATE_SYSTEM_SETTINGS'; payload: { settings: Partial<OSSystemSettings> } }
  | { type: 'UPDATE_BACKGROUND_CONFIG'; payload: { backgroundConfig: BackgroundConfig } }
  | { type: 'UPDATE_SYSTEM_TIME' }
  | { type: 'SET_ONLINE_STATUS'; payload: { isOnline: boolean } }
  | { type: 'UPDATE_BATTERY'; payload: { level: number } }
  | { type: 'UPDATE_WIFI'; payload: { strength: number } }
  
  // Utilities
  | { type: 'ADD_TO_CLIPBOARD'; payload: { content: string; type: OSClipboard['type'] } }
  | { type: 'CLEAR_CLIPBOARD' }
  | { type: 'ADD_RECENT_FILE'; payload: { fileId: string } }
  | { type: 'ADD_SEARCH_HISTORY'; payload: { query: string } }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  
  // Desktop
  | { type: 'ADD_DESKTOP_ICON'; payload: { appId: string } }
  | { type: 'REMOVE_DESKTOP_ICON'; payload: { appId: string } }
  | { type: 'SET_WALLPAPER'; payload: { wallpaper: string } }
  | { type: 'SNAP_WINDOW'; payload: { windowId: string; position: OSWindow['snapPosition'] } }
  | { type: 'UNSNAP_WINDOW'; payload: { windowId: string } }
  | { type: 'GROUP_WINDOWS'; payload: { windowIds: string[]; groupName: string } }
  | { type: 'UNGROUP_WINDOWS'; payload: { groupId: string } }
  | { type: 'MOVE_WINDOW_TO_MONITOR'; payload: { windowId: string; monitorId: string } }
  | { type: 'SET_WINDOW_OPACITY'; payload: { windowId: string; opacity: number } }
  | { type: 'TOGGLE_ALWAYS_ON_TOP'; payload: { windowId: string } }
  | { type: 'ADD_MONITOR'; payload: { monitor: OSMonitor } }
  | { type: 'REMOVE_MONITOR'; payload: { monitorId: string } }
  | { type: 'SET_PRIMARY_MONITOR'; payload: { monitorId: string } }
  | { type: 'SET_ACTIVE_MONITOR'; payload: { monitorId: string } }
  | { type: 'ADD_SHORTCUT'; payload: { key: string; action: string } }

// Initial OS state
const initialState: OSState = {
  // Authentication & Screen
  isLoggedIn: false,
  currentScreen: 'login',
  userName: 'Portfolio User',
  userAvatar: '/avatar.jpg',
  
  // Window Management
  windows: [],
  activeWindowId: null,
  nextZIndex: 1000,
  windowGroups: [],
  monitors: [
    {
      id: 'monitor-1',
      name: 'Primary Monitor',
      isPrimary: true,
      resolution: { width: 1920, height: 1080 },
      position: { x: 0, y: 0 },
      scaleFactor: 1,
      isActive: true,
    }
  ],
  activeMonitorId: 'monitor-1',
  
  // Applications
  apps: [
    { id: 'browser', name: 'Browser', icon: Globe, component: 'Browser', category: 'productivity', isSystemApp: false },
    { id: 'terminal', name: 'Terminal', icon: Terminal, component: 'Terminal', category: 'development', isSystemApp: true },
    { id: 'email', name: 'Email', icon: Mail, component: 'Email', category: 'communication', isSystemApp: false },
    { id: 'settings', name: 'Settings', icon: Settings, component: 'Settings', category: 'system', isSystemApp: true },
    { id: 'files', name: 'File Manager', icon: Folder, component: 'FileManager', category: 'system', isSystemApp: true },
    { id: 'gallery', name: 'Gallery', icon: Image, component: 'Gallery', category: 'entertainment', isSystemApp: false },
    { id: 'markdown', name: 'Markdown Viewer', icon: FileText, component: 'MarkdownApp', category: 'productivity', isSystemApp: false },
  ],
  taskbarApps: ['browser', 'terminal', 'email', 'files', 'gallery', 'markdown'],
  recentApps: [],
  
  // Notifications
  notifications: [],
  unreadNotifications: 0,
  notificationCenter: false,
  
  // Enhanced File System Tree
  fileSystem: (() => {
    // Create root folder
    const root = FileSystemUtils.createFolder('root', 'Root', '/', Folder)
    
    // Create main folders
    const desktop = FileSystemUtils.createFolder('desktop', 'Desktop', '/Desktop', Folder)
    const documents = FileSystemUtils.createFolder('documents', 'Documents', '/Documents', Folder)
    const downloads = FileSystemUtils.createFolder('downloads', 'Downloads', '/Downloads', Download)
    const images = FileSystemUtils.createFolder('images', 'Images', '/Images', Image)
    const about = FileSystemUtils.createFolder('about', 'About', '/About', User)
    const projects = FileSystemUtils.createFolder('projects', 'Projects', '/Projects', Briefcase)
    const apps = FileSystemUtils.createFolder('apps', 'Apps', '/Apps', Package)
    
    // Add sample markdown files to Documents folder
    const sampleMarkdownFiles = [
      {
        id: 'readme',
        name: 'README.md',
        content: `# Welcome to My Portfolio OS

This is a simulated operating system built with Next.js and React. It features:

- File system management
- Multiple applications
- Window management
- Markdown viewer
- And much more!

## Getting Started

Click on the applications in the taskbar to explore different features.

## Features

- **File Explorer**: Browse through the file system
- **Markdown Viewer**: View and edit markdown files
- **Browser**: Web browsing simulation
- **Settings**: Customize your experience

Enjoy exploring!`,
        size: 512,
        path: '/Documents/README.md',
        mimeType: 'text/markdown'
      },
      {
        id: 'notes',
        name: 'Notes.md',
        content: `# My Notes

## Project Ideas
- [ ] Add more applications to the OS
- [ ] Implement file editing capabilities
- [ ] Add drag and drop functionality
- [ ] Create a code editor app

## Technical Notes
- Using Next.js 15 with App Router
- shadcn/ui for components
- Tailwind CSS for styling
- TypeScript for type safety

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)`,
        size: 456,
        path: '/Documents/Notes.md',
        mimeType: 'text/markdown'
      },
      {
        id: 'changelog',
        name: 'CHANGELOG.md',
        content: `# Changelog

## [1.0.0] - 2024-01-15

### Added
- Initial OS simulation
- File system management
- Window management system
- Taskbar with application shortcuts
- Markdown viewer application
- File browser dialog
- Basic settings management

### Features
- Responsive design
- Dark/light theme support
- Keyboard shortcuts
- File operations (open, close, navigate)

### Technical
- Built with Next.js 15
- TypeScript for type safety
- shadcn/ui component library
- Tailwind CSS for styling`,
        size: 678,
        path: '/Documents/CHANGELOG.md',
        mimeType: 'text/markdown'
      }
    ]

    // Add markdown files to Documents folder
    sampleMarkdownFiles.forEach(fileData => {
      const file = FileSystemUtils.createFile(
        fileData.id,
        fileData.name,
        fileData.path,
        'md', // extension
        fileData.size,
        fileData.content, // content
        FileText // icon
      )
      FileSystemUtils.addToFolder(documents, file)
    })

    // Add main folders to root
    FileSystemUtils.addToFolder(root, desktop)
    FileSystemUtils.addToFolder(root, documents)
    FileSystemUtils.addToFolder(root, downloads)
    FileSystemUtils.addToFolder(root, images)
    FileSystemUtils.addToFolder(root, about)
    FileSystemUtils.addToFolder(root, projects)
    FileSystemUtils.addToFolder(root, apps)
    
    // Create bg subfolder in images
    const bgFolder = FileSystemUtils.createFolder('bg', 'bg', '/Images/bg', Image)
    FileSystemUtils.addToFolder(images, bgFolder)
    
    // Create background image files
    const backgroundImages = [
      { id: 'bg1', name: 'BG (1).WEBP', size: 2048000, path: '/image_os/background/BG (1).WEBP' },
      { id: 'bg2', name: 'BG (2).WEBP', size: 1856000, path: '/image_os/background/BG (2).WEBP' },
      { id: 'bg3', name: 'BG (3).WEBP', size: 2304000, path: '/image_os/background/BG (3).WEBP' },
      { id: 'bg4', name: 'BG (4).WEBP', size: 1920000, path: '/image_os/background/BG (4).WEBP' },
      { id: 'bg5', name: 'BG (5).WEBP', size: 2176000, path: '/image_os/background/BG (5).WEBP' },
      { id: 'bg6', name: 'BG (6).WEBP', size: 1792000, path: '/image_os/background/BG (6).WEBP' },
      { id: 'bg7', name: 'BG (7).WEBP', size: 2432000, path: '/image_os/background/BG (7).WEBP' },
      { id: 'bg8', name: 'BG (8).WEBP', size: 2048000, path: '/image_os/background/BG (8).WEBP' },
      { id: 'bg9', name: 'BG (9).WEBP', size: 1984000, path: '/image_os/background/BG (9).WEBP' },
      { id: 'bg10', name: 'BG (10).WEBP', size: 2240000, path: '/image_os/background/BG (10).WEBP' }
    ]
    
    backgroundImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/bg/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(bgFolder, file)
    })

    // Create gallery subfolder in images
    const galleryFolder = FileSystemUtils.createFolder('gallery', 'gallery', '/Images/gallery', Image)
    FileSystemUtils.addToFolder(images, galleryFolder)

    // Create gallery subfolders and images
    const europeFolder = FileSystemUtils.createFolder('europe', 'europe', '/Images/gallery/europe', Image)
    const franceFolder = FileSystemUtils.createFolder('france', 'france', '/Images/gallery/france', Image)
    const indeFolder = FileSystemUtils.createFolder('inde', 'inde', '/Images/gallery/inde', Image)
    const marocFolder = FileSystemUtils.createFolder('maroc', 'maroc', '/Images/gallery/maroc', Image)
    const newYorkFolder = FileSystemUtils.createFolder('new york', 'new york', '/Images/gallery/new york', Image)
    const thailandeFolder = FileSystemUtils.createFolder('thailande', 'thailande', '/Images/gallery/thailande', Image)

    FileSystemUtils.addToFolder(galleryFolder, europeFolder)
    FileSystemUtils.addToFolder(galleryFolder, franceFolder)
    FileSystemUtils.addToFolder(galleryFolder, indeFolder)
    FileSystemUtils.addToFolder(galleryFolder, marocFolder)
    FileSystemUtils.addToFolder(galleryFolder, newYorkFolder)
    FileSystemUtils.addToFolder(galleryFolder, thailandeFolder)

    // Europe images - All 29 images
    const europeImages = [
      { id: 'eu1', name: 'Albany - 2024 1.webp', size: 245760, path: '/image_os/gallery/europe/Albany - 2024 (11).webp' },
      { id: 'eu2', name: 'Albany - 2024 2.webp', size: 198432, path: '/image_os/gallery/europe/Albany - 2024 (110).webp' },
      { id: 'eu13', name: 'Dresde - 2023 1.webp', size: 312576, path: '/image_os/gallery/europe/Dresde - 2023 (11).webp' },
      { id: 'eu14', name: 'Dresde - 2023 2.webp', size: 267890, path: '/image_os/gallery/europe/Dresde - 2023 (12).webp' },
      { id: 'eu15', name: 'Dresde - 2023 3.webp', size: 289123, path: '/image_os/gallery/europe/Dresde - 2023 (13).webp' },
      { id: 'eu19', name: 'Grece - 2024 1.webp', size: 276543, path: '/image_os/gallery/europe/Grece - 2024 (22).webp' },
      { id: 'eu20', name: 'Grece - 2024 2.webp', size: 321098, path: '/image_os/gallery/europe/Grece - 2024 (78).webp' },
      { id: 'eu21', name: 'Grece - 2024 3.webp', size: 245760, path: '/image_os/gallery/europe/Grece - 2024 - nb (13).webp' },
      { id: 'eu22', name: 'Grece - 2024 4.webp', size: 198432, path: '/image_os/gallery/europe/Grece - 2024 - nb (14).webp' },
      { id: 'eu23', name: 'Grece - 2024 5.webp', size: 312576, path: '/image_os/gallery/europe/Grece - 2024 - nb (15).webp' },
      { id: 'eu24', name: 'Grece - 2024 6.webp', size: 267890, path: '/image_os/gallery/europe/Grece - 2024 - nb (16).webp' },
      { id: 'eu25', name: 'Sicile - 2023 1.webp', size: 289123, path: '/image_os/gallery/europe/Sicile - 2023 (1).webp' },
      { id: 'eu26', name: 'Sicile - 2023 2.webp', size: 234567, path: '/image_os/gallery/europe/Sicile - 2023 (15).webp' },
      { id: 'eu27', name: 'Sicile - 2023 3.webp', size: 345678, path: '/image_os/gallery/europe/Sicile - 2023 (16).webp' },
      { id: 'eu28', name: 'Sicile - 2023 4.webp', size: 198765, path: '/image_os/gallery/europe/Sicile - 2023 (17).webp' },
      { id: 'eu29', name: 'Sicile - 2023 5.webp', size: 276543, path: '/image_os/gallery/europe/Sicile - 2023 (18).webp' }
    ]

    europeImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/europe/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(europeFolder, file)
    })

    // France images - All 30 images
    const franceImages = [
      { id: 'fr1', name: 'Avignon - 2024.webp', size: 245760, path: '/image_os/gallery/france/Avignon - 2024 (10).webp' },
      { id: 'fr5', name: 'Baden - 2023 (11).webp', size: 289123, path: '/image_os/gallery/france/Baden - 2023 (11).webp' },
      { id: 'fr9', name: 'GP Mathilde - 2024 (17).webp', size: 276543, path: '/image_os/gallery/france/GP Mathilde - 2024 (17).webp' },
      { id: 'fr13', name: 'Paris - 2024 (204).webp', size: 312576, path: '/image_os/gallery/france/Paris - 2024 (204).webp' },
      { id: 'fr19', name: 'Ski courchevel - 2024 (27).webp', size: 276543, path: '/image_os/gallery/france/Ski courchevel - 2024 (27).webp' },
      { id: 'fr20', name: 'Ski courchevel - 2024 (28).webp', size: 321098, path: '/image_os/gallery/france/Ski courchevel - 2024 (28).webp' },
      { id: 'fr21', name: 'Ski courchevel - 2024 (29).webp', size: 245760, path: '/image_os/gallery/france/Ski courchevel - 2024 (29).webp' },
      { id: 'fr22', name: 'Teuf Baden - 2023 (10).webp', size: 198432, path: '/image_os/gallery/france/Teuf Baden - 2023 (10).webp' },
      { id: 'fr23', name: 'Teuf Baden - 2023 (11).webp', size: 312576, path: '/image_os/gallery/france/Teuf Baden - 2023 (11).webp' },
      { id: 'fr24', name: 'Teuf Baden - 2023 (12).webp', size: 267890, path: '/image_os/gallery/france/Teuf Baden - 2023 (12).webp' },
      { id: 'fr25', name: 'Teuf Baden - 2023 (13).webp', size: 289123, path: '/image_os/gallery/france/Teuf Baden - 2023 (13).webp' },
      { id: 'fr26', name: 'Toulon - 2023 (15).webp', size: 234567, path: '/image_os/gallery/france/Toulon - 2023 (15).webp' },
      { id: 'fr27', name: 'Toulon - 2023 (16).webp', size: 345678, path: '/image_os/gallery/france/Toulon - 2023 (16).webp' },
      { id: 'fr28', name: 'Trek - 2024  (10).webp', size: 198765, path: '/image_os/gallery/france/Trek - 2024  (10).webp' },
      { id: 'fr29', name: 'Trek - 2024  (11).webp', size: 276543, path: '/image_os/gallery/france/Trek - 2024  (11).webp' },
      { id: 'fr30', name: 'Trek - 2024  (12).webp', size: 321098, path: '/image_os/gallery/france/Trek - 2024  (12).webp' }
    ]

    franceImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/france/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(franceFolder, file)
    })

    // Inde images - All 89 images
    const indeImages = [
      { id: 'in1', name: '000001680037.webp', size: 245760, path: '/image_os/gallery/inde/000001680037.webp' },
      { id: 'in2', name: '20250209 - Bangalore [081].webp', size: 198432, path: '/image_os/gallery/inde/20250209 - Bangalore [081].webp' },
      { id: 'in3', name: '20250209 - Bangalore [081].webp', size: 198432, path: '/image_os/gallery/inde/20250424 - Bangalore [002].webp' },
      { id: 'in4', name: '20250209 - Bangalore [081].webp', size: 198432, path: '/image_os/gallery/inde/20250424 - Bangalore [003].webp' },
      { id: 'in5', name: '20250209 - Bangalore [081].webp', size: 198432, path: '/image_os/gallery/inde/20250424 - Bangalore [007].webp' },
      { id: 'in6', name: '20250221 - Andaman [46].webp', size: 245760, path: '/image_os/gallery/inde/20250221 - Andaman [46].webp' },
      { id: 'in7', name: '20250221 - Andaman [47].webp', size: 198432, path: '/image_os/gallery/inde/20250221 - Andaman [51].webp' },
      { id: 'in8', name: '20250221 - Andaman [48].webp', size: 312576, path: '/image_os/gallery/inde/20250223 - Andaman [40].webp' },
      { id: 'in9', name: '20250221 - Andaman [49].webp', size: 267890, path: '/image_os/gallery/inde/20250224 - Andaman [32].webp' },
      { id: 'in10', name: '20250221 - Andaman [50].webp', size: 289123, path: '/image_os/gallery/inde/20250225 - Andaman [10].webp' },
      { id: 'in11', name: '20250321 - Meghalaya [52].webp', size: 234567, path: '/image_os/gallery/inde/20250321 - Meghalaya [52].webp' },
      { id: 'in12', name: '20250321 - Meghalaya [53].webp', size: 345678, path: '/image_os/gallery/inde/20250321 - Meghalaya [57].webp' },
      { id: 'in13', name: '20250321 - Meghalaya [54].webp', size: 198765, path: '/image_os/gallery/inde/20250321 - Meghalaya [54].webp' },
      { id: 'in14', name: '20250321 - Meghalaya [55].webp', size: 276543, path: '/image_os/gallery/inde/20250321 - Meghalaya [58].webp' },
      { id: 'in15', name: '20250321 - Meghalaya [56].webp', size: 321098, path: '/image_os/gallery/inde/20250321 - Meghalaya [60].webp' },
      { id: 'in16', name: '20250321 - Meghalaya [57].webp', size: 245760, path: '/image_os/gallery/inde/20250321 - Meghalaya [61].webp' },
      { id: 'in17', name: '20250321 - Meghalaya [58].webp', size: 198432, path: '/image_os/gallery/inde/20250321 - Meghalaya [63].webp' },
      { id: 'in18', name: '20250321 - Meghalaya [59].webp', size: 312576, path: '/image_os/gallery/inde/20250321 - Meghalaya [67].webp' },
      { id: 'in19', name: '20250321 - Meghalaya [60].webp', size: 267890, path: '/image_os/gallery/inde/20250321 - Meghalaya [68].webp' },
      { id: 'in20', name: '20250321 - Meghalaya [61].webp', size: 289123, path: '/image_os/gallery/inde/20250321 - Meghalaya [69].webp' },
      { id: 'in21', name: '20250321 - Meghalaya [62].webp', size: 234567, path: '/image_os/gallery/inde/20250321 - Meghalaya [70].webp' },
      { id: 'in22', name: '20250321 - Meghalaya [63].webp', size: 345678, path: '/image_os/gallery/inde/20250321 - Meghalaya [72].webp' },
      { id: 'in23', name: '20250321 - Meghalaya [64].webp', size: 198765, path: '/image_os/gallery/inde/20250321 - Meghalaya [73].webp' },
      { id: 'in24', name: '20250321 - Meghalaya [65].webp', size: 276543, path: '/image_os/gallery/inde/20250321 - Meghalaya [74].webp' },
      { id: 'in25', name: '20250321 - Meghalaya [66].webp', size: 621098, path: '/image_os/gallery/inde/20250321 - Meghalaya [75].webp' },
      { id: 'in26', name: '20250321 - Meghalaya [66].webp', size: 324058, path: '/image_os/gallery/inde/20250321 - Meghalaya [75].webp' },
      { id: 'in27', name: '20250321 - Meghalaya [66].webp', size: 343468, path: '/image_os/gallery/inde/20250321 - Meghalaya [76].webp' },
      { id: 'in28', name: '20250321 - Meghalaya [66].webp', size: 321098, path: '/image_os/gallery/inde/20250321 - Meghalaya [85].webp' },
      { id: 'in29', name: '20250321 - Meghalaya [66].webp', size: 365098, path: '/image_os/gallery/inde/20250322 - Meghalaya [21].webp' },
      { id: 'in31', name: '20250321 - Meghalaya [66].webp', size: 321098, path: '/image_os/gallery/inde/20250322 - Meghalaya [24].webp' },
      { id: 'in32', name: '20250321 - Meghalaya [66].webp', size: 356698, path: '/image_os/gallery/inde/20250322 - Meghalaya [37].webp' },
      { id: 'in33', name: '20250321 - Meghalaya [66].webp', size: 655698, path: '/image_os/gallery/inde/20250322 - Meghalaya [38].webp' },
      { id: 'in34', name: '20250321 - Meghalaya [66].webp', size: 321768, path: '/image_os/gallery/inde/20250322 - Meghalaya [42].webp' },
      { id: 'in35', name: '20250321 - Meghalaya [66].webp', size: 825509, path: '/image_os/gallery/inde/20250322 - Meghalaya [43].webp' },
      { id: 'in36', name: '20250321 - Meghalaya [66].webp', size: 327778, path: '/image_os/gallery/inde/20250322 - Meghalaya [47].webp' },
      { id: 'in37', name: '20250321 - Meghalaya [66].webp', size: 528798, path: '/image_os/gallery/inde/20250323 - Meghalaya [05].webp' },
      { id: 'in38', name: '20250321 - Meghalaya [66].webp', size: 121098, path: '/image_os/gallery/inde/20250323 - Meghalaya [08].webp' },
      { id: 'in39', name: '20250412 - Jaipur [28].webp', size: 245760, path: '/image_os/gallery/inde/20250412 - Jaipur [28].webp' },
      { id: 'in40', name: '20250412 - Jaipur [29].webp', size: 198432, path: '/image_os/gallery/inde/20250412 - Jaipur [32].webp' },
      { id: 'in41', name: '20250412 - Jaipur [30].webp', size: 312576, path: '/image_os/gallery/inde/20250412 - Jaipur [36].webp' },
      { id: 'in42', name: '20250412 - Jaipur [31].webp', size: 267890, path: '/image_os/gallery/inde/20250412 - Jaipur [37].webp' },
      { id: 'in43', name: '20250412 - Jaipur [32].webp', size: 289123, path: '/image_os/gallery/inde/20250412 - Jaipur [39].webp' },
      { id: 'in44', name: '20250412 - Jaipur [33].webp', size: 234567, path: '/image_os/gallery/inde/20250412 - Jaipur [43].webp' },
      { id: 'in45', name: '20250412 - Jaipur [34].webp', size: 345678, path: '/image_os/gallery/inde/20250412 - Jaipur [47].webp' },
      { id: 'in46', name: '20250412 - Jaipur [35].webp', size: 198765, path: '/image_os/gallery/inde/20250413 - Jaipur [21].webp' },
      { id: 'in47', name: '20250419 - Udaipur [01].webp', size: 245760, path: '/image_os/gallery/inde/20250419 - Udaipur [01].webp' },
      { id: 'in48', name: '20250419 - Udaipur [02].webp', size: 198432, path: '/image_os/gallery/inde/20250419 - Udaipur [07].webp' },
      { id: 'in49', name: '20250419 - Udaipur [03].webp', size: 312576, path: '/image_os/gallery/inde/20250419 - Udaipur [10].webp' },
      { id: 'in50', name: '20250419 - Udaipur [04].webp', size: 267890, path: '/image_os/gallery/inde/20250419 - Udaipur [12].webp' },
      { id: 'in51', name: '20250419 - Udaipur [05].webp', size: 289123, path: '/image_os/gallery/inde/20250419 - Udaipur [16].webp' },
      { id: 'in52', name: '20250419 - Udaipur [06].webp', size: 234567, path: '/image_os/gallery/inde/20250419 - Udaipur [18].webp' },
      { id: 'in53', name: '20250419 - Udaipur [07].webp', size: 345678, path: '/image_os/gallery/inde/20250419 - Udaipur [33].webp' },
      { id: 'in54', name: '20250420 - Jodhpur [29].webp', size: 245760, path: '/image_os/gallery/inde/20250420 - Jodhpur [38].webp' },
      { id: 'in55', name: '20250420 - Jodhpur [30].webp', size: 198432, path: '/image_os/gallery/inde/20250420 - Jodhpur [39].webp' },
      { id: 'in56', name: '20250420 - Jodhpur [31].webp', size: 312576, path: '/image_os/gallery/inde/20250420 - Jodhpur [41].webp' },
      { id: 'in57', name: '20250420 - Jodhpur [32].webp', size: 267890, path: '/image_os/gallery/inde/20250420 - Jodhpur [42].webp' },
      { id: 'in58', name: '20250420 - Jodhpur [33].webp', size: 289123, path: '/image_os/gallery/inde/20250420 - Jodhpur [44].webp' },
      { id: 'in59', name: '20250420 - Jodhpur [34].webp', size: 234567, path: '/image_os/gallery/inde/20250420 - Jodhpur [46].webp' },
      { id: 'in60', name: '20250420 - Jodhpur [35].webp', size: 345678, path: '/image_os/gallery/inde/20250420 - Jodhpur [33].webp' },
      { id: 'in61', name: '20250420 - Jodhpur [36].webp', size: 198765, path: '/image_os/gallery/inde/20250420 - Jodhpur [37].webp' },
      { id: 'in62', name: '20250420 - Jodhpur [37].webp', size: 276543, path: '/image_os/gallery/inde/20250420 - Jodhpur [29].webp' },
      { id: 'in63', name: '20250420 - Jodhpur [38].webp', size: 431098, path: '/image_os/gallery/inde/20250420 - Jodhpur [50].webp' },
      { id: 'in64', name: '20250420 - Jodhpur [38].webp', size: 566798, path: '/image_os/gallery/inde/20250420 - Jodhpur [55].webp' },
      { id: 'in65', name: '20250420 - Jodhpur [38].webp', size: 245543, path: '/image_os/gallery/inde/20250420 - Jodhpur [59].webp' },  
      { id: 'in66', name: '20250420 - Jodhpur [38].webp', size: 235356, path: '/image_os/gallery/inde/20250420 - Jodhpur [65].webp' },
      { id: 'in67', name: '20250420 - Jodhpur [38].webp', size: 144653, path: '/image_os/gallery/inde/20250420 - Jodhpur [67].webp' },
      { id: 'in68', name: '20250420 - Jodhpur [38].webp', size: 348902, path: '/image_os/gallery/inde/20250420 - Jodhpur [70].webp' },
      { id: 'in69', name: '20250420 - Jodhpur [38].webp', size: 245543, path: '/image_os/gallery/inde/20250421 - Jodhpur [02].webp' },
      { id: 'in70', name: '20250420 - Jodhpur [38].webp', size: 235356, path: '/image_os/gallery/inde/20250421 - Jodhpur [03].webp' },
      { id: 'in71', name: '20250420 - Jodhpur [38].webp', size: 876786, path: '/image_os/gallery/inde/20250421 - Jodhpur [03].webp' },
      { id: 'in72', name: '20250420 - Jodhpur [38].webp', size: 698807, path: '/image_os/gallery/inde/20250421 - Jodhpur [04].webp' },
      { id: 'in73', name: '20250420 - Jodhpur [38].webp', size: 578699, path: '/image_os/gallery/inde/20250421 - Jodhpur [05].webp' },
      { id: 'in74', name: '20250420 - Jodhpur [38].webp', size: 767554, path: '/image_os/gallery/inde/20250421 - Jodhpur [09].webp' },
      { id: 'in75', name: '20250420 - Jodhpur [38].webp', size: 345677, path: '/image_os/gallery/inde/20250421 - Jodhpur [16].webp' },
      { id: 'in76', name: '20250420 - Jodhpur [38].webp', size: 345657, path: '/image_os/gallery/inde/20250421 - Jodhpur [23].webp' },
      { id: 'in77', name: '20250428 - Goa [01].webp', size: 245760, path: '/image_os/gallery/inde/20250428 - Goa [01].webp' },
      { id: 'in78', name: '20250428 - Goa [03].webp', size: 312576, path: '/image_os/gallery/inde/20250428 - Goa [03].webp' },
      { id: 'in79', name: '20250428 - Goa [04].webp', size: 267890, path: '/image_os/gallery/inde/20250428 - Goa [12].webp' },
      { id: 'in80', name: '20250428 - Goa [05].webp', size: 289123, path: '/image_os/gallery/inde/20250428 - Goa [13].webp' },
      { id: 'in81', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/20250428 - Goa [16].webp' },
      { id: 'in82', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo01_3.webp' },
      { id: 'in83', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo03_5.webp' },
      { id: 'in84', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo04_4.webp' },
      { id: 'in85', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo06_8.webp' },
      { id: 'in86', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo20_20.webp' },
      { id: 'in87', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo21_21.webp' },
      { id: 'in88', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo22_13.webp' },
      { id: 'in89', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo25_33.webp' },
      { id: 'in90', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo26_9.webp' },
      { id: 'in91', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo27_8.webp' },
      { id: 'in92', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo28_28.webp' },
      { id: 'in93', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo29_29.webp' },
      { id: 'in94', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo31_31.webp' },
      { id: 'in95', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/Photo34_34.webp' },
      { id: 'in96', name: '20250428 - Goa [06].webp', size: 234567, path: '/image_os/gallery/inde/TEST.webp' },
    ]

    indeImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/inde/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(indeFolder, file)
    })

    // Maroc images - All 9 images
    const marocImages = [
      { id: 'ma1', name: 'Maroc - 2024 1.webp', size: 245760, path: '/image_os/gallery/maroc/Maroc - 2024 (129).webp' },
      { id: 'ma2', name: 'Maroc - 2024 2.webp', size: 198432, path: '/image_os/gallery/maroc/Maroc - 2024 (130).webp' },
      { id: 'ma3', name: 'Maroc - 2024 3.webp', size: 312576, path: '/image_os/gallery/maroc/Maroc - 2024 (131).webp' },
      { id: 'ma4', name: 'Maroc - 2024 4.webp', size: 267890, path: '/image_os/gallery/maroc/Maroc - 2024 (142).webp' },
      { id: 'ma5', name: 'Maroc - 2024 5.webp', size: 289123, path: '/image_os/gallery/maroc/Maroc - 2024 (93).webp' },
      { id: 'ma6', name: 'Maroc - 2024 6.webp', size: 234567, path: '/image_os/gallery/maroc/Maroc - 2024 (86).webp' },
      { id: 'ma7', name: 'Maroc - 2024 7.webp', size: 345678, path: '/image_os/gallery/maroc/Maroc - 2024 (58).webp' },
      { id: 'ma8', name: 'Maroc - 2024 8.webp', size: 198765, path: '/image_os/gallery/maroc/Maroc - 2024 (62).webp' },
      { id: 'ma9', name: 'Maroc - 2024 9.webp', size: 276543, path: '/image_os/gallery/maroc/Maroc - 2024 (84).webp' }
    ]

    marocImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/maroc/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(marocFolder, file)
    })

    // New York images - All 9 images
    const newYorkImages = [
      { id: 'ny1', name: 'NYC - 2024 1.webp', size: 245760, path: '/image_os/gallery/new york/NYC - 2024 (149).webp' },
      { id: 'ny2', name: 'NYC - 2024 2.webp', size: 198432, path: '/image_os/gallery/new york/NYC - 2024 (154).webp' },
      { id: 'ny3', name: 'NYC - 2024 3.webp', size: 312576, path: '/image_os/gallery/new york/NYC - 2024 (182).webp' },
      { id: 'ny4', name: 'NYC - 2024 4.webp', size: 267890, path: '/image_os/gallery/new york/NYC - 2024 (193).webp' },
      { id: 'ny5', name: 'NYC - 2024 5.webp', size: 289123, path: '/image_os/gallery/new york/NYC - 2024 (195).webp' },
      { id: 'ny6', name: 'NYC - 2024 6.webp', size: 234567, path: '/image_os/gallery/new york/NYC - 2024 (80).webp' },
      { id: 'ny7', name: 'NYC - 2024 7.webp', size: 345678, path: '/image_os/gallery/new york/NYC - 2024 (77).webp' },  
      { id: 'ny8', name: 'NYC - 2024 8.webp', size: 198765, path: '/image_os/gallery/new york/NYC - 2024 (87).webp' },
      { id: 'ny9', name: 'NYC - 2024 9.webp', size: 276543, path: '/image_os/gallery/new york/NYC - 2024 (98).webp' }
    ]

    newYorkImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/new york/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(newYorkFolder, file)
    })

    // Thailande images - All 17 images
    const thailandeImages = [
      { id: 'th1', name: 'Thailande - 2025 1.webp', size: 245760, path: '/image_os/gallery/thailande/20250302 - Thailande [134].webp' },
      { id: 'th2', name: 'Thailande - 2025 2.webp', size: 198432, path: '/image_os/gallery/thailande/20250302 - Thailande [138].webp' },
      { id: 'th3', name: 'Thailande - 2025 3.webp', size: 312576, path: '/image_os/gallery/thailande/20250302 - Thailande [143].webp' },
      { id: 'th4', name: 'Thailande - 2025 4.webp', size: 267890, path: '/image_os/gallery/thailande/20250302 - Thailande [146].webp' },
      { id: 'th5', name: 'Thailande - 2025 5.webp', size: 289123, path: '/image_os/gallery/thailande/20250302 - Thailande [147].webp' },
      { id: 'th6', name: 'Thailande - 2025 6.webp', size: 234567, path: '/image_os/gallery/thailande/20250302 - Thailande [162].webp' },
      { id: 'th7', name: 'Thailande - 2025 7.webp', size: 345678, path: '/image_os/gallery/thailande/20250302 - Thailande [165].webp' },
      { id: 'th8', name: 'Thailande - 2025 8.webp', size: 198765, path: '/image_os/gallery/thailande/20250302 - Thailande [173].webp' },
      { id: 'th9', name: 'Thailande - 2025 9.webp', size: 276543, path: '/image_os/gallery/thailande/20250303 - Thailande [125].webp' },
      { id: 'th10', name: 'Thailande - 2025 10.webp', size: 321098, path: '/image_os/gallery/thailande/20250303 - Thailande [131].webp' },
      { id: 'th11', name: 'Thailande - 2025 11.webp', size: 245760, path: '/image_os/gallery/thailande/20250304 - Thailande [107].webp' },
      { id: 'th12', name: 'Thailande - 2025 12.webp', size: 198432, path: '/image_os/gallery/thailande/20250304 - Thailande [110].webp' },
      { id: 'th13', name: 'Thailande - 2025 13.webp', size: 312576, path: '/image_os/gallery/thailande/20250306 - Thailande [069].webp' },
      { id: 'th14', name: 'Thailande - 2025 14.webp', size: 267890, path: '/image_os/gallery/thailande/20250312 - Thailande [061].webp' },
      { id: 'th15', name: 'Thailande - 2025 15.webp', size: 289123, path: '/image_os/gallery/thailande/20250315 - Thailande [044].webp' },
      { id: 'th16', name: 'Thailande - 2025 16.webp', size: 234567, path: '/image_os/gallery/thailande/20250316 - Thailande [032].webp' },
      { id: 'th17', name: 'Thailande - 2025 17.webp', size: 345678, path: '/image_os/gallery/thailande/20250316 - Thailande [033].webp' }
    ]

    thailandeImages.forEach(img => {
      const file = FileSystemUtils.createFile(
        img.id,
        img.name,
        `/Images/gallery/thailande/${img.name}`,
        'webp',
        img.size,
        img.path,
        Image
      )
      FileSystemUtils.addToFolder(thailandeFolder, file)
    })
    
    // Create about folder files
    const cvFile = FileSystemUtils.createFile(
      'cv',
      'cv.md',
      '/About/cv.md',
      'md',
      4096,
      '# Curriculum Vitae\n\n## Personal Information\n- Name: Portfolio Developer\n- Email: contact@portfolio.dev\n- Location: Remote\n\n## Experience\n- Senior Full Stack Developer (2020-Present)\n- Frontend Developer (2018-2020)\n- Junior Developer (2016-2018)\n\n## Skills\n- React, Next.js, TypeScript\n- Node.js, Python\n- Three.js, WebGL\n- UI/UX Design',
      FileText
    )
    
    const meFile = FileSystemUtils.createFile(
      'me',
      'me.md',
      '/About/me.md',
      'md',
      2048,
      '# About Me\n\nI am a passionate full-stack developer with expertise in modern web technologies. I love creating immersive user experiences using cutting-edge technologies like React Three Fiber, Next.js, and advanced animation libraries.\n\n## Interests\n- 3D Web Development\n- Interactive Design\n- Performance Optimization\n- Open Source Contributions\n\n## Philosophy\nI believe in writing clean, maintainable code that not only works but also tells a story.',
      FileText
    )
    
    const profilePicture = FileSystemUtils.createFile(
      'profile_picture',
      'profile_picture.jpg',
      '/About/profile_picture.jpg',
      'jpg',
      512000,
      '/avatar.jpg',
      Image
    )
    
    FileSystemUtils.addToFolder(about, cvFile)
    FileSystemUtils.addToFolder(about, meFile)
    FileSystemUtils.addToFolder(about, profilePicture)
    
    const projectFiles = [
      {
        id: 'enchere',
        name: 'enchere.tsx',
        componentId: 'enchere',
        type: 'component',
        size: 1024,
        path: '/Projects/enchere.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'gile',
        name: 'gile.tsx',
        componentId: 'gile',
        type: 'component',
        size: 1200,
        path: '/Projects/gile.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'helixir',
        name: 'helixir.tsx',
        componentId: 'helixir',
        type: 'component',
        size: 1400,
        path: '/Projects/helixir.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'lab',
        name: 'lab.tsx',
        componentId: 'lab',
        type: 'component',
        size: 1600,
        path: '/Projects/lab.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'optimisationPostgres',
        name: 'optimisationPostgres.tsx',
        componentId: 'optimisationPostgres',
        type: 'component',
        size: 1300,
        path: '/Projects/optimisationPostgres.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'satviewer',
        name: 'satviewer.tsx',
        componentId: 'satviewer',
        type: 'component',
        size: 1800,
        path: '/Projects/satviewer.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'spotmap',
        name: 'spotmap.tsx',
        componentId: 'spotmap',
        type: 'component',
        size: 1500,
        path: '/Projects/spotmap.tsx',
        mimeType: 'application/tsx'
      },
      {
        id: 'all-projects',
        name: 'all-projects.tsx',
        componentId: 'all-projects',
        type: 'component',
        size: 2500,
        path: '/Projects/all-projects.tsx',
        mimeType: 'application/tsx'
      }
    ]

    // Add project files to Projects folder
    projectFiles.forEach(fileData => {
      console.log('useOS - Creating file for:', fileData)
      
      const file = FileSystemUtils.createFile(
        fileData.id,
        fileData.name,
        fileData.path,
        'tsx', // extension
        fileData.size,
        fileData.content || '', // content
        Globe // icon
      )
      
      // Set additional properties for component files
      if (fileData.componentId) {
        file.componentId = fileData.componentId
      }
      if (fileData.type) {
        file.type = fileData.type
      }
      
      console.log('useOS - Created file:', file)
      FileSystemUtils.addToFolder(projects, file)
    })
    
    return {
      root,
      currentPath: '/Desktop',
      selectedItems: new Set<string>(),
      clipboardItems: null,
      searchResults: [],
      recentItems: [],
      bookmarks: ['/Desktop', '/Documents', '/Images', '/About', '/Projects'],
      trash: []
    } as OSFileSystemTree
  })(),
  
  // System
  systemSettings: SettingsManager.merge({
    wallpaper: '/wallpapers/default.jpg',
    theme: 'dark',
    accentColor: '#3b82f6',
    secondaryColor: '#a855f7',
    fontSize: 'medium',
    borderRadius: 'md',
    animations: true,
    sounds: true,
    notifications: true,
    autoLogin: false,
    language: 'en',
    backgroundConfig: {
      type: 'component',
      component: () => null, // Placeholder component
      props: {
        colorStops: ['#5227FF', '#7cff67', '#5227FF'],
        amplitude: 1.0,
        blend: 0.5
      }
    }
  }),
  systemTime: Date.now(),
  isOnline: true,
  batteryLevel: 85,
  wifiStrength: 4,
  
  // Utilities
  clipboard: [],
  recentFiles: [],
  searchHistory: [],
  
  // Desktop
  desktopIcons: ['browser', 'terminal', 'vscode', 'files'],
  wallpapers: [
    '/wallpapers/default.jpg',
    '/wallpapers/nature.jpg',
    '/wallpapers/abstract.jpg',
    '/wallpapers/minimal.jpg',
  ],
  shortcuts: {
    'ctrl+alt+t': 'terminal',
    'ctrl+alt+b': 'browser',
    'ctrl+alt+f': 'files',
    'ctrl+alt+s': 'settings',
  },
}

// OS reducer
function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    // Authentication & Screen
    case 'LOGIN':
      if (action.payload.password === 'portfolio' || action.payload.password === 'admin') {
        return {
          ...state,
          isLoggedIn: true,
          currentScreen: 'desktop',
          userName: action.payload.userName || state.userName,
          systemTime: Date.now(),
        }
      }
      return state

    case 'LOGOUT':
      return {
        ...initialState,
        isLoggedIn: false,
        currentScreen: 'login',
        systemTime: Date.now(),
      }

    case 'LOCK_SCREEN':
      return {
        ...state,
        currentScreen: 'lockscreen',
        systemTime: Date.now(),
      }

    case 'UNLOCK_SCREEN':
      if (action.payload.password === 'portfolio' || action.payload.password === 'admin') {
        return {
          ...state,
          currentScreen: 'desktop',
          systemTime: Date.now(),
        }
      }
      return state

    // Window Management
    case 'OPEN_WINDOW':
      const existingWindow = state.windows.find(w => w.component === action.payload.app.component)
      if (existingWindow) {
        return {
          ...state,
          activeWindowId: existingWindow.id,
          windows: state.windows.map(w =>
            w.id === existingWindow.id
              ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
          recentApps: [action.payload.app.id, ...state.recentApps.filter(id => id !== action.payload.app.id)].slice(0, 10),
        }
      }
  
      // Clamp initial window size to .baba container dimensions
      const containerEl = typeof document !== 'undefined' ? (document.querySelector('.baba') as HTMLElement | null) : null
      const rect = containerEl?.getBoundingClientRect()
      const maxW = rect?.width || 1200
      const maxH = rect?.height || 800
      const initialW = Math.min(800, maxW)
      const initialH = Math.min(600, maxH)
      const newWindow: OSWindow = {
        id: `window-${Date.now()}`,
        title: action.payload.app.name,
        component: action.payload.app.component,
        isMinimized: false,
        isMaximized: false,
        isFullscreen: false,
        position: { x: 100 + state.windows.length * 30, y: 100 + state.windows.length * 30 },
        size: { width: initialW, height: initialH },
        initialSize: { width: initialW, height: initialH },
        zIndex: state.nextZIndex,
        isResizable: true,
        isDraggable: true,
        // Enhanced properties
        isSnapped: false,
        monitorId: state.activeMonitorId,
        isMovable: true,
        minSize: { width: 300, height: 200 },
        opacity: 1,
        isAlwaysOnTop: false,
      }
  
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
        nextZIndex: state.nextZIndex + 1,
        recentApps: [action.payload.app.id, ...state.recentApps.filter(id => id !== action.payload.app.id)].slice(0, 10),
      }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.payload.windowId),
        activeWindowId: state.activeWindowId === action.payload.windowId ? null : state.activeWindowId,
      }

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, isMinimized: true }
            : w
        ),
        activeWindowId: state.activeWindowId === action.payload.windowId ? null : state.activeWindowId,
      }

    case 'MAXIMIZE_WINDOW':
      console.log('MAXIMIZE_WINDOW', action.payload.windowId)
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, isMaximized: !w.isMaximized, isMinimized: false, isFullscreen: false }
            : w
        ),
      }

    case 'FULLSCREEN_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, isFullscreen: !w.isFullscreen, isMaximized: false, isMinimized: false }
            : w
        ),
      }

    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, isMinimized: false, isMaximized: false, isFullscreen: false }
            : w
        ),
        activeWindowId: action.payload.windowId,
      }

    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, position: action.payload.position }
            : w
        ),
      }

    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, size: action.payload.size }
            : w
        ),
      }

    case 'FOCUS_WINDOW':
      return {
        ...state,
        activeWindowId: action.payload.windowId,
        windows: state.windows.map(w =>
          w.id === action.payload.windowId
            ? { ...w, zIndex: state.nextZIndex, isMinimized: false }
            : w
        ),
        nextZIndex: state.nextZIndex + 1,
      }

    // Taskbar & Apps
    case 'ADD_TO_TASKBAR':
      if (!state.taskbarApps.includes(action.payload.appId)) {
        return {
          ...state,
          taskbarApps: [...state.taskbarApps, action.payload.appId],
        }
      }
      return state

    case 'REMOVE_FROM_TASKBAR':
      return {
        ...state,
        taskbarApps: state.taskbarApps.filter(id => id !== action.payload.appId),
      }

    case 'ADD_RECENT_APP':
      return {
        ...state,
        recentApps: [action.payload.appId, ...state.recentApps.filter(id => id !== action.payload.appId)].slice(0, 10),
      }

    // Notifications
    case 'ADD_NOTIFICATION':
      const newNotification: OSNotification = {
        ...action.payload.notification,
        id: `notification-${Date.now()}`,
        timestamp: Date.now(),
        isRead: false,
      }
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadNotifications: state.unreadNotifications + 1,
      }

    case 'REMOVE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload.notificationId)
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.notificationId),
        unreadNotifications: notification && !notification.isRead 
          ? state.unreadNotifications - 1 
          : state.unreadNotifications,
      }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.notificationId && !n.isRead
            ? { ...n, isRead: true }
            : n
        ),
        unreadNotifications: state.notifications.find(n => n.id === action.payload.notificationId && !n.isRead)
          ? state.unreadNotifications - 1
          : state.unreadNotifications,
      }

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadNotifications: 0,
      }

    case 'TOGGLE_NOTIFICATION_CENTER':
      return {
        ...state,
        notificationCenter: !state.notificationCenter,
      }

    // Enhanced File System Actions
    case 'CREATE_FILE': {
      const { parentPath, file } = action.payload
      const parentFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, parentPath)
      
      if (!parentFolder || parentFolder.type !== 'folder') {
        return state
      }

      const newFile = FileSystemUtils.createFile(
        `file-${Date.now()}`,
        file.name,
        `${parentPath}/${file.name}`,
        file.extension,
        file.size || 0,
        file.content || '',
        file.icon
      )

      const updatedFileSystem = { ...state.fileSystem }
      FileSystemUtils.addToFolder(parentFolder as OSFolder, newFile)
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'CREATE_FOLDER': {
      const { parentPath, folderName, icon } = action.payload
      const parentFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, parentPath)
      
      if (!parentFolder || parentFolder.type !== 'folder') {
        return state
      }

      const newFolder = FileSystemUtils.createFolder(
        `folder-${Date.now()}`,
        folderName,
        `${parentPath}/${folderName}`,
        icon || Folder
      )

      const updatedFileSystem = { ...state.fileSystem }
      FileSystemUtils.addToFolder(parentFolder as OSFolder, newFolder)
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'DELETE_FILE': {
      const { itemPath } = action.payload
      const pathParts = itemPath.split('/').filter(Boolean)
      const itemName = pathParts.pop()
      const parentPath = '/' + pathParts.join('/')
      
      const parentFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, parentPath)
      
      if (!parentFolder || parentFolder.type !== 'folder' || !itemName) {
        return state
      }

      const itemToDelete = Array.from((parentFolder as OSFolder).children.values())
        .find(item => item.name === itemName)
      
      if (!itemToDelete) {
        return state
      }

      const updatedFileSystem = { ...state.fileSystem }
      FileSystemUtils.removeFromFolder(parentFolder as OSFolder, itemToDelete.id)
      
      // Remove from selected items if selected
      const selectedItems = new Set(state.fileSystem.selectedItems)
      selectedItems.delete(itemToDelete.id)
      updatedFileSystem.selectedItems = selectedItems
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'RENAME_FILE': {
      const { itemPath, newName } = action.payload
      const item = FileSystemUtils.findItemByPath(state.fileSystem.root, itemPath)
      
      if (!item) {
        return state
      }

      const updatedFileSystem = { ...state.fileSystem }
      item.name = newName
      item.modifiedAt = Date.now()
      
      // Update path
      const pathParts = item.path.split('/').filter(Boolean)
      pathParts[pathParts.length - 1] = newName
      item.path = '/' + pathParts.join('/')
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'MOVE_FILE': {
      const { sourcePath, targetPath } = action.payload
      const sourceItem = FileSystemUtils.findItemByPath(state.fileSystem.root, sourcePath)
      const targetFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, targetPath)
      
      if (!sourceItem || !targetFolder || targetFolder.type !== 'folder') {
        return state
      }

      // Find source parent and remove item
      const sourcePathParts = sourcePath.split('/').filter(Boolean)
      sourcePathParts.pop()
      const sourceParentPath = '/' + sourcePathParts.join('/')
      const sourceParent = FileSystemUtils.findItemByPath(state.fileSystem.root, sourceParentPath)
      
      if (!sourceParent || sourceParent.type !== 'folder') {
        return state
      }

      const updatedFileSystem = { ...state.fileSystem }
      FileSystemUtils.removeFromFolder(sourceParent as OSFolder, sourceItem.id)
      
      // Update item path and add to target
      sourceItem.path = `${targetPath}/${sourceItem.name}`
      sourceItem.modifiedAt = Date.now()
      FileSystemUtils.addToFolder(targetFolder as OSFolder, sourceItem)
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'SELECT_FILE': {
      const { fileId: itemId, multiSelect } = action.payload
      const selectedItems = new Set(state.fileSystem.selectedItems)
      
      if (multiSelect) {
        if (selectedItems.has(itemId)) {
          selectedItems.delete(itemId)
        } else {
          selectedItems.add(itemId)
        }
      } else {
        selectedItems.clear()
        selectedItems.add(itemId)
      }
      
      return {
        ...state,
        fileSystem: {
          ...state.fileSystem,
          selectedItems,
        },
      }
    }

    case 'DESELECT_ALL_FILES': {
      return {
        ...state,
        fileSystem: {
          ...state.fileSystem,
          selectedItems: new Set(),
        },
      }
    }

    case 'NAVIGATE_TO': {
      const { path } = action.payload
      const targetItem = FileSystemUtils.findItemByPath(state.fileSystem.root, path)
      
      if (!targetItem || targetItem.type !== 'folder') {
        return state
      }

      return {
        ...state,
        fileSystem: {
          ...state.fileSystem,
          currentPath: path,
          selectedItems: new Set(),
        },
      }
    }

    case 'TOGGLE_FOLDER_EXPANSION': {
      const { folderPath } = action.payload
      const folder = FileSystemUtils.findItemByPath(state.fileSystem.root, folderPath)
      
      if (!folder || folder.type !== 'folder') {
        return state
      }

      const updatedFileSystem = { ...state.fileSystem }
      ;(folder as OSFolder).isExpanded = !(folder as OSFolder).isExpanded
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    case 'COPY_TO_CLIPBOARD': {
      const { itemPaths, operation } = action.payload
      const items = itemPaths
        .map((path: string) => FileSystemUtils.findItemByPath(state.fileSystem.root, path))
        .filter(Boolean) as OSFileSystemItem[]
      
      return {
        ...state,
        fileSystem: {
          ...state.fileSystem,
          clipboardItems: {
            items,
            operation: operation || 'copy',
          },
        },
      }
    }

    case 'PASTE_FROM_CLIPBOARD': {
      const { targetPath } = action.payload
      const { clipboardItems } = state.fileSystem
      
      if (!clipboardItems || clipboardItems.items.length === 0) {
        return state
      }

      const targetFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, targetPath)
      
      if (!targetFolder || targetFolder.type !== 'folder') {
        return state
      }

      const updatedFileSystem = { ...state.fileSystem }
      
      clipboardItems.items.forEach(item => {
        if (clipboardItems.operation === 'copy') {
          // Create a copy of the item
          const newItem = { ...item }
          newItem.id = `${item.type}-${Date.now()}-${Math.random()}`
          newItem.path = `${targetPath}/${item.name}`
          newItem.createdAt = Date.now()
          newItem.modifiedAt = Date.now()
          
          FileSystemUtils.addToFolder(targetFolder as OSFolder, newItem)
        } else if (clipboardItems.operation === 'cut') {
          // Move the item (handled by MOVE_FILE action)
          // This would typically trigger a MOVE_FILE action
        }
      })
      
      // Clear clipboard after paste
      updatedFileSystem.clipboardItems = null
      
      return {
        ...state,
        fileSystem: updatedFileSystem,
      }
    }

    // System Settings
    case 'UPDATE_SYSTEM_SETTINGS':
      return {
        ...state,
        systemSettings: { ...state.systemSettings, ...action.payload.settings },
      }

    case 'UPDATE_BACKGROUND_CONFIG':
      return {
        ...state,
        systemSettings: { 
          ...state.systemSettings, 
          backgroundConfig: action.payload.backgroundConfig 
        },
      }

    case 'UPDATE_SYSTEM_TIME':
      return {
        ...state,
        systemTime: Date.now(),
      }

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload.isOnline,
      }

    case 'UPDATE_BATTERY':
      return {
        ...state,
        batteryLevel: Math.max(0, Math.min(100, action.payload.level)),
      }

    case 'UPDATE_WIFI':
      return {
        ...state,
        wifiStrength: Math.max(0, Math.min(5, action.payload.strength)),
      }

    // Utilities
    case 'ADD_TO_CLIPBOARD':
      const clipboardItem: OSClipboard = {
        content: action.payload.content,
        type: action.payload.type,
        timestamp: Date.now(),
      }
      return {
        ...state,
        clipboard: [clipboardItem, ...state.clipboard.slice(0, 9)], // Keep last 10 items
      }

    case 'CLEAR_CLIPBOARD':
      return {
        ...state,
        clipboard: [],
      }

    case 'ADD_RECENT_FILE':
      return {
        ...state,
        recentFiles: [action.payload.fileId, ...state.recentFiles.filter(id => id !== action.payload.fileId)].slice(0, 20),
      }

    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload.query, ...state.searchHistory.filter(q => q !== action.payload.query)].slice(0, 50),
      }

    case 'CLEAR_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [],
      }

    // Desktop
    case 'ADD_DESKTOP_ICON':
      if (!state.desktopIcons.includes(action.payload.appId)) {
        return {
          ...state,
          desktopIcons: [...state.desktopIcons, action.payload.appId],
        }
      }
      return state

    case 'REMOVE_DESKTOP_ICON':
      return {
        ...state,
        desktopIcons: state.desktopIcons.filter(id => id !== action.payload.appId),
      }

    case 'SET_WALLPAPER':
      return {
        ...state,
        systemSettings: { ...state.systemSettings, wallpaper: action.payload.wallpaper },
      }

    case 'SNAP_WINDOW': {
      const { windowId, position } = action.payload
      return {
        ...state,
        windows: state.windows.map(window =>
          window.id === windowId
            ? {
                ...window,
                isSnapped: true,
                snapPosition: position,
                lastPosition: window.position,
                lastSize: window.size,
                position: getSnapPosition(position, state.monitors.find(m => m.id === window.monitorId)!),
                size: getSnapSize(position, state.monitors.find(m => m.id === window.monitorId)!),
                isMaximized: false,
              }
            : window
        ),
      }
    }

    case 'UNSNAP_WINDOW': {
      const { windowId } = action.payload
      return {
        ...state,
        windows: state.windows.map(window =>
          window.id === windowId
            ? {
                ...window,
                isSnapped: false,
                snapPosition: undefined,
                position: window.lastPosition || window.position,
                size: window.lastSize || window.size,
              }
            : window
        ),
      }
    }

    case 'GROUP_WINDOWS': {
      const { windowIds, groupName } = action.payload
      const groupId = `group-${Date.now()}`
      const newGroup: OSWindowGroup = {
        id: groupId,
        name: groupName,
        windowIds,
        isMinimized: false,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      }
      
      return {
        ...state,
        windowGroups: [...state.windowGroups, newGroup],
        windows: state.windows.map(window =>
          windowIds.includes(window.id)
            ? { ...window, groupId }
            : window
        ),
      }
    }

    case 'UNGROUP_WINDOWS': {
      const { groupId } = action.payload
      return {
        ...state,
        windowGroups: state.windowGroups.filter(group => group.id !== groupId),
        windows: state.windows.map(window =>
          window.groupId === groupId
            ? { ...window, groupId: undefined }
            : window
        ),
      }
    }

    case 'MOVE_WINDOW_TO_MONITOR': {
      const { windowId, monitorId } = action.payload
      const targetMonitor = state.monitors.find(m => m.id === monitorId)
      if (!targetMonitor) return state
      
      return {
        ...state,
        windows: state.windows.map(window =>
          window.id === windowId
            ? {
                ...window,
                monitorId,
                position: {
                  x: targetMonitor.position.x + 100,
                  y: targetMonitor.position.y + 100,
                },
                isSnapped: false,
                snapPosition: undefined,
              }
            : window
        ),
      }
    }

    case 'SET_WINDOW_OPACITY': {
      const { windowId, opacity } = action.payload
      return {
        ...state,
        windows: state.windows.map(window =>
          window.id === windowId
            ? { ...window, opacity: Math.max(0.1, Math.min(1, opacity)) }
            : window
        ),
      }
    }

    case 'TOGGLE_ALWAYS_ON_TOP': {
      const { windowId } = action.payload
      return {
        ...state,
        windows: state.windows.map(window =>
          window.id === windowId
            ? { ...window, isAlwaysOnTop: !window.isAlwaysOnTop }
            : window
        ),
      }
    }

    case 'ADD_MONITOR': {
      const { monitor } = action.payload
      return {
        ...state,
        monitors: [...state.monitors, monitor],
      }
    }

    case 'REMOVE_MONITOR': {
      const { monitorId } = action.payload
      if (state.monitors.length <= 1) return state // Can't remove the last monitor
      
      const removedMonitor = state.monitors.find(m => m.id === monitorId)
      if (!removedMonitor) return state
      
      const primaryMonitor = state.monitors.find(m => m.isPrimary && m.id !== monitorId) || state.monitors[0]
      
      return {
        ...state,
        monitors: state.monitors.filter(m => m.id !== monitorId),
        windows: state.windows.map(window =>
          window.monitorId === monitorId
            ? { ...window, monitorId: primaryMonitor.id }
            : window
        ),
        activeMonitorId: state.activeMonitorId === monitorId ? primaryMonitor.id : state.activeMonitorId,
      }
    }

    case 'SET_PRIMARY_MONITOR': {
      const { monitorId } = action.payload
      return {
        ...state,
        monitors: state.monitors.map(monitor => ({
          ...monitor,
          isPrimary: monitor.id === monitorId,
        })),
      }
    }

    case 'SET_ACTIVE_MONITOR': {
      const { monitorId } = action.payload
      return {
        ...state,
        activeMonitorId: monitorId,
      }
    }

    default:
      return state
  }
}

// Context
const OSContext = createContext<{
  state: OSState
  dispatch: React.Dispatch<OSAction>
} | null>(null)

// Provider component
export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, initialState)

  return (
    <OSContext.Provider value={{ state, dispatch }}>
      {children}
    </OSContext.Provider>
  )
}

// Hook to use OS context
export function useOS() {
  const context = useContext(OSContext)
  if (!context) {
    throw new Error('useOS must be used within an OSProvider')
  }
  
  // Create action dispatchers
  const actionDispatchers = Object.fromEntries(
    Object.entries(osActions).map(([key, actionCreator]) => [
      key,
      (...args: any[]) => context.dispatch((actionCreator as any)(...args))
    ])
  )
  
  return {
    ...context,
    actions: actionDispatchers
  }
}

// Helper functions for window snapping
const getSnapPosition = (
  snapPosition: OSWindow['snapPosition'], 
  monitor: OSMonitor
): { x: number; y: number } => {
  // Use the .baba container dimensions instead of monitor resolution to determine snap positions
  const containerEl = typeof document !== 'undefined' ? (document.querySelector('.baba') as HTMLElement | null) : null
  const rect = containerEl?.getBoundingClientRect()
  const containerWidth = rect?.width ?? 0
  const containerHeight = rect?.height ?? 0

  switch (snapPosition) {
    case 'left':
      return { x: 0, y: 0 }
    case 'right':
      return { x: containerWidth / 2, y: 0 }
    case 'top':
      return { x: 0, y: 0 }
    case 'bottom':
      return { x: 0, y: containerHeight / 2 }
    case 'top-left':
      return { x: 0, y: 0 }
    case 'top-right':
      return { x: containerWidth / 2, y: 0 }
    case 'bottom-left':
      return { x: 0, y: containerHeight / 2 }
    case 'bottom-right':
      return { x: containerWidth / 2, y: containerHeight / 2 }
    default:
      return { x: 0, y: 0 }
  }
}

const getSnapSize = (
  snapPosition: OSWindow['snapPosition'], 
  monitor: OSMonitor
): { width: number; height: number } => {
    // Use the .baba container dimensions instead of monitor resolution to determine snap positions
  const containerEl = typeof document !== 'undefined' ? (document.querySelector('.baba') as HTMLElement | null) : null
  const rect = containerEl?.getBoundingClientRect()
  const containerWidth = rect?.width ?? 0
  const containerHeight = rect?.height ?? 0
  switch (snapPosition) {
    case 'left':
    case 'right':
      return { width: containerWidth / 2, height: containerHeight }
    case 'top':
    case 'bottom':
      return { width: containerWidth, height: containerHeight / 2 }
    case 'top-left':
    case 'top-right':
    case 'bottom-left':
    case 'bottom-right':
      return { width: containerWidth / 2, height: containerHeight / 2 }
    default:
      return { width: containerWidth, height: containerHeight }
  }
}

// Helper functions
export const osActions = {
  // Authentication & Screen
  login: (password: string, userName?: string) => ({ 
    type: 'LOGIN' as const, 
    payload: { password, userName } 
  }),
  logout: () => ({ type: 'LOGOUT' as const }),
  lockScreen: () => ({ type: 'LOCK_SCREEN' as const }),
  unlockScreen: (password: string) => ({ 
    type: 'UNLOCK_SCREEN' as const, 
    payload: { password } 
  }),

  // Window Management (Enhanced)
  openWindow: (app: OSApp) => ({ type: 'OPEN_WINDOW' as const, payload: { app } }),
  closeWindow: (windowId: string) => ({ type: 'CLOSE_WINDOW' as const, payload: { windowId } }),
  minimizeWindow: (windowId: string) => ({ type: 'MINIMIZE_WINDOW' as const, payload: { windowId } }),
  maximizeWindow: (windowId: string) => ({ type: 'MAXIMIZE_WINDOW' as const, payload: { windowId } }),
  fullscreenWindow: (windowId: string) => ({ type: 'FULLSCREEN_WINDOW' as const, payload: { windowId } }),
  restoreWindow: (windowId: string) => ({ type: 'RESTORE_WINDOW' as const, payload: { windowId } }),
  moveWindow: (windowId: string, position: { x: number; y: number }) => 
    ({ type: 'MOVE_WINDOW' as const, payload: { windowId, position } }),
  resizeWindow: (windowId: string, size: { width: number; height: number }) => 
    ({ type: 'RESIZE_WINDOW' as const, payload: { windowId, size } }),
  focusWindow: (windowId: string) => ({ type: 'FOCUS_WINDOW' as const, payload: { windowId } }),
  
  // Advanced Window Management
  snapWindow: (windowId: string, position: OSWindow['snapPosition']) => 
    ({ type: 'SNAP_WINDOW' as const, payload: { windowId, position } }),
  unsnapWindow: (windowId: string) => ({ type: 'UNSNAP_WINDOW' as const, payload: { windowId } }),
  groupWindows: (windowIds: string[], groupName: string) => 
    ({ type: 'GROUP_WINDOWS' as const, payload: { windowIds, groupName } }),
  ungroupWindows: (groupId: string) => ({ type: 'UNGROUP_WINDOWS' as const, payload: { groupId } }),
  moveWindowToMonitor: (windowId: string, monitorId: string) => 
    ({ type: 'MOVE_WINDOW_TO_MONITOR' as const, payload: { windowId, monitorId } }),
  setWindowOpacity: (windowId: string, opacity: number) => 
    ({ type: 'SET_WINDOW_OPACITY' as const, payload: { windowId, opacity } }),
  toggleAlwaysOnTop: (windowId: string) => ({ type: 'TOGGLE_ALWAYS_ON_TOP' as const, payload: { windowId } }),

  // Monitor Management
  addMonitor: (monitor: OSMonitor) => ({ type: 'ADD_MONITOR' as const, payload: { monitor } }),
  removeMonitor: (monitorId: string) => ({ type: 'REMOVE_MONITOR' as const, payload: { monitorId } }),
  setPrimaryMonitor: (monitorId: string) => ({ type: 'SET_PRIMARY_MONITOR' as const, payload: { monitorId } }),
  setActiveMonitor: (monitorId: string) => ({ type: 'SET_ACTIVE_MONITOR' as const, payload: { monitorId } }),

  // Taskbar & Apps
  addToTaskbar: (appId: string) => ({ type: 'ADD_TO_TASKBAR' as const, payload: { appId } }),
  removeFromTaskbar: (appId: string) => ({ type: 'REMOVE_FROM_TASKBAR' as const, payload: { appId } }),
  addRecentApp: (appId: string) => ({ type: 'ADD_RECENT_APP' as const, payload: { appId } }),

  // Notifications
  addNotification: (notification: Omit<OSNotification, 'id' | 'timestamp'>) => ({
    type: 'ADD_NOTIFICATION' as const,
    payload: { notification }
  }),
  removeNotification: (notificationId: string) => ({
    type: 'REMOVE_NOTIFICATION' as const,
    payload: { notificationId }
  }),
  markNotificationRead: (notificationId: string) => ({
    type: 'MARK_NOTIFICATION_READ' as const,
    payload: { notificationId }
  }),
  clearAllNotifications: () => ({ type: 'CLEAR_ALL_NOTIFICATIONS' as const }),
  toggleNotificationCenter: () => ({ type: 'TOGGLE_NOTIFICATION_CENTER' as const }),

  // File System
  createFile: (parentPath: string, file: Omit<OSFile, 'id' | 'createdAt' | 'modifiedAt'>) => ({
    type: 'CREATE_FILE' as const,
    payload: { parentPath, file }
  }),
  deleteFile: (fileId: string, itemPath: string) => ({ type: 'DELETE_FILE' as const, payload: { fileId, itemPath } }),
  renameFile: (fileId: string, itemPath: string, newName: string) => ({
    type: 'RENAME_FILE' as const,
    payload: { fileId, itemPath, newName }
  }),
  moveFile: (fileId: string, sourcePath: string, targetPath: string, newParentId: string) => ({
    type: 'MOVE_FILE' as const,
    payload: { fileId, sourcePath, targetPath, newParentId }
  }),
  selectFile: (fileId: string, multiSelect?: boolean) => ({
    type: 'SELECT_FILE' as const,
    payload: { fileId, multiSelect }
  }),
  changeDirectory: (directoryId: string) => ({
    type: 'CHANGE_DIRECTORY' as const,
    payload: { directoryId }
  }),

  // System Settings
  updateSystemSettings: (settings: Partial<OSSystemSettings>) => ({
    type: 'UPDATE_SYSTEM_SETTINGS' as const,
    payload: { settings }
  }),
  updateBackgroundConfig: (backgroundConfig: BackgroundConfig) => ({
    type: 'UPDATE_BACKGROUND_CONFIG' as const,
    payload: { backgroundConfig }
  }),
  updateSystemTime: () => ({ type: 'UPDATE_SYSTEM_TIME' as const }),
  setOnlineStatus: (isOnline: boolean) => ({
    type: 'SET_ONLINE_STATUS' as const,
    payload: { isOnline }
  }),
  updateBattery: (level: number) => ({ type: 'UPDATE_BATTERY' as const, payload: { level } }),
  updateWifi: (strength: number) => ({ type: 'UPDATE_WIFI' as const, payload: { strength } }),

  // Utilities
  addToClipboard: (content: string, type: OSClipboard['type']) => ({
    type: 'ADD_TO_CLIPBOARD' as const,
    payload: { content, type }
  }),
  clearClipboard: () => ({ type: 'CLEAR_CLIPBOARD' as const }),
  addRecentFile: (fileId: string) => ({ type: 'ADD_RECENT_FILE' as const, payload: { fileId } }),
  addSearchHistory: (query: string) => ({
    type: 'ADD_SEARCH_HISTORY' as const,
    payload: { query }
  }),
  clearSearchHistory: () => ({ type: 'CLEAR_SEARCH_HISTORY' as const }),

  // Desktop
  addDesktopIcon: (appId: string) => ({ type: 'ADD_DESKTOP_ICON' as const, payload: { appId } }),
  removeDesktopIcon: (appId: string) => ({ type: 'REMOVE_DESKTOP_ICON' as const, payload: { appId } }),
  setWallpaper: (wallpaper: string) => ({ type: 'SET_WALLPAPER' as const, payload: { wallpaper } }),
  addShortcut: (key: string, action: string) => ({
    type: 'ADD_SHORTCUT' as const,
    payload: { key, action }
  }),
}

// Utility functions for OS operations
export const osUtils = {
  // Window utilities (Enhanced)
  getWindowById: (state: OSState, windowId: string) => 
    state.windows.find(w => w.id === windowId),
  
  getActiveWindow: (state: OSState) => 
    state.activeWindowId ? state.windows.find(w => w.id === state.activeWindowId) : null,
  
  getVisibleWindows: (state: OSState) => 
    state.windows.filter(w => !w.isMinimized),
  
  getWindowsByMonitor: (state: OSState, monitorId: string) => 
    state.windows.filter(w => w.monitorId === monitorId),
  
  getWindowsByGroup: (state: OSState, groupId: string) => 
    state.windows.filter(w => w.groupId === groupId),
  
  getSnappedWindows: (state: OSState) => 
    state.windows.filter(w => w.isSnapped),
  
  getAlwaysOnTopWindows: (state: OSState) => 
    state.windows.filter(w => w.isAlwaysOnTop).sort((a, b) => b.zIndex - a.zIndex),
  
  // Monitor utilities
  getPrimaryMonitor: (state: OSState) => 
    state.monitors.find(m => m.isPrimary),
  
  getActiveMonitor: (state: OSState) => 
    state.monitors.find(m => m.id === state.activeMonitorId),
  
  getMonitorByPosition: (state: OSState, x: number, y: number) => 
    state.monitors.find(m => 
      x >= m.position.x && 
      x < m.position.x + m.resolution.width &&
      y >= m.position.y && 
      y < m.position.y + m.resolution.height
    ),
  
  // Window group utilities
  getWindowGroup: (state: OSState, groupId: string) => 
    state.windowGroups.find(g => g.id === groupId),
  
  getGroupsForWindow: (state: OSState, windowId: string) => {
    const window = state.windows.find(w => w.id === windowId)
    return window?.groupId ? state.windowGroups.find(g => g.id === window.groupId) : null
  },
  
  // App utilities
  getAppById: (state: OSState, appId: string) => 
    state.apps.find(app => app.id === appId),
  
  getAppsByCategory: (state: OSState, category: OSApp['category']) => 
    state.apps.filter(app => app.category === category),
  
  // File utilities
  getFileById: (state: OSState, fileId: string) => 
    FileSystemUtils.getAllFiles(state.fileSystem.root).find(f => f.id === fileId),
  
  getFilesByParent: (state: OSState, parentPath: string) => {
    const parentFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, parentPath)
    if (!parentFolder || parentFolder.type !== 'folder') return []
    return Array.from((parentFolder as OSFolder).children.values()).filter(item => item.type === 'file') as OSFile[]
  },
  
  getCurrentDirectoryFiles: (state: OSState) => {
    const currentFolder = FileSystemUtils.findItemByPath(state.fileSystem.root, state.fileSystem.currentPath)
    if (!currentFolder || currentFolder.type !== 'folder') return []
    return Array.from((currentFolder as OSFolder).children.values()).filter(item => item.type === 'file') as OSFile[]
  },
  
  // Notification utilities
  getUnreadNotifications: (state: OSState) => 
    state.notifications.filter(n => !n.isRead),
  
  getNotificationsByType: (state: OSState, type: OSNotification['type']) => 
    state.notifications.filter(n => n.type === type),
  
  // System utilities
  formatSystemTime: (timestamp: number) => new Date(timestamp).toLocaleString(),
  
  getBatteryStatus: (level: number) => {
    if (level > 80) return 'high'
    if (level > 20) return 'medium'
    return 'low'
  },
  
  getWifiStatus: (strength: number) => {
    if (strength >= 4) return 'excellent'
    if (strength >= 3) return 'good'
    if (strength >= 2) return 'fair'
    if (strength >= 1) return 'poor'
    return 'none'
  },
}