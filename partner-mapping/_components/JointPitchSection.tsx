'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCreatePartnerActivity } from '@/http-hooks/partner-activities'
import { RootState } from '@/redux/store'
import { formatDistanceToNow } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'

import { useJointPitch, useSaveJointPitch } from '../api'

function messageFromMutationError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const m = (error as { message?: unknown }).message
    if (typeof m === 'string' && m.trim()) return m
  }
  if (typeof error === 'string' && error.trim()) return error
  return 'Failed to save joint pitch'
}

function editedFooterLine(
  lastEditedBy: string | null | undefined,
  lastEditedAt: string | null | undefined
): string | null {
  const who = lastEditedBy?.trim() || 'Someone'
  if (!lastEditedAt?.trim()) {
    return `Edited by ${who}`
  }
  try {
    const d = new Date(lastEditedAt)
    if (Number.isNaN(d.getTime())) {
      return `Edited by ${who}`
    }
    const relative = formatDistanceToNow(d, { addSuffix: true })
    return `Edited by ${who} — ${relative}`
  } catch {
    return `Edited by ${who}`
  }
}

type JointPitchSectionProps = {
  partnerOrgId: string
  dealId?: string | null
}

export function JointPitchSection({
  partnerOrgId,
  dealId
}: JointPitchSectionProps) {
  const numericId = useMemo(() => {
    const n = Number(partnerOrgId)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [partnerOrgId])

  const { data, isLoading, isError, error, refetch } = useJointPitch(
    numericId,
    dealId
  )
  const saveMutation = useSaveJointPitch(numericId)
  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const createActivityMutation = useCreatePartnerActivity(numericId, dealId)

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const hasPitch = Boolean(data?.pitch)

  useEffect(() => {
    if (isLoading || isEditing) return
    if (data?.pitch != null) {
      setDraft(data.pitch)
    } else if (data === null) {
      setDraft('')
    }
  }, [data, isLoading, isEditing])

  const handleCancelEdit = () => {
    setIsEditing(false)
    setDraft(data?.pitch ?? '')
  }

  const handleSave = () => {
    if (numericId == null) return

    const pitchToSave = draft.trim()

    const payload = {
      partnerOrgId: numericId,
      pitch: pitchToSave,
      dealId
    }
    saveMutation.mutate(payload, {
      onSuccess: () => {
        showCustomToast(
          'Success',
          pitchToSave ? 'Joint pitch saved' : 'Joint pitch cleared',
          'success',
          5000
        )
        setIsEditing(false)
        if (numericId) {
          createActivityMutation.mutate({
            partnerOrgId: numericId,
            title: pitchToSave ? 'Updated Joint Pitch' : 'Cleared Joint Pitch',
            description: pitchToSave
              ? 'Updated the joint pitch details.'
              : 'Cleared the joint pitch.',
            activityType: 'joint_pitch_update',
            userName: org?.name || 'Your team',
            dealId: dealId || ''
          })
        }
      },
      onError: (e) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('[JointPitch] save failed', e)
        }
        showCustomToast('Error', messageFromMutationError(e), 'error', 5000)
      }
    })
  }

  if (numericId == null) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-[21px]'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Joint Pitch
        </h2>
        <p className='mt-2 text-sm text-[#A91B22]'>
          Invalid partner organization. This section is unavailable.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-[21px]'>
        <div className='mb-2.5 flex items-center justify-between'>
          <Skeleton className='h-5 w-28' />
        </div>
        <Skeleton className='min-h-[100px] w-full rounded-[10px]' />
        <Skeleton className='mt-2.5 h-3 w-52' />
      </section>
    )
  }

  if (isError) {
    return (
      <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-[21px]'>
        <div className='mb-2.5 flex items-center justify-between'>
          <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
            Joint Pitch
          </h2>
        </div>
        <p className='text-sm text-[#A91B22]'>
          {error instanceof Error
            ? error.message
            : 'Could not load joint pitch.'}
        </p>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-3'
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </section>
    )
  }

  const showComposer = !hasPitch || isEditing
  const footer = data
    ? editedFooterLine(data.lastEditedBy, data.lastEditedAt)
    : null

  return (
    <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-[21px]'>
      <div className='mb-2.5 flex items-center justify-between gap-2'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Joint Pitch
        </h2>
        {hasPitch && !isEditing ? (
          <button
            type='button'
            className='flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#6B4FBB]'
            onClick={() => {
              setIsEditing(true)
              setDraft(data?.pitch ?? '')
            }}
          >
            <Pencil className='size-3' aria-hidden />
            Edit message
          </button>
        ) : null}
      </div>

      {showComposer ? (
        <div className='space-y-3'>
          {!hasPitch ? (
            <p className='text-xs leading-4 text-[#64748B]'>
              Add a joint pitch for this co-sell workspace.
            </p>
          ) : null}
          <Textarea
            id='joint-pitch-input'
            aria-label='Joint pitch'
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={saveMutation.isPending}
            className='min-h-[120px] rounded-[10px] border border-[#EEE] bg-[#F8F9FB] text-[13px] leading-[21px] tracking-[-0.076px] text-[#36455C] focus-visible:ring-[#6B4FBB]'
            placeholder='Write your joint pitch…'
          />
          <div className='flex flex-wrap items-center justify-end gap-2'>
            {isEditing && hasPitch ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                disabled={saveMutation.isPending}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type='button'
              variant='primary'
              size='sm'
              disabled={saveMutation.isPending}
              onClick={handleSave}
            >
              {saveMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className='rounded-[10px] border border-[#EEE] bg-[#F8F9FB] p-4'>
            <p className='whitespace-pre-wrap text-[13px] leading-[21px] tracking-[-0.076px] text-[#36455C]'>
              {data?.pitch}
            </p>
          </div>
          {footer ? (
            <p className='mt-2.5 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#64738D]'>
              {footer}
            </p>
          ) : null}
        </>
      )}
    </section>
  )
}
