'use client'

import React, { useState } from 'react'
import { Check, Lock, Pencil, RefreshCw, X } from 'lucide-react'

import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'

import {
  useDealOwnerDetails,
  useGenerateIntro,
  useSendCoSellNotification
} from '../api'

// ─── Types ────────────────────────────────────────────────────────────────────

type IntroType = 'email' | 'linkedin' | 'direct-meeting'
type MessageTone = 'professional' | 'direct' | 'casual'
type SendVia = 'sharkdom' | 'linkedin' | 'email'
type ContactId = 'primary-contact' | 'c-suite'
type RequestPriority = 'normal' | 'urgent'

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

// ─── Icons ────────────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect
        x='3'
        y='5'
        width='18'
        height='14'
        rx='2'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M3 7l9 6 9-6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function LinkedInIntroIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect
        x='3'
        y='3'
        width='18'
        height='18'
        rx='3'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M7 10v7M7 7v.5M11 17v-4c0-1.1.9-2 2-2s2 .9 2 2v4M11 10v7'
        stroke='currentColor'
        strokeWidth='1.7'
        strokeLinecap='round'
      />
    </svg>
  )
}

function MeetingIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect
        x='3'
        y='5'
        width='18'
        height='16'
        rx='2'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M3 10h18M8 3v4M16 3v4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <circle cx='8' cy='15' r='1.3' fill='currentColor' />
      <circle cx='12' cy='15' r='1.3' fill='currentColor' />
      <circle cx='16' cy='15' r='1.3' fill='currentColor' />
    </svg>
  )
}

function UserIcon({ color }: { color: string }) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
      <ellipse
        cx='8'
        cy='5.5'
        rx='3.33'
        ry='3'
        stroke={color}
        strokeWidth='1.33'
      />
      <path
        d='M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6'
        stroke={color}
        strokeWidth='1.33'
        strokeLinecap='round'
      />
    </svg>
  )
}

// ─── Step 1 sub-components ────────────────────────────────────────────────────

function IntroTypeOption({
  id,
  icon,
  title,
  description,
  responseRate,
  warning,
  selected,
  onSelect
}: {
  id: IntroType
  icon: React.ReactNode
  title: string
  description: string
  responseRate?: string
  warning?: string
  selected: boolean
  onSelect: (id: IntroType) => void
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
      <div className='flex flex-col gap-1.5'>
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
            {title}
          </span>
          <span className='text-xs leading-4 text-[#6A7282]'>
            {description}
          </span>
          {responseRate && (
            <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#6B4FBB]'>
              {responseRate}
            </span>
          )}
        </div>
        {warning && (
          <div className='rounded bg-[#FFF8E1] px-2 py-1'>
            <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#E67E22]'>
              {warning}
            </span>
          </div>
        )}
      </div>
    </button>
  )
}

function ContactCard({
  id,
  avatar,
  name,
  title,
  titleItalic,
  source,
  sourceColor,
  sourceTextColor,
  note,
  star,
  locked,
  selected,
  onSelect
}: {
  id: ContactId
  avatar: React.ReactNode
  name: string
  title: string
  titleItalic?: boolean
  source: string
  sourceColor: string
  sourceTextColor: string
  note?: string
  star?: string
  locked?: string
  selected: boolean
  onSelect: (id: ContactId) => void
}) {
  return (
    <button
      type='button'
      onClick={() => onSelect(id)}
      className={`flex w-full items-start gap-3 rounded-[10px] px-3.5 py-3.5 text-left transition-all ${
        selected
          ? 'bg-[#F5F0FF] outline outline-2 outline-[#C4AFF0]'
          : 'bg-white outline outline-1 outline-[#EEEEEE] hover:outline-[#C4AFF0]'
      }`}
    >
      {avatar}
      <div className='flex flex-1 flex-col gap-1'>
        <span className='text-[13px] font-semibold leading-[19.5px] text-[#1A1A2E]'>
          {name}
        </span>
        <span
          className={`text-xs leading-4 ${titleItalic ? 'italic text-[#5C6A83]' : 'text-[#6A7282]'}`}
        >
          {title}
        </span>
        <span
          className='w-fit rounded px-1.5 py-0.5 text-[10px] font-medium leading-[15px] tracking-[0.12px]'
          style={{ background: sourceColor, color: sourceTextColor }}
        >
          {source}
        </span>
        {star && (
          <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#323232]'>
            {star}
          </span>
        )}
        {locked && (
          <span className='text-[10px] leading-[15px] tracking-[0.12px] text-[#323232]'>
            {locked}
          </span>
        )}
        {note && (
          <span className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
            {note}
          </span>
        )}
      </div>
      {/* Radio */}
      <div
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
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

// ─── Step 1 Content ───────────────────────────────────────────────────────────

function Step1Content({
  introType,
  setIntroType,
  selectedContact,
  setSelectedContact,
  pitchMode,
  setPitchMode,
  customPitch,
  setCustomPitch,
  partnerContext,
  setPartnerContext,
  dealDetails,
  accountName = 'GlobalPay Inc'
}: {
  introType: IntroType
  setIntroType: (v: IntroType) => void
  selectedContact: ContactId
  setSelectedContact: (v: ContactId) => void
  pitchMode: 'ai' | 'custom'
  setPitchMode: (v: 'ai' | 'custom') => void
  customPitch: string
  setCustomPitch: (v: string) => void
  partnerContext: string
  setPartnerContext: (v: string) => void
  dealDetails: any
  accountName?: string
}) {
  const introOptions = [
    {
      id: 'email' as IntroType,
      icon: <EmailIcon />,
      title: 'Email Introduction',
      description:
        'Partner sends a 3-way email introducing your AE directly to their contact. Professional, documented, and attribution-timestamped.',
      responseRate: 'Response rate: ~73% within 48hrs'
    },
    {
      id: 'linkedin' as IntroType,
      icon: <LinkedInIntroIcon />,
      title: 'LinkedIn Introduction',
      description:
        'Partner tags both parties in a LinkedIn message. Good for relationship-first context. Less formal than email.',
      responseRate: 'Response rate: ~58% within 72hrs'
    },
    {
      id: 'direct-meeting' as IntroType,
      icon: <MeetingIcon />,
      title: 'Direct Meeting Setup',
      description:
        'Partner invites all parties to a 30-minute intro call. Highest commitment — only request if partner has strong relationship.',
      warning: '⚠️ Use only with strong partner relationships'
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      {/* Intro type */}
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What type of co-sell motion?
        </h3>
        <div className='flex flex-col gap-2'>
          {introOptions.map((opt) => (
            <IntroTypeOption
              key={opt.id}
              {...opt}
              selected={introType === opt.id}
              onSelect={setIntroType}
            />
          ))}
        </div>
      </div>

      {/* Who to introduce */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          Who should be introduced to?
        </h3>

        {/* Info banner */}
        <div className='flex items-start gap-2.5 rounded-[10px] bg-[#F8F9FB] px-3 py-3.5 outline outline-1 outline-[#EEEEEE]'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            className='mt-0.5 shrink-0'
          >
            <circle cx='8' cy='8' r='6' stroke='#00897B' strokeWidth='1.33' />
            <path
              d='M8 7v4M8 5v.5'
              stroke='#00897B'
              strokeWidth='1.33'
              strokeLinecap='round'
            />
          </svg>
          <p className='text-xs leading-4 text-[#6A7282]'>
            Partner&apos;s {accountName} contacts are revealed only after they
            agree to make the introduction. Below is what we know from public
            and CRM data.
          </p>
        </div>

        {/* Contact cards */}
        <div className='flex flex-col gap-2'>
          <ContactCard
            id='primary-contact'
            avatar={
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9EBFF]'>
                <span className='text-[11px] font-bold text-[#3E50F7]'>
                  {dealDetails?.firstName
                    ? dealDetails.firstName.charAt(0)
                    : ''}
                  {dealDetails?.lastName ? dealDetails.lastName.charAt(0) : ''}
                </span>
              </div>
            }
            name={
              dealDetails?.firstName && dealDetails?.lastName
                ? `${dealDetails.firstName} ${dealDetails.lastName}`
                : '[Contact Name]'
            }
            title={dealDetails?.jobTitle || '[Job Title]'}
            source='From: Your CRM'
            sourceColor='#E3F2FD'
            sourceTextColor='#1565C0'
            note={
              dealDetails?.firstName
                ? `Your AE has met ${dealDetails.firstName} recently`
                : ''
            }
            selected={selectedContact === 'primary-contact'}
            onSelect={setSelectedContact}
          />
          <ContactCard
            id='c-suite'
            avatar={
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white outline outline-1 outline-[#EEEEEE]'>
                <UserIcon color='#6B4FBB' />
              </div>
            }
            name='[C-Suite Contact]'
            title='[Title hidden until partner agrees]'
            titleItalic
            source='From: Partner CRM'
            sourceColor='#6B4FBB'
            sourceTextColor='white'
            star='★ Partner recommends starting here'
            locked='🔒 Full details revealed after partner accepts'
            selected={selectedContact === 'c-suite'}
            onSelect={setSelectedContact}
          />
        </div>

        <button
          type='button'
          className='text-left text-[11px] font-medium leading-[16.5px] tracking-[0.06px] text-[#3E50F7] hover:underline'
        >
          + Suggest a specific contact
        </button>
      </div>

      {/* What should partner say */}
      <div className='flex flex-col gap-4'>
        <h3 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What should the partner say about you?
        </h3>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <button
              type='button'
              onClick={() => setPitchMode('ai')}
              className='flex items-center gap-2.5'
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  pitchMode === 'ai'
                    ? 'outline outline-2 outline-[#6B4FBB]'
                    : 'border-2 border-[#CCCCCC]'
                }`}
              >
                {pitchMode === 'ai' && (
                  <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
                )}
              </div>
              <span className='text-[11px] font-bold leading-[16.5px] tracking-[0.06px] text-[#6B4FBB]'>
                AI-Generated Suggestion
              </span>
            </button>

            <button
              type='button'
              className='flex items-center gap-2 rounded-full bg-[#EEF0FF] px-2 py-0.5'
            >
              <RefreshCw size={11} className='text-[#7881FF]' />
              <span className='text-xs font-semibold leading-6 text-[#344257]'>
                Re-generate
              </span>
            </button>
          </div>

          <div className='rounded-[10px] bg-[#F5F0FF] px-4 py-4 outline outline-1 outline-[#C4AFF0]'>
            <p className='text-[13px] italic leading-[21.13px] text-[#4A5565]'>
              Sharkdom helps companies like {accountName} manage and activate
              their partner ecosystem — tracking deal attribution, onboarding
              partners faster, and turning partner agreements into measurable
              revenue. Given {accountName}&apos;s growth stage and partner
              program, this is highly relevant right now.
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => setPitchMode('custom')}
            className='flex items-center gap-2.5'
          >
            <div
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                pitchMode === 'custom'
                  ? 'outline outline-2 outline-[#6B4FBB]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {pitchMode === 'custom' && (
                <div className='h-2 w-2 rounded-full bg-[#6B4FBB]' />
              )}
            </div>
            <span className='text-xs font-medium leading-4 text-[#2F3B51]'>
              Or write your own joint value prop:
            </span>
          </button>

          <div className='relative'>
            <textarea
              value={customPitch}
              onChange={(e) => setCustomPitch(e.target.value)}
              maxLength={280}
              placeholder='Describe why Acme Corporation should hear from both companies together...'
              rows={4}
              className='w-full resize-none rounded-[10px] p-3 text-[13px] leading-[19.5px] text-[#4A5565] outline outline-1 outline-[#E5E7EB] placeholder:text-[#4A5565]/50 focus:outline-[#6B4FBB] focus:ring-0'
            />
            <span className='absolute bottom-2.5 right-3 text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
              {customPitch.length}/280
            </span>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className='rounded-lg bg-[#E0F2F1] px-3 py-2'>
        <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#00897B]'>
          💡 Tip: Mention a specific pain point {accountName} likely has.
          Partners are 2x more likely to make intros when the fit is obvious.
        </p>
      </div>

      {/* Context for partner */}
      <div className='flex flex-col gap-2'>
        <h3 className='text-[15px] font-semibold leading-[22.5px] text-[#1A1A2E]'>
          Context for partner{' '}
          <span className='text-xs font-normal text-[#99A1AF]'>
            (optional but recommended)
          </span>
        </h3>
        <textarea
          value={partnerContext}
          onChange={(e) => setPartnerContext(e.target.value)}
          placeholder={`e.g. We believe ${accountName} is evaluating partner ops tools this quarter — their CTO posted about scaling their ecosystem on LinkedIn last week. Your intro would arrive at the perfect moment.`}
          rows={3}
          className='w-full resize-none rounded-[10px] bg-[#FAFAFA] p-3 text-[13px] italic leading-[19.5px] text-[#4A5565] outline outline-1 outline-[#E5E7EB] placeholder:text-[#4A5565]/50 focus:outline-[#6B4FBB] focus:ring-0'
        />
        <p className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
          This is only visible to the partner — not to {accountName}
        </p>
      </div>

      {/* Attribution Preview */}
      <div
        className='flex flex-col gap-5 rounded-xl px-5 py-[23px]'
        style={{
          background: 'linear-gradient(90deg, #E5EDFF 0%, #F3E3FF 100%)'
        }}
      >
        <div className='flex items-center gap-2'>
          <Lock size={15} className='text-[#2A3241]' />
          <span className='text-[13px] font-semibold leading-[19.5px] text-[#2A3241]'>
            Attribution Preview
          </span>
        </div>

        <div className='flex items-start gap-6'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-xs leading-4 text-[#4D5C78]'>
              If {accountName} closes after this introduction:
            </span>
            <div className='flex h-8 w-[97px] items-center justify-center rounded-lg bg-[#6B4FBB]'>
              <span className='text-sm font-bold leading-5 text-white'>
                SOURCED
              </span>
            </div>
            <span className='text-[11px] italic leading-[16.5px] tracking-[0.06px] text-[#2F3B51]'>
              (Highest attribution tier)
            </span>
          </div>

          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs leading-4 text-[#4D5C78]'>
                Partner commission:
              </span>
              <span className='text-sm font-semibold leading-5 text-[#6B4FBB]'>
                Eligible — Full Tier
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-xs leading-4 text-[#4D5C78]'>
                Timestamp locked:
              </span>
              <span className='text-sm font-semibold leading-5 text-[#6B4FBB]'>
                On intro confirmation
              </span>
            </div>
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

// ─── Step 2 Content (Send) ────────────────────────────────────────────────────

function Step2Content({
  sendVia,
  setSendVia,
  urgent,
  setUrgent,
  requestPriority,
  setRequestPriority,
  noResponseDate,
  setNoResponseDate,
  accountName = 'GlobalPay Inc',
  generatedSubject,
  generatedBody,
  onRegenerate,
  isGenerating
}: {
  sendVia: SendVia
  setSendVia: (v: SendVia) => void
  urgent: boolean
  setUrgent: (v: boolean) => void
  requestPriority: RequestPriority
  setRequestPriority: (v: RequestPriority) => void
  noResponseDate: string
  setNoResponseDate: (v: string) => void
  accountName?: string
  generatedSubject: string
  generatedBody: string
  onRegenerate: () => void
  isGenerating: boolean
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
      id: 'linkedin',
      icon: (
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
          <rect width='22' height='22' rx='4' fill='#2A3241' />
          <path
            d='M6 9h2v7H6V9zm1-1.5a1 1 0 110-2 1 1 0 010 2zM10 9h1.9v1h.03C12.3 9.4 13.1 9 14.1 9c2.1 0 2.9 1.4 2.9 3.2V16h-2v-3.5c0-.8 0-1.8-1.1-1.8S12 11.6 12 12.4V16h-2V9z'
            fill='white'
          />
        </svg>
      ),
      title: 'LinkedIn Message',
      subtitle: 'Drafts message to send from your LinkedIn'
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
    <div className='flex flex-col gap-4'>
      {/* Title */}
      <div className='flex flex-col gap-1'>
        <h3 className='text-lg font-semibold leading-7 text-[#1A1A2E]'>
          Preview Your Request
        </h3>
        <p className='text-[13px] leading-[19.5px] text-[#6A7282]'>
          This request goes to your PARTNER first — not to {accountName}.
          Partner must agree before any introduction is made.
        </p>
      </div>

      {/* Important warning banner */}
      <div
        className='flex items-start gap-2 rounded-[10px] px-3 py-3'
        style={{
          background: '#FFF8E1',
          outline: '1px solid #F5A623',
          outlineOffset: '-1px'
        }}
      >
        <span className='shrink-0 text-base leading-6'>⚡</span>
        <p className='text-[13px] font-semibold leading-[19.5px] text-[#E67E22]'>
          Important: You are requesting that your PARTNER make an introduction
          on your behalf. {accountName} will not be contacted until your partner
          agrees and initiates the introduction themselves.
        </p>
      </div>

      {/* What partner will receive */}
      <div className='flex flex-col gap-2.5'>
        <h4 className='text-sm font-semibold leading-5 text-[#1A1A2E]'>
          What your partner will receive:
        </h4>

        {/* Actions */}
        <div className='flex items-center justify-between'>
          <button
            type='button'
            onClick={onRegenerate}
            disabled={isGenerating}
            className='flex items-center gap-2 rounded-full bg-[#EEF0FF] px-2 py-0.5'
          >
            <RefreshCw
              size={11}
              className={`text-[#7881FF] ${isGenerating ? 'animate-spin' : ''}`}
            />
            <span className='text-xs font-semibold leading-6 text-[#344257]'>
              {isGenerating ? 'Generating...' : 'Re-generate'}
            </span>
          </button>

          <button
            type='button'
            className='flex items-center gap-1.5 text-xs font-medium text-[#6B4FBB]'
          >
            <Pencil size={12} />
            Edit message
          </button>
        </div>

        {/* Email preview */}
        <div className='rounded-[10px] bg-white outline outline-1 outline-[#E5E7EB]'>
          <div className='flex flex-col gap-0 px-5 pt-5'>
            <span className='text-xs leading-4 text-[#6A7282]'>
              From: [Your Name] (via Sharkdom)
            </span>
            <span className='mt-1 text-xs leading-4 text-[#6A7282]'>
              To: [Partner Contact]
            </span>
            <div className='mt-2.5 border-b border-[#F3F4F6] pb-2.5'>
              <span className='text-[13px] font-bold leading-[19.5px] text-[#1A1A2E]'>
                {generatedSubject || `Introduction Request — ${accountName}`}
              </span>
            </div>
          </div>
          <div className='px-5 py-4'>
            <p className='whitespace-pre-wrap text-[13px] leading-[21.13px] text-[#364153]'>
              {generatedBody ||
                `Hi [Partner Team], I noticed you have ${accountName} as a closed customer in our shared account mapping session on Sharkdom.

We're currently in Discovery stage with ${accountName} and believe Sharkdom would be a strong fit for their partner ops needs.
I'd love to ask if you'd be comfortable making a warm introduction to your contact at ${accountName}. Specifically:

→ Who: [Your Name], [Your Title] at [Your Company]
→ Why it makes sense: [Your personalized pitch]
→ Context I can share: [Additional context]

If you're open to it, I can draft the intro email for you to send — or happy to hop on a quick call to align first. No pressure if the timing isn't right.

— [Your Name]
[Your Company] | [Your Title]`}
            </p>
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

      {/* Request priority */}
      <div className='flex flex-col gap-2'>
        <span className='text-xs leading-4 text-[#6A7282]'>
          Request priority:
        </span>
        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => setRequestPriority('normal')}
            className='flex items-start gap-1.5'
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                requestPriority === 'normal'
                  ? 'outline outline-2 outline-[#00897B]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {requestPriority === 'normal' && (
                <div className='h-2 w-2 rounded-full bg-[#00897B]' />
              )}
            </div>
            <span className='text-xs leading-4 text-[#0A0A0A]'>
              Normal —{' '}
              <span className='text-[#99A1AF]'>
                Partner notified within 24 hours
              </span>
            </span>
          </button>

          <button
            type='button'
            onClick={() => setRequestPriority('urgent')}
            className='flex items-start gap-1.5'
          >
            <div
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                requestPriority === 'urgent'
                  ? 'outline outline-2 outline-[#00897B]'
                  : 'border-2 border-[#CCCCCC]'
              }`}
            >
              {requestPriority === 'urgent' && (
                <div className='h-2 w-2 rounded-full bg-[#00897B]' />
              )}
            </div>
            <span className='text-xs leading-4 text-[#0A0A0A]'>
              Urgent —{' '}
              <span className='text-[#99A1AF]'>
                Send push notification immediately
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* If no response by */}
      <div className='flex flex-col gap-1'>
        <div className='flex flex-col gap-2'>
          <span className='text-xs leading-4 text-[#6A7282]'>
            If no response by:
          </span>
          <input
            type='date'
            value={noResponseDate}
            onChange={(e) => setNoResponseDate(e.target.value)}
            className='w-[209px] rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-[13px] leading-[19.5px] text-[#4A5565] focus:border-[#6B4FBB] focus:outline-none'
          />
        </div>
        <p className='text-[11px] leading-[16.5px] tracking-[0.06px] text-[#99A1AF]'>
          After this date, you&apos;ll receive an alert and alternative
          suggestions will be surfaced
        </p>
      </div>
    </div>
  )
}

// ─── Step 3 content (Track) ───────────────────────────────────────────────────

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

function Step3Content({
  accountName = 'GlobalPay Inc'
}: {
  accountName?: string
}) {
  const timeline = [
    {
      icon: <CheckCircle color='#38B000' />,
      title: 'Request Sent',
      subtitle: 'Apr 5, 2026 — 2:34 PM'
    },
    {
      icon: <ClockCircle />,
      title: 'Partner accepts invitation',
      subtitle: 'Typically within 24 hours'
    },
    {
      icon: <CalendarCircle />,
      title: 'Introduction Made',
      subtitle: 'Partner sends 3-way email'
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex gap-2'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl font-semibold leading-8 tracking-[0.07px] text-[#1A1A2E]'>
              Request Sent! 🎉
            </h3>
            <p className='text-sm leading-5 text-[#6A7282]'>
              HubSpot Partner has been notified of your intro request for{' '}
              {accountName}.
            </p>
          </div>

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
  )
}

// ─── Arrow icon ───────────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

interface RequestIntroDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId?: number
  dealId?: string
  accountName?: string
  onSuccess?: () => void
}

export function RequestIntroDrawer({
  open,
  onOpenChange,
  organizationId,
  dealId,
  accountName = 'GlobalPay Inc'
}: RequestIntroDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const { data: dealDetails } = useDealOwnerDetails(organizationId, dealId)

  // Step 1 state
  const [introType, setIntroType] = useState<IntroType>('email')
  const [selectedContact, setSelectedContact] = useState<ContactId>('c-suite')
  const [pitchMode, setPitchMode] = useState<'ai' | 'custom'>('ai')
  const [customPitch, setCustomPitch] = useState('')
  const [partnerContext, setPartnerContext] = useState('')

  // Step 2 state
  const [sendVia, setSendVia] = useState<SendVia>('sharkdom')
  const [urgent, setUrgent] = useState(false)
  const [requestPriority, setRequestPriority] =
    useState<RequestPriority>('normal')
  const [noResponseDate, setNoResponseDate] = useState('')
  const [generatedSubject, setGeneratedSubject] = useState('')
  const [generatedBody, setGeneratedBody] = useState('')

  const generateIntroMutation = useGenerateIntro()

  const handleGenerateIntro = async () => {
    try {
      const res = await generateIntroMutation.mutateAsync({
        type: 'vendor-to-partner',
        data: {
          sender_name: '[Your Name]',
          sender_title: '[Your Title]',
          sender_company: '[Your Company]',
          sender_company_description: '',
          partner_contact_name: '[Partner Contact Name]',
          partner_contact_title: '',
          partner_company: '',
          target_contact_name:
            dealDetails?.firstName && dealDetails?.lastName
              ? `${dealDetails.firstName} ${dealDetails.lastName}`
              : '[Contact Name]',
          target_contact_title: dealDetails?.jobTitle || '[Job Title]',
          target_account_name: accountName,
          your_deal_stage: 'Discovery',
          partner_relationship_type: '',
          partner_relationship_duration: '',
          relevance_reason:
            customPitch ||
            'We believe Sharkdom would be a strong fit for their partner ops needs.',
          prior_context: partnerContext || '',
          why_meeting_preferred: '',
          meeting_duration: '',
          meeting_agenda: '',
          available_slots: '',
          why_suggesting: '',
          endorsement_strength: '',
          target_contact_linkedin: '',
          linkedin_intro_format: '',
          partner_contact_linkedin: '',
          linkedin_connection_type: '',
          relevance_to_target: '',
          relationship_tone: 'professional',
          why_making_intro: ''
        }
      })
      if (res.ok && res.data) {
        setGeneratedSubject(res.data.subject)
        setGeneratedBody(res.data.body)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const sendNotificationMutation = useSendCoSellNotification()
  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = async () => {
    setIsSending(true)
    try {
      const emailBody =
        generatedBody ||
        `Hi [Partner Team], I noticed you have ${accountName} as a closed customer...`
      const emailSubject =
        generatedSubject || `Introduction Request — ${accountName}`

      await sendNotificationMutation.mutateAsync({
        body: emailBody,
        subject: emailSubject,
        receiverEmail: 'partner@example.com', // Would come from real data
        receiverName: '[Partner Contact]',
        scheduled: false,
        scheduleTime: new Date().toISOString()
      })
      onSuccess?.()
      setStep(3)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
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
              {step === 1
                ? 'Request a Warm Introduction'
                : step === 2
                  ? 'Preview Your Request'
                  : 'Request Sent! 🎉'}
            </h2>
            <p className='text-sm leading-5 text-[#030303]/60'>
              {accountName} via HubSpot Partner Program
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
            label='Send'
            state={step > 2 ? 'completed' : step === 2 ? 'active' : 'idle'}
          />
          <StepBadge
            step={3}
            label='Track'
            state={step === 3 ? 'active' : 'idle'}
          />
        </div>

        {/* ── Scrollable Content ──────────────────────────────────────────── */}
        <div className='hide-scrollbar flex-1 overflow-y-auto px-5 py-5'>
          {step === 1 && (
            <Step1Content
              introType={introType}
              setIntroType={setIntroType}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              pitchMode={pitchMode}
              setPitchMode={setPitchMode}
              customPitch={customPitch}
              setCustomPitch={setCustomPitch}
              partnerContext={partnerContext}
              setPartnerContext={setPartnerContext}
              dealDetails={dealDetails}
              accountName={accountName}
            />
          )}
          {step === 2 && (
            <Step2Content
              sendVia={sendVia}
              setSendVia={setSendVia}
              urgent={urgent}
              setUrgent={setUrgent}
              requestPriority={requestPriority}
              setRequestPriority={setRequestPriority}
              noResponseDate={noResponseDate}
              setNoResponseDate={setNoResponseDate}
              accountName={accountName}
              generatedSubject={generatedSubject}
              generatedBody={generatedBody}
              onRegenerate={handleGenerateIntro}
              isGenerating={generateIntroMutation.isPending}
            />
          )}
          {step === 3 && <Step3Content accountName={accountName} />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div
          className='flex items-center justify-between px-8 py-5'
          style={{ borderTop: '1px solid #C0D6FF' }}
        >
          <span className='text-xs leading-4 text-[#2A3241]'>
            Step {step} of 3 —{' '}
            {step === 1 ? 'Setup' : step === 2 ? 'Notify' : 'Track'}
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
              <DrawerClose asChild>
                <button
                  type='button'
                  className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
                >
                  Cancel
                </button>
              </DrawerClose>
            ) : (
              <DrawerClose asChild>
                <button
                  type='button'
                  className='text-[13px] font-medium leading-[19.5px] text-[#2A3241] hover:underline'
                >
                  Close
                </button>
              </DrawerClose>
            )}

            <button
              type='button'
              onClick={() => {
                if (step === 1) setStep(2)
                else if (step === 2) handleSendNotification()
                else handleClose()
              }}
              disabled={isSending}
              className='flex items-center gap-2 rounded-[10px] bg-[#3E50F7] px-5 py-3 text-sm font-bold leading-5 text-white transition-colors hover:bg-[#3344e0] disabled:opacity-50'
            >
              {step === 1
                ? 'Next: Notify Partner'
                : step === 2
                  ? isSending
                    ? 'Sending...'
                    : 'Send Notifications'
                  : 'View Account'}
              <ArrowRight />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
