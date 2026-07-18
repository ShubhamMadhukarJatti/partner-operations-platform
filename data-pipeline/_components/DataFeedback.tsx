'use client'

import { useState } from 'react'
import { Database, FileText, ThumbsDown, ThumbsUp, Upload } from 'lucide-react'

export type DataFeedbackProps = {
  onConnectDifferentCRM?: () => void
  onAddManualData?: () => void
}

export default function DataFeedback({
  onConnectDifferentCRM,
  onAddManualData
}: DataFeedbackProps) {
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)

  return <></>
}
