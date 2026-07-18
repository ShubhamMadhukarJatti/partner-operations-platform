'use client'

import React from 'react'

// Template component to prevent layout re-renders
// This creates a new instance on navigation but keeps the layout stable
export default function OfflinePartnersTemplate({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
