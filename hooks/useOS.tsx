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
  initialUrl?: string // For browser windows
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
  actions?: Array\u003c{ label: string; action: string }\u003e
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
  metadata: Record\u003cstring, any\u003e
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
  children: Map\u003cstring, OSFileSystemItem\u003e
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
  selectedItems: Set\u003cstring\u003e
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
    
    const mimeTypes: Record\u003cstring, string\u003e = {
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
    const associations: Record\u003cstring, string\u003e = {
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
      const found = Array.from(folder.children.values()).find(item =\u003e item.name === part)
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

  static buildBreadcrumbs(path: string): Array\u003c{ name: string; path: string }\u003e {
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

    const searchRecursive = (folder: OSFolder) =\u003e {
      if (results.length \u003e= maxResults) return

      for (const item of folder.children.values()) {
        if (results.length \u003e= maxResults) break
        
        // Skip hidden items if not included
        if (!includeHidden \u0026\u0026 item.isHidden) continue
        
        // Filter by file types if specified
        if (fileTypesOnly.length \u003e 0 \u0026\u0026 item.type === 'file') {
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
    const sorted = [...items].sort((a, b) =\u003e {
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
          } else if (a.type === 'file' \u0026\u0026 b.type === 'file') {
            comparison = (a as OSFile).extension.localeCompare((b as OSFile).extension)
          }
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  static getFileIcon(extension: string): LucideIcon {
    const iconMap: Record\u003cstring, LucideIcon\u003e = {
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

    const invalidChars = /[\u003c\u003e:"/\\|?*]/
    if (invalidChars.test(name)) {
      return { valid: false, error: 'File name contains invalid characters' }
    }

    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
    if (reservedNames.includes(name.toUpperCase())) {
      return { valid: false, error: 'File name is reserved by the system' }
    }

    if (name.length \u003e 255) {
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
    
    const collectFiles = (folder: OSFolder) =\u003e {
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
  // Authentication \u0026 Screen
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
  shortcuts: Record\u003cstring, string\u003e
}

// Actions for OS state management
type OSAction =
  // Authentication \u0026 Screen
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
  
  // Taskbar \u0026 Apps
  | { type: 'ADD_TO_TASKBAR'; payload: { appId: string } }
  | { type: 'REMOVE_FROM_TASKBAR'; payload: { appId: string } }
  | { type: 'ADD_RECENT_APP'; payload: { appId: string } }
  
  // Notifications
  | { type: 'ADD_NOTIFICATION'; payload: { notification: Omit\u003cOSNotification, 'id' | 'timestamp'\u003e } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { notificationId: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: { notificationId: string } }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'TOGGLE_NOTIFICATION_CENTER' }
  
  // File System
  | { type: 'CREATE_FILE'; payload: { parentPath: string; file: Omit\u003cOSFile, 'id' | 'createdAt' | 'modifiedAt'\u003e } }
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
  | { type: 'UPDATE_SYSTEM_SETTINGS'; payload: { settings: Partial\u003cOSSystemSettings\u003e } }
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
  // Authentication \u0026 Screen
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
      id: 'main',
      name: 'Main Monitor',
      isPrimary: true,
      resolution: { width: 1920, height: 1080 },
      position: { x: 0, y: 0 },
      scaleFactor: 1,
      isActive: true
    }
  ],
  activeMonitorId: 'main',
  
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
  fileSystem: (() =\u003e {
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

I'm a young developer looking for new opportunities. This simulated OS is my portfolio, designed to showcase my skills.

You can explore this OS to learn more about me. The **File Explorer** (the folder icon in the taskbar) is your main navigation tool.

Here's what you'll find:

*   **Projects**: Detailed descriptions of projects I've worked on.
*   **Images**: A collection of photos from my travels, showcasing my passion for photography.
*   **Documents**: Simple documents about this OS.
*   **Apps**: A showcase of applications I use in my daily development workflow.
*   **About**: In this folder, you'll find my resume, a bit about me, and how to get in touch.

There are also several applications to explore:

*   **Settings**: Customize the OS functionality.
*   **Contact**: Get in touch with me directly.
*   **Terminal**: For those who enjoy a command-line interface.

Each file in the File Explorer will open in its dedicated application. Enjoy your visit!`,
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
- Basic theming support

## [0.9.0] - 2023-12-20

### Added
- Project setup with Next.js and TypeScript
- Initial component library with shadcn/ui`,
        size: 345,
        path: '/Documents/CHANGELOG.md',
        mimeType: 'text/markdown'
      }
    ]
    
    sampleMarkdownFiles.forEach(file =\u003e {
      const newFile = FileSystemUtils.createFile(
        file.id,
        file.name,
        file.path,
        'md',
        file.size,
        file.content,
        FileText
      )
      FileSystemUtils.addToFolder(documents, newFile)
    })

    // Add folders to root
    FileSystemUtils.addToFolder(root, desktop)
    FileSystemUtils.addToFolder(root, documents)
    FileSystemUtils.addToFolder(root, downloads)
    FileSystemUtils.addToFolder(root, images)
    FileSystemUtils.addToFolder(root, about)
    FileSystemUtils.addToFolder(root, projects)
    FileSystemUtils.addToFolder(root, apps)
    
    return {
      root,
      currentPath: '/',
      selectedItems: new Set(),
      clipboardItems: null,
      searchResults: [],
      recentItems: [],
      bookmarks: [],
      trash: []
    }
  })(),
  
  // System
  systemSettings: defaultSettings,
  systemTime: Date.now(),
  isOnline: true,
  batteryLevel: 100,
  wifiStrength: 100,
  
  // Utilities
  clipboard: [],
  recentFiles: [],
  searchHistory: [],
  
  // Desktop
  desktopIcons: ['files', 'browser', 'terminal', 'email'],
  wallpapers: ['/wallpapers/wallpaper1.jpg', '/wallpapers/wallpaper2.jpg'],
  shortcuts: {}
}

// OS Reducer
const osReducer = (state: OSState, action: OSAction): OSState =\u003e {
  switch (action.type) {
    // Authentication \u0026 Screen
    case 'LOGIN':
      // In a real app, you'd verify the password
      return { ...state, isLoggedIn: true, currentScreen: 'desktop', userName: action.payload.userName || state.userName }
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, currentScreen: 'login' }
    case 'LOCK_SCREEN':
      return { ...state, currentScreen: 'lockscreen' }
    case 'UNLOCK_SCREEN':
      // Password verification would go here
      return { ...state, currentScreen: 'desktop' }

    // Window Management
    case 'OPEN_WINDOW': {
      const { app } = action.payload
      const existingWindow = state.windows.find(w =\u003e w.component === app.component)
      
      if (existingWindow) {
        return {
          ...state,
          windows: state.windows.map(w =\u003e 
            w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: state.nextZIndex + 1 } : w
          ),
          activeWindowId: existingWindow.id,
          nextZIndex: state.nextZIndex + 1
        }
      }

      const newWindow: OSWindow = {
        id: `window-${Date.now()}`,
        title: app.name,
        component: app.component,
        isMinimized: false,
        isMaximized: false,
        isFullscreen: false,
        position: { x: 100 + state.windows.length * 20, y: 100 + state.windows.length * 20 },
        size: { width: 800, height: 600 },
        initialSize: { width: 800, height: 600 },
        zIndex: state.nextZIndex + 1,
        isResizable: true,
        isDraggable: true,
        isSnapped: false,
        monitorId: state.activeMonitorId,
        isMovable: true,
        minSize: { width: 300, height: 200 },
        opacity: 1,
        isAlwaysOnTop: false
      }
      
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
        nextZIndex: state.nextZIndex + 1
      }
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w =\u003e w.id !== action.payload.windowId),
        activeWindowId: state.activeWindowId === action.payload.windowId ? null : state.activeWindowId
      }
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e 
          w.id === action.payload.windowId ? { ...w, isMinimized: true } : w
        ),
        activeWindowId: state.activeWindowId === action.payload.windowId ? null : state.activeWindowId
      }
    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e {
          if (w.id === action.payload.windowId) {
            return {
              ...w,
              isMaximized: !w.isMaximized,
              isMinimized: false,
              lastPosition: w.isMaximized ? w.lastPosition : w.position,
              lastSize: w.isMaximized ? w.lastSize : w.size
            }
          }
          return w
        })
      }
    case 'RESTORE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e 
          w.id === action.payload.windowId ? { ...w, isMinimized: false } : w
        ),
        activeWindowId: action.payload.windowId
      }
    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e 
          w.id === action.payload.windowId ? { ...w, position: action.payload.position } : w
        )
      }
    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e 
          w.id === action.payload.windowId ? { ...w, size: action.payload.size } : w
        )
      }
    case 'FOCUS_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =\u003e 
          w.id === action.payload.windowId ? { ...w, zIndex: state.nextZIndex + 1 } : w
        ),
        activeWindowId: action.payload.windowId,
        nextZIndex: state.nextZIndex + 1
      }

    // System Settings
    case 'UPDATE_SYSTEM_SETTINGS':
      return {
        ...state,
        systemSettings: { ...state.systemSettings, ...action.payload.settings }
      }
    case 'UPDATE_BACKGROUND_CONFIG':
      return {
        ...state,
        systemSettings: {
          ...state.systemSettings,
          backgroundConfig: action.payload.backgroundConfig
        }
      }

    // File System
    case 'NAVIGATE_TO':
      return {
        ...state,
        fileSystem: { ...state.fileSystem, currentPath: action.payload.path }
      }

    default:
      return state
  }
}

// OS Context
const OSContext = createContext\u003c{
  state: OSState
  dispatch: React.Dispatch\u003cOSAction\u003e
  settingsManager: SettingsManager
} | undefined\u003e(undefined)

// OS Provider
export const OSProvider = ({ children }: { children: ReactNode }) =\u003e {
  const [state, dispatch] = useReducer(osReducer, initialState)
  const settingsManager = new SettingsManager(state.systemSettings, (newSettings) =\u003e {
    dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', payload: { settings: newSettings } })
  })

  return (
    \u003cOSContext.Provider value={{ state, dispatch, settingsManager }}\u003e
      {children}
    \u003c/OSContext.Provider\u003e
  )
}

// Custom hook to use OS context
export const useOS = () =\u003e {
  const context = useContext(OSContext)
  if (!context) {
    throw new Error('useOS must be used within an OSProvider')
  }
  return context
}