'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

export type TierKind = 'champion' | 'referral'
export type StatusKind =
  | 'demo_scheduled'
  | 'accepted'
  | 'declined'
  | 'onboarded'
  | 'under_review'

export interface LeadApiRecord {
  id: number
  userId: string
  companyName: string
  companyWebsite: string
  industry: string
  companySize: string
  geography: string
  estimatedAcv: number
  contactName: string
  contactTitle: string
  contactEmail: string
  contactLinkedIn: string
  buyingIntentSignal: string
  leadTemperature: string
  involvementLevel: string
  preferredMeetingFormat: string
  messageToSharkdomTeam: string
  estimatedCommission: number
  rate: number
  leadStatus: string
  partnershipTier: string
  paymentDate: string
  paymentStatus: string
  invoiceLink: string
  assignedAe: string
  createdAt?: string
}

function mapBackendStatus(s: string): StatusKind {
  if (s === 'DEMO_SCHEDULED') return 'demo_scheduled'
  if (s === 'ACCEPTED') return 'accepted'
  if (s === 'DECLINED') return 'declined'
  if (s === 'ONBOARDED') return 'onboarded'
  return 'under_review'
}

function mapBackendTier(s: string): TierKind {
  return s === 'CHAMPION_PARTNER' ? 'champion' : 'referral'
}

type StatusFilter =
  | 'all'
  | 'under_review'
  | 'in_progress'
  | 'onboarded'
  | 'declined'

type TierFilter = 'all' | TierKind

const STATUS_IN_PROGRESS: StatusKind[] = ['demo_scheduled', 'accepted']

const STATUS_TAB_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'onboarded', label: 'Onboarded' },
  { id: 'declined', label: 'Declined' }
]

const TIER_TAB_OPTIONS: { id: TierFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'champion', label: 'Champion' },
  { id: 'referral', label: 'Referral' }
]

function TierBadge({ tier }: { tier: TierKind }) {
  const champion = tier === 'champion'
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.275px]',
        champion
          ? 'bg-[rgba(245,166,35,0.2)] text-[#B8860B]'
          : 'bg-[#E5E7EB] text-[#4A5565]'
      )}
    >
      {champion ? 'Champion Partner' : 'Referral Partner'}
    </span>
  )
}

function StatusPill({ status }: { status: StatusKind }) {
  const styles: Record<StatusKind, { label: string; className: string }> = {
    demo_scheduled: {
      label: 'Demo Scheduled',
      className: 'bg-[rgba(107,79,187,0.15)] text-[#6863FB]'
    },
    accepted: {
      label: 'Accepted',
      className: 'bg-[rgba(26,106,181,0.15)] text-[#1A6AB5]'
    },
    declined: {
      label: 'Declined',
      className: 'bg-[rgba(192,57,43,0.15)] text-[#C0392B]'
    },
    onboarded: {
      label: 'Onboarded',
      className: 'bg-[rgba(26,122,74,0.15)] text-[#1A7A4A]'
    },
    under_review: {
      label: 'Under Review',
      className: 'bg-[#E5E7EB] text-[#364153]'
    }
  }
  const s = styles[status]
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase leading-4 tracking-[0.275px]',
        s.className
      )}
    >
      {status === 'declined' && <span className='mr-0.5'>❌ </span>}
      {status === 'onboarded' && <span className='mr-0.5'>✅ </span>}
      {s.label}
    </span>
  )
}

function SegmentTabs<T extends string>({
  value,
  onChange,
  options
}: {
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string }[]
}) {
  return (
    <div className='inline-flex gap-1 rounded-[10px] bg-[#F3F4F6] p-1'>
      {options.map((opt) => (
        <button
          key={opt.id}
          type='button'
          onClick={() => onChange(opt.id)}
          className={cn(
            'h-[30px] shrink-0 whitespace-nowrap rounded-lg px-3 text-center text-xs leading-[18px] transition-colors',
            value === opt.id
              ? 'bg-white font-bold text-[#1A1A2E] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card'
              : 'font-normal text-[#6A7282] hover:text-[#364153]'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function matchesStatusFilter(
  row: LeadApiRecord,
  status: StatusFilter
): boolean {
  if (status === 'all') return true
  const mapped = mapBackendStatus(row.leadStatus)
  if (status === 'under_review') return mapped === 'under_review'
  if (status === 'onboarded') return mapped === 'onboarded'
  if (status === 'declined') return mapped === 'declined'
  return STATUS_IN_PROGRESS.includes(mapped)
}

const PAGE_SIZE = 10

export function PartnerLeadDirectoryView() {
  const { user, token } = usePartnerSession()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [search, setSearch] = useState('')
  const [leads, setLeads] = useState<LeadApiRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1) // 1-indexed for display & API
  const [totalPages, setTotalPages] = useState(1)

  // Dialog State
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [leadDetails, setLeadDetails] = useState<LeadApiRecord | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  useEffect(() => {
    async function fetchLeads() {
      if (!token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/partner-leads?page=${page}&size=${PAGE_SIZE}`,
          {
            headers: {
              Accept: 'application/hal+json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setLeads(json.data?.content || [])
            const tp = json.data?.totalPages ?? 1
            setTotalPages(tp < 1 ? 1 : tp)
          }
        } else {
          toast.error('Failed to load leads.')
        }
      } catch (err) {
        console.error('Failed to fetch leads list:', err)
        toast.error('Failed to load leads.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeads()
  }, [token, page])

  async function handleViewLead(id: number) {
    setSelectedLeadId(id)
    setIsDetailsLoading(true)
    setLeadDetails(null)

    try {
      const res = await fetch(`/api/api/v1/partner/lead/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setLeadDetails(json.data)
        } else {
          toast.error(json.message || 'Error loading lead details.')
        }
      } else {
        toast.error('Failed to fetch lead details.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error.')
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((row) => {
      if (!matchesStatusFilter(row, statusFilter)) return false
      if (
        tierFilter !== 'all' &&
        mapBackendTier(row.partnershipTier) !== tierFilter
      )
        return false
      if (q && !row.companyName?.toLowerCase().includes(q)) return false
      return true
    })
  }, [search, statusFilter, tierFilter, leads])

  return (
    <PartnerProgramPortalScaffold mainClassName='flex-1 overflow-y-auto p-6'>
      <div className='mx-auto w-full max-w-[1283px]'>
        <h1 className='text-2xl font-bold leading-9 text-[#1A1A2E]'>
          My Leads
        </h1>

        <div className='mt-4 flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center xl:justify-between'>
          <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
            <SegmentTabs
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_TAB_OPTIONS}
            />
            <SegmentTabs
              value={tierFilter}
              onChange={setTierFilter}
              options={TIER_TAB_OPTIONS}
            />
          </div>
          <div className='relative w-full min-w-0 xl:max-w-[636px] xl:flex-1'>
            <Search
              className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#99A1AF]'
              strokeWidth={1.33}
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by company name...'
              className='h-[39px] w-full rounded-[10px] border border-[#E5E7EB] bg-white pl-10 pr-4 text-sm text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus-visible:ring-[#6863FB] dark:bg-card dark:placeholder:text-white'
              aria-label='Search by company name'
            />
          </div>
        </div>

        <div
          className={`mt-6 overflow-hidden rounded-[14px] border border-[#F3F4F6] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card ${isLoading ? 'opacity-70 transition-opacity' : ''}`}
        >
          {filteredRows.length === 0 && !isLoading ? (
            <p className='px-6 py-12 text-center text-sm text-[#6A7282]'>
              No leads match your filters.
            </p>
          ) : (
            <div className='w-full overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='h-[41px] border-[#F3F4F6] hover:!bg-transparent focus:!bg-transparent'>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      Company
                    </TableHead>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      Tier
                    </TableHead>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      Status
                    </TableHead>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      AE Assigned
                    </TableHead>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      Est. Commission
                    </TableHead>
                    <TableHead className='h-[41px] whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      Submitted
                    </TableHead>
                    <TableHead className='h-[41px] w-[90px] whitespace-nowrap text-right text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className='h-[53px] border-[#F9FAFB] hover:bg-[#F9FAFB] dark:bg-muted/50'
                    >
                      <TableCell className='py-4 text-sm font-medium text-[#0A0A0A]'>
                        {row.companyName}
                      </TableCell>
                      <TableCell className='py-4'>
                        <TierBadge tier={mapBackendTier(row.partnershipTier)} />
                      </TableCell>
                      <TableCell className='py-4'>
                        <StatusPill status={mapBackendStatus(row.leadStatus)} />
                      </TableCell>
                      <TableCell className='py-4 text-sm text-[#4A5565]'>
                        {row.assignedAe || '-'}
                      </TableCell>
                      <TableCell className='py-4 text-sm text-[#4A5565]'>
                        {row.estimatedCommission
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0
                            }).format(row.estimatedCommission)
                          : '-'}
                      </TableCell>
                      <TableCell className='py-4 text-[13px] text-[#99A1AF]'>
                        {row.createdAt || '-'}
                      </TableCell>
                      <TableCell className='py-4 text-right'>
                        <button
                          type='button'
                          onClick={() => handleViewLead(row.id)}
                          className='inline-flex h-7 min-w-[70px] items-center justify-center rounded-[10px] border border-[#D1D5DC] px-2 text-xs font-bold leading-[18px] text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
                        >
                          View →
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-center gap-2'>
            <button
              type='button'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#4A5565] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-card'
              aria-label='Previous page'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type='button'
                onClick={() => setPage(p)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                  p === page
                    ? 'border-[#6863FB] bg-[#6863FB] text-white'
                    : 'border-[#E5E7EB] bg-white text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-card'
                }`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ))}

            <button
              type='button'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#4A5565] hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-card'
              aria-label='Next page'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>

      <Dialog
        open={selectedLeadId !== null}
        onOpenChange={(open) => !open && setSelectedLeadId(null)}
      >
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {isDetailsLoading ? (
            <div className='py-8 text-center text-sm text-[#6A7282]'>
              Loading details...
            </div>
          ) : leadDetails ? (
            <div className='grid gap-6 py-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>Company</p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.companyName}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>Status</p>
                  <div className='mt-1'>
                    <StatusPill
                      status={mapBackendStatus(leadDetails.leadStatus)}
                    />
                  </div>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>
                    Contact Name
                  </p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.contactName}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>
                    Contact Email
                  </p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.contactEmail || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>Industry</p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.industry || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>Est. ACV</p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(leadDetails.estimatedAcv || 0)}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>
                    Temperature
                  </p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.leadTemperature}
                  </p>
                </div>
                <div>
                  <p className='text-xs font-bold text-[#99A1AF]'>
                    Assigned AE
                  </p>
                  <p className='text-sm font-medium text-[#1A1A2E]'>
                    {leadDetails.assignedAe || 'Unassigned'}
                  </p>
                </div>
              </div>

              {leadDetails.buyingIntentSignal && (
                <div className='rounded-lg bg-[#F9FAFB] p-3 dark:bg-muted'>
                  <p className='mb-1 text-xs font-bold text-[#99A1AF]'>
                    Buying Intent Signal
                  </p>
                  <p className='text-sm text-[#4A5565]'>
                    {leadDetails.buyingIntentSignal}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className='py-8 text-center text-sm text-red-500'>
              Failed to load details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PartnerProgramPortalScaffold>
  )
}
