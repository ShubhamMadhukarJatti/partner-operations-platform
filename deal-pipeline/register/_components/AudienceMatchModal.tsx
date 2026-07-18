'use client'

import React, { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import {
  AudienceMatchComplete,
  BothProfilesNeededBox,
  CompleteYourProfileBox,
  WaitingForPartnerBox
} from '../../../explore-2/_components/AudienceMatchInfoBoxes'

interface AudienceMatchModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  organization: any
  currentOrganization: any
}

export const AudienceMatchModal: React.FC<AudienceMatchModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  organization,
  currentOrganization
}) => {
  const [personaMatchData, setPersonaMatchData] = useState<any>(null)
  const [personaMatchLoading, setPersonaMatchLoading] = useState(false)
  const [personaMatchError, setPersonaMatchError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (!organization?.id || !isOpen) return

    setPersonaMatchLoading(true)
    setPersonaMatchError(null)

    fetch(`/api/persona/persona-match/${organization.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch persona match')
        return res.json()
      })
      .then((data) => {
        setPersonaMatchData(data)
        setPersonaMatchLoading(false)
      })
      .catch((err) => {
        setPersonaMatchError(err.message)
        setPersonaMatchLoading(false)
      })
  }, [organization?.id, isOpen])

  const renderContent = () => {
    if (personaMatchLoading) {
      return (
        <div className='flex animate-pulse flex-col gap-6 rounded-xl bg-white p-6'>
          <div className='flex items-start gap-3'>
            <div className='mt-1'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200' />
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <div className='h-4 w-2/3 rounded bg-gray-200' />
              <div className='h-3 w-1/2 rounded bg-gray-200' />
            </div>
          </div>
          <div className='h-3 w-3/4 rounded bg-gray-200' />
        </div>
      )
    }

    if (personaMatchError) {
      return <div>Error loading audience match: {personaMatchError}</div>
    }

    if (!personaMatchData) return null

    const currentStatus = personaMatchData.currentOrgPersonaStatus
    const targetStatus = personaMatchData.targetOrgPersonaStatus

    if (currentStatus === true && targetStatus === true) {
      return (
        <AudienceMatchComplete
          orgName={organization?.name}
          personaMatch={personaMatchData.personaMatch}
        />
      )
    } else if (currentStatus === false && targetStatus === true) {
      return (
        <CompleteYourProfileBox
          orgName={organization?.name}
          currentOrganization={currentOrganization}
          organization={organization}
          currentStatus={currentStatus}
          targetStatus={targetStatus}
        />
      )
    } else if (currentStatus === true && targetStatus === false) {
      return (
        <WaitingForPartnerBox
          orgName={organization?.name}
          currentOrganization={currentOrganization}
          organization={organization}
        />
      )
    } else if (currentStatus === false && targetStatus === false) {
      return (
        <BothProfilesNeededBox
          orgName={organization?.name}
          currentOrganization={currentOrganization}
          organization={organization}
          currentStatus={currentStatus}
          targetStatus={targetStatus}
        />
      )
    }

    return null
  }

  const canContinue =
    personaMatchData?.currentOrgPersonaStatus === true &&
    personaMatchData?.targetOrgPersonaStatus === true

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Audience Match Check</DialogTitle>
          <DialogDescription>
            Checking audience compatibility between organizations
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>{renderContent()}</div>
        <div className='mt-4 flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='rounded-lg border px-4 py-2 text-sm font-medium'
          >
            Close
          </button>
          {canContinue && (
            <button
              onClick={onContinue}
              className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white'
            >
              Continue Submission
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
