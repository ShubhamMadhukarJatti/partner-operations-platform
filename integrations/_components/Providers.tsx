'use client'

// Mark this file as a Client Component
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
