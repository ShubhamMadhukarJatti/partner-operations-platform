'use client'

import React from 'react'

// Template component to prevent layout re-renders during partnership navigation
// This ensures smooth transitions between different partner pages
export default function PartnershipTemplate({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
