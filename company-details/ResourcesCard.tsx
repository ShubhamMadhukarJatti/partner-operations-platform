'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useTransition
} from 'react'
import { RootState } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import { Lightbulb, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { BetaLoadingState } from '@/app/(app)/_beta-profile/components'

import {
  createEmptyResource,
  isResourceDraftEmpty,
  mapResourceRecordsToDrafts,
  RESOURCE_TYPE_OPTIONS,
  ResourceDraft
} from './company-details-helpers'
import {
  SectionCard,
  SectionHeader,
  SelectField,
  TextInputField
} from './company-details-ui'

export interface ResourcesCardRef {
  handleSave: () => Promise<void>
}

export const ResourcesCard = forwardRef<
  ResourcesCardRef,
  { className?: string; setSaving?: (saving: boolean) => void }
>(({ className, setSaving }, ref) => {
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const currentOrg = currentOrgState.organization?.id
    ? currentOrgState.organization
    : null

  const [resourcesPending, startResourcesTransition] = useTransition()
  const [resourceItems, setResourceItems] = useState<ResourceDraft[]>([
    createEmptyResource()
  ])
  const [removedResourceIds, setRemovedResourceIds] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string
    title: string
    description: string
  } | null>(null)

  useEffect(() => {
    if (setSaving) {
      setSaving(resourcesPending)
    }
  }, [resourcesPending, setSaving])

  const resourcesQuery = useQuery({
    queryKey: ['profile-beta-resources', currentOrg?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/resources/by-org/${currentOrg?.id}`
      )
      if (response.status === 404) {
        return null
      }
      if (!response.ok) {
        throw new Error('Failed to fetch resources')
      }
      return response.json()
    },
    enabled: Boolean(currentOrg?.id),
    retry: false,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (!currentOrg) return
    setRemovedResourceIds([])

    // We map response based on profile beta adapters: mapOrganizationResourceRecordsResponse
    // but here we just manually unwrap it.
    const unwrapRecords = (res: any) => {
      if (Array.isArray(res?.data?.resources)) return res.data.resources
      if (Array.isArray(res?.data?.content)) return res.data.content
      if (Array.isArray(res?.content)) return res.content
      if (Array.isArray(res?.data)) return res.data
      if (Array.isArray(res)) return res
      return []
    }

    setResourceItems(
      mapResourceRecordsToDrafts(unwrapRecords(resourcesQuery.data))
    )
  }, [currentOrg, resourcesQuery.data])

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      if (!currentOrg) return

      startResourcesTransition(async () => {
        try {
          const normalizedResources = resourceItems
            .map((resource, index) => ({
              index,
              id: resource.id,
              resourceId: resource.resourceId,
              title: resource.title.trim(),
              type: resource.type.trim(),
              source: resource.source.trim(),
              url: resource.url.trim()
            }))
            .filter((resource) => !isResourceDraftEmpty(resource))

          for (const resource of normalizedResources) {
            if (
              !resource.title ||
              !resource.type ||
              !resource.source ||
              !resource.url
            ) {
              throw new Error(
                `Resource ${resource.index + 1} must include title, type, source, and URL.`
              )
            }
          }

          for (const resource of normalizedResources) {
            const payload = {
              title: resource.title,
              type: resource.type,
              source: resource.source,
              url: resource.url
            }

            const response = await fetch(
              resource.resourceId
                ? `/api/organization/resources/${resource.resourceId}`
                : '/api/organization/resources',
              {
                method: resource.resourceId ? 'PUT' : 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
              }
            )

            if (!response.ok) {
              const error = await response.json().catch(() => null)
              throw new Error(
                error?.details?.message ||
                  error?.message ||
                  'Failed to save resources.'
              )
            }
          }

          for (const resourceId of removedResourceIds) {
            const response = await fetch(
              `/api/organization/resources/${encodeURIComponent(resourceId)}`,
              { method: 'DELETE' }
            )

            if (!response.ok) {
              const error = await response.json().catch(() => null)
              throw new Error(
                error?.details?.message ||
                  error?.message ||
                  'Failed to remove a resource.'
              )
            }
          }

          await resourcesQuery.refetch()
          setRemovedResourceIds([])
          showCustomToast('Success', 'Resources updated.', 'success')
        } catch (error: any) {
          showCustomToast(
            'Error',
            error?.message || 'Failed to update resources.',
            'error'
          )
        }
      })
    }
  }))

  return (
    <div className={cn('space-y-6', className)}>
      <SectionHeader
        title='Resources'
        description='Add helpful resources for potential partners'
      />

      <SectionCard className='space-y-8 border-0 bg-transparent p-0 shadow-none'>
        <div className='space-y-5 rounded-[20px] border border-[#F3F4F6] bg-[#F9FAFB] p-6 shadow-sm'>
          <p className='text-[15px] font-semibold text-[#364153]'>
            Added Resources
          </p>

          {resourcesQuery.isLoading ? (
            <div className='rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5'>
              <BetaLoadingState />
            </div>
          ) : resourceItems.filter((r) => r.resourceId).length > 0 ? (
            <div className='space-y-3.5'>
              {resourceItems
                .filter((r) => r.resourceId)
                .map((resource, index) => (
                  <div
                    key={resource.id}
                    className='flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5 sm:px-5'
                  >
                    <div className='flex min-w-0 items-center gap-4'>
                      <div className='flex h-[58px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-gray-100 bg-[#F9FAFB]'>
                        <svg
                          className='h-8 w-8 text-gray-300'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                      </div>

                      <div className='flex min-w-0 flex-col justify-center gap-1'>
                        {resource.type && (
                          <span className='inline-flex w-fit items-center rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-[12px] font-medium text-[#4B5563]'>
                            {resource.type}
                          </span>
                        )}
                        <p className='truncate text-[16px] font-semibold tracking-[-0.01em] text-[#101828]'>
                          {resource.title}
                        </p>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target='_blank'
                            rel='noreferrer'
                            className='truncate text-sm text-[#6863FB] hover:underline'
                          >
                            {resource.url}
                          </a>
                        )}
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() =>
                        setDeleteConfirm({
                          id: resource.resourceId || resource.id,
                          title:
                            'Are you sure you want to delete this resource?',
                          description:
                            'This action cannot be undone. The resource will be permanently removed.'
                        })
                      }
                      disabled={resourcesPending}
                      className='rounded-full p-2 text-[#F04438] transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <Trash2 className='h-5 w-5 stroke-[2]' />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className='rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-8 text-center text-[15px] text-[#667085] shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5'>
              No resources added yet.
            </div>
          )}
        </div>

        {resourceItems
          .filter((r) => !r.resourceId)
          .map((resource, formIndex) => (
            <div key={resource.id} className='space-y-5'>
              <div className='flex items-center justify-between'>
                <h3 className='text-[16px] font-bold text-[#101828]'>
                  Add a resource
                </h3>
                <button
                  type='button'
                  onClick={() => {
                    setResourceItems((current) =>
                      current.filter((item) => item.id !== resource.id)
                    )
                  }}
                  className='text-[#6B7280] transition-colors hover:text-[#101828]'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='flex items-start gap-2 rounded-[8px] bg-[#F4F2FF] p-3 text-[13px] text-[#6863FB]'>
                <Lightbulb className='mt-0.5 h-5 w-5 shrink-0' />
                <div>
                  <span className='font-semibold'>Resource tip</span>
                  <br />
                  Companies with video resources get{' '}
                  <span className='font-semibold'>47% more profile views</span>.
                  Consider adding a product demo or walkthrough video.
                </div>
              </div>

              <div className='space-y-8 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]'>
                <div className='space-y-4'>
                  <label className='text-[14px] font-semibold text-[#374151]'>
                    Resource type <span className='text-[#F04438]'>*</span>
                  </label>
                  <div className='flex flex-wrap items-center gap-3'>
                    {RESOURCE_TYPE_OPTIONS.map((opt) => {
                      const isSelected = resource.type === opt
                      return (
                        <button
                          key={opt}
                          type='button'
                          onClick={() =>
                            setResourceItems((current) =>
                              current.map((item) =>
                                item.id === resource.id
                                  ? { ...item, type: opt }
                                  : item
                              )
                            )
                          }
                          className={cn(
                            'rounded-lg border px-4 py-2 text-[14px] font-medium transition-colors',
                            isSelected
                              ? 'border-[#6863FB] bg-white text-[#6863FB]'
                              : 'border-gray-200 bg-[#F9FAFB] text-[#4A5565] hover:bg-gray-50'
                          )}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  <div className='space-y-3'>
                    <label className='text-[14px] font-semibold text-[#374151]'>
                      Resource title <span className='text-[#F04438]'>*</span>
                    </label>
                    <Input
                      placeholder='Acme corp'
                      value={resource.title}
                      onChange={(e) =>
                        setResourceItems((current) =>
                          current.map((item) =>
                            item.id === resource.id
                              ? { ...item, title: e.target.value }
                              : item
                          )
                        )
                      }
                      className='h-11 rounded-[8px] border-[#D1D5DC]'
                    />
                  </div>
                  <div className='space-y-3'>
                    <label className='text-[14px] font-semibold text-[#374151]'>
                      Source <span className='text-[#F04438]'>*</span>
                    </label>
                    <Input
                      placeholder='YouTube, PDF, etc.'
                      value={resource.source}
                      onChange={(e) =>
                        setResourceItems((current) =>
                          current.map((item) =>
                            item.id === resource.id
                              ? { ...item, source: e.target.value }
                              : item
                          )
                        )
                      }
                      className='h-11 rounded-[8px] border-[#D1D5DC]'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='text-[14px] font-semibold text-[#374151]'>
                    URL <span className='text-[#F04438]'>*</span>
                  </label>
                  <div className='flex h-11 items-stretch'>
                    <div className='flex items-center rounded-l-[8px] border border-r-0 border-[#D1D5DC] bg-[#F9FAFB] px-4 text-[14px] text-[#6B7280]'>
                      https://
                    </div>
                    <Input
                      value={resource.url.replace(/^https?:\/\//, '')}
                      onChange={(e) =>
                        setResourceItems((current) =>
                          current.map((item) =>
                            item.id === resource.id
                              ? { ...item, url: `https://${e.target.value}` }
                              : item
                          )
                        )
                      }
                      placeholder='www.youtube.com/demo'
                      className='h-full rounded-l-none rounded-r-[8px] border-[#D1D5DC] bg-white text-[14px] focus:border-[#D1D5DC] focus-visible:ring-0 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-end'>
                <button
                  type='button'
                  className='flex items-center gap-2 text-[14px] font-semibold text-[#6863FB] hover:underline'
                  onClick={async () => {
                    await ref?.current?.handleSave?.()
                    setResourceItems((current) => [
                      ...current,
                      createEmptyResource()
                    ])
                  }}
                >
                  <Plus className='h-4 w-4 stroke-[2.5]' /> Add another resource
                </button>

                <Button
                  type='button'
                  onClick={async () => {
                    await ref?.current?.handleSave?.()
                  }}
                  disabled={resourcesPending}
                  className='h-11 w-full rounded-[8px] bg-[#6863FB] px-8 font-semibold text-white hover:bg-[#5b56e5] sm:w-auto'
                >
                  Save
                </Button>
              </div>
            </div>
          ))}

        {!resourceItems.some((r) => !r.resourceId) && (
          <button
            type='button'
            onClick={() =>
              setResourceItems((current) => [...current, createEmptyResource()])
            }
            className='mt-4 flex h-[56px] w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D1D5DC] bg-[#F9FAFB] text-[15px] font-medium text-[#4A5565] transition-colors hover:bg-[#F3F4F6]'
          >
            <Plus className='h-5 w-5' />
            Add Another Resource
          </button>
        )}
      </SectionCard>

      <AlertDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null)
        }}
      >
        <AlertDialogContent className='max-w-[480px] rounded-[18px] p-7'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-[17px] font-bold text-[#101828]'>
              {deleteConfirm?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className='mt-1.5 text-sm leading-6 text-[#6A7282]'>
              {deleteConfirm?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mt-5 flex-row gap-3'>
            <AlertDialogAction
              className='h-10 rounded-[10px] bg-[#DC2626] px-5 text-sm font-semibold text-white hover:bg-[#B91C1C]'
              onClick={async (e) => {
                e.preventDefault()
                if (!deleteConfirm) return
                try {
                  const targetResource = resourceItems.find(
                    (r) =>
                      r.id === deleteConfirm.id ||
                      r.resourceId === deleteConfirm.id
                  )
                  if (targetResource?.resourceId) {
                    setRemovedResourceIds((current) => [
                      ...current,
                      targetResource.resourceId!
                    ])
                  }
                  setResourceItems((current) => {
                    const next = current.filter(
                      (item) =>
                        item.id !== deleteConfirm.id &&
                        item.resourceId !== deleteConfirm.id
                    )
                    return next.length > 0 ? next : [createEmptyResource()]
                  })
                } catch (error: any) {
                  showCustomToast(
                    'Error',
                    error?.message || 'Failed to prepare delete.',
                    'error'
                  )
                } finally {
                  setDeleteConfirm(null)
                }
              }}
            >
              Confirm and Delete
            </AlertDialogAction>
            <AlertDialogCancel className='h-10 rounded-[10px] border border-[#D0D5DD] bg-white px-5 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB] dark:bg-white/5'>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
})
ResourcesCard.displayName = 'ResourcesCard'
