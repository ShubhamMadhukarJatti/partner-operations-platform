'use client'

import React, { useState } from 'react'
import { Check, Lock, X } from 'lucide-react'

import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'

// ─── Types ────────────────────────────────────────────────────────────────────

type PipelineType = 'partner-influenced' | 'direct-sales' | 'partner-sourced'
type PipelineStage =
  | 'discovery'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'closed-won'
type Priority = 'low' | 'medium' | 'high'
type OwnerContact = 'james-chen' | 'c-suite'
type CRMSync = 'hubspot' | 'salesforce'
type ApproachType = 'reference-partner' | 'direct-cold' | 'formal-intro'
type SequenceId = 'partner-overlap' | 'us-bd-standard'
type OutreachTiming = 'right-now' | 'tomorrow' | 'choose-date'

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

// ─── Pipeline type option ─────────────────────────────────────────────────────

function PipelineTypeOption({
  id,
  icon,
  title,
  description,
  hint,
  hintColor,
  selected,
  onSelect
}: {
  id: PipelineType
  icon: React.ReactNode
  title: string
  description: string
  hint: string
  hintColor: string
  selected: boolean
  onSelect: (id: PipelineType) => void
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
      <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center'>
        {icon}
      </div>
      <div className='flex flex-col gap-0.5'>
        <span className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          {title}
        </span>
        <span className='text-xs leading-4 text-[#6A7282]'>{description}</span>
        <span
          className='text-[11px] italic leading-[16.5px] tracking-[0.06px]'
          style={{ color: hintColor }}
        >
          {hint}
        </span>
      </div>
    </button>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect
        x='3'
        y='5'
        width='18'
        height='14'
        rx='2'
        stroke='#4D5C78'
        strokeWidth='2'
      />
      <path
        d='M3 7l9 6 9-6'
        stroke='#4D5C78'
        strokeWidth='2'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function LinkedInSquareIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect x='2' y='2' width='20' height='20' rx='3' fill='#4D5C78' />
      <path
        d='M7 10h2v7H7v-7zm1-1.5a1 1 0 110-2 1 1 0 010 2zM11 10h1.8v1h.03C13.2 10.4 14 10 15 10c2 0 3 1.4 3 3.2V17h-2v-3.5c0-.8-.1-1.8-1.1-1.8S13 12.6 13 13.4V17h-2v-7z'
        fill='white'
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        d='M5 12h14M15 8l4 4-4 4'
        stroke='#4D5C78'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function LockIconSmall() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <rect
        x='2'
        y='7'
        width='12'
        height='8'
        rx='1.5'
        stroke='#6B4FBB'
        strokeWidth='1.33'
      />
      <path
        d='M4.67 7V4.67a3.33 3.33 0 116.67 0V7'
        stroke='#6B4FBB'
        strokeWidth='1.33'
      />
    </svg>
  )
}

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

// ─── Stage config ─────────────────────────────────────────────────────────────

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'demo', label: 'Demo' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed-won', label: 'Closed Won' }
]

const STAGE_DESCRIPTIONS: Record<PipelineStage, string> = {
  discovery:
    'First sales contact stage. Goal: qualify the opportunity and understand the pain point.',
  demo: 'Product demonstration stage. Show value and address key concerns.',
  proposal: 'Formal proposal stage. Deliver detailed solution and pricing.',
  negotiation: 'Contract negotiation stage. Align on terms and close details.',
  'closed-won': 'Deal closed. Transition to onboarding and delivery.'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateShort(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d
}

// ─── Step 1 content ───────────────────────────────────────────────────────────

function Step1Content({
  dealName,
  setDealName,
  pipelineType,
  setPipelineType,
  stage,
  setStage,
  acv,
  setAcv,
  closeDate,
  setCloseDate,
  priority,
  setPriority,
  partnerName,
  opportunityScore
}: {
  dealName: string
  setDealName: (v: string) => void
  pipelineType: PipelineType
  setPipelineType: (v: PipelineType) => void
  stage: PipelineStage
  setStage: (v: PipelineStage) => void
  acv: string
  setAcv: (v: string) => void
  closeDate: string
  setCloseDate: (v: string) => void
  priority: Priority
  setPriority: (v: Priority) => void
  partnerName: string
  opportunityScore: number
}) {
  const pipelineOptions: {
    id: PipelineType
    icon: React.ReactNode
    title: string
    description: string
    hint: string
    hintColor: string
  }[] = [
    {
      id: 'partner-influenced',
      icon: <MailIcon />,
      title: 'Partner-Influenced Pipeline',
      description:
        'Deal discovered through partner account overlap. Attribution seed: INFLUENCED. Tracked separately from direct sales for accurate partner ROI reporting.',
      hint: 'Response rate: ~73% within 48hrs',
      hintColor: '#6B4FBB'
    },
    {
      id: 'direct-sales',
      icon: <LinkedInSquareIcon />,
      title: 'Direct Sales Pipeline',
      description:
        'Standard direct pipeline. No partner attribution. Use if overlap is coincidental and partner played no role.',
      hint: '⚠️ Removing partner attribution may affect partner reporting accuracy',
      hintColor: '#E67E22'
    },
    {
      id: 'partner-sourced',
      icon: <SendIcon />,
      title: 'Partner-Sourced Pipeline',
      description:
        'Use only if partner directly introduced this account to you. Higher attribution tier, triggers higher partner commission.',
      hint: '💡 Use Request Intro flow if you want partner to formally introduce this account first',
      hintColor: '#6B4FBB'
    }
  ]

  const autoPriorityLabel =
    opportunityScore < 50 ? 'Low' : opportunityScore <= 75 ? 'Medium' : 'High'

  const now = new Date()
  const formattedDate =
    now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' — ' +
    now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) +
    ' IST'

  return (
    <div className='flex flex-col gap-6'>
      {/* Deal Name */}
      <div className='flex flex-col gap-2'>
        <label className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Deal Name
        </label>
        <input
          type='text'
          value={dealName}
          onChange={(e) => setDealName(e.target.value)}
          className='w-full rounded-[10px] bg-[#F8F9FB] px-4 py-3 text-sm leading-5 text-[#333333] outline outline-1 outline-[#EEEEEE] focus:outline-[#6B4FBB] focus:ring-0'
        />
      </div>

      {/* Pipeline Type */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What type of co-sell motion?
        </h3>
        <div className='flex flex-col gap-2'>
          {pipelineOptions.map((opt) => (
            <PipelineTypeOption
              key={opt.id}
              {...opt}
              selected={pipelineType === opt.id}
              onSelect={setPipelineType}
            />
          ))}
        </div>
      </div>

      {/* Starting Stage */}
      <div className='flex flex-col gap-2.5'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Starting stage:
        </h3>
        <div className='flex items-center gap-1'>
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && (
                <span className='shrink-0 text-[16px] leading-6 text-[#5872A1]'>
                  →
                </span>
              )}
              <button
                type='button'
                onClick={() => setStage(s.id)}
                className={`flex-1 rounded-[10px] px-2.5 py-1.5 text-center text-[13px] leading-[19.5px] transition-all ${
                  stage === s.id
                    ? 'bg-[#1A6AB5] font-bold text-white shadow-[0_2px_8px_rgba(26,106,181,0.30)]'
                    : 'bg-[#F8F9FB] font-normal text-[#5F6D88] outline outline-1 outline-[#7688A8]'
                }`}
              >
                {s.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <p className='text-xs leading-4 text-[#6A7282]'>
          {STAGE_DESCRIPTIONS[stage]}
        </p>
      </div>

      {/* Estimated ACV + Target close date */}
      <div className='flex items-start gap-4'>
        <div className='flex flex-1 flex-col gap-1'>
          <label className='text-[13px] font-medium leading-[19.5px] text-[#6A7282]'>
            Estimated ACV
          </label>
          <div className='relative'>
            <span className='absolute left-4 top-1/2 -translate-y-1/2 text-lg leading-7 text-[#99A1AF]'>
              $
            </span>
            <input
              type='number'
              value={acv}
              onChange={(e) => setAcv(e.target.value)}
              className='w-full rounded-[10px] bg-[#F8F9FB] py-3 pl-9 pr-4 text-xl font-bold leading-7 text-[#1A1A2E] outline outline-1 outline-[#EEEEEE] focus:outline-[#6B4FBB] focus:ring-0'
            />
          </div>
          <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
            Suggested based on company size, industry, and ICP match
          </p>
        </div>

        <div className='flex flex-1 flex-col gap-1'>
          <label className='text-[13px] font-medium leading-[19.5px] text-[#6A7282]'>
            Target close date
          </label>
          <input
            type='date'
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
            className='w-full rounded-[10px] bg-[#F8F9FB] px-4 py-3 text-sm leading-5 text-[#1A1A2E] outline outline-1 outline-[#EEEEEE] focus:outline-[#6B4FBB] focus:ring-0'
          />
          <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
            90 days from today (standard discovery-to-close)
          </p>
        </div>
      </div>

      {/* Priority Level */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Priority level:
        </h3>
        <div className='flex items-stretch gap-2'>
          <button
            type='button'
            onClick={() => setPriority('low')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] py-3.5 transition-all ${
              priority === 'low'
                ? 'bg-white outline outline-2 outline-[#7688A8]'
                : 'bg-white outline outline-1 outline-[#7688A8]'
            }`}
          >
            <span
              className={`text-[13px] leading-[19.5px] text-[#5F6D88] ${priority === 'low' ? 'font-bold' : 'font-normal'}`}
            >
              Low
            </span>
            <span className='text-[10px] font-medium leading-[15px] tracking-[0.12px] text-[#677799]'>
              Score &lt; 50
            </span>
          </button>

          <button
            type='button'
            onClick={() => setPriority('medium')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] py-3.5 transition-all ${
              priority === 'medium'
                ? 'bg-[#FFF8F0] outline outline-2 outline-[#E67E22]'
                : 'bg-white outline outline-1 outline-[#7688A8]'
            }`}
          >
            <span
              className={`text-[13px] leading-[19.5px] ${
                priority === 'medium'
                  ? 'font-bold text-[#E67E22]'
                  : 'font-normal text-[#5F6D88]'
              }`}
            >
              Medium
            </span>
            <span
              className={`text-[10px] font-medium leading-[15px] tracking-[0.12px] ${
                priority === 'medium' ? 'text-[#E67E22]' : 'text-[#677799]'
              }`}
            >
              Score 50–75
            </span>
          </button>

          <button
            type='button'
            onClick={() => setPriority('high')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] py-3.5 transition-all ${
              priority === 'high'
                ? 'bg-white outline outline-2 outline-[#C0392B]'
                : 'bg-white outline outline-1 outline-[#7688A8]'
            }`}
          >
            <span
              className={`text-[13px] leading-[19.5px] text-[#C0392B] ${priority === 'high' ? 'font-bold' : 'font-normal'}`}
            >
              High
            </span>
            <span
              className={`text-[10px] font-medium leading-[15px] tracking-[0.12px] ${
                priority === 'high' ? 'text-[#C0392B]' : 'text-[#CCCCCC]'
              }`}
            >
              Score &gt; 75
            </span>
          </button>
        </div>
        <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
          Auto-set based on opportunity score ({opportunityScore} ={' '}
          {autoPriorityLabel})
        </p>
      </div>

      {/* Attribution seed locked card */}
      <div
        className='flex flex-col gap-4 rounded-xl px-5 py-[23px]'
        style={{
          background: 'linear-gradient(90deg, #E5EDFF 0%, #F3E3FF 100%)'
        }}
      >
        <div className='relative flex items-center gap-2'>
          <Lock size={16} className='shrink-0 text-[#2A3241]' />
          <span className='text-[13px] font-semibold leading-[19.5px] text-[#2A3241]'>
            Attribution seed locked at creation
          </span>
          <div className='absolute right-0 rounded-full bg-white px-3 py-0.5'>
            <span className='text-[11px] font-medium leading-[16.5px] tracking-[0.06px] text-[#6B4FBB]'>
              {formattedDate}
            </span>
          </div>
        </div>

        <div className='flex items-start gap-6'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs leading-4 text-[#4D5C78]'>Tier:</span>
            <div className='w-fit rounded-[8px] bg-[#6B4FBB] px-2 py-0.5'>
              <span className='text-xs font-medium leading-5 text-white'>
                INFLUENCED
              </span>
            </div>
            <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#2F3B51]'>
              (Highest attribution tier)
            </span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs leading-4 text-[#4D5C78]'>Partner:</span>
            <span className='text-sm font-semibold leading-5 text-[#6B4FBB]'>
              {partnerName}
            </span>
          </div>

          <div className='flex flex-col gap-1'>
            <span className='text-xs leading-4 text-[#4D5C78]'>
              Signal Source:
            </span>
            <span className='text-sm font-semibold leading-5 text-[#6B4FBB]'>
              Account Mapping Overlap
            </span>
          </div>
        </div>

        <p className='text-[10px] italic leading-[15px] tracking-[0.12px] text-[#2A3241]'>
          This attribution is only activated if you proceed and partner makes
          the actual introduction.
        </p>
      </div>
    </div>
  )
}

// ─── Step 2 content ───────────────────────────────────────────────────────────

function Step2Content({
  accountName,
  pipelineType,
  stage,
  selectedOwner,
  setSelectedOwner,
  selectedCRM,
  setSelectedCRM,
  tags,
  setTags,
  aeNotes,
  setAeNotes
}: {
  accountName: string
  pipelineType: PipelineType
  stage: PipelineStage
  selectedOwner: OwnerContact
  setSelectedOwner: (v: OwnerContact) => void
  selectedCRM: CRMSync
  setSelectedCRM: (v: CRMSync) => void
  tags: string[]
  setTags: (v: string[]) => void
  aeNotes: string
  setAeNotes: (v: string) => void
}) {
  const pipelineLabel =
    pipelineType === 'partner-influenced'
      ? 'Partner-Influenced'
      : pipelineType === 'direct-sales'
        ? 'Direct Sales'
        : 'Partner-Sourced'

  const stageLabel = STAGES.find((s) => s.id === stage)?.label ?? 'Discovery'

  return (
    <div className='flex flex-col gap-6'>
      {/* Who owns this deal */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Who owns this deal?
        </h3>

        <div className='flex flex-col gap-2'>
          {/* James Chen */}
          <button
            type='button'
            onClick={() => setSelectedOwner('james-chen')}
            className={`relative w-full rounded-[10px] p-3 text-left transition-all ${
              selectedOwner === 'james-chen'
                ? 'bg-white outline outline-2 outline-[#3E50F7]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div className='flex items-start gap-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9EBFF]'>
                <span className='text-xs font-bold leading-4 text-[#3E50F7]'>
                  JC
                </span>
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <span className='text-[13px] font-semibold leading-[19.5px] text-[#1A1A2E]'>
                  James Chen
                </span>
                <span className='text-xs leading-4 text-[#6A7282]'>
                  Head of Revenue Operations
                </span>
                <div className='w-fit rounded bg-[#E3F2FD] px-1.5 py-0.5'>
                  <span className='text-[10px] font-medium leading-[15px] tracking-[0.12px] text-[#1565C0]'>
                    From: Your CRM
                  </span>
                </div>
                <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
                  Your AE has met James once at SaaStr 2025
                </span>
              </div>
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selectedOwner === 'james-chen'
                    ? 'border-[#3E50F7]'
                    : 'border-[#CCCCCC]'
                }`}
              >
                {selectedOwner === 'james-chen' && (
                  <div className='h-2 w-2 rounded-full bg-[#3E50F7]' />
                )}
              </div>
            </div>
          </button>

          {/* C-Suite Contact */}
          <button
            type='button'
            onClick={() => setSelectedOwner('c-suite')}
            className={`relative w-full rounded-[10px] p-3 text-left transition-all ${
              selectedOwner === 'c-suite'
                ? 'bg-[#F5F0FF] outline outline-2 outline-[#C4AFF0]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div className='flex items-start gap-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-[#C4AFF0]'>
                <LockIconSmall />
              </div>
              <div className='flex flex-1 flex-col gap-1'>
                <span className='text-[13px] font-semibold leading-[19.5px] text-[#4A5565]'>
                  [C-Suite Contact]
                </span>
                <span className='text-xs italic leading-4 text-[#5C6A83]'>
                  [Title hidden until partner agrees]
                </span>
                <div className='w-fit rounded bg-[#6B4FBB] px-1.5 py-0.5'>
                  <span className='text-[10px] font-medium leading-[15px] tracking-[0.12px] text-white'>
                    From: Partner CRM
                  </span>
                </div>
                <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#323232]'>
                  ★ Partner recommends starting here
                </span>
                <span className='text-[10px] leading-[15px] tracking-[0.12px] text-[#323232]'>
                  🔒 Full details revealed after partner accepts
                </span>
              </div>
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  selectedOwner === 'c-suite'
                    ? 'outline outline-2 outline-[#6B4FBB]'
                    : 'border-2 border-[#CCCCCC]'
                }`}
              >
                {selectedOwner === 'c-suite' && (
                  <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
                )}
              </div>
            </div>
          </button>
        </div>

        <button
          type='button'
          className='w-full rounded-2xl py-3 text-center text-[13px] leading-[19.5px] text-[#1A6AB5] outline outline-1 outline-[#CCCCCC] transition-colors hover:bg-gray-50'
        >
          + Assign to different AE
        </button>
      </div>

      {/* Sync this deal to CRM */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Sync this deal to CRM:
        </h3>
        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => setSelectedCRM('hubspot')}
            className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition-all ${
              selectedCRM === 'hubspot'
                ? 'bg-[#FFF5F2] outline outline-2 outline-[#FF7A59]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#FF7A59]'>
              <span className='text-sm font-bold leading-5 text-white'>H</span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[13px] font-semibold leading-[19.5px] text-[#1A1A2E]'>
                HubSpot CRM
              </span>
              <span className='text-xs leading-4 text-[#1A7A4A]'>
                Connected ✅ — syncing in real-time
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#6A7282]'>
                Deal will appear in HubSpot within 30 seconds of creation
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
                Pipeline: {pipelineLabel} · Stage: {stageLabel} · Owner:
                Akshunya Vijay
              </span>
            </div>
          </button>

          <div className='flex items-start gap-3 rounded-2xl p-4 opacity-70 outline outline-1 outline-[#EEEEEE]'>
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#D1D5DC]'>
              <span className='text-sm font-bold leading-5 text-white'>S</span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[13px] font-semibold leading-[19.5px] text-[#99A1AF]'>
                Salesforce
              </span>
              <span className='text-xs leading-4 text-[#D1D5DC]'>
                Not connected
              </span>
              <button
                type='button'
                className='text-left text-[11px] leading-[16.5px] tracking-[0.06px] text-[#1A6AB5]'
              >
                Connect Salesforce →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* First contact to pursue */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          First contact to pursue:
        </h3>
        <div className='flex flex-col gap-4 rounded-2xl bg-[#F8F9FB] p-5 outline outline-1 outline-[#CCCCCC]'>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-2xl'>👤</span>
            <span className='text-center text-[13px] leading-[19.5px] text-[#6A7282]'>
              No contacts found for {accountName} in your CRM
            </span>
            <span className='text-center text-xs font-bold leading-4 text-[#1A6AB5]'>
              Suggested approach:
            </span>
          </div>
          <div className='flex flex-col gap-1 rounded-[10px] bg-[#E3F0FF] px-3 py-3'>
            <span className='text-xs leading-4 text-[#4A5565]'>
              Based on {accountName}&apos;s size and ICP profile, target:
            </span>
            <p className='text-xs leading-4'>
              <span className='font-semibold text-[#1A1A2E]'>
                Head of Partnerships
              </span>
              <span className='text-[#99A1AF]'> or </span>
              <span className='font-semibold text-[#1A1A2E]'>
                VP Sales Operations
              </span>
            </p>
            <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#6A7282]'>
              Most likely Sharkdom buyer at 120-person B2B SaaS company
            </span>
            <span className='mt-1 text-xs font-semibold leading-4 text-[#1A1A2E]'>
              CRO or VP Revenue
            </span>
            <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#6A7282]'>
              Economic buyer — bring in after initial discovery
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {[
              '🔗 Find on LinkedIn →',
              '✉️ Search by Email Domain',
              '👤 Add Contact Manually'
            ].map((label) => (
              <button
                key={label}
                type='button'
                className='flex-1 rounded-[10px] bg-white py-2 text-center text-[11px] font-medium leading-[16.5px] tracking-[0.06px] text-[#4A5565] outline outline-1 outline-[#E5E7EB] hover:bg-gray-50'
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deal tags */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Deal tags:
        </h3>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <div
              key={tag}
              className='flex items-center gap-1 rounded bg-[#E3F0FF] px-2 py-2'
            >
              <span className='text-xs leading-4 text-[#1A6AB5]'>{tag}</span>
              <button
                type='button'
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className='text-base font-medium leading-6 text-[#1A6AB5] hover:opacity-70'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AE Notes */}
      <div className='flex flex-col gap-1'>
        <label className='text-xs font-medium leading-4 text-[#6A7282]'>
          AE Notes (optional):
        </label>
        <textarea
          value={aeNotes}
          onChange={(e) => setAeNotes(e.target.value)}
          rows={4}
          placeholder='Any context the AE should know before first outreach? Partner intel, recent news, specific pain points...'
          className='w-full resize-none rounded-[10px] p-3 text-[13px] leading-[19.5px] text-[#4A5565] outline outline-1 outline-[#E5E7EB] placeholder:text-[#4A5565]/50 focus:outline-[#6B4FBB] focus:ring-0'
        />
      </div>
    </div>
  )
}

// ─── Step 3 content ───────────────────────────────────────────────────────────

const SEQUENCE_STEPS = ['E', 'L', 'C', 'E', 'L', 'E', 'C', 'E']

function Step3Content({
  accountName,
  dealName,
  pipelineType,
  stage,
  priority,
  acv,
  closeDate,
  selectedCRM,
  partnerName,
  approachType,
  setApproachType,
  selectedSequence,
  setSelectedSequence,
  outreachTiming,
  setOutreachTiming,
  customDate,
  setCustomDate
}: {
  accountName: string
  dealName: string
  pipelineType: PipelineType
  stage: PipelineStage
  priority: Priority
  acv: string
  closeDate: string
  selectedCRM: CRMSync
  partnerName: string
  approachType: ApproachType
  setApproachType: (v: ApproachType) => void
  selectedSequence: SequenceId
  setSelectedSequence: (v: SequenceId) => void
  outreachTiming: OutreachTiming
  setOutreachTiming: (v: OutreachTiming) => void
  customDate: string
  setCustomDate: (v: string) => void
}) {
  const tomorrow = getTomorrow()
  const tomorrowLabel = `${formatDateShort(tomorrow)} · 9:00 AM recipient's timezone`

  const outreachStartLabel =
    outreachTiming === 'right-now'
      ? 'Today'
      : outreachTiming === 'tomorrow'
        ? formatDateShort(tomorrow)
        : customDate
          ? formatDateShort(new Date(customDate + 'T00:00:00'))
          : 'TBD'

  const pipelineLabel =
    pipelineType === 'partner-influenced'
      ? 'Partner-Influenced'
      : pipelineType === 'direct-sales'
        ? 'Direct Sales'
        : 'Partner-Sourced'

  const stageLabel = STAGES.find((s) => s.id === stage)?.label ?? 'Discovery'

  const priorityColor =
    priority === 'medium'
      ? '#E67E22'
      : priority === 'high'
        ? '#C0392B'
        : '#5F6D88'

  const priorityLabel =
    priority === 'medium' ? 'Medium' : priority === 'high' ? 'High' : 'Low'

  const closeDateFormatted = closeDate
    ? formatDateShort(new Date(closeDate + 'T00:00:00'))
    : '—'

  const acvFormatted = acv ? `$${Number(acv).toLocaleString('en-US')}` : '—'

  const crmSyncLabel = selectedCRM === 'hubspot' ? 'HubSpot ✅' : 'Salesforce'
  const crmSyncColor = selectedCRM === 'hubspot' ? '#1A7A4A' : '#6A7282'

  const approaches: {
    id: ApproachType
    emoji: string
    emojiAvatarBg: string
    title: string
    badge?: string
    badgeBg?: string
    description: string
    stat: string
    statColor: string
    extra?: string
    extraColor?: string
    quote?: string
  }[] = [
    {
      id: 'reference-partner',
      emoji: '💬',
      emojiAvatarBg: '#1A6AB5',
      title: 'Reference Partner as Context',
      badge: '★ Recommended',
      badgeBg: '#1A6AB5',
      description:
        'Use the HubSpot partner relationship as a credibility signal without formally requesting an intro. Opens cold outreach with warmth.',
      stat: '↑ 41% higher reply rate vs cold',
      statColor: '#1A7A4A',
      quote:
        '"Hi [Name], I noticed Momentum SaaS works with HubSpot — we partner closely with them and help companies at your stage manage partner pipelines and attribution..."'
    },
    {
      id: 'direct-cold',
      emoji: '🎯',
      emojiAvatarBg: '#F5F5F5',
      title: 'Direct Cold Outreach',
      description:
        'Standard cold sequence. No partner reference. Use if partner relationship is not relevant to pitch.',
      stat: 'Standard reply rate: ~8–12%',
      statColor: '#999999'
    },
    {
      id: 'formal-intro',
      emoji: '🤝',
      emojiAvatarBg: '#F5F5F5',
      title: 'Request Formal Intro First',
      description:
        'Before starting outreach, ask partner to formally introduce you. Higher effort but highest conversion rate.',
      stat: '↑ 67% higher close rate',
      statColor: '#1A7A4A',
      extra: '→ This will open the Request Intro flow instead',
      extraColor: '#00897B'
    }
  ]

  const radioColor = (id: ApproachType) =>
    id === 'reference-partner' ? '#1A6AB5' : '#6B4FBB'

  return (
    <div className='flex flex-col gap-6'>
      {/* How to approach */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-[15px] font-semibold leading-[22.5px] text-[#1A1A2E]'>
          How to approach {accountName} first?
        </h3>
        <div className='flex flex-col gap-2'>
          {approaches.map((a) => {
            const isSelected = approachType === a.id
            const rColor = radioColor(a.id)
            return (
              <button
                key={a.id}
                type='button'
                onClick={() => setApproachType(a.id)}
                className={`flex w-full items-start gap-4 rounded-2xl p-[18px] text-left transition-all ${
                  isSelected
                    ? 'bg-[#F5F0FF] outline outline-2 outline-[#6B4FBB]'
                    : 'bg-white outline outline-1 outline-[#EEEEEE]'
                }`}
              >
                {/* Emoji avatar */}
                <div
                  className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg'
                  style={{ background: a.emojiAvatarBg }}
                >
                  {a.emoji}
                </div>

                {/* Content */}
                <div className='flex flex-1 flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
                      {a.title}
                    </span>
                    {a.badge && (
                      <div
                        className='rounded px-2 py-0.5'
                        style={{ background: a.badgeBg }}
                      >
                        <span className='text-[10px] font-bold leading-[15px] tracking-[0.12px] text-white'>
                          {a.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className='text-xs leading-4 text-[#6A7282]'>
                    {a.description}
                  </span>
                  <span
                    className='text-[11px] leading-[16.5px] tracking-[0.06px]'
                    style={{ color: a.statColor }}
                  >
                    {a.stat}
                  </span>
                  {a.extra && (
                    <span
                      className='text-[11px] leading-[16.5px] tracking-[0.06px]'
                      style={{ color: a.extraColor }}
                    >
                      {a.extra}
                    </span>
                  )}
                  {a.quote && isSelected && (
                    <div
                      className='mt-1 rounded bg-white px-3 py-2.5'
                      style={{ borderLeft: '3px solid #1A6AB5' }}
                    >
                      <p className='text-xs italic leading-4 text-[#4A5565]'>
                        {a.quote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Radio */}
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    isSelected
                      ? 'outline outline-2'
                      : 'border-2 border-[#CCCCCC]'
                  }`}
                  style={isSelected ? { outlineColor: rColor } : undefined}
                >
                  {isSelected && (
                    <div
                      className='h-2 w-2 rounded-full'
                      style={{ background: rColor }}
                    />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add to outreach sequence */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Add to outreach sequence:
        </h3>
        <div className='overflow-hidden rounded-2xl outline outline-1 outline-[#E5E7EB]'>
          {/* Partner Overlap Fast Track */}
          <button
            type='button'
            onClick={() => setSelectedSequence('partner-overlap')}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all ${
              selectedSequence === 'partner-overlap'
                ? 'bg-[#F5F0FF]'
                : 'bg-white'
            }`}
            style={{ borderBottom: '1px solid #EEEEEE' }}
          >
            {/* Radio */}
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                selectedSequence === 'partner-overlap'
                  ? 'outline outline-2 outline-[#6B4FBB]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {selectedSequence === 'partner-overlap' && (
                <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
              )}
            </div>

            {/* Info */}
            <div className='flex flex-1 flex-col gap-0.5'>
              <span className='text-[13px] font-semibold leading-[19.5px] text-[#1A1A2E]'>
                Partner Overlap Fast Track
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#6A7282]'>
                8 touches · 21 days · Email + LinkedIn + Call
              </span>
            </div>

            {/* Best match badge */}
            <div className='rounded bg-[#E8F5E9] px-2 py-0.5'>
              <span className='text-[10px] font-bold leading-[15px] tracking-[0.12px] text-[#1A7A4A]'>
                Best match
              </span>
            </div>

            {/* Sequence steps */}
            <div className='flex items-center gap-0.5'>
              {SEQUENCE_STEPS.map((letter, i) => (
                <div
                  key={i}
                  className='flex h-5 w-5 items-center justify-center rounded'
                  style={{ background: '#6B4FBB' }}
                >
                  <span className='text-[9px] font-bold leading-[13.5px] tracking-[0.17px] text-white'>
                    {letter}
                  </span>
                </div>
              ))}
            </div>
          </button>

          {/* US BD Leaders Standard */}
          <button
            type='button'
            onClick={() => setSelectedSequence('us-bd-standard')}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all ${
              selectedSequence === 'us-bd-standard'
                ? 'bg-[#F5F0FF]'
                : 'bg-white'
            }`}
            style={{ borderBottom: '1px solid #EEEEEE' }}
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                selectedSequence === 'us-bd-standard'
                  ? 'outline outline-2 outline-[#6B4FBB]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {selectedSequence === 'us-bd-standard' && (
                <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
              )}
            </div>
            <div className='flex flex-1 flex-col gap-0.5'>
              <span className='text-[13px] font-semibold leading-[19.5px] text-[#1A1A2E]'>
                US BD Leaders — Standard
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#6A7282]'>
                8 touches · 28 days · Email + LinkedIn
              </span>
            </div>
          </button>

          {/* Create custom */}
          <div className='px-4 py-3'>
            <button
              type='button'
              className='text-[13px] leading-[19.5px] text-[#1A6AB5] hover:underline'
            >
              + Create custom sequence
            </button>
          </div>
        </div>
      </div>

      {/* When to start outreach */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          When to start outreach:
        </h3>
        <div className='flex flex-col gap-2'>
          {/* Right Now */}
          <button
            type='button'
            onClick={() => setOutreachTiming('right-now')}
            className={`flex w-full items-start gap-3 rounded-[10px] px-3 py-3.5 text-left transition-all ${
              outreachTiming === 'right-now'
                ? 'bg-[#F5F0FF] outline outline-2 outline-[#6B4FBB]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                outreachTiming === 'right-now'
                  ? 'outline outline-2 outline-[#6B4FBB]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {outreachTiming === 'right-now' && (
                <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
              )}
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[13px] leading-[19.5px] text-[#1A1A2E]'>
                Right Now
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#999999]'>
                First email sends immediately after deal creation
              </span>
            </div>
          </button>

          {/* Tomorrow Morning */}
          <button
            type='button'
            onClick={() => setOutreachTiming('tomorrow')}
            className={`flex w-full items-start gap-3 rounded-[10px] px-3 py-3.5 text-left transition-all ${
              outreachTiming === 'tomorrow'
                ? 'bg-[#F5F0FF] outline outline-2 outline-[#6B4FBB]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                outreachTiming === 'tomorrow'
                  ? 'outline outline-2 outline-[#1A6AB5]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {outreachTiming === 'tomorrow' && (
                <div className='h-2 w-2 rounded-full bg-[#1A6AB5]' />
              )}
            </div>
            <div className='flex flex-col gap-0.5'>
              <span
                className={`text-[13px] leading-[19.5px] text-[#1A1A2E] ${outreachTiming === 'tomorrow' ? 'font-bold' : 'font-normal'}`}
              >
                Tomorrow Morning
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#1A6AB5]'>
                {tomorrowLabel}
              </span>
              <span className='text-[10px] leading-[15px] tracking-[0.12px] text-[#1A7A4A]'>
                Gives AE time to research the account
              </span>
            </div>
          </button>

          {/* Choose Date */}
          <button
            type='button'
            onClick={() => setOutreachTiming('choose-date')}
            className={`flex w-full items-start gap-3 rounded-[10px] px-3 py-3.5 text-left transition-all ${
              outreachTiming === 'choose-date'
                ? 'bg-[#F5F0FF] outline outline-2 outline-[#6B4FBB]'
                : 'bg-white outline outline-1 outline-[#EEEEEE]'
            }`}
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                outreachTiming === 'choose-date'
                  ? 'outline outline-2 outline-[#6B4FBB]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {outreachTiming === 'choose-date' && (
                <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
              )}
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <span className='text-[13px] leading-[19.5px] text-[#1A1A2E]'>
                Choose Date
              </span>
              <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#999999]'>
                Best for planned outreach campaigns
              </span>
              {outreachTiming === 'choose-date' && (
                <input
                  type='date'
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className='mt-1 w-full rounded-[8px] bg-white px-3 py-2 text-sm outline outline-1 outline-[#E5E7EB] focus:outline-[#6B4FBB] focus:ring-0'
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Deal Summary */}
      <div className='flex flex-col gap-3 rounded-2xl bg-[#F8F9FB] px-5 py-5 outline outline-1 outline-[#E5E7EB]'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Deal Summary — Review Before Creating
        </h3>
        <div className='grid grid-cols-2 gap-x-4 gap-y-2.5'>
          {/* Row 1 */}
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Deal Name: </span>
            <span className='text-[#1A1A2E]'>{dealName}</span>
          </div>
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Assigned AE: </span>
            <span className='text-[#1A1A2E]'>Akshunya Vijay</span>
          </div>

          {/* Row 2 */}
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Pipeline: </span>
            <span className='text-[#1A6AB5]'>{pipelineLabel}</span>
          </div>
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>CRM Sync: </span>
            <span style={{ color: crmSyncColor }}>{crmSyncLabel}</span>
          </div>

          {/* Row 3 */}
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Stage: </span>
            <span className='text-[#1A1A2E]'>{stageLabel}</span>
          </div>
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Close Date: </span>
            <span className='text-[#1A1A2E]'>{closeDateFormatted}</span>
          </div>

          {/* Row 4 */}
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Priority: </span>
            <span style={{ color: priorityColor }}>{priorityLabel}</span>
          </div>
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Outreach: </span>
            <span className='text-[#1A1A2E]'>Starts {outreachStartLabel}</span>
          </div>

          {/* Row 5 */}
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Est. ACV: </span>
            <span className='font-bold text-[#1A7A4A]'>{acvFormatted}</span>
          </div>
          <div className='text-[13px] leading-[19.5px]'>
            <span className='text-[#99A1AF]'>Attribution: </span>
            <span className='text-[#6B4FBB]'>INFLUENCED — {partnerName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface AddToPipelineDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountName?: string
  partnerName?: string
  estimatedACV?: number
  opportunityScore?: number
}

export function AddToPipelineDrawer({
  open,
  onOpenChange,
  accountName = 'Unknown Account',
  partnerName = 'Partner',
  estimatedACV = 42000,
  opportunityScore = 61
}: AddToPipelineDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 state
  const [dealName, setDealName] = useState(
    `${accountName} — Partner Overlap Discovery`
  )
  const [pipelineType, setPipelineType] =
    useState<PipelineType>('partner-influenced')
  const [stage, setStage] = useState<PipelineStage>('discovery')
  const [acv, setAcv] = useState(String(estimatedACV))
  const [closeDate, setCloseDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 90)
    return d.toISOString().split('T')[0]
  })
  const [priority, setPriority] = useState<Priority>(
    opportunityScore < 50 ? 'low' : opportunityScore <= 75 ? 'medium' : 'high'
  )

  // Step 2 state
  const [selectedOwner, setSelectedOwner] = useState<OwnerContact>('c-suite')
  const [selectedCRM, setSelectedCRM] = useState<CRMSync>('hubspot')
  const [tags, setTags] = useState<string[]>([
    'Partner Overlap',
    'Q2 2026',
    'HubSpot Signal',
    'Trial User Signal'
  ])
  const [aeNotes, setAeNotes] = useState('')

  // Step 3 state
  const [approachType, setApproachType] =
    useState<ApproachType>('reference-partner')
  const [selectedSequence, setSelectedSequence] =
    useState<SequenceId>('partner-overlap')
  const [outreachTiming, setOutreachTiming] =
    useState<OutreachTiming>('tomorrow')
  const [customDate, setCustomDate] = useState('')

  const STEP_TITLES: Record<1 | 2 | 3, string> = {
    1: 'Create Pipeline Deal',
    2: 'Assign & Configure',
    3: 'Launch Outreach'
  }

  const STEP_FOOTER_LABELS: Record<1 | 2 | 3, string> = {
    1: 'Setup',
    2: 'Notify',
    3: 'Track'
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
              {STEP_TITLES[step]}
            </h2>
            <p className='text-sm leading-5 text-[#030303]/60'>
              {accountName} — Partner Overlap Discovery
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
            label='Deal Setup'
            state={step > 1 ? 'completed' : 'active'}
          />
          <StepBadge
            step={2}
            label='Assign'
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
            <Step1Content
              dealName={dealName}
              setDealName={setDealName}
              pipelineType={pipelineType}
              setPipelineType={setPipelineType}
              stage={stage}
              setStage={setStage}
              acv={acv}
              setAcv={setAcv}
              closeDate={closeDate}
              setCloseDate={setCloseDate}
              priority={priority}
              setPriority={setPriority}
              partnerName={partnerName}
              opportunityScore={opportunityScore}
            />
          )}
          {step === 2 && (
            <Step2Content
              accountName={accountName}
              pipelineType={pipelineType}
              stage={stage}
              selectedOwner={selectedOwner}
              setSelectedOwner={setSelectedOwner}
              selectedCRM={selectedCRM}
              setSelectedCRM={setSelectedCRM}
              tags={tags}
              setTags={setTags}
              aeNotes={aeNotes}
              setAeNotes={setAeNotes}
            />
          )}
          {step === 3 && (
            <Step3Content
              accountName={accountName}
              dealName={dealName}
              pipelineType={pipelineType}
              stage={stage}
              priority={priority}
              acv={acv}
              closeDate={closeDate}
              selectedCRM={selectedCRM}
              partnerName={partnerName}
              approachType={approachType}
              setApproachType={setApproachType}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
              outreachTiming={outreachTiming}
              setOutreachTiming={setOutreachTiming}
              customDate={customDate}
              setCustomDate={setCustomDate}
            />
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div
          className='flex items-center justify-between px-8 py-5'
          style={{ borderTop: '1px solid #C0D6FF' }}
        >
          <span className='text-xs leading-4 text-[#2A3241]'>
            Step {step} of 3 — {STEP_FOOTER_LABELS[step]}
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
            ) : step === 3 ? (
              <DrawerClose asChild>
                <button
                  type='button'
                  className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
                >
                  Cancel
                </button>
              </DrawerClose>
            ) : (
              <button
                type='button'
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
              >
                Back
              </button>
            )}

            <button
              type='button'
              onClick={() => {
                if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3)
                else handleClose()
              }}
              className='flex items-center gap-2 rounded-[10px] bg-[#3E50F7] px-5 py-3 text-sm font-bold leading-5 text-white transition-colors hover:bg-[#3344e0]'
            >
              {step === 1
                ? 'Next: Notify Partner'
                : step === 2
                  ? 'Send Notifications'
                  : 'CREATE DEAL'}
              <ArrowRight />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
