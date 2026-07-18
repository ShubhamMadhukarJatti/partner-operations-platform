'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePartnerActivity } from '@/http-hooks/partner-activities'
import type { RootState } from '@/redux/store'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  Loader2,
  Lock,
  Pencil,
  RefreshCw,
  Upload,
  X,
  Zap
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'
import { showCustomToast } from '@/components/custom-toast'

import {
  useCreateSharedAsset,
  useDealOwnerDetails,
  useGenerateIntro,
  useSendCoSellNotification,
  useSharedAssets
} from '../api'

function formatStage(stage: string) {
  return stage
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ')
}

function formatACV(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

type CoSellLabels = {
  accountName: string
  partnerName: string
  yourStageLabel: string
  partnerStageLabel: string
  opportunityScore: number
  estimatedACV: number
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CoSellMotion = 'joint-intro' | 'co-sell-pursuit' | 'partner-led'
type MessageTone = 'professional' | 'direct' | 'casual'
type SendVia = 'sharkdom' | 'linkedin' | 'email'

// ─── Stepper ──────────────────────────────────────────────────────────────────

function StepBadge({
  step,
  label,
  state
}: {
  step: number
  label: string
  state: 'active' | 'completed' | 'idle'
}) {
  return (
    <div className='flex items-center gap-2'>
      {step > 1 && <div className='h-px w-8 bg-[#D1D5DC]' />}
      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-0.5 ${
          state === 'active'
            ? 'bg-[#3E50F7] text-white'
            : 'bg-[#F5F5F5] text-[#4A5565]'
        }`}
      >
        {state === 'completed' ? (
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-[#38B000]'>
            <Check size={9} color='white' strokeWidth={3} />
          </div>
        ) : (
          <span className='text-xs font-semibold leading-4'>{step}</span>
        )}
        <span className='text-xs font-semibold leading-4'>{label}</span>
      </div>
    </div>
  )
}

// ─── Step 1 sub-components ────────────────────────────────────────────────────

function CoSellMotionOption({
  id,
  icon,
  title,
  description,
  selected,
  onSelect
}: {
  id: CoSellMotion
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  onSelect: (id: CoSellMotion) => void
}) {
  return (
    <button
      type='button'
      onClick={() => onSelect(id)}
      className={`flex w-full items-start gap-5 rounded-2xl px-5 py-[18px] text-left transition-all ${
        selected
          ? 'bg-[#F5F0FF] outline outline-1 outline-[#6B4FBB]'
          : 'bg-white outline outline-1 outline-[#EEEEEE] hover:outline-[#C4AFF0]'
      }`}
    >
      <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#4D5C78]'>
        {icon}
      </div>
      <div className='flex flex-col gap-0.5'>
        <span className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          {title}
        </span>
        <span className='text-xs leading-4 text-[#6A7282]'>{description}</span>
      </div>
    </button>
  )
}

function ResourceChip({
  emoji,
  label,
  selected,
  recommended,
  isUploading,
  fileUrl,
  onClick
}: {
  emoji: string
  label: string
  selected?: boolean
  recommended?: string
  isUploading?: boolean
  fileUrl?: string | null
  onClick?: () => void
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={isUploading}
      className='group flex flex-col items-start gap-1'
    >
      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
          fileUrl
            ? 'bg-[#EEE8FF] font-bold text-[#6B4FBB] outline outline-1 outline-[#6B4FBB]'
            : 'bg-white text-[#666666] outline outline-1 outline-[#EEEEEE] hover:outline-[#C4AFF0]'
        }`}
      >
        {isUploading ? (
          <Loader2 size={11} className='animate-spin' />
        ) : (
          <span className='text-xs'>{emoji}</span>
        )}
        <span className='text-xs'>{label}</span>
        {fileUrl && <Check size={11} className='text-[#6B4FBB]' />}
        {!fileUrl && !isUploading && (
          <Upload
            size={10}
            className='text-[#999999] opacity-0 transition-opacity group-hover:opacity-100'
          />
        )}
      </div>
      {recommended && !fileUrl && (
        <span className='pl-1 text-[10px] italic text-[#1A7A4A]'>
          {recommended}
        </span>
      )}
      {fileUrl && (
        <span className='pl-1 text-[10px] font-medium text-[#6B4FBB]'>
          File attached
        </span>
      )}
    </button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IntroIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z'
        fill='#4D5C78'
      />
      <path
        d='M3 20C3 17.2386 7.02944 15 12 15C16.9706 15 21 17.2386 21 20'
        stroke='#4D5C78'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function PursuitIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='2'
        stroke='#4D5C78'
        strokeWidth='2'
      />
      <path d='M3 9h18M9 21V9' stroke='#4D5C78' strokeWidth='2' />
    </svg>
  )
}

function PartnerLedIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
        fill='#4D5C78'
      />
    </svg>
  )
}

// ─── Step 2 sub-components ────────────────────────────────────────────────────

function SendViaOption({
  id,
  icon,
  title,
  subtitle,
  selected,
  onSelect
}: {
  id: SendVia
  icon: React.ReactNode
  title: string
  subtitle: string
  selected: boolean
  onSelect: (id: SendVia) => void
}) {
  return (
    <button
      type='button'
      onClick={() => onSelect(id)}
      className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-3.5 text-left transition-all ${
        selected
          ? 'bg-[#F5F0FF] outline outline-1 outline-[#6B4FBB]'
          : 'bg-white outline outline-1 outline-[#EEEEEE] hover:outline-[#C4AFF0]'
      }`}
    >
      <div className='flex h-6 w-6 shrink-0 items-center justify-center text-[#2A3241]'>
        {icon}
      </div>
      <div className='flex flex-1 flex-col gap-0.5'>
        <span className='text-xs font-semibold leading-4 text-[#1A1A2E]'>
          {title}
        </span>
        <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
          {subtitle}
        </span>
      </div>
      {/* Radio */}
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          selected
            ? 'outline outline-2 outline-[#6B4FBB]'
            : 'border-2 border-[#CCCCCC]'
        }`}
      >
        {selected && <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />}
      </div>
    </button>
  )
}

// ─── Step content components ──────────────────────────────────────────────────

function Step1Content({
  labels,
  selectedMotion,
  setSelectedMotion,
  customPitch,
  setCustomPitch,
  resources,
  onUploadResource,
  uploadingLabel,
  ownerNameToShow
}: {
  labels: CoSellLabels
  selectedMotion: CoSellMotion
  setSelectedMotion: (v: CoSellMotion) => void
  customPitch: string
  setCustomPitch: (v: string) => void
  resources: Array<{
    emoji: string
    label: string
    recommended?: string
    fileUrl?: string | null
  }>
  onUploadResource: (label: string) => void
  uploadingLabel: string | null
  ownerNameToShow?: string
}) {
  const motions = [
    {
      id: 'joint-intro' as CoSellMotion,
      icon: <IntroIcon />,
      title: 'Joint Introduction',
      description:
        'Partner makes a warm intro of your team to the account. Best when partner already has relationship.'
    },
    {
      id: 'co-sell-pursuit' as CoSellMotion,
      icon: <PursuitIcon />,
      title: 'Co-sell Pursuit',
      description:
        'Both AEs work the account together from this point forward. Share contacts, calls, proposals.'
    },
    {
      id: 'partner-led' as CoSellMotion,
      icon: <PartnerLedIcon />,
      title: 'Partner-Led with Support',
      description:
        'Partner owns the deal. You provide technical support and co-marketing materials only.'
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      {/* Co-sell motion */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What type of co-sell motion?
        </h3>
        <div className='flex flex-col gap-2'>
          {motions.map((m) => (
            <CoSellMotionOption
              key={m.id}
              {...m}
              selected={selectedMotion === m.id}
              onSelect={setSelectedMotion}
            />
          ))}
        </div>
      </div>

      {/* Owner */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Who owns this from your side?
        </h3>
        <div className='flex items-center gap-2 rounded-[10px] bg-[#F8F9FB] px-4 py-2.5 outline outline-1 outline-[#EEEEEE]'>
          <span className='text-[13px] font-semibold leading-[19.5px] text-[#364153]'>
            {ownerNameToShow || 'Your account owner'}
          </span>
        </div>
      </div>

      {/* Joint pitch */}
      <div className='flex flex-col gap-4'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What&apos;s the joint pitch to {labels.accountName}?
        </h3>

        <div className='flex flex-col gap-2'>
          <span className='text-xs font-medium leading-4 text-[#2F3B51]'>
            Write your joint value prop:
          </span>

          <div className='relative'>
            <textarea
              value={customPitch}
              onChange={(e) => setCustomPitch(e.target.value)}
              maxLength={280}
              placeholder={`Describe why ${labels.accountName} should hear from both companies together...`}
              rows={4}
              className='w-full resize-none rounded-[10px] p-3 text-[13px] leading-[19.5px] text-[#4A5565] outline outline-1 outline-[#E5E7EB] placeholder:text-[#4A5565]/50 focus:outline-[#6B4FBB] focus:ring-0'
            />
            <span className='absolute bottom-2.5 right-3 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
              {customPitch.length}/280
            </span>
          </div>
        </div>
      </div>

      {/* Attach resources */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Attach resources for partner
        </h3>
        <div className='flex flex-wrap gap-2'>
          {resources.map((r) => (
            <ResourceChip
              key={r.label}
              emoji={r.emoji}
              label={r.label}
              fileUrl={r.fileUrl}
              recommended={r.recommended}
              isUploading={uploadingLabel === r.label}
              onClick={() => onUploadResource(r.label)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Step2Content({
  labels,
  messageTone,
  setMessageTone,
  sendVia,
  setSendVia,
  urgent,
  setUrgent,
  generatedContent,
  onGenerateAI,
  isGenerating,
  isEditingMessage,
  setIsEditingMessage,
  customSubject,
  setCustomSubject,
  customBody,
  setCustomBody,
  partnerOwnerName,
  ownerNameToShow
}: {
  labels: CoSellLabels
  messageTone: MessageTone
  setMessageTone: (v: MessageTone) => void
  sendVia: SendVia
  setSendVia: (v: SendVia) => void
  urgent: boolean
  setUrgent: (v: boolean) => void
  generatedContent?: { subject: string; body: string }
  onGenerateAI: () => void
  isGenerating?: boolean
  isEditingMessage: boolean
  setIsEditingMessage: (v: boolean) => void
  customSubject: string
  setCustomSubject: (v: string) => void
  customBody: string
  setCustomBody: (v: string) => void
  partnerOwnerName?: string
  ownerNameToShow?: string
}) {
  const sendOptions: {
    id: SendVia
    icon: React.ReactNode
    title: string
    subtitle: string
  }[] = [
    {
      id: 'sharkdom',
      icon: (
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
          <rect width='22' height='22' rx='4' fill='#2563EB' />
          <path
            d='M7 15L11 7L15 15'
            stroke='white'
            strokeWidth='1.5'
            strokeLinejoin='round'
          />
          <path
            d='M8.5 12.5h5'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      ),
      title: 'Sharkdom Notification',
      subtitle: 'Partner receives in-app + email notification'
    },
    {
      id: 'email',
      icon: (
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
          <rect width='22' height='22' rx='4' fill='#2A3241' />
          <rect
            x='3'
            y='6'
            width='16'
            height='11'
            rx='1.5'
            stroke='white'
            strokeWidth='1.5'
          />
          <path
            d='M3 7.5l8 5.5 8-5.5'
            stroke='white'
            strokeWidth='1.5'
            strokeLinejoin='round'
          />
        </svg>
      ),
      title: 'Email Direct',
      subtitle: 'Opens in your email client'
    }
  ]

  return (
    <div className='flex flex-col gap-5'>
      {/* Title */}
      <div className='flex flex-col gap-1'>
        <h3 className='text-lg font-semibold leading-7 text-[#1A1A2E]'>
          Notify Partner AE
        </h3>
        <p className='text-[13px] leading-[19.5px] text-[#6A7282]'>
          A notification will be sent to {labels.partnerName}&apos;s partnership
          contact inviting them to the co-sell workspace.
        </p>
      </div>

      {/* Sending to card */}
      <div
        className='flex flex-col gap-5 rounded-2xl p-5'
        style={{
          background: 'linear-gradient(90deg, #E9EBFF 0%, #F5F0FF 100%)',
          outline: '1px solid #6B4FBB',
          outlineOffset: '-1px'
        }}
      >
        <div className='flex flex-col gap-2.5'>
          <span className='text-[10px] font-bold uppercase leading-[15px] tracking-[1.12px] text-[#40495A]'>
            Sending to
          </span>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white'>
              <span className='text-sm font-bold text-[#3B4645]'>
                {labels.partnerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
                {labels.partnerName}
              </span>
              <span className='text-xs italic leading-4 text-[#2A3241]'>
                Partner AE contact details will be shared upon acceptance
              </span>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Lock size={14} className='shrink-0 text-[#2A3241]' />
          <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#2A3241]'>
            Contact details are exchanged only after both sides agree to
            co-sell. Your data is protected.
          </span>
        </div>
      </div>

      {/* Preview notification message */}
      <div className='flex flex-col gap-2.5'>
        <h4 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Preview notification message
        </h4>

        {/* Actions bar */}
        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onGenerateAI}
            disabled={isGenerating}
            className='flex items-center gap-1.5 text-xs font-medium text-[#3E50F7] hover:underline disabled:opacity-50'
          >
            {isGenerating ? (
              <RefreshCw size={12} className='animate-spin' />
            ) : (
              <Zap size={12} fill='#3E50F7' />
            )}
            Generate with AI
          </button>
          <button
            type='button'
            onClick={() => setIsEditingMessage(!isEditingMessage)}
            className='flex items-center gap-1.5 text-xs font-medium text-[#6B4FBB] hover:underline'
          >
            <Pencil size={12} />
            {isEditingMessage ? 'Preview message' : 'Edit message'}
          </button>
        </div>

        {/* Email preview */}
        <div className='rounded-[10px] bg-white outline outline-1 outline-[#E5E7EB]'>
          <div className='flex flex-col gap-0 px-5 pt-5'>
            <span className='text-xs leading-4 text-[#6A7282]'>
              From: {ownerNameToShow || 'Your team'} (via Sharkdom)
            </span>
            <span className='mt-1 text-xs leading-4 text-[#6A7282]'>
              To: {partnerOwnerName || `${labels.partnerName} partner contact`}
            </span>
            <div className='mt-2.5 border-b border-[#F3F4F6] pb-2.5'>
              {isEditingMessage ? (
                <input
                  type='text'
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className='w-full rounded-md border border-[#E5E7EB] px-3 py-1.5 text-[13px] font-bold text-[#1A1A2E] outline-none focus:border-[#6B4FBB] focus:ring-1 focus:ring-[#6B4FBB]'
                />
              ) : (
                <span className='text-[13px] font-bold leading-[19.5px] text-[#1A1A2E]'>
                  {customSubject ||
                    generatedContent?.subject ||
                    `Co-sell opportunity — ${labels.accountName}`}
                </span>
              )}
            </div>
          </div>
          <div className='px-5 py-4'>
            {isEditingMessage ? (
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={8}
                className='w-full resize-y rounded-md border border-[#E5E7EB] px-3 py-2 text-[13px] leading-[21.13px] text-[#364153] outline-none focus:border-[#6B4FBB] focus:ring-1 focus:ring-[#6B4FBB]'
              />
            ) : customBody || generatedContent ? (
              <div
                className='text-[13px] leading-[21.13px] text-[#364153]'
                dangerouslySetInnerHTML={{
                  __html: (customBody || generatedContent!.body).replace(
                    /\n/g,
                    '<br />'
                  )
                }}
              />
            ) : (
              <p className='whitespace-pre-line text-[13px] leading-[21.13px] text-[#364153]'>
                {`Hi [Partner AE], I noticed we both have ${labels.accountName} in active pipeline — you at ${labels.partnerStageLabel} stage, us at ${labels.yourStageLabel}. I'd like to propose we align on a joint approach before either of us advances further. I've opened a co-sell workspace in Sharkdom where we can:

→ Share contacts at ${labels.accountName}
→ Align on joint value prop
→ Coordinate outreach timing
→ Track co-sell attribution

${labels.estimatedACV > 0 ? `This is roughly a ${formatACV(labels.estimatedACV)} opportunity (est.) with opp. score ${labels.opportunityScore}.\n\n` : ''}Interested in connecting this week?

— Your team
via Sharkdom`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Send via */}
      <div className='flex flex-col gap-2.5'>
        <h4 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Send via:
        </h4>
        <div className='flex flex-col gap-2'>
          {sendOptions.map((opt) => (
            <SendViaOption
              key={opt.id}
              {...opt}
              selected={sendVia === opt.id}
              onSelect={setSendVia}
            />
          ))}
        </div>
      </div>

      {/* Mark as urgent */}
      <div className='flex items-center gap-3'>
        <span className='text-xs leading-4 text-[#6A7282]'>
          Mark as urgent?
        </span>
        <button
          type='button'
          role='switch'
          aria-checked={urgent}
          onClick={() => setUrgent(!urgent)}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
            urgent ? 'bg-[#6B4FBB]' : 'bg-[#DDDDDD]'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
              urgent ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

// ─── Step 3 content ───────────────────────────────────────────────────────────

function CheckCircle({ color }: { color: string }) {
  return (
    <div
      className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full'
      style={{ background: color }}
    >
      <Check size={13} color='white' strokeWidth={3} />
    </div>
  )
}

function ClockCircle() {
  return (
    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E67E22]'>
      <svg width='13' height='13' viewBox='0 0 13 13' fill='none'>
        <circle cx='6.5' cy='6.5' r='5.5' stroke='white' strokeWidth='1.5' />
        <path
          d='M6.5 3.5v3l2 1.5'
          stroke='white'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
      </svg>
    </div>
  )
}

function CalendarCircle() {
  return (
    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4A5565]'>
      <svg width='13' height='13' viewBox='0 0 13 13' fill='none'>
        <rect
          x='1.5'
          y='2.5'
          width='10'
          height='9'
          rx='1.5'
          stroke='white'
          strokeWidth='1.3'
        />
        <path
          d='M1.5 5.5h10M4.5 1.5v2M8.5 1.5v2'
          stroke='white'
          strokeWidth='1.3'
          strokeLinecap='round'
        />
      </svg>
    </div>
  )
}

function Step3Content({ labels }: { labels: CoSellLabels }) {
  const timeline = [
    {
      icon: <CheckCircle color='#38B000' />,
      title: 'Co-sell workspace created',
      subtitle: `${labels.accountName} workspace is live in Sharkdom`
    },
    {
      icon: <CheckCircle color='#38B000' />,
      title: 'Partner notified',
      subtitle: `${labels.partnerName} notified via Sharkdom + email`
    },
    {
      icon: <ClockCircle />,
      title: 'Partner accepts invitation',
      subtitle: 'Typically within 24 hours'
    },
    {
      icon: <CalendarCircle />,
      title: 'Joint session scheduled',
      subtitle: 'Book a 30-min alignment call'
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      {/* Hero block */}
      <div className='flex flex-col gap-3'>
        <div className='flex gap-2'>
          <div className='flex flex-col gap-4'>
            {/* Text — full width at top */}
            <div className='flex flex-col gap-1.5'>
              <h3 className='text-2xl font-semibold leading-8 tracking-[0.07px] text-[#1A1A2E]'>
                Co-sell Initiated!
              </h3>
              <p className='text-sm leading-5 text-[#6A7282]'>
                {labels.partnerName} has been notified. Your co-sell workspace
                for {labels.accountName} is ready.
              </p>
            </div>

            {/* Timeline checklist */}
            <div className='flex flex-col gap-[18px]'>
              {timeline.map((item) => (
                <div key={item.title} className='flex items-center gap-3.5'>
                  {item.icon}
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-sm font-semibold leading-5 text-[#3B3D4C]'>
                      {item.title}
                    </span>
                    <span className='text-xs leading-4 text-[#646782]'>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustrations — side by side, right-aligned below text */}
          <div className='flex flex-col items-end justify-end gap-3'>
            <img
              src='/assets/partner-mappings/Rocket.png'
              alt='Rocket'
              className='h-[180px] w-auto object-contain'
            />
            <img
              src='/assets/partner-mappings/Meeting.png'
              alt='Meeting'
              className='h-[180px] w-auto object-contain'
            />
          </div>
        </div>
      </div>

      {/* Attribution card */}
      <div
        className='flex items-center gap-5 rounded-2xl p-5'
        style={{
          background: 'linear-gradient(90deg, #E9EBFF 0%, #E8EAFF 100%)',
          outline: '1px solid #6B4FBB',
          outlineOffset: '-1px'
        }}
      >
        {/* Shield illustration */}
        <img
          src='/assets/partner-mappings/Shield.png'
          alt='Shield'
          className='h-[90px] w-[90px] shrink-0 object-contain'
        />

        <div className='flex flex-col gap-2.5'>
          <div className='flex items-center gap-2'>
            <Lock size={15} className='text-[#2A3241]' />
            <span className='text-[15px] font-semibold leading-[19.5px] text-[#2A3241]'>
              Attribution Timestamped
            </span>
          </div>
          <div className='w-fit rounded-full bg-[#3E50F7] px-3 py-0.5'>
            <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-white'>
              Apr 5, 2026 — 2:34 PM IST
            </span>
          </div>
          <p className='text-xs leading-[19.5px] text-[#2A3241]'>
            This co-sell initiation has been logged at the timestamp below. Both
            parties&apos; activity from this point forward will be tracked for
            attribution. Your first-touch rights on {labels.accountName} are
            protected.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Arrow icon ────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <path
        d='M3 8h10M9 4l4 4-4 4'
        stroke='white'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface StartCoSellDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Partner org id for `/partner-mapping/cosell-workspace/[partnerOrgId]`. */
  partnerOrgId?: string | null
  /** Report overlap `type` query (e.g. CUSTOMER_CUSTOMER) for workspace + report links. */
  reportType?: string | null
  /** Line under the main title when set (e.g. compare report org — partner). */
  workspaceSubtitle?: string
  /** Shared account id for workspace URL (?account=). */
  accountId?: string
  accountName?: string
  accountDomain?: string
  /** Compare-report partner display name (notification / pitch copy). */
  partnerName?: string
  estimatedACV?: number
  opportunityScore?: number
  yourStage?: string
  partnerStage?: string
  targetPartnerDealId?: string | null
  currentPartnerDealId?: string | null
}

export function StartCoSellDrawer({
  open,
  onOpenChange,
  partnerOrgId,
  reportType,
  workspaceSubtitle,
  accountId,
  accountName,
  accountDomain,
  partnerName,
  estimatedACV,
  opportunityScore,
  yourStage,
  partnerStage,
  targetPartnerDealId,
  currentPartnerDealId
}: StartCoSellDrawerProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const labels: CoSellLabels = useMemo(
    () => ({
      accountName: accountName?.trim() || 'This account',
      partnerName: partnerName?.trim() || 'Partner',
      yourStageLabel: yourStage ? formatStage(yourStage) : 'your stage',
      partnerStageLabel: partnerStage
        ? formatStage(partnerStage)
        : 'their stage',
      opportunityScore: opportunityScore ?? 0,
      estimatedACV: estimatedACV ?? 0
    }),
    [
      accountName,
      partnerName,
      yourStage,
      partnerStage,
      opportunityScore,
      estimatedACV
    ]
  )

  const workspaceHref = useMemo(() => {
    const id =
      partnerOrgId != null && String(partnerOrgId).trim() !== ''
        ? String(partnerOrgId).trim()
        : ''
    if (!id) return null
    const q = new URLSearchParams()
    if (accountId) q.set('account', accountId)
    if (reportType?.trim()) q.set('type', reportType.trim())
    if (accountName?.trim()) q.set('accountName', accountName.trim())
    if (targetPartnerDealId) q.set('targetpartnerdealId', targetPartnerDealId)
    if (currentPartnerDealId)
      q.set('currentpartnerdealId', currentPartnerDealId)
    const qs = q.toString()
    return `/partner-mapping/cosell-workspace/${encodeURIComponent(id)}${qs ? `?${qs}` : ''}`
  }, [partnerOrgId, accountId, reportType, accountName])

  const subtitleLine = useMemo(() => {
    if (workspaceSubtitle?.trim()) return workspaceSubtitle.trim()
    const domainBit = accountDomain?.trim() ? ` · ${accountDomain.trim()}` : ''
    return `${labels.accountName}${domainBit} — ${labels.partnerName} co-sell`
  }, [workspaceSubtitle, accountDomain, labels.accountName, labels.partnerName])

  const [selectedMotion, setSelectedMotion] =
    useState<CoSellMotion>('joint-intro')
  const [customPitch, setCustomPitch] = useState('')

  const dealId = currentPartnerDealId || targetPartnerDealId
  const { data: sharedAssets } = useSharedAssets(
    partnerOrgId ? Number(partnerOrgId) : null,
    dealId
  )

  // Step 1 Resources state
  const [resources, setResources] = useState([
    { emoji: '📄', label: 'Product Overview Deck', fileUrl: null },
    { emoji: '🎥', label: 'Demo Video (3 min)', fileUrl: null },
    { emoji: '💰', label: 'Pricing Guide', fileUrl: null },
    {
      emoji: '📊',
      label: 'TechFlow Case Study',
      fileUrl: null,
      recommended: 'Recommended — industry match'
    },
    { emoji: '🤝', label: 'Co-sell Playbook', fileUrl: null }
  ])

  useEffect(() => {
    if (sharedAssets && Array.isArray(sharedAssets)) {
      setResources((prev) =>
        prev.map((r) => {
          const matched = sharedAssets.find(
            (asset) =>
              asset.title?.trim().toLowerCase() === r.label.trim().toLowerCase()
          )
          return matched ? { ...r, fileUrl: matched.fileUrl } : r
        })
      )
    }
  }, [sharedAssets])
  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadMutation = useCreateSharedAsset(
    partnerOrgId ? Number(partnerOrgId) : null
  )

  const handleUploadClick = (label: string) => {
    setUploadingLabel(label)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingLabel || !partnerOrgId) {
      setUploadingLabel(null)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('partnerOrgId', String(partnerOrgId))
    formData.append('title', uploadingLabel)
    if (currentPartnerDealId || targetPartnerDealId) {
      formData.append(
        'dealId',
        String(currentPartnerDealId || targetPartnerDealId)
      )
    }

    try {
      const result = await uploadMutation.mutateAsync(formData)
      if (result.ok && result.asset) {
        setResources((prev) =>
          prev.map((r) =>
            r.label === uploadingLabel
              ? { ...r, fileUrl: result.asset!.fileUrl }
              : r
          )
        )
        showCustomToast('Success', `${uploadingLabel} uploaded`, 'success')
      } else {
        showCustomToast('Upload failed', result.message, 'error')
      }
    } catch (err) {
      showCustomToast('Error', 'Failed to upload resource', 'error')
    } finally {
      setUploadingLabel(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Step 2 state
  const [messageTone, setMessageTone] = useState<MessageTone>('professional')
  const [sendVia, setSendVia] = useState<SendVia>('sharkdom')
  const [urgent, setUrgent] = useState(false)
  const [aiGenerated, setAiGenerated] = useState<{
    subject: string
    body: string
  } | null>(null)

  const [isEditingMessage, setIsEditingMessage] = useState(false)
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')

  const org = useSelector((s: RootState) => s.currentOrg?.organization)
  const { data: ownerDetails } = useDealOwnerDetails(
    org?.id ? Number(org.id) : null,
    currentPartnerDealId || targetPartnerDealId
  )
  const { data: authData } = useQuery<any>({
    queryKey: ['auth-data'],
    enabled: false
  })
  const userProfile = authData?.userProfile
  const registeredUserName =
    userProfile?.name || authData?.user?.displayName || 'Your account owner'

  const ownerNameToShow = ownerDetails?.dealOwner || registeredUserName

  const { data: partnerDealDetails } = useDealOwnerDetails(
    partnerOrgId ? Number(partnerOrgId) : null,
    currentPartnerDealId || targetPartnerDealId
  )

  React.useEffect(() => {
    if (aiGenerated) {
      setCustomSubject(aiGenerated.subject)
      setCustomBody(aiGenerated.body)
    } else {
      const partnerOwnerName = partnerDealDetails?.dealOwner || 'Partner AE'
      setCustomSubject(`Co-sell opportunity — ${labels.accountName}`)
      setCustomBody(`Hi ${partnerOwnerName},

I noticed we both have ${labels.accountName} in active pipeline — you at ${labels.partnerStageLabel} stage, us at ${labels.yourStageLabel}. I'd like to propose we align on a joint approach before either of us advances further. I've opened a co-sell workspace in Sharkdom where we can:

→ Share contacts at ${labels.accountName}
→ Align on joint value prop
→ Coordinate outreach timing
→ Track co-sell attribution

${labels.estimatedACV > 0 ? `This is roughly a ${formatACV(labels.estimatedACV)} opportunity (est.) with opp. score ${labels.opportunityScore}.\n\n` : ''}Interested in connecting this week?

— ${ownerNameToShow}
via Sharkdom`)
    }
  }, [aiGenerated, labels, ownerNameToShow, partnerDealDetails?.dealOwner])

  const sendNotificationMutation = useSendCoSellNotification()
  const createActivityMutation = useCreatePartnerActivity(
    partnerOrgId ? Number(partnerOrgId) : null,
    currentPartnerDealId || targetPartnerDealId
  )

  const generateMutation = useGenerateIntro()

  const handleGenerateAI = async () => {
    const payload: GenerateIntroPayload = {
      type: 'vendor-to-partner',
      data: {
        sender_name: ownerNameToShow,
        sender_title: ownerDetails?.jobTitle || 'Account Executive',
        sender_company: org?.name || 'Sharkdom',
        sender_company_description: org?.description || 'A B2B SaaS company',
        partner_contact_name: labels.partnerName,
        partner_contact_title: 'Partnership Manager',
        partner_company: labels.partnerName,
        target_contact_name: ownerDetails?.firstName || labels.accountName,
        target_contact_title: ownerDetails?.jobTitle || 'Stakeholder',
        target_account_name: labels.accountName,
        your_deal_stage: labels.yourStageLabel,
        partner_relationship_type: 'Partner',
        partner_relationship_duration: 'Over 1 year',
        relevance_reason: 'Active overlap in pipeline',
        prior_context: 'We have seen success in similar accounts',
        why_meeting_preferred: 'To align on outreach strategy',
        meeting_duration: '30 minutes',
        meeting_agenda: 'Pipeline review and contact sharing',
        available_slots: 'Next Tuesday at 10 AM',
        why_suggesting: 'Mutual benefit for both organizations',
        endorsement_strength: 'High',
        target_contact_linkedin: ownerDetails?.contactLinkedinUrl || '',
        linkedin_intro_format: 'Direct message',
        partner_contact_linkedin: '',
        linkedin_connection_type: '1st',
        relevance_to_target: 'Solving key business challenges',
        relationship_tone: messageTone,
        why_making_intro: 'Collaborative selling'
      }
    }

    const result = await generateMutation.mutateAsync(payload)
    if (result.ok) {
      setAiGenerated({
        subject: result.data.subject,
        body: result.data.body
      })
    } else {
      showCustomToast('Generation failed', result.message, 'error')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setStep(1), 300)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='flex max-w-[608px] flex-col overflow-hidden p-0'>
        {/* ── Gradient Header ─────────────────────────────────────────────── */}
        <div
          className='relative flex flex-col gap-2.5 px-5 py-5'
          style={{
            background: 'linear-gradient(90deg, #DADDFF 0%, #F5EFFF 100%)',
            outline: '1px solid #B2C4E7',
            outlineOffset: '-1px'
          }}
        >
          <div className='flex items-center'>
            <div className='rounded-full bg-white px-3 py-1'>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#383A4D]'>
                Step {step} of 3
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-0.5'>
            <h2 className='text-[22px] font-bold leading-[33px] text-[#383A4D]'>
              Set Up Co-sell Workspace
            </h2>
            <p className='text-sm leading-5 text-[#030303]/60'>
              {subtitleLine}
            </p>
          </div>

          <button
            type='button'
            onClick={handleClose}
            className='absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-[#030303]/60 transition-colors hover:bg-black/10'
            aria-label='Close'
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Step Tabs ───────────────────────────────────────────────────── */}
        <div className='flex items-center gap-0 border-b border-[#F3F4F6] px-5 py-2.5'>
          <StepBadge
            step={1}
            label='Setup'
            state={step > 1 ? 'completed' : 'active'}
          />
          <StepBadge
            step={2}
            label='Notify'
            state={step > 2 ? 'completed' : step === 2 ? 'active' : 'idle'}
          />
          <StepBadge
            step={3}
            label='Launch'
            state={step === 3 ? 'active' : 'idle'}
          />
        </div>

        {/* ── Scrollable Content ──────────────────────────────────────────── */}
        <div className='hide-scrollbar flex-1 overflow-y-auto px-5 py-5'>
          {step === 1 && (
            <>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                onChange={handleFileChange}
              />
              <Step1Content
                labels={labels}
                selectedMotion={selectedMotion}
                setSelectedMotion={setSelectedMotion}
                customPitch={customPitch}
                setCustomPitch={setCustomPitch}
                resources={resources}
                onUploadResource={handleUploadClick}
                uploadingLabel={uploadingLabel}
                ownerNameToShow={ownerNameToShow}
              />
            </>
          )}
          {step === 2 && (
            <Step2Content
              labels={labels}
              messageTone={messageTone}
              setMessageTone={setMessageTone}
              sendVia={sendVia}
              setSendVia={setSendVia}
              urgent={urgent}
              setUrgent={setUrgent}
              generatedContent={aiGenerated || undefined}
              onGenerateAI={handleGenerateAI}
              isGenerating={generateMutation.isPending}
              isEditingMessage={isEditingMessage}
              setIsEditingMessage={setIsEditingMessage}
              customSubject={customSubject}
              setCustomSubject={setCustomSubject}
              customBody={customBody}
              setCustomBody={setCustomBody}
              partnerOwnerName={partnerDealDetails?.dealOwner}
              ownerNameToShow={ownerNameToShow}
            />
          )}
          {step === 3 && <Step3Content labels={labels} />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div
          className='flex items-center justify-between px-8 py-5'
          style={{ borderTop: '1px solid #C0D6FF' }}
        >
          <span className='text-xs leading-4 text-[#2A3241]'>
            Step {step} of 3 —{' '}
            {step === 1 ? 'Setup' : step === 2 ? 'Notify' : 'Launch'}
          </span>

          <div className='flex items-center gap-3'>
            {step === 1 ? (
              <DrawerClose asChild>
                <button
                  type='button'
                  className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
                >
                  Cancel
                </button>
              </DrawerClose>
            ) : step === 2 ? (
              <button
                type='button'
                onClick={() => setStep(1)}
                className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
              >
                Back
              </button>
            ) : (
              <DrawerClose asChild>
                <button
                  type='button'
                  className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
                >
                  Cancel
                </button>
              </DrawerClose>
            )}

            <button
              type='button'
              disabled={sendNotificationMutation.isPending}
              onClick={() => {
                if (step === 1) setStep(2)
                else if (step === 2) {
                  const payload = {
                    subject:
                      customSubject ||
                      aiGenerated?.subject ||
                      `Co-sell opportunity — ${labels.accountName}`,
                    body:
                      customBody ||
                      aiGenerated?.body ||
                      `Hi, I noticed we both have ${labels.accountName} in active pipeline — you at ${labels.partnerStageLabel} stage, us at ${labels.yourStageLabel}. I'd like to propose we align on a joint approach before either of us advances further. I've opened a co-sell workspace in Sharkdom where we can:\n\n→ Share contacts at ${labels.accountName}\n→ Align on joint value prop\n→ Coordinate outreach timing\n→ Track co-sell attribution`,
                    receiverEmail:
                      partnerDealDetails?.owner?.email ||
                      'partner-ae@example.com',
                    receiverName:
                      partnerDealDetails?.dealOwner ||
                      (partnerDealDetails?.owner?.firstName
                        ? `${partnerDealDetails.owner.firstName} ${partnerDealDetails.owner.lastName}`
                        : 'Partner AE'),
                    scheduled: false,
                    scheduleTime: new Date().toISOString().slice(0, 19),
                    data: {}
                  }

                  sendNotificationMutation.mutate(payload, {
                    onSuccess: (res) => {
                      if (res.success) {
                        showCustomToast(
                          'Success',
                          'Co-sell notification email sent successfully!',
                          'success'
                        )
                        if (partnerOrgId) {
                          createActivityMutation.mutate({
                            partnerOrgId: Number(partnerOrgId),
                            title: `Sent co-sell notification`,
                            description: `Emailed co-sell workspace invitation to ${payload.receiverName || 'Partner AE'}.`,
                            activityType: 'email_sent',
                            userName: org?.name || 'Your team',
                            dealId:
                              currentPartnerDealId || targetPartnerDealId || ''
                          })
                        }
                      } else {
                        showCustomToast(
                          'Failed to send notification',
                          res.message || 'API returned failure status',
                          'error'
                        )
                      }
                      setStep(3)
                    },
                    onError: (err: any) => {
                      showCustomToast(
                        'Notification Error',
                        err?.message || 'Failed to send notification',
                        'error'
                      )
                      setStep(3)
                    }
                  })
                } else if (step === 3) {
                  if (workspaceHref) {
                    if (accountId) {
                      localStorage.setItem(
                        `cosell_started_${accountId}`,
                        'true'
                      )
                      window.dispatchEvent(new Event('cosell_started'))
                    }
                    router.push(workspaceHref)
                    handleClose()
                  } else {
                    showCustomToast(
                      'Cannot open workspace',
                      'Partner context is missing. Open Shared Accounts from a compare report so the workspace link includes your partner.',
                      'error',
                      6000
                    )
                  }
                }
              }}
              className='flex items-center gap-2 rounded-[10px] bg-[#3E50F7] px-5 py-3 text-sm font-bold leading-5 text-white transition-colors hover:bg-[#3344e0] disabled:opacity-50'
            >
              {sendNotificationMutation.isPending ? (
                <>
                  Sending...
                  <Loader2 className='h-4 w-4 animate-spin' />
                </>
              ) : (
                <>
                  {step === 1
                    ? 'Next: Notify Partner'
                    : step === 2
                      ? 'Send Notifications'
                      : 'View cosell workspace'}
                  <ArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
