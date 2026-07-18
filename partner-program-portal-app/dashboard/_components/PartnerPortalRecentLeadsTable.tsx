import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'
import {
  type LeadApiRecord,
  type StatusKind,
  type TierKind
} from '@/app/partner-program-portal-app/lead-directory/_components/PartnerLeadDirectoryView'

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

export function PartnerPortalRecentLeadsTable() {
  const { user, token } = usePartnerSession()
  const router = useRouter()
  const [leads, setLeads] = useState<LeadApiRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

      try {
        const res = await fetch('/api/partner-leads?page=1&size=5', {
          headers: {
            Accept: 'application/hal+json',
            Authorization: `Bearer ${token}`
          }
        })
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setLeads(json.data?.content || [])
          }
        }
      } catch (err) {
        console.error('Failed to fetch recent leads:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeads()
  }, [token])

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

  return (
    <div
      className={`rounded-[14px] border border-[#F3F4F6] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-card ${isLoading ? 'opacity-70 transition-opacity' : ''}`}
    >
      <div className='flex flex-row flex-wrap items-center justify-between gap-4 border-b border-[#F3F4F6] px-6 py-4'>
        <h2 className='text-xl font-bold leading-[30px] text-[#1A1A2E]'>
          Recent Leads
        </h2>
        <Button
          type='button'
          variant='outline'
          onClick={() =>
            router.push('/partner-program-portal-app/lead-directory')
          }
          className='h-[41.5px] rounded-[10px] border-[#D1D5DC] px-5 text-[13px] font-bold text-[#4A5565]'
        >
          View All →
        </Button>
      </div>
      <div className='w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-[#F9FAFB] hover:!bg-transparent focus:!bg-transparent'>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Company
              </TableHead>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Tier
              </TableHead>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Status
              </TableHead>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                AE Assigned
              </TableHead>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Est. Commission
              </TableHead>
              <TableHead className='whitespace-nowrap text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Submitted
              </TableHead>
              <TableHead className='whitespace-nowrap text-right text-[11px] font-bold uppercase leading-4 tracking-[0.275px] text-[#6A7282]'>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-8 text-center text-sm text-[#6A7282]'
                >
                  No recent leads found.
                </TableCell>
              </TableRow>
            )}
            {leads.map((row) => (
              <TableRow
                key={row.id}
                className='border-[#F9FAFB] hover:bg-[#F9FAFB] dark:bg-muted/50'
              >
                <TableCell className='font-medium text-[#0A0A0A]'>
                  {row.companyName}
                </TableCell>
                <TableCell>
                  <TierBadge tier={mapBackendTier(row.partnershipTier)} />
                </TableCell>
                <TableCell>
                  <StatusPill status={mapBackendStatus(row.leadStatus)} />
                </TableCell>
                <TableCell className='text-sm text-[#4A5565]'>
                  {row.assignedAe || '-'}
                </TableCell>
                <TableCell className='text-sm text-[#4A5565]'>
                  {row.estimatedCommission
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                      }).format(row.estimatedCommission)
                    : '-'}
                </TableCell>
                <TableCell className='text-xs text-[#53637F]'>
                  {row.createdAt || '-'}
                </TableCell>
                <TableCell className='text-right'>
                  <button
                    type='button'
                    onClick={() => handleViewLead(row.id)}
                    className='inline-flex h-7 items-center justify-center rounded-[10px] border border-[#D1D5DC] px-3 text-xs font-bold leading-[18px] text-[#2563EB] hover:bg-[#F9FAFB] dark:bg-muted'
                  >
                    View →
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  )
}
