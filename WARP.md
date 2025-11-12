# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15-based portfolio website featuring an interactive OS simulation. The project uses the App Router and includes a 3D MacBook scene built with React Three Fiber that transitions into a fully functional OS environment with window management, file systems, and applications.

## Build & Development Commands

### Core Commands
- **Development**: `pnpm dev` - Starts Next.js dev server on http://localhost:3000
- **Build**: `pnpm build` - Production build with Turbopack enabled
- **Production**: `pnpm start` - Runs production build
- **Lint**: `pnpm lint` - Runs ESLint

### Notes
- This project uses **pnpm** as the package manager
- Build uses Turbopack (`--turbopack` flag in build script)
- No dedicated test command is configured in package.json
- TypeScript strict mode is enabled (`tsconfig.json`)

## Architecture Overview

### High-Level Structure

The application has two main modes:

1. **Landing Page** (`/`) - 3D MacBook scene
2. **OS Environment** (`/os`) - Simulated operating system

### Key Architectural Patterns

#### 1. OS State Management
The OS simulation uses a complex reducer pattern managed through `hooks/useOS.tsx`:
- **OSState** contains windows, file system, apps, notifications, settings, etc.
- **OSProvider** wraps the OS page and provides context
- **useOS()** hook exposes state and dispatch actions
- State is managed through discrete actions (e.g., `OPEN_WINDOW`, `CREATE_FILE`, `NAVIGATE_TO`)

#### 2. File System Architecture
A virtual file system is implemented with:
- **OSFolder** and **OSFile** types with Map-based children storage
- **FileSystemUtils** class provides operations (create, delete, move, search, sort)
- Initial file system includes pre-populated folders: Desktop, Documents, Downloads, Images, About, Projects
- Gallery images and markdown files are pre-loaded with metadata

#### 3. Window Management
Advanced window system with features like:
- Multiple windows with z-index management
- Minimize, maximize, fullscreen, snap-to-grid
- Window groups and multi-monitor support (simulated)
- Drag and resize with boundaries
- Each window references an app component by string identifier

#### 4. Application System
Apps are registered in `OSState.apps` with:
- Unique ID, name, icon (Lucide), component name
- Category classification (productivity, entertainment, system, etc.)
- Component mapping happens in `WindowContent.tsx` which dynamically renders the correct component

#### 5. Settings Management
Dual-layer settings system:
- **EnhancedSystemSettings** (new) in `lib/settings.ts` with structured config
- **OSSystemSettings** (legacy compatibility) extends the enhanced version
- Supports multiple background types: monocolor, image, gradient, component
- SettingsManager class handles merging and validation

### Component Organization

```
components/
├── 3d/              # Three.js/R3F components for landing page
│   ├── MacBookScene.tsx    # Main 3D scene orchestrator
│   ├── MacBook.tsx          # 3D MacBook model
│   ├── Scene.tsx            # Canvas wrapper
│   ├── CameraController.tsx # Camera animations
│   └── TableLamp.tsx        # Additional 3D object
├── os/              # OS simulation components
│   ├── app/         # Application components (Browser, Terminal, FileExplorer, etc.)
│   ├── background/  # Various background renderers
│   ├── projet/      # Project showcase components
│   ├── screen/      # Login and Desktop screens
│   ├── task/        # Taskbar, TopBar, StartMenu
│   └── window/      # Window management UI
└── ui/              # shadcn/ui components
```

### Important File Locations

- **OS Hook**: `hooks/useOS.tsx` (2000+ lines, core OS logic)
- **Settings**: `lib/settings.ts` (settings types and defaults)
- **Path Alias**: `@/*` maps to project root via `tsconfig.json`
- **Global Styles**: `app/globals.css`
- **Theme Provider**: `components/ThemeProvider.tsx`

### Route Structure

- `/` - Landing page with 3D MacBook
- `/os` - OS simulation (client component with OSProvider)

## Code Patterns & Conventions

### State Management
- Use `useOS()` hook within OS components, never access OSContext directly
- Dispatch actions via the reducer, avoid direct state mutation
- File system operations must use `FileSystemUtils` static methods

### Component Patterns
- OS apps should be in `components/os/app/` and registered in initial state
- New windows map to app components via the `component` field matching
- Use Lucide React icons throughout the project

### Styling
- Tailwind CSS v4 with custom color variables
- Font family variables: `--font-geist-sans`, `--font-geist-mono`, `--font-pixer`
- Theme support via `next-themes` ThemeProvider
- Use `cn()` utility from `lib/utils` for conditional classes

### TypeScript
- Strict mode enabled
- `@typescript-eslint/no-explicit-any` is disabled in ESLint config
- Target ES2017, use ESNext modules
- Prefer interfaces over types for object shapes

### File System Operations
When adding files/folders to the virtual OS:
- Create using `FileSystemUtils.createFile()` or `FileSystemUtils.createFolder()`
- Add to parent with `FileSystemUtils.addToFolder()`
- Always update `modifiedAt` timestamps
- Use proper MIME types and icons

### Window Operations
- Always check for existing window before creating a new one
- Use `state.nextZIndex` and increment for proper layering
- Clamp window sizes to container bounds (`.baba` element)
- Save `lastPosition` and `lastSize` for restore operations

## Common Development Scenarios

### Adding a New OS Application
1. Create component in `components/os/app/YourApp.tsx`
2. Add app definition to `initialState.apps` in `hooks/useOS.tsx`
3. Add app ID to `taskbarApps` if it should appear in taskbar
4. Update WindowContent.tsx to map component name to actual component
5. Optionally add desktop icon by updating `desktopIcons` array

### Modifying File System Content
1. Locate the file system initialization in `hooks/useOS.tsx` (around line 717)
2. Use FileSystemUtils to create new files/folders
3. Add files to appropriate parent folders before returning the tree
4. Ensure paths match the folder hierarchy

### Working with 3D Scene
- Three.js components use `@react-three/fiber` and `@react-three/drei`
- Scene is wrapped in `<Canvas>` via the Scene component
- Camera animations handled by CameraController
- Models reference local files or use primitive geometries

### Managing Settings
- Update settings via `UPDATE_SYSTEM_SETTINGS` action
- Background changes use `UPDATE_BACKGROUND_CONFIG` action
- Settings persist in OSState.systemSettings
- Use SettingsManager.merge() for safe partial updates

## Technical Dependencies

### Core Framework
- Next.js 15.5.6 (App Router, Turbopack build)
- React 19.1.0
- TypeScript 5

### UI Libraries
- Tailwind CSS 4 with PostCSS
- Radix UI primitives (20+ components)
- shadcn/ui component patterns
- Lucide React icons

### 3D Graphics
- Three.js 0.180.0
- @react-three/fiber 9.4.0
- @react-three/drei 10.7.6
- @react-three/postprocessing 3.0.4

### Rich Text & Forms
- TipTap (full editor suite with 30+ extensions)
- react-hook-form 7.65.0
- Zod 4.1.12 (validation)

### Animation
- motion (Framer Motion successor)
- GSAP 3.13.0
- anime.js 4.2.2
- @react-spring (core, web, three)

### Utilities
- date-fns 4.1.0
- fuse.js 7.1.0 (fuzzy search)
- class-variance-authority
- clsx + tailwind-merge

## Important Constraints

### Next.js Image Configuration
- `unoptimized: true` - local images don't require optimization
- Remote pattern allows all HTTPS sources
- Custom quality levels defined

### Three.js Transpilation
- `transpilePackages: ['three']` in next.config.ts
- Required for proper SSR handling

### Client Components
- Most OS and 3D components must be client components (`'use client'`)
- Server components only used for layouts and static pages

## Windows Development Notes
- Project path: `C:\Users\bibz\Documents\Perso\Dev\portfolio`
- Uses PowerShell as default shell
- Ensure line endings are handled correctly (CRLF vs LF)
- Some file paths in code use forward slashes (cross-platform compatibility)
