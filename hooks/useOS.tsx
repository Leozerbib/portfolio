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
      'txt': 'notepad',
      'md': 'notepad',
      'html': 'browser',
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

    if (item.type === 'folder') {
      const folder = item as OSFolder
      const newFolder = duplicatedItem as OSFolder
      newFolder.children = new Map()
      
      // Recursively duplicate children
      for (const child of folder.children.values()) {
        const duplicatedChild = FileSystemUtils.duplicateItem(child)
        newFolder.children.set(duplicatedChild.id, duplicatedChild)
      }
      
      newFolder.itemCount = newFolder.children.size
    }

    return duplicatedItem
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
  | { type: 'CREATE_FILE'; payload: { file: Omit<OSFile, 'id' | 'createdAt' | 'modifiedAt'> } }
  | { type: 'DELETE_FILE'; payload: { fileId: string } }
  | { type: 'RENAME_FILE'; payload: { fileId: string; newName: string } }
  | { type: 'MOVE_FILE'; payload: { fileId: string; newParentId: string } }
  | { type: 'SELECT_FILE'; payload: { fileId: string; multiSelect?: boolean } }
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
    { id: 'about', name: 'About', icon: User, component: 'About', category: 'system', isSystemApp: true },
    { id: 'vscode', name: 'VS Code', icon: Code, component: 'VSCode', category: 'development', isSystemApp: false },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, component: 'Portfolio', category: 'productivity', isSystemApp: false },
    { id: 'projects', name: 'Projects', icon: Rocket, component: 'Projects', category: 'productivity', isSystemApp: false },
    { id: 'contact', name: 'Contact', icon: Phone, component: 'Contact', category: 'communication', isSystemApp: false },
    { id: 'settings', name: 'Settings', icon: Settings, component: 'Settings', category: 'system', isSystemApp: true },
    { id: 'files', name: 'File Manager', icon: Folder, component: 'FileManager', category: 'system', isSystemApp: true },
    { id: 'gallery', name: 'Gallery', icon: Image, component: 'Gallery', category: 'entertainment', isSystemApp: false },
    { id: 'music', name: 'Music Player', icon: Music, component: 'MusicPlayer', category: 'entertainment', isSystemApp: false },
    { id: 'video', name: 'Video Player', icon: Video, component: 'VideoPlayer', category: 'entertainment', isSystemApp: false },
  ],
  taskbarApps: ['browser', 'terminal', 'email', 'about', 'vscode', 'files', 'gallery'],
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
      type: 'component' as BackgroundType,
      componentName: 'Aurora',
      componentProps: {
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
      const { itemId, multiSelect } = action.payload
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
      (...args: any[]) => context.dispatch(actionCreator(...args))
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
  createFile: (file: Omit<OSFile, 'id' | 'createdAt' | 'modifiedAt'>) => ({
    type: 'CREATE_FILE' as const,
    payload: { file }
  }),
  deleteFile: (fileId: string) => ({ type: 'DELETE_FILE' as const, payload: { fileId } }),
  renameFile: (fileId: string, newName: string) => ({
    type: 'RENAME_FILE' as const,
    payload: { fileId, newName }
  }),
  moveFile: (fileId: string, newParentId: string) => ({
    type: 'MOVE_FILE' as const,
    payload: { fileId, newParentId }
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
    state.files.find(f => f.id === fileId),
  
  getFilesByParent: (state: OSState, parentId: string | null) => 
    state.files.filter(f => f.parentId === parentId),
  
  getCurrentDirectoryFiles: (state: OSState) => 
    state.files.filter(f => f.parentId === state.currentDirectory),
  
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