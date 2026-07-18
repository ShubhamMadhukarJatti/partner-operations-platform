'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useVendorOrgId } from '@/http-hooks/agreed-next-steps'
import { usePartnerActivityTimeline } from '@/http-hooks/partner-activities'
import { useGetPartnerReport } from '@/http-hooks/partner-report'
import type { RootState } from '@/redux/store'
import {
  ArrowLeft,
  CalendarCheck,
  Linkedin,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  User
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import {
  useCreateSharedContact,
  useDealOwnerDetails,
  useSharedContacts
} from '../api'
import { AgreedNextStepsSection } from './AgreedNextStepsSection'
import { CoSellActivityTimeline } from './CoSellActivityTimeline'
import { CoSellWorkspaceSidebar } from './CoSellWorkspaceSidebar'
import { JointPitchSection } from './JointPitchSection'
import {
  SHARED_ASSETS_FILE_INPUT_ID,
  SHARED_ASSETS_UPLOAD_ROOT_ID,
  SharedAssetsSection
} from './SharedAssetsSection'

const REPORT_TYPES = [
  'CUSTOMER_CUSTOMER',
  'CUSTOMER_PROSPECT',
  'CUSTOMER_OPPORTUNITY',
  'PROSPECT_CUSTOMER',
  'PROSPECT_PROSPECT',
  'PROSPECT_OPPORTUNITY',
  'OPPORTUNITY_CUSTOMER',
  'OPPORTUNITY_PROSPECT',
  'OPPORTUNITY_OPPORTUNITY'
] as const

const WORKSPACE_TABS = [
  'Overview',
  'Contacts',
  'Activity',
  'Assets',
  'Attribution'
] as const

type WorkspaceTab = (typeof WORKSPACE_TABS)[number]

export default function CoSellWorkspaceContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const partnerOrgId = String(params.partnerOrgId ?? '')
  const partnerIdNum = useMemo(() => Number(partnerOrgId), [partnerOrgId])
  const typeParam = searchParams.get('type')
  const reportType =
    typeParam &&
    REPORT_TYPES.includes(typeParam as (typeof REPORT_TYPES)[number])
      ? typeParam
      : 'CUSTOMER_CUSTOMER'

  const targetPartnerDealId = searchParams.get('targetpartnerdealId')
  const currentPartnerDealId = searchParams.get('currentpartnerdealId')
  const dealId =
    currentPartnerDealId || searchParams.get('dealId') || targetPartnerDealId

  const { data, isLoading } = useGetPartnerReport(
    Number.isFinite(partnerIdNum) && partnerIdNum > 0 ? partnerIdNum : null,
    reportType
  )
  const vendorOrgId = useVendorOrgId()
  const org = useSelector((s: RootState) => s.currentOrg?.organization)

  const { data: dealDetails } = useDealOwnerDetails(
    org?.id ? Number(org.id) : null,
    dealId
  )

  const { data: partnerDealDetails } = useDealOwnerDetails(partnerIdNum, dealId)

  const { data: sharedContacts = [], isLoading: isContactsLoading } =
    useSharedContacts(partnerIdNum, dealId)

  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newRelationship, setNewRelationship] = useState('')
  const [newSource, setNewSource] = useState<'YOUR_CRM' | 'PARTNER_CRM'>(
    'YOUR_CRM'
  )
  const [newInCrm, setNewInCrm] = useState(true)

  const createContactMutation = useCreateSharedContact()

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerIdNum || !dealId) return

    try {
      await createContactMutation.mutateAsync({
        partnerOrgId: partnerIdNum,
        name: newName,
        title: newTitle,
        source: newSource,
        relationship: newRelationship,
        inCrm: newInCrm,
        dealId: dealId
      })

      setNewName('')
      setNewTitle('')
      setNewRelationship('')
      setNewSource('YOUR_CRM')
      setNewInCrm(true)
      setIsAddContactOpen(false)
    } catch (error) {
      console.error('Failed to create shared contact:', error)
    }
  }

  const activityPartnerId =
    Number.isFinite(partnerIdNum) && partnerIdNum > 0 ? partnerIdNum : null

  const { data: activities = [] } = usePartnerActivityTimeline(
    activityPartnerId,
    dealId
  )

  const partnerTitle = data?.partnerName ?? 'Partner'
  const orgShort = useMemo(() => {
    const name = data?.organizationName as string | undefined
    if (!name?.trim()) return 'S'
    return name.trim().charAt(0).toUpperCase()
  }, [data?.organizationName])
  const partnerInitial = partnerTitle.trim().charAt(0).toUpperCase() || 'P'

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('Overview')

  const focusSharedAssetsUpload = () => {
    document
      .getElementById(SHARED_ASSETS_UPLOAD_ROOT_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    document.getElementById(SHARED_ASSETS_FILE_INPUT_ID)?.click()
  }

  return (
    <GradientPageBackground className='min-h-screen'>
      <div className='relative z-[1] px-5 pb-12 pt-6 md:px-6'>
        <header className='mb-6 flex flex-col gap-4'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
            <div className='min-w-0 flex-1 space-y-3'>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-8 gap-1.5 px-0 text-[#2A3241] hover:bg-transparent hover:text-[#3E50F7]'
                  onClick={() =>
                    router.push(
                      `/partner-mapping/report?type=${encodeURIComponent(reportType)}&partner=${encodeURIComponent(partnerOrgId)}`
                    )
                  }
                >
                  <ArrowLeft className='size-3.5 shrink-0' aria-hidden />
                  <span className='text-xs font-medium leading-4'>
                    Co-sell Workspace
                  </span>
                </Button>
              </div>
              <div className='flex flex-wrap items-center gap-3'>
                <h1 className='text-[22px] font-bold leading-8 tracking-[-0.26px] text-[#303141]'>
                  {isLoading ? '…' : partnerTitle}
                </h1>
                <span className='inline-flex items-center gap-2 rounded-[30px] border border-[#38B000] bg-white px-[11px] py-1.5 text-xs font-semibold text-[#38B000]'>
                  <span
                    className='size-2.5 rounded-full bg-[#38B000]'
                    aria-hidden
                  />
                  Active Co-sell
                </span>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-2.5'>
              <p className='text-right text-[10px] leading-[16.5px] text-[#64748B]'>
                Co-sell started
                <br />
                <span className='text-xs font-medium text-[#2A3241]'>
                  {dealDetails?.lastActivityDate || 'Just started'}
                </span>
              </p>
              <div className='flex items-center gap-2'>
                <div className='flex size-[29px] items-center justify-center rounded-full bg-[#3E50F7] text-[10px] font-bold text-white'>
                  {orgShort}
                </div>
                <span className='text-sm text-[#4D5C78]' aria-hidden>
                  ×
                </span>
                <div className='flex size-[29px] items-center justify-center rounded-full bg-[#6B4FBB] text-[10px] font-bold text-white'>
                  {partnerInitial}
                </div>
              </div>
            </div>
          </div>

          <nav
            className='flex flex-wrap gap-x-8 gap-y-1 border-b border-[#B1C1E2]'
            aria-label='Workspace sections'
          >
            {WORKSPACE_TABS.map((tab) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  type='button'
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'relative pb-2.5 pt-2 text-[13px] tracking-[-0.076px]',
                    active
                      ? 'font-semibold text-[#3E50F7]'
                      : 'font-normal text-[#4A5565]'
                  )}
                >
                  {tab}
                  {active && (
                    <span className='absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#3E50F7]' />
                  )}
                </button>
              )
            })}
          </nav>
        </header>

        {activeTab === 'Assets' && (
          <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5'>
            <div className='min-w-0 flex-1'>
              <SharedAssetsSection
                partnerOrgId={partnerOrgId}
                dealId={dealId}
              />
            </div>
            <CoSellWorkspaceSidebar
              partnerOrgId={partnerIdNum}
              dealId={dealId}
              vendorOrgId={org?.id ? Number(org.id) : null}
              onShareNewAsset={focusSharedAssetsUpload}
            />
          </div>
        )}

        {activeTab === 'Contacts' && (
          <div className='flex flex-col gap-5'>
            <section className='rounded-[14px] border border-[#F3F4F6] bg-white p-6'>
              <div className='mb-6 flex items-center justify-between gap-4'>
                <h2 className='text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
                  Primary Contacts
                </h2>
                <Dialog
                  open={isAddContactOpen}
                  onOpenChange={setIsAddContactOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      type='button'
                      className='inline-flex h-8 items-center justify-center rounded-[8px] bg-[#3E50F7] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#2A3FD7]'
                    >
                      + Add Contact
                    </button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle>Add Shared Contact</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleCreateContact}
                      className='space-y-4 pt-3'
                    >
                      <div className='space-y-1.5'>
                        <label
                          htmlFor='contact-name'
                          className='text-xs font-semibold text-[#344054]'
                        >
                          Full Name *
                        </label>
                        <input
                          id='contact-name'
                          type='text'
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder='e.g. John Doe'
                          className='w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#3E50F7] focus:ring-1 focus:ring-[#3E50F7]'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <label
                          htmlFor='contact-title'
                          className='text-xs font-semibold text-[#344054]'
                        >
                          Job Title *
                        </label>
                        <input
                          id='contact-title'
                          type='text'
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder='e.g. Director of Procurement'
                          className='w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#3E50F7] focus:ring-1 focus:ring-[#3E50F7]'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <label
                          htmlFor='contact-relationship'
                          className='text-xs font-semibold text-[#344054]'
                        >
                          Relationship *
                        </label>
                        <input
                          id='contact-relationship'
                          type='text'
                          required
                          value={newRelationship}
                          onChange={(e) => setNewRelationship(e.target.value)}
                          placeholder='e.g. Champion, Economic Buyer'
                          className='w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#3E50F7] focus:ring-1 focus:ring-[#3E50F7]'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <label
                          htmlFor='contact-source'
                          className='text-xs font-semibold text-[#344054]'
                        >
                          Source *
                        </label>
                        <select
                          id='contact-source'
                          value={newSource}
                          onChange={(e) => setNewSource(e.target.value as any)}
                          className='w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#3E50F7] focus:ring-1 focus:ring-[#3E50F7]'
                        >
                          <option value='YOUR_CRM'>Your CRM</option>
                          <option value='PARTNER_CRM'>Partner CRM</option>
                        </select>
                      </div>

                      <div className='flex items-center gap-2 pt-1.5'>
                        <input
                          id='contact-incrm'
                          type='checkbox'
                          checked={newInCrm}
                          onChange={(e) => setNewInCrm(e.target.checked)}
                          className='size-4 rounded border-[#D0D5DD] text-[#3E50F7] focus:ring-[#3E50F7]'
                        />
                        <label
                          htmlFor='contact-incrm'
                          className='select-none text-xs font-medium text-[#344054]'
                        >
                          Sync to CRM
                        </label>
                      </div>

                      <DialogFooter className='gap-2 pt-2 sm:gap-0'>
                        <button
                          type='button'
                          onClick={() => setIsAddContactOpen(false)}
                          className='rounded-md border border-[#D0D5DD] bg-white px-4 py-2 text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB]'
                        >
                          Cancel
                        </button>
                        <button
                          type='submit'
                          disabled={createContactMutation.isPending}
                          className='inline-flex items-center justify-center rounded-md bg-[#3E50F7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2A3FD7] disabled:opacity-50'
                        >
                          {createContactMutation.isPending
                            ? 'Adding...'
                            : 'Add Contact'}
                        </button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isContactsLoading ? (
                <div className='flex items-center justify-center py-10 text-sm text-[#4D5C78]'>
                  <RefreshCw className='mr-2 size-4 animate-spin text-[#3E50F7]' />
                  Loading shared contacts...
                </div>
              ) : sharedContacts.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {sharedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className='flex flex-col gap-4 rounded-xl border border-[#F3F4F6] bg-white p-5 outline outline-1 outline-[#E5E7EB] transition-shadow hover:shadow-md'
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full text-sm font-bold text-white',
                            contact.source === 'YOUR_CRM'
                              ? 'bg-[#3E50F7]'
                              : 'bg-[#6B4FBB]'
                          )}
                        >
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-bold text-[#1A1A2E]'>
                            {contact.name}
                          </p>
                          <p className='truncate text-xs text-[#6A7282]'>
                            {contact.title || 'Decision Maker'}
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-col gap-2.5 pt-2'>
                        <div className='flex items-center gap-2 text-xs text-[#4D5C78]'>
                          <User size={14} className='shrink-0' />
                          <span className='truncate font-medium'>
                            Relationship:{' '}
                            {contact.relationship || 'Stakeholder'}
                          </span>
                        </div>
                        <div className='mt-1.5 flex items-center gap-2 text-xs text-[#4D5C78]'>
                          <span
                            className={cn(
                              'rounded-[6px] px-2 py-0.5 text-[10px] font-bold',
                              contact.source === 'YOUR_CRM'
                                ? 'bg-[#E5EFFE] text-[#3E50F7]'
                                : 'bg-[#F2EDFF] text-[#6B4FBB]'
                            )}
                          >
                            Source:{' '}
                            {contact.source === 'YOUR_CRM'
                              ? 'Your CRM'
                              : `${partnerTitle} CRM`}
                          </span>
                        </div>
                      </div>

                      <div className='mt-2 flex items-center justify-between border-t border-[#E5E7EB] pt-3'>
                        <span className='text-[10px] font-medium uppercase tracking-[0.5px] text-[#99A1AF]'>
                          CRM: {contact.inCrm ? 'Synced' : 'Workspace Only'}
                        </span>
                        <button className='text-xs font-semibold text-[#3E50F7] hover:underline'>
                          View Bio
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !dealDetails ? (
                <div className='py-10 text-center text-sm text-[#4D5C78]'>
                  No contacts found for this deal.
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {/* Fallback Single Deal Owner Card */}
                  <div className='flex flex-col gap-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] p-5 transition-shadow hover:shadow-md'>
                    <div className='flex items-center gap-3'>
                      <div className='flex size-12 items-center justify-center rounded-full bg-[#E5EFFE] text-[#3E50F7]'>
                        <User size={24} />
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-bold text-[#1A1A2E]'>
                          {dealDetails.firstName} {dealDetails.lastName}
                        </p>
                        <p className='truncate text-xs text-[#6A7282]'>
                          {dealDetails.jobTitle || 'Decision Maker'}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2.5 pt-2'>
                      <div className='flex items-center gap-2 text-xs text-[#4D5C78]'>
                        <Mail size={14} className='shrink-0' />
                        <span className='truncate'>
                          {dealDetails.contactEmail || 'No email provided'}
                        </span>
                      </div>
                      {dealDetails.contactPhone && (
                        <div className='flex items-center gap-2 text-xs text-[#4D5C78]'>
                          <Phone size={14} className='shrink-0' />
                          <span>{dealDetails.contactPhone}</span>
                        </div>
                      )}
                      {dealDetails.contactLinkedinUrl && (
                        <a
                          href={dealDetails.contactLinkedinUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-2 text-xs text-[#3E50F7] hover:underline'
                        >
                          <Linkedin size={14} className='shrink-0' />
                          <span>LinkedIn Profile</span>
                        </a>
                      )}
                    </div>

                    <div className='mt-2 flex items-center justify-between border-t border-[#E5E7EB] pt-3'>
                      <span className='text-[10px] font-medium uppercase tracking-[0.5px] text-[#99A1AF]'>
                        Status: {dealDetails.leadStatus || 'Active'}
                      </span>
                      <button className='text-xs font-semibold text-[#3E50F7] hover:underline'>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'Attribution' && (
          <div className='rounded-[14px] border border-[#F3F4F6] bg-white p-10 text-center text-sm text-[#4D5C78]'>
            <p className='font-medium text-[#2A3241]'>{activeTab}</p>
            <p className='mt-2'>
              This section will connect to your attribution tracking.
            </p>
            <Link
              href={`/partner-mapping/report?type=${encodeURIComponent(reportType)}&partner=${encodeURIComponent(partnerOrgId)}`}
              className='mt-4 inline-block text-sm font-medium text-[#3E50F7] hover:underline'
            >
              Back to shared accounts report
            </Link>
          </div>
        )}

        {(activeTab === 'Overview' || activeTab === 'Activity') && (
          <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5'>
            <div className='min-w-0 flex-1 space-y-[17px]'>
              {activeTab === 'Overview' && (
                <>
                  {/* Deal Alignment */}
                  <section className='rounded-[14px] border border-[#F3F4F6] bg-white px-[21px] pb-5 pt-[21px]'>
                    <h2 className='mb-4 text-[15px] font-semibold tracking-[-0.23px] text-[#1A1A2E]'>
                      Deal Alignment
                    </h2>
                    <div className='flex min-h-[165px] flex-col gap-3 sm:flex-row sm:items-stretch'>
                      <div className='flex min-h-[165px] min-w-0 flex-1 flex-col rounded-[10px] border border-[#3E50F7] bg-[#E5EFFE] p-4'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex gap-2'>
                            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#3E50F7]'>
                              {dealDetails?.owner?.firstName?.charAt(0) ||
                                dealDetails?.dealOwner?.charAt(0) ||
                                data?.organizationName?.charAt(0) ||
                                'U'}
                            </div>
                            <div className='min-w-0'>
                              <p className='text-[13px] font-semibold leading-[19.5px] tracking-[-0.076px] text-[#1A1A2E]'>
                                {dealDetails?.dealOwner ||
                                  data?.organizationName ||
                                  'Your Organization'}
                              </p>
                              <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#222938]'>
                                {dealDetails?.jobTitle || 'Account Executive'}
                              </p>
                              <p className='text-xs leading-4 text-[#64666A]'>
                                {dealDetails?.companyName || 'Sharkdom'}
                              </p>
                            </div>
                          </div>
                          <button
                            type='button'
                            className='flex shrink-0 items-center gap-1.5 rounded border border-[#C8CDF7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1D4AAE]'
                          >
                            <MessageSquare className='size-3' aria-hidden />
                            Message
                          </button>
                        </div>
                        <div className='mt-4 border-t border-dashed border-[#A0B5D3] pt-3'>
                          <div className='flex flex-col gap-1 text-xs text-[#334053]'>
                            <div className='flex items-center gap-1.5'>
                              <CalendarCheck className='size-3.5 shrink-0' />
                              <p>
                                <span className='font-semibold'>
                                  Target Close:
                                </span>{' '}
                                {dealDetails?.closeDate || 'Not set'}
                              </p>
                            </div>
                            <p className='pl-5 text-[10px] text-[#64748B]'>
                              Value: {dealDetails?.amountAcv || 'TBD'}
                            </p>
                          </div>
                        </div>
                        <div className='mt-3 flex justify-end'>
                          <span className='rounded border border-[#1D4AAE] bg-[#DDE8FF] px-2 py-1 text-[11px] font-medium text-[#1D4AAE]'>
                            {dealDetails?.dealStage || 'Discovery'}
                          </span>
                        </div>
                      </div>

                      <div className='flex shrink-0 flex-col items-center justify-center gap-1 py-2 sm:w-[53px] sm:py-0'>
                        <RefreshCw className='size-[18px] text-[#3E50F7]' />
                        <p className='w-[67px] text-center text-[11px] font-bold leading-[15.5px] tracking-[0.06px] text-[#3E50F7]'>
                          Sync Stages
                        </p>
                      </div>

                      <div className='flex min-h-[165px] min-w-0 flex-1 flex-col rounded-[10px] border border-[#6B4FBB] bg-[#F2EDFF] p-4'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex gap-2'>
                            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#6B4FBB]'>
                              {partnerInitial}
                            </div>
                            <div className='min-w-0'>
                              <p className='text-[13px] font-semibold leading-[19.5px] tracking-[-0.076px] text-[#1A1A2E]'>
                                {partnerDealDetails?.dealOwner ||
                                  'Partner Team'}
                              </p>
                              <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#222938]'>
                                {partnerDealDetails?.jobTitle ||
                                  'Account Executive'}
                              </p>
                              <p className='text-xs leading-4 text-[#64666A]'>
                                {partnerDealDetails?.companyName ||
                                  data?.partnerName ||
                                  'Partner Organization'}
                              </p>
                            </div>
                          </div>
                          <button
                            type='button'
                            className='flex shrink-0 items-center gap-1.5 rounded border border-[#C8CDF7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#6B4FBB]'
                          >
                            <MessageSquare className='size-3' aria-hidden />
                            Message
                          </button>
                        </div>
                        <div className='mt-4 border-t border-dashed border-[#A0B5D3] pt-3'>
                          <div className='flex flex-col gap-1 text-xs text-[#334053]'>
                            <div className='flex items-center gap-1.5'>
                              <CalendarCheck className='size-3.5 shrink-0' />
                              <p>
                                <span className='font-semibold'>
                                  Target Close:
                                </span>{' '}
                                {partnerDealDetails?.closeDate || 'Not set'}
                              </p>
                            </div>
                            <p className='pl-5 text-[10px] text-[#64748B]'>
                              Value: {partnerDealDetails?.amountAcv || 'TBD'}
                            </p>
                          </div>
                        </div>
                        <div className='mt-3 flex justify-end'>
                          <span className='rounded border border-[#6B4FBB] bg-[#F2EDFF] px-2 py-1 text-[11px] font-medium text-[#6B4FBB]'>
                            {partnerDealDetails?.dealStage || 'Discovery'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <JointPitchSection
                    partnerOrgId={partnerOrgId}
                    dealId={dealId}
                  />

                  <AgreedNextStepsSection orgId={vendorOrgId} dealId={dealId} />
                </>
              )}

              {activeTab === 'Activity' && (
                <CoSellActivityTimeline
                  partnerOrgId={activityPartnerId}
                  dealId={dealId}
                />
              )}
            </div>

            <CoSellWorkspaceSidebar
              partnerOrgId={partnerIdNum}
              dealId={dealId}
              vendorOrgId={org?.id ? Number(org.id) : null}
              onShareNewAsset={
                activeTab === 'Assets' ? undefined : focusSharedAssetsUpload
              }
            />
          </div>
        )}
      </div>
    </GradientPageBackground>
  )
}
