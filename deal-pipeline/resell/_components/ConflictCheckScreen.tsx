'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Shield, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

interface Conflict {
  id: string
  title: string
  count: number
  isExpanded?: boolean
  details?: {
    accountName?: string
    owner?: string
    stage?: string
    lastActivity?: string
    region?: string
  }
  resolutionText?: string
}

interface ConflictCheckScreenProps {
  conflicts: Conflict[]
  onDismiss: (conflictId: string) => void
  onSubmitAnyway: () => void
  onDiscard: () => void
}

export default function ConflictCheckScreen({
  conflicts,
  onDismiss,
  onSubmitAnyway,
  onDiscard
}: ConflictCheckScreenProps) {
  const [expandedConflicts, setExpandedConflicts] = useState<Set<string>>(
    new Set([conflicts[0]?.id].filter(Boolean))
  )

  const toggleConflict = (conflictId: string) => {
    const newExpanded = new Set(expandedConflicts)
    if (newExpanded.has(conflictId)) {
      newExpanded.delete(conflictId)
    } else {
      newExpanded.add(conflictId)
    }
    setExpandedConflicts(newExpanded)
  }

  const activeConflicts = conflicts.filter(
    (c) => !c.isExpanded || expandedConflicts.has(c.id)
  )

  return (
    <div className='w-full'>
      <div className='mb-6 rounded-2xl border bg-white p-8'>
        <div className='mb-6 flex items-center gap-2'>
          <Shield size={20} className='text-gray-800' />
          <span className='text-lg font-semibold text-[#1A202C]'>
            Conflict Checks ({activeConflicts.length})
          </span>
        </div>

        <div className='space-y-4'>
          {conflicts.map((conflict) => {
            const isExpanded = expandedConflicts.has(conflict.id)
            const isDismissed = conflict.isExpanded === false

            if (isDismissed) return null

            return (
              <Collapsible
                key={conflict.id}
                open={isExpanded}
                onOpenChange={() => toggleConflict(conflict.id)}
                className='rounded-lg border border-gray-200'
              >
                <div className='flex items-center justify-between p-4'>
                  <CollapsibleTrigger className='flex flex-1 items-center gap-3 text-left'>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                    <div className='flex-1'>
                      <span className='font-medium text-[#1A202C]'>
                        {conflict.title}
                      </span>
                      <span className='ml-2 text-sm text-gray-500'>
                        ({conflict.count} Conflict
                        {conflict.count > 1 ? 's' : ''})
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDismiss(conflict.id)
                    }}
                    className='ml-2 rounded p-1 hover:bg-gray-100'
                    aria-label='Dismiss conflict'
                  >
                    <X size={16} className='text-gray-400' />
                  </button>
                </div>

                <CollapsibleContent>
                  <div className='border-t border-gray-200 px-4 pb-4 pt-4'>
                    {conflict.details && (
                      <div className='mb-4 rounded-lg bg-gray-50 p-4'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <span className='text-gray-500'>Account Name:</span>
                            <p className='font-medium text-[#1A202C]'>
                              {conflict.details.accountName}
                            </p>
                          </div>
                          <div>
                            <span className='text-gray-500'>Owner:</span>
                            <p className='font-medium text-[#1A202C]'>
                              {conflict.details.owner}
                            </p>
                          </div>
                          <div>
                            <span className='text-gray-500'>Stage:</span>
                            <p>
                              <span className='inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800'>
                                {conflict.details.stage}
                              </span>
                            </p>
                          </div>
                          <div>
                            <span className='text-gray-500'>
                              Last Activity:
                            </span>
                            <p className='font-medium text-[#1A202C]'>
                              {conflict.details.lastActivity}
                            </p>
                          </div>
                          <div className='col-span-2'>
                            <span className='text-gray-500'>Region:</span>
                            <p className='font-medium text-[#1A202C]'>
                              {conflict.details.region}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {conflict.resolutionText && (
                      <div className='mb-4'>
                        <p className='mb-2 text-sm font-medium text-[#1A202C]'>
                          How to resolve?
                        </p>
                        <p className='text-sm text-gray-600'>
                          {conflict.resolutionText}
                        </p>
                        {conflict.id === 'account-exists' && (
                          <div className='mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4'>
                            <p className='text-sm text-gray-600'>
                              You can link the CRM and the system automatically
                              checks if this is the same customer.
                            </p>
                            <p className='text-sm font-medium text-primary-blue'>
                              Linked to CRM
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>

        <div className='mt-8 flex gap-4'>
          <Button
            variant='outline'
            className='flex-1 rounded-lg border-gray-300 text-gray-700'
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button
            variant='primary'
            className='flex-1 rounded-lg font-semibold'
            onClick={onSubmitAnyway}
          >
            Submit Anyway
          </Button>
        </div>
      </div>
    </div>
  )
}
