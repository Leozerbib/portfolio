'use client'

import { OSWindow } from '@/hooks/useOS'
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

interface WindowContentProps {
  window: OSWindow
}

export function WindowContent({ window }: WindowContentProps) {
  const renderContent = () => {
    switch (window.component) {
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