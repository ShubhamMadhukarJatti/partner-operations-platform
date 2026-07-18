'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  useAgreedNextSteps,
  useCreateAgreedNextStep,
  useDeleteAgreedNextStep,
  useUpdateAgreedNextStep
} from '@/http-hooks/agreed-next-steps'
import { useCreatePartnerActivity } from '@/http-hooks/partner-activities'
import { RootState } from '@/redux/store'
import {
  AGREED_NEXT_STEPS_PAGE_SIZE,
  AgreedNextStep,
  AgreedNextStepPriority
} from '@/services/account-mapping-agreed-next-steps'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'

import { formatDate } from '@/lib/dates'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  orgId: number | null
  dealId?: string | null
}

function formatStepDueLabel(dueDate: string): string {
  if (!dueDate?.trim()) return ''
  try {
    return formatDate(dueDate, 'MMM d, y')
  } catch {
    return dueDate
  }
}

function priorityDisplayLabel(priority: string): string | null {
  const p = priority?.toUpperCase()
  if (p === 'HIGH') return 'High'
  if (p === 'MEDIUM') return 'Medium'
  if (p === 'LOW') return null
  return priority?.trim() || null
}

function shouldEmphasizePriority(priority: string): 'high' | 'medium' | null {
  const p = priority?.toUpperCase()
  if (p === 'HIGH') return 'high'
  if (p === 'MEDIUM') return 'medium'
  return null
}

function normalizePriority(p: string): AgreedNextStepPriority {
  const u = p?.toUpperCase()
  if (u === 'HIGH' || u === 'MEDIUM' || u === 'LOW') return u
  return 'LOW'
}

const PRIORITY_OPTIONS: { value: AgreedNextStepPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
]

const SKELETON_ROW_COUNT = 4

function AgreedNextStepsSkeleton() {
  return (
    <ul className='space-y-0' aria-hidden>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <li
          key={i}
          className={cn(
            'flex gap-3 py-2.5',
            i < SKELETON_ROW_COUNT - 1 && 'border-b border-[#A0B5D3]'
          )}
        >
          <Skeleton className='mt-0.5 size-[18px] shrink-0 rounded border border-[#C4CDD5]/40 bg-[#EEF1F6]' />
          <div className='min-w-0 flex-1 space-y-2 py-0.5'>
            <Skeleton className='h-3.5 w-[88%] max-w-[320px] rounded-sm bg-[#EEF1F6]' />
            <Skeleton className='h-3 w-[58%] max-w-[220px] rounded-sm bg-[#EEF1F6]' />
          </div>
          <div className='flex shrink-0 gap-1.5 pt-0.5'>
            <Skeleton className='size-8 rounded-md bg-[#EEF1F6]' />
            <Skeleton className='size-8 rounded-md bg-[#EEF1F6]' />
          </div>
        </li>
      ))}
    </ul>
  )
}

type EditDraft = {
  id: number
  orgId: number
  isCompleted: boolean
  title: string
  description: string
  owner: string
  priority: AgreedNextStepPriority
  dueDate: string
}

export function AgreedNextStepsSection({ orgId, dealId }: Props) {
  const { data, isLoading, isError, error, refetch } = useAgreedNextSteps(
    orgId,
    {
      page: 0,
      size: AGREED_NEXT_STEPS_PAGE_SIZE,
      dealId
    }
  )
  const createMutation = useCreateAgreedNextStep()
  const updateMutation = useUpdateAgreedNextStep()
  const deleteMutation = useDeleteAgreedNextStep()

  const searchParams = useSearchParams()
  const partnerOrgId =
    searchParams.get('partnerOrgId') ||
    searchParams.get('partner') ||
    searchParams.get('partnerId')
  const partnerOrgIdNum = partnerOrgId ? Number(partnerOrgId) : null

  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const createActivityMutation = useCreatePartnerActivity(
    partnerOrgIdNum,
    dealId
  )

  const [addOpen, setAddOpen] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formOwner, setFormOwner] = useState('')
  const [formPriority, setFormPriority] =
    useState<AgreedNextStepPriority>('LOW')
  const [formDueDate, setFormDueDate] = useState('')

  const [editDraft, setEditDraft] = useState<EditDraft | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AgreedNextStep | null>(null)

  useEffect(() => {
    if (isError && error?.message) {
      showCustomToast('Error', error.message, 'error', 5000)
    }
  }, [isError, error])

  const steps = data?.content ?? []

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormOwner('')
    setFormPriority('LOW')
    setFormDueDate('')
  }

  const handleAddOpenChange = (open: boolean) => {
    setAddOpen(open)
    if (!open) resetForm()
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) {
      showCustomToast(
        'Error',
        'Organization context is missing. Try refreshing the page.',
        'error',
        5000
      )
      return
    }
    const title = formTitle.trim()
    if (!title) {
      showCustomToast('Error', 'Title is required', 'error', 4000)
      return
    }
    if (!formDueDate.trim()) {
      showCustomToast('Error', 'Due date is required', 'error', 4000)
      return
    }

    createMutation.mutate(
      {
        orgId,
        title,
        description: formDescription.trim(),
        owner: formOwner.trim(),
        priority: formPriority,
        dueDate: formDueDate.trim(),
        isCompleted: false,
        dealId: dealId
      },
      {
        onSuccess: () => {
          showCustomToast('Success', 'Step added', 'success', 4000)
          handleAddOpenChange(false)
          if (partnerOrgIdNum) {
            createActivityMutation.mutate({
              partnerOrgId: partnerOrgIdNum,
              title: `Added next step: ${title}`,
              description: `Assigned to ${formOwner.trim() || 'Unassigned'}, priority: ${formPriority}.`,
              activityType: 'next_step_create',
              userName: org?.name || 'Your team',
              dealId: dealId || ''
            })
          }
        }
      }
    )
  }

  const openEdit = (step: AgreedNextStep) => {
    setEditDraft({
      id: step.id,
      orgId: step.orgId,
      isCompleted: step.isCompleted,
      title: step.title,
      description: step.description ?? '',
      owner: step.owner ?? '',
      priority: normalizePriority(step.priority),
      dueDate: step.dueDate ?? ''
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDraft) return
    const title = editDraft.title.trim()
    if (!title) {
      showCustomToast('Error', 'Title is required', 'error', 4000)
      return
    }
    if (!editDraft.dueDate.trim()) {
      showCustomToast('Error', 'Due date is required', 'error', 4000)
      return
    }

    updateMutation.mutate(
      {
        id: editDraft.id,
        payload: {
          orgId: editDraft.orgId,
          title,
          description: editDraft.description.trim(),
          owner: editDraft.owner.trim(),
          priority: editDraft.priority,
          dueDate: editDraft.dueDate.trim(),
          isCompleted: editDraft.isCompleted,
          dealId: dealId
        }
      },
      {
        onSuccess: () => {
          showCustomToast('Success', 'Step updated', 'success', 4000)
          setEditDraft(null)
          if (partnerOrgIdNum) {
            createActivityMutation.mutate({
              partnerOrgId: partnerOrgIdNum,
              title: `Updated next step: ${title}`,
              description: `Task details or ownership updated.`,
              activityType: 'next_step_update',
              userName: org?.name || 'Your team',
              dealId: dealId || ''
            })
          }
        }
      }
    )
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        if (partnerOrgIdNum) {
          createActivityMutation.mutate({
            partnerOrgId: partnerOrgIdNum,
            title: `Deleted next step: ${deleteTarget.title}`,
            description: `Removed the next step task.`,
            activityType: 'next_step_delete',
            userName: org?.name || 'Your team',
            dealId: dealId || ''
          })
        }
      },
      onSettled: () => setDeleteTarget(null)
    })
  }

  const toggleComplete = (step: AgreedNextStep) => {
    if (!orgId) {
      showCustomToast(
        'Error',
        'Organization context is missing. Try refreshing the page.',
        'error',
        5000
      )
      return
    }

    updateMutation.mutate(
      {
        id: step.id,
        payload: {
          orgId: step.orgId,
          title: step.title,
          description: step.description ?? '',
          owner: step.owner,
          priority: step.priority,
          dueDate: step.dueDate,
          isCompleted: !step.isCompleted,
          dealId: dealId
        }
      },
      {
        onSuccess: () => {
          if (partnerOrgIdNum) {
            createActivityMutation.mutate({
              partnerOrgId: partnerOrgIdNum,
              title: !step.isCompleted
                ? `Completed next step: ${step.title}`
                : `Reopened next step: ${step.title}`,
              description: !step.isCompleted
                ? `Marked as done.`
                : `Reopened task for completion.`,
              activityType: 'next_step_toggle',
              userName: org?.name || 'Your team',
              dealId: dealId || ''
            })
          }
        }
      }
    )
  }

  const updatePendingId =
    updateMutation.isPending && updateMutation.variables
      ? updateMutation.variables.id
      : null
  const deletePendingId =
    deleteMutation.isPending && deleteMutation.variables !== undefined
      ? deleteMutation.variables
      : null

  const rowIsBusy = (step: AgreedNextStep) =>
    updatePendingId === step.id || deletePendingId === step.id

  return (
    <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
          Agreed Next Steps
        </h2>
        <button
          type='button'
          className='text-xs font-medium text-[#6B4FBB] disabled:opacity-50'
          disabled={!orgId}
          onClick={() => (orgId ? setAddOpen(true) : undefined)}
        >
          + Add Step
        </button>
      </div>

      {isError && (
        <p className='mb-3 text-xs text-[#A91B22]'>
          {error?.message ?? 'Could not load steps.'}{' '}
          <button
            type='button'
            className='font-medium text-[#6B4FBB] underline'
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      )}

      {isLoading && <AgreedNextStepsSkeleton />}

      {!isLoading && !isError && steps.length === 0 && (
        <p className='py-6 text-center text-xs text-[#5F6F8D]'>
          No agreed next steps yet. Add one to get started.
        </p>
      )}

      {!isLoading && steps.length > 0 && (
        <ul className='space-y-0'>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const dueLabel = formatStepDueLabel(step.dueDate)
            const priLabel = priorityDisplayLabel(step.priority)
            const priKind = shouldEmphasizePriority(step.priority)
            const busy = rowIsBusy(step)

            return (
              <li
                key={step.id}
                className={cn(
                  'flex gap-3 py-2.5 transition-opacity duration-200',
                  !isLast && 'border-b border-[#A0B5D3]',
                  busy && 'pointer-events-none opacity-50'
                )}
              >
                <button
                  type='button'
                  role='checkbox'
                  aria-checked={step.isCompleted}
                  aria-label={
                    step.isCompleted
                      ? 'Mark step incomplete'
                      : 'Mark step complete'
                  }
                  disabled={!orgId || busy}
                  onClick={() => toggleComplete(step)}
                  className={cn(
                    'mt-0.5 size-[18px] shrink-0 rounded disabled:opacity-50',
                    step.isCompleted
                      ? 'relative bg-[#6750A4]'
                      : 'box-border border-[1.78px] border-[#C4CDD5] bg-white'
                  )}
                >
                  {step.isCompleted && (
                    <Check
                      className='absolute left-0.5 top-0.5 size-3.5 text-white'
                      strokeWidth={3}
                      aria-hidden
                    />
                  )}
                </button>
                <div className='min-w-0 flex-1'>
                  <p
                    className={cn(
                      'text-xs leading-4 text-[#243045]',
                      step.isCompleted && 'text-[#5F6F8D] line-through'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className='mt-0.5 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#5F6F8D]'>
                    {step.owner?.trim()
                      ? `${step.owner.trim()}${dueLabel ? ` • Due: ${dueLabel}` : ''}`
                      : dueLabel
                        ? `Due: ${dueLabel}`
                        : null}
                    {priLabel ? (
                      <>
                        {(step.owner?.trim() || dueLabel) && priLabel
                          ? ' '
                          : null}
                        <span
                          className={cn(
                            priKind === 'high' && 'text-[#A91B22]',
                            priKind === 'medium' && 'text-[#B45309]'
                          )}
                        >
                          {priLabel}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className='flex shrink-0 items-start gap-0.5 pt-0.5'>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-8 text-[#5F6F8D] hover:bg-[#F2EDFF] hover:text-[#6B4FBB]'
                    aria-label='Edit step'
                    disabled={!orgId || busy}
                    onClick={() => openEdit(step)}
                  >
                    <Pencil className='size-3.5' aria-hidden />
                  </Button>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-8 text-[#5F6F8D] hover:bg-red-50 hover:text-[#FB2C36]'
                    aria-label='Delete step'
                    disabled={!orgId || busy}
                    onClick={() => setDeleteTarget(step)}
                  >
                    <Trash2 className='size-3.5' aria-hidden />
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Dialog
        open={editDraft !== null}
        onOpenChange={(open) => {
          if (!open) setEditDraft(null)
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit step</DialogTitle>
          </DialogHeader>
          {editDraft && (
            <form onSubmit={handleEditSubmit} className='space-y-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='agreed-step-edit-title'>Title</Label>
                <Input
                  id='agreed-step-edit-title'
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft((d) =>
                      d ? { ...d, title: e.target.value } : d
                    )
                  }
                  placeholder='What needs to happen?'
                  required
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='agreed-step-edit-owner'>Owner</Label>
                <Input
                  id='agreed-step-edit-owner'
                  value={editDraft.owner}
                  onChange={(e) =>
                    setEditDraft((d) =>
                      d ? { ...d, owner: e.target.value } : d
                    )
                  }
                  placeholder='e.g. Both AEs'
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label htmlFor='agreed-step-edit-due'>Due date</Label>
                  <Input
                    id='agreed-step-edit-due'
                    type='date'
                    value={editDraft.dueDate}
                    onChange={(e) =>
                      setEditDraft((d) =>
                        d ? { ...d, dueDate: e.target.value } : d
                      )
                    }
                    required
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='agreed-step-edit-priority'>Priority</Label>
                  <select
                    id='agreed-step-edit-priority'
                    value={editDraft.priority}
                    onChange={(e) =>
                      setEditDraft((d) =>
                        d
                          ? {
                              ...d,
                              priority: e.target.value as AgreedNextStepPriority
                            }
                          : d
                      )
                    }
                    disabled={updateMutation.isPending}
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {PRIORITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='agreed-step-edit-desc'>
                  Description (optional)
                </Label>
                <Input
                  id='agreed-step-edit-desc'
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft((d) =>
                      d ? { ...d, description: e.target.value } : d
                    )
                  }
                  placeholder='Extra context'
                  disabled={updateMutation.isPending}
                />
              </div>
              <DialogFooter className='gap-2 sm:gap-0'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setEditDraft(null)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving…' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this step?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `"${deleteTarget.title.trim()}" will be removed. This action may be reversible depending on your organization settings.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type='button'
              className='bg-[#FB2C36] text-white hover:bg-[#e02630]'
              disabled={deleteMutation.isPending || !deleteTarget}
              onClick={confirmDelete}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addOpen} onOpenChange={handleAddOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add next step</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className='space-y-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='agreed-step-title'>Title</Label>
              <Input
                id='agreed-step-title'
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder='What needs to happen?'
                required
                disabled={createMutation.isPending}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='agreed-step-owner'>Owner</Label>
              <Input
                id='agreed-step-owner'
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
                placeholder='e.g. Both AEs'
                disabled={createMutation.isPending}
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='agreed-step-due'>Due date</Label>
                <Input
                  id='agreed-step-due'
                  type='date'
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  required
                  disabled={createMutation.isPending}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='agreed-step-priority'>Priority</Label>
                <select
                  id='agreed-step-priority'
                  value={formPriority}
                  onChange={(e) =>
                    setFormPriority(e.target.value as AgreedNextStepPriority)
                  }
                  disabled={createMutation.isPending}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='agreed-step-desc'>Description (optional)</Label>
              <Input
                id='agreed-step-desc'
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder='Extra context'
                disabled={createMutation.isPending}
              />
            </div>
            <DialogFooter className='gap-2 sm:gap-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleAddOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving…' : 'Add step'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
