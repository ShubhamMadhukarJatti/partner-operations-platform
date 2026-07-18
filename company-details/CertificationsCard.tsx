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
import {
  CheckCircle2,
  Info,
  Lightbulb,
  Link2,
  Plus,
  Trash2,
  X
} from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'
import { BetaLoadingState } from '@/app/(app)/_beta-profile/components'

import {
  CertificationComposerDraft,
  CertificationDraft,
  createCertificationComposerDraft,
  isValidUrl,
  mapAdminCertificationOptions,
  mapOrganizationCertificationRecords
} from './company-details-helpers'
import {
  CertificationBadge,
  FieldLabel,
  SectionCard,
  SectionHeader
} from './company-details-ui'

export interface CertificationsCardRef {
  handleSave: () => Promise<void>
}

export const CertificationsCard = forwardRef<
  CertificationsCardRef,
  { className?: string; setSaving?: (saving: boolean) => void }
>(({ className, setSaving }, ref) => {
  const currentOrgState = useSelector((state: RootState) => state.currentOrg)
  const currentOrg = currentOrgState.organization?.id
    ? currentOrgState.organization
    : null

  const [certificationsPending, startCertificationsTransition] = useTransition()
  const [certificationItems, setCertificationItems] = useState<
    CertificationDraft[]
  >([])
  const [certificationComposer, setCertificationComposer] =
    useState<CertificationComposerDraft | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<string>('')
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'certification'
    id: string
    title: string
    description: string
  } | null>(null)

  useEffect(() => {
    if (setSaving) {
      setSaving(certificationsPending)
    }
  }, [certificationsPending, setSaving])

  const certificationOptionsQuery = useQuery({
    queryKey: ['profile-beta-certification-options'],
    queryFn: async () => {
      const response = await fetch('/api/admin/certifications?page=0&size=100')
      if (!response.ok) {
        throw new Error('Failed to fetch certification options')
      }
      return response.json()
    },
    retry: false,
    refetchOnWindowFocus: false
  })

  const organizationCertificationsQuery = useQuery({
    queryKey: ['profile-beta-organization-certifications', currentOrg?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/organization/profile/${currentOrg?.id}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch certifications')
      }
      return response.json()
    },
    enabled: Boolean(currentOrg?.id),
    retry: false,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (!currentOrg) return
    setCertificationItems(
      mapOrganizationCertificationRecords(organizationCertificationsQuery.data)
    )
    setCertificationComposer(null)
  }, [currentOrg, organizationCertificationsQuery.data])

  const certificationOptions = mapAdminCertificationOptions(
    certificationOptionsQuery.data
  )

  const openCertificationComposer = () => {
    setSelectedRadio('SOC 2 Type II')
    setCertificationComposer(
      (current) =>
        current ?? {
          ...createCertificationComposerDraft(),
          title: 'SOC 2 Type II'
        }
    )
  }

  const closeCertificationComposer = () => {
    setCertificationComposer(null)
  }

  const submitCertificationForReview = (keepOpen = false) => {
    if (!certificationComposer) return

    const title = certificationComposer.title.trim()
    const verificationUrl = certificationComposer.verificationUrl.trim()

    if (!title) {
      showCustomToast(
        'Info',
        'Select a certification before submitting.',
        'info'
      )
      return
    }

    if (!verificationUrl) {
      showCustomToast(
        'Info',
        'Add a verification URL before submitting.',
        'info'
      )
      return
    }

    if (!isValidUrl(verificationUrl)) {
      showCustomToast(
        'Info',
        'Enter a valid verification URL starting with http or https.',
        'info'
      )
      return
    }

    const alreadyAdded = certificationItems.some(
      (item) => item.title.trim().toLowerCase() === title.toLowerCase()
    )

    if (alreadyAdded) {
      showCustomToast(
        'Info',
        'That certification is already added to this profile.',
        'info'
      )
      return
    }

    startCertificationsTransition(async () => {
      try {
        const createResponse = await fetch('/api/organization/certifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            certificationName: title,
            verificationUrl,
            logoUrl: certificationComposer?.logoUrl || undefined
          })
        })

        const createPayload = await createResponse.json().catch(() => null)

        if (!createResponse.ok) {
          throw new Error(
            createPayload?.details?.message ||
              createPayload?.message ||
              'Failed to create certification.'
          )
        }

        const createdId =
          createPayload?.data?.id ??
          createPayload?.id ??
          createPayload?.data?.data?.id

        let nextItems: CertificationDraft[] | null = null

        if (createdId !== null && createdId !== undefined) {
          const detailResponse = await fetch(
            `/api/organization/certifications/${encodeURIComponent(String(createdId))}`
          )
          const detailPayload = await detailResponse.json().catch(() => null)

          if (detailResponse.ok) {
            const detailItems =
              mapOrganizationCertificationRecords(detailPayload)
            if (detailItems.length > 0) {
              nextItems = detailItems
            }
          }
        }

        if (!nextItems) {
          nextItems = mapOrganizationCertificationRecords(createPayload)
        }

        if (nextItems.length > 0) {
          setCertificationItems((current) => {
            const existingIds = new Set(current.map((item) => item.id))
            const merged = [...current]

            nextItems?.forEach((item) => {
              if (!existingIds.has(item.id)) {
                merged.push({
                  ...item,
                  logoUrl: item.logoUrl || certificationComposer.logoUrl
                })
              }
            })

            return merged
          })
        } else {
          await organizationCertificationsQuery.refetch()
        }

        if (!keepOpen) {
          setCertificationComposer(null)
        } else {
          setSelectedRadio('')
          setCertificationComposer({
            ...createCertificationComposerDraft(),
            title: ''
          })
        }
        showCustomToast(
          'Success',
          'Certification submitted for review.',
          'success'
        )
      } catch (error: any) {
        showCustomToast(
          'Error',
          error?.message || 'Failed to submit certification.',
          'error'
        )
      }
    })
  }

  const deleteCertification = (certificationId: string) => {
    startCertificationsTransition(async () => {
      try {
        const response = await fetch(
          `/api/organization/certifications/${encodeURIComponent(certificationId)}`,
          { method: 'DELETE' }
        )

        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            payload?.details?.message ||
              payload?.message ||
              'Failed to delete certification.'
          )
        }

        setCertificationItems((current) =>
          current.filter((item) => item.id !== certificationId)
        )
        showCustomToast('Success', 'Certification removed.', 'success')
      } catch (error: any) {
        showCustomToast(
          'Error',
          error?.message || 'Failed to delete certification.',
          'error'
        )
      }
    })
  }

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      showCustomToast(
        'Info',
        'Certifications save when you submit or delete them in this section.',
        'info'
      )
    }
  }))

  return (
    <div className={cn('w-full space-y-6', className)}>
      <SectionCard className='w-full border-0 bg-transparent p-0 shadow-none'>
        <div className='w-full space-y-8 rounded-[20px] border border-[#F3F4F6] bg-white/50 p-6 shadow-sm'>
          <div className='space-y-1'>
            <h2 className='text-[20px] font-bold tracking-tight text-[#101828]'>
              Certification & partnerships
            </h2>
            <p className='text-[14px] text-[#6B7280]'>
              Select certifications and provide verification links. Official
              logos will auto-load.
            </p>
          </div>

          <div className='space-y-5 rounded-[20px] border border-[#F3F4F6] bg-[#F9FAFB] p-6 shadow-sm'>
            <p className='text-[15px] font-semibold text-[#364153]'>
              Added Certifications
            </p>

            {organizationCertificationsQuery.isLoading ? (
              <div className='rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5'>
                <BetaLoadingState />
              </div>
            ) : certificationItems.length > 0 ? (
              <div className='space-y-3.5'>
                {certificationItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5 sm:px-5'
                  >
                    <div className='flex min-w-0 items-center gap-4'>
                      <CertificationBadge
                        title={item.title}
                        logoUrl={
                          item.logoUrl ||
                          certificationOptions.find(
                            (opt) =>
                              opt.title.toLowerCase() ===
                              item.title.toLowerCase()
                          )?.logoUrl
                        }
                      />

                      <div className='flex min-w-0 flex-col justify-center'>
                        <p className='truncate text-[16px] font-semibold tracking-[-0.01em] text-[#101828]'>
                          {item.title}
                        </p>
                        {item.verificationUrl && (
                          <a
                            href={item.verificationUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='truncate text-sm text-[#6863FB] hover:underline'
                          >
                            {item.verificationUrl}
                          </a>
                        )}

                        {item.status !== 'verified' && (
                          <span
                            className={cn(
                              'mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium leading-none',
                              item.status === 'rejected'
                                ? 'bg-[#FEE2E2] text-[#B42318]'
                                : 'bg-[#FEF3C6] text-[#BB4D00]'
                            )}
                          >
                            <Info className='h-3 w-3' />
                            {item.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending Verification'}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() =>
                        setDeleteConfirm({
                          type: 'certification',
                          id: item.id,
                          title:
                            'Are you sure you want to delete the certification?',
                          description:
                            'You will need to re-verify the certification while adding the certification again.'
                        })
                      }
                      disabled={certificationsPending}
                      className='rounded-full p-2 text-[#F04438] transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <Trash2 className='h-5 w-5 stroke-[2]' />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className='rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-8 text-center text-[15px] text-[#667085] shadow-[0px_1px_2px_rgba(16,24,40,0.04)] dark:bg-white/5'>
                No certifications added yet.
              </div>
            )}
          </div>

          {certificationComposer ? (
            <div className='space-y-5'>
              <div className='flex items-center justify-between'>
                <h3 className='text-[16px] font-bold text-[#101828]'>
                  Add a certification
                </h3>
                <button
                  type='button'
                  onClick={closeCertificationComposer}
                  className='text-[#6B7280] transition-colors hover:text-[#101828]'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='flex items-start gap-2 rounded-[8px] bg-[#F4F2FF] p-3 text-[13px] text-[#6863FB]'>
                <Lightbulb className='mt-0.5 h-5 w-5 shrink-0' />
                <div>
                  <span className='font-semibold'>
                    Don't see your certification?
                  </span>{' '}
                  You can add custom certifications, but you'll need to provide
                  the logo file and verification documentation.
                </div>
              </div>

              <div className='space-y-8 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]'>
                <div className='space-y-4'>
                  <label className='text-[14px] font-semibold text-[#374151]'>
                    Certification <span className='text-[#F04438]'>*</span>
                  </label>
                  <div className='flex flex-wrap items-center gap-x-8 gap-y-4'>
                    {[
                      'SOC 2 Type II',
                      'ISO27001',
                      'GDPR',
                      'AWS Partner',
                      'Custom'
                    ].map((opt) => {
                      const isSelected = selectedRadio === opt
                      return (
                        <label
                          key={opt}
                          className='flex cursor-pointer items-center gap-2'
                        >
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                              isSelected
                                ? 'border-[#6863FB]'
                                : 'border-[#D1D5DC]'
                            )}
                          >
                            {isSelected && (
                              <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                            )}
                          </div>
                          <span className='text-[14px] text-[#4A5565]'>
                            {opt}
                          </span>
                          <input
                            type='radio'
                            className='hidden'
                            checked={isSelected}
                            onChange={() => {
                              setSelectedRadio(opt)
                              if (opt !== 'Custom') {
                                const matchingOption =
                                  certificationOptions.find(
                                    (o) =>
                                      o.title.toLowerCase() ===
                                      opt.toLowerCase()
                                  )
                                setCertificationComposer({
                                  ...certificationComposer,
                                  title: opt,
                                  logoUrl: matchingOption?.logoUrl
                                })
                              } else {
                                setCertificationComposer({
                                  ...certificationComposer,
                                  title: '',
                                  logoUrl: undefined
                                })
                              }
                            }}
                          />
                        </label>
                      )
                    })}
                  </div>
                  {selectedRadio === 'Custom' && (
                    <Input
                      placeholder='Enter custom certification name'
                      value={certificationComposer.title}
                      onChange={(e) =>
                        setCertificationComposer({
                          ...certificationComposer,
                          title: e.target.value
                        })
                      }
                      className='h-11 rounded-[8px] border-[#D1D5DC]'
                    />
                  )}
                </div>

                <div className='space-y-3'>
                  <label className='text-[14px] font-semibold text-[#374151]'>
                    Company website <span className='text-[#F04438]'>*</span>
                  </label>
                  <div className='flex h-11 items-stretch'>
                    <div className='flex items-center rounded-l-[8px] border border-r-0 border-[#D1D5DC] bg-[#F9FAFB] px-4 text-[14px] text-[#6B7280]'>
                      https://
                    </div>
                    <Input
                      value={certificationComposer.verificationUrl.replace(
                        /^https?:\/\//,
                        ''
                      )}
                      onChange={(e) =>
                        setCertificationComposer({
                          ...certificationComposer,
                          verificationUrl: `https://${e.target.value}`
                        })
                      }
                      placeholder='www.example.com'
                      className='h-full rounded-l-none rounded-r-[8px] border-[#D1D5DC] bg-white text-[14px] focus:border-[#D1D5DC] focus-visible:ring-0 focus-visible:ring-offset-0'
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-end'>
                <button
                  type='button'
                  className='flex items-center gap-2 text-[14px] font-semibold text-[#6863FB] hover:underline'
                  onClick={() => {
                    submitCertificationForReview(true)
                  }}
                >
                  <Plus className='h-4 w-4 stroke-[2.5]' /> Add another
                  certification
                </button>

                <div className='flex w-full flex-col items-end gap-2 sm:w-auto'>
                  <Button
                    onClick={() => submitCertificationForReview(false)}
                    disabled={certificationsPending}
                    className='h-11 w-full rounded-[8px] bg-[#6863FB] px-6 font-semibold text-white hover:bg-[#5b56e5] sm:w-auto'
                  >
                    Submit for review
                  </Button>
                  <span className='text-[12px] text-[#6B7280]'>
                    Sharkdom team will verify within 2-3 business days
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              type='button'
              onClick={openCertificationComposer}
              disabled={certificationsPending}
              className='mt-4 flex h-[56px] w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D1D5DC] bg-[#F9FAFB] text-[15px] font-medium text-[#4A5565] transition-colors hover:bg-[#F3F4F6]'
            >
              <Plus className='h-5 w-5' />
              Add Another Certification
            </button>
          )}
        </div>
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
              onClick={(e) => {
                e.preventDefault()
                if (deleteConfirm?.type === 'certification') {
                  deleteCertification(deleteConfirm.id)
                }
                setDeleteConfirm(null)
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
CertificationsCard.displayName = 'CertificationsCard'
