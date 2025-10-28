'use client'

import { OSWindow, useOS } from '@/hooks/useOS'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { TerminalApp } from '../app/TerminalApp'
import { EmailApp } from '../app/EmailApp'
import SettingsApp from '../app/SettingsApp'
import FileExplorerApp from '../app/FileExplorerApp'
import GalleryApp from '../app/GalleryApp'
import { MarkdownApp } from '../app/MarkdownApp'
import { cn } from '@/lib/utils'
import { BrowserApp } from '../app/BrowserApp'

interface WindowContentProps {
  window: OSWindow
}

export function WindowContent({ window }: WindowContentProps) {
  const { state } = useOS()
  
  // Guard against uninitialized file system
  if (!state.fileSystem || !state.fileSystem.root || !state.fileSystem.root.children) {
    console.log('WindowContent - File system not yet initialized')
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading file system...</p>
        </div>
      </div>
    )
  }
  
  // Debug the entire file system structure
  console.log('WindowContent - Full fileSystem:', state.fileSystem)
  console.log('WindowContent - Root:', state.fileSystem.root)
  console.log('WindowContent - Root children:', state.fileSystem.root.children)
  console.log('WindowContent - Available folders:', Array.from(state.fileSystem.root.children.keys()))
  
  // Extract project files from the file system
  const projectsFolder = state.fileSystem.root.children.get('projects')
  console.log('WindowContent - Projects folder:', projectsFolder)
  
  if (projectsFolder && 'children' in projectsFolder) {
    console.log('WindowContent - Projects folder children:', Array.from(projectsFolder.children.values()))
  }
  
  const projects = projectsFolder && 'children' in projectsFolder 
    ? Array.from(projectsFolder.children.values()).map(file => ({
        id: file.id,
        name: file.name,
        description: file.name.replace('.tsx', '').replace('.html', ''),
        path: file.path,
        componentId: (file as any).componentId,
        type: (file as any).type === 'component' ? 'component' as const : 'html' as const,
        htmlContent: (file as any).content
      })) 
    : []
  
  console.log('WindowContent - Mapped projects:', projects)

  const renderContent = () => {
    switch (window.component) {
      case 'Browser':
        return <BrowserApp projects={projects} />
      case 'Terminal':
        return <TerminalApp />
      case 'Email':
        return <EmailApp />
      case 'Settings':
        return <SettingsApp />
      case 'FileManager':
        return <FileExplorerApp />
      case 'Gallery':
        return <GalleryApp windowId={window.id} />
      case 'MarkdownApp':
        return <MarkdownApp />
      default:
        return (
          <Card className="h-full border-0 shadow-none">
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center space-y-4 max-w-md">
                <div className="text-6xl mb-4 opacity-50">🚧</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Application Not Found
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The application <Badge variant="secondary" className="mx-1">{window.component}</Badge> 
                    is not implemented yet.
                  </p>
                </div>
                <Alert className="mt-6">
                  <AlertDescription className="text-xs">
                    This is a placeholder for future application development.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className={cn(
      "h-full w-full overflow-hidden",
      "bg-background/50 backdrop-blur-sm"
    )}>
      {renderContent()}
    </div>
  )
}