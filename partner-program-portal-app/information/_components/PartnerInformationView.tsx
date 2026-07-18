'use client'

import { useCallback, useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import { usePartnerSession } from '@/app/partner-program-portal-app/_components/PartnerSessionContext'

const cardClassName =
  'rounded-[14px] border border-[#F3F4F6] bg-white dark:bg-card shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]'

export interface PartnerUserApiRecord {
  id: number
  fullName: string
  email: string
  userId: string
  linkedInProfileUrl: string
  companyName: string
  geography: string
  companiesAdvised: string
  primaryGtmFocus: string[]
  howDidYouHearAboutProgram: string
  partnershipTier: string
  networkDescription: string
  referCode: string
  active: boolean
}

function TierBadge({ tier }: { tier: string }) {
  const isChampion = tier === 'CHAMPION_PARTNER'
  return (
    <div
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 ${isChampion ? 'bg-[rgba(245,166,35,0.2)]' : 'bg-[#E5E7EB]'}`}
    >
      <span
        className={`text-[11px] font-bold uppercase leading-4 tracking-[0.275px] ${isChampion ? 'text-[#B8860B]' : 'text-[#4A5565]'}`}
      >
        {isChampion ? 'Champion Partner' : 'Referral Partner'}
      </span>
    </div>
  )
}

export function PartnerInformationView() {
  const { user, token } = usePartnerSession()
  const [partnerInfo, setPartnerInfo] = useState<PartnerUserApiRecord | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)

  const [preferences, setPreferences] = useState({
    leadStatus: true,
    commission: true,
    weeklyDigest: false,
    programAnnouncements: true
  })

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    linkedInProfileUrl: ''
  })

  // Edit Referral Code State
  const [isEditReferralModalOpen, setIsEditReferralModalOpen] = useState(false)
  const [isSavingReferral, setIsSavingReferral] = useState(false)
  const [editReferralCode, setEditReferralCode] = useState('')

  useEffect(() => {
    async function fetchUserInfo() {
      if (!user?.uid || !token) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/api/v1/partner/user/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setPartnerInfo(json.data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch partner user info:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserInfo()
  }, [user?.uid, token])

  const referralUrl = partnerInfo?.referCode
    ? `https://sharkdom.com/partners?ref=${partnerInfo.referCode}`
    : ''

  const copyReferral = useCallback(async () => {
    if (!referralUrl) return
    try {
      await navigator.clipboard.writeText(referralUrl)
      toast.success('Referral link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }, [referralUrl])

  function handleEditProfile() {
    setEditForm({
      fullName: partnerInfo?.fullName || '',
      email: partnerInfo?.email || '',
      linkedInProfileUrl: partnerInfo?.linkedInProfileUrl || ''
    })
    setIsEditModalOpen(true)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.uid || !token) {
      toast.error('Authentication missing')
      return
    }

    setIsSaving(true)
    try {
      const updatedData = {
        ...(partnerInfo || {}),
        fullName: editForm.fullName,
        email: editForm.email,
        linkedInProfileUrl: editForm.linkedInProfileUrl
      }

      const res = await fetch(`/api/api/v1/partner/user/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setPartnerInfo(json.data)
          toast.success('Profile updated successfully')
          setIsEditModalOpen(false)
        } else {
          toast.error(json.message || 'Error updating profile')
        }
      } else {
        toast.error('Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error while updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  function handleEditReferral() {
    setEditReferralCode(partnerInfo?.referCode || '')
    setIsEditReferralModalOpen(true)
  }

  async function handleSaveReferral(e: React.FormEvent) {
    e.preventDefault()
    if (!partnerInfo?.email || !token) {
      toast.error('Authentication or email missing')
      return
    }

    setIsSavingReferral(true)
    try {
      const res = await fetch('/api/api/v1/partner/referral-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: partnerInfo.email,
          referralCode: editReferralCode
        })
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setPartnerInfo({ ...partnerInfo, referCode: editReferralCode })
          toast.success('Referral code updated successfully')
          setIsEditReferralModalOpen(false)
        } else {
          toast.error(json.message || 'Error updating referral code')
        }
      } else {
        toast.error('Failed to update referral code')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error while updating referral code')
    } finally {
      setIsSavingReferral(false)
    }
  }

  function handleAddPayment() {
    toast.message('Add payment method (demo — API not connected yet).')
  }

  return (
    <PartnerProgramPortalScaffold mainClassName='flex-1 overflow-y-auto px-6 pb-28 pt-6'>
      <div className='w-full max-w-[672px]'>
        <h1 className='text-2xl font-bold leading-9 text-[#1A1A2E]'>
          Profile & Settings
        </h1>

        <div
          className={`mt-[60px] flex flex-col gap-4 ${isLoading ? 'opacity-70 transition-opacity' : ''}`}
        >
          <section
            className={`${cardClassName} flex flex-col gap-4 p-[25px] pb-6`}
          >
            <div className='flex h-10 items-center justify-between gap-4'>
              <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
                Personal Info
              </h2>
              <button
                type='button'
                onClick={handleEditProfile}
                className='flex h-10 items-center justify-center rounded-[10px] border border-solid border-[#D1D5DC] px-5 text-xs font-bold leading-[18px] text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
              >
                Edit
              </button>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium leading-[18px] text-[#6A7282]'>
                  Name
                </span>
                <p className='text-sm font-normal leading-[21px] text-[#1A1A2E]'>
                  {partnerInfo?.fullName || '-'}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium leading-[18px] text-[#6A7282]'>
                  Email
                </span>
                <p className='text-sm font-normal leading-[21px] text-[#1A1A2E]'>
                  {partnerInfo?.email || '-'}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-xs font-medium leading-[18px] text-[#6A7282]'>
                  LinkedIn URL
                </span>
                <p className='text-sm font-normal leading-[21px] text-[#1A1A2E]'>
                  {partnerInfo?.linkedInProfileUrl || '-'}
                </p>
              </div>
            </div>
          </section>

          <section
            className={`${cardClassName} flex flex-col gap-3 p-[25px] pb-6`}
          >
            <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
              Your Tier
            </h2>
            <TierBadge tier={partnerInfo?.partnershipTier || ''} />
          </section>

          <section
            className={`${cardClassName} flex flex-col gap-3 p-[25px] pb-6`}
          >
            <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
              Payment Details
            </h2>
            <p className='text-sm font-normal leading-[21px] text-[#6A7282]'>
              No payment method configured yet.
            </p>
            <button
              type='button'
              onClick={handleAddPayment}
              className='h-10 w-fit rounded-[10px] bg-[#6863FB] px-5 text-[13px] font-bold leading-5 text-white hover:bg-[#5d44a3]'
            >
              Add Payment Method
            </button>
          </section>

          <section className={`${cardClassName} p-[25px] pb-6`}>
            <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
              Notification Preferences
            </h2>
            <ul className='mt-4 flex flex-col'>
              <li className='flex items-center justify-between gap-4 py-2'>
                <span className='text-sm font-normal leading-[21px] text-[#364153]'>
                  Lead status updates
                </span>
                <Switch
                  checked={preferences.leadStatus}
                  onCheckedChange={(v) =>
                    setPreferences((p) => ({ ...p, leadStatus: v }))
                  }
                  className='h-6 w-10 shrink-0 border-0 data-[state=checked]:bg-[#6863FB] data-[state=unchecked]:bg-[#D1D5DC] dark:bg-card [&>span]:size-4 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0'
                  aria-label='Lead status updates'
                />
              </li>
              <li className='flex items-center justify-between gap-4 py-2'>
                <span className='text-sm font-normal leading-[21px] text-[#364153]'>
                  Commission updates
                </span>
                <Switch
                  checked={preferences.commission}
                  onCheckedChange={(v) =>
                    setPreferences((p) => ({ ...p, commission: v }))
                  }
                  className='h-6 w-10 shrink-0 border-0 data-[state=checked]:bg-[#6863FB] data-[state=unchecked]:bg-[#D1D5DC] dark:bg-card [&>span]:size-4 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0'
                  aria-label='Commission updates'
                />
              </li>
              <li className='flex items-center justify-between gap-4 py-2'>
                <span className='text-sm font-normal leading-[21px] text-[#364153]'>
                  Weekly digest
                </span>
                <Switch
                  checked={preferences.weeklyDigest}
                  onCheckedChange={(v) =>
                    setPreferences((p) => ({ ...p, weeklyDigest: v }))
                  }
                  className='h-6 w-10 shrink-0 border-0 data-[state=checked]:bg-[#6863FB] data-[state=unchecked]:bg-[#D1D5DC] dark:bg-card [&>span]:size-4 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0'
                  aria-label='Weekly digest'
                />
              </li>
              <li className='flex items-center justify-between gap-4 py-2'>
                <span className='text-sm font-normal leading-[21px] text-[#364153]'>
                  New program announcements
                </span>
                <Switch
                  checked={preferences.programAnnouncements}
                  onCheckedChange={(v) =>
                    setPreferences((p) => ({ ...p, programAnnouncements: v }))
                  }
                  className='h-6 w-10 shrink-0 border-0 data-[state=checked]:bg-[#6863FB] data-[state=unchecked]:bg-[#D1D5DC] dark:bg-card [&>span]:size-4 [&>span]:bg-white [&>span]:data-[state=checked]:translate-x-5 [&>span]:data-[state=unchecked]:translate-x-0'
                  aria-label='New program announcements'
                />
              </li>
            </ul>
          </section>

          <section
            className={`${cardClassName} flex flex-col gap-4 p-[25px] pb-6`}
          >
            <div className='flex h-10 items-center justify-between gap-4'>
              <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
                Your Referral Link
              </h2>
              <button
                type='button'
                onClick={handleEditReferral}
                className='flex h-10 items-center justify-center rounded-[10px] border border-solid border-[#D1D5DC] px-5 text-xs font-bold leading-[18px] text-[#4A5565] hover:bg-[#F9FAFB] dark:bg-muted'
              >
                Edit
              </button>
            </div>
            <p className='text-[13px] font-normal leading-5 text-[#6A7282]'>
              Share this link to recruit other consultants and earn a bonus.
            </p>
            <div className='flex items-center gap-2'>
              <div className='min-h-[38px] min-w-0 flex-1 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] py-2 dark:bg-muted'>
                <p className='truncate text-[13px] font-normal leading-5 text-[#4A5565]'>
                  {referralUrl || 'Generating...'}
                </p>
              </div>
              <button
                type='button'
                onClick={copyReferral}
                className='flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#6863FB] text-white hover:bg-[#5d44a3]'
                aria-label='Copy referral link'
              >
                <Copy className='size-4' strokeWidth={1.33} aria-hidden />
              </button>
            </div>
          </section>

          <section className={`${cardClassName} p-[25px] pb-6`}>
            <h2 className='text-base font-bold leading-6 text-[#1A1A2E]'>
              Account Status
            </h2>
            <div
              className={`mt-4 inline-flex w-fit rounded-full px-2.5 py-0.5 ${partnerInfo?.active ? 'bg-[rgba(26,122,74,0.15)]' : 'bg-red-100'}`}
            >
              <span
                className={`text-[11px] font-bold uppercase leading-4 tracking-[0.275px] ${partnerInfo?.active ? 'text-[#1A7A4A]' : 'text-red-700'}`}
              >
                {partnerInfo?.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className='grid gap-4 py-4'>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fullName'
                className='text-xs font-bold text-[#6A7282]'
              >
                Full Name
              </label>
              <Input
                id='fullName'
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='email'
                className='text-xs font-bold text-[#6A7282]'
              >
                Email Address
              </label>
              <Input
                id='email'
                type='email'
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='linkedInProfileUrl'
                className='text-xs font-bold text-[#6A7282]'
              >
                LinkedIn URL
              </label>
              <Input
                id='linkedInProfileUrl'
                type='url'
                value={editForm.linkedInProfileUrl}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    linkedInProfileUrl: e.target.value
                  })
                }
              />
            </div>
            <DialogFooter className='mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-[#6863FB] text-white hover:bg-[#5d44a3]'
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditReferralModalOpen}
        onOpenChange={setIsEditReferralModalOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Referral Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveReferral} className='grid gap-4 py-4'>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='referralCode'
                className='text-xs font-bold text-[#6A7282]'
              >
                Custom Code
              </label>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-[#6A7282]'>
                  https://sharkdom.com/partners?ref=
                </span>
                <Input
                  id='referralCode'
                  value={editReferralCode}
                  onChange={(e) => setEditReferralCode(e.target.value)}
                  className='flex-1'
                  required
                />
              </div>
            </div>
            <DialogFooter className='mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditReferralModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-[#6863FB] text-white hover:bg-[#5d44a3]'
                disabled={isSavingReferral}
              >
                {isSavingReferral ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PartnerProgramPortalScaffold>
  )
}
