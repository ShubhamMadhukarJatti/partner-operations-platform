'use client'

import { useEffect, useState } from 'react'
import { Loader2, PencilLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useJointPitch, useSaveJointPitch } from '../../joint-pitch'

type Props = {
  partnerOrgId: string
}

export function JointPitchCard({ partnerOrgId }: Props) {
  const { data, isLoading, isError, error, isFetched } = useJointPitch(
    partnerOrgId || null
  )
  const saveMutation = useSaveJointPitch(partnerOrgId || null)

  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (data?.body) setDraft(data.body)
  }, [data?.body])

  const showComposer = isFetched && !isLoading && (data === null || isEditing)

  const startEdit = () => {
    setDraft(data?.body ?? '')
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setDraft(data?.body ?? '')
  }

  const handleSave = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    saveMutation.mutate(trimmed, {
      onSuccess: () => {
        setIsEditing(false)
      }
    })
  }

  if (isLoading && !isFetched) {
    return (
      <div className='rounded-[14px] border border-[#F3F4F6] bg-white px-5 pb-5 pt-[21px]'>
        <div className='flex items-center gap-2 text-sm text-[#64738B]'>
          <Loader2 className='h-4 w-4 animate-spin' aria-hidden />
          Loading joint pitch…
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm text-[#B42318]'>
        {error instanceof Error ? error.message : 'Could not load joint pitch.'}
      </div>
    )
  }

  return (
    <div className='rounded-[14px] border border-[#F3F4F6] bg-white px-5 pb-5 pt-[21px]'>
      <div className='mb-2.5 flex items-center justify-between gap-4'>
        <h2 className='text-[15px] font-semibold leading-[22px] tracking-[-0.2344px] text-[#1A1A2E]'>
          Joint Pitch
        </h2>
        {!showComposer && data ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-auto gap-1.5 px-0 py-0 text-xs font-medium leading-4 text-[#6B4FBB] hover:bg-transparent hover:text-[#5a3fa0]'
            onClick={startEdit}
          >
            <PencilLine className='h-3 w-3' strokeWidth={1} />
            Edit message
          </Button>
        ) : null}
      </div>

      {showComposer ? (
        <div className='flex flex-col gap-3'>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='Write the joint pitch for this partner…'
            className='min-h-[140px] resize-y rounded-[10px] border border-[#EEEEEE] bg-[#F8F9FB] text-[13px] leading-[21px] text-[#36455C]'
            disabled={saveMutation.isPending}
          />
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              type='button'
              size='sm'
              className='rounded-[10px] bg-[#5B76FF] text-white hover:bg-[#4a66e8]'
              disabled={saveMutation.isPending || !draft.trim()}
              onClick={handleSave}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </Button>
            {data && isEditing ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='rounded-[10px]'
                disabled={saveMutation.isPending}
                onClick={cancelEdit}
              >
                Cancel
              </Button>
            ) : null}
          </div>
          {saveMutation.isError ? (
            <p className='text-sm text-[#B42318]'>
              {saveMutation.error instanceof Error
                ? saveMutation.error.message
                : 'Save failed.'}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <div className='rounded-[10px] border border-[#EEEEEE] bg-[#F8F9FB] px-[17px] py-[17px]'>
            <p className='whitespace-pre-wrap text-[13px] font-normal leading-[21px] tracking-[-0.0762em] text-[#36455C]'>
              {data?.body}
            </p>
          </div>
          <p className='mt-2.5 text-[11px] font-normal leading-4 tracking-[0.0645em] text-[#64738D]'>
            Edited by {data?.lastEditedBy ?? '—'} —{' '}
            {data?.lastEditedRelative ?? '—'}
          </p>
        </>
      )}
    </div>
  )
}
