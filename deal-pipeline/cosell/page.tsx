'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Cosell redirects to the main deal pipeline page
export default function CosellPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/deal-pipeline')
  }, [router])

  return null
}
