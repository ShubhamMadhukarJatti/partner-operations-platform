// src\app\(app)\(dashboard-pages)\data-pipeline\page.tsx
'use client'

import { Suspense } from 'react'

import { FieldMappingContent } from './FieldMappingContent'

export default function FieldMappingPage() {
  return (
    <Suspense fallback={<div>Loading mapping...</div>}>
      <FieldMappingContent />
    </Suspense>
  )
}
