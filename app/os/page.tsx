'use client'

import { OSProvider, useOS } from '@/hooks/useOS'
import { LoginScreen } from '@/components/os/screen/LoginScreen'
import { DesktopScreen } from '@/components/os/screen/DesktopScreen'

function OSInterface() {
  const { state } = useOS()

  return (
    <div className="h-screen w-full overflow-hidden bg-background relative">
      {!state.isLoggedIn ? (
        <LoginScreen />
      ) : (
        <DesktopScreen />
      )}
    </div>
  )
}

export default function OSPage() {
  return (
    <OSProvider>
      <OSInterface />
    </OSProvider>
  )
}