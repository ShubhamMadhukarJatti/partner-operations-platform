import React, { useState } from 'react'

import { showCustomToast } from '@/components/custom-toast'

interface Step4_5Props {
  firstName?: string
  lastName?: string
  companyName?: string
  websiteUrl?: string
  email?: string
  currentRole?: string
  teamSize?: string
  onNext?: () => void
  onPrev?: () => void
}

type InvitedMember = {
  id: number
  initials: string
  name: string
  role: string
}

export const Step4_5: React.FC<Step4_5Props> = ({
  firstName = 'John',
  lastName = 'Doe',
  companyName = 'Acme corp',
  websiteUrl = 'https://www.acmecorp.io',
  email = 'johndoe@acmecorp.io',
  currentRole = 'Partnership team',
  teamSize = '1-4 people',
  onNext,
  onPrev
}) => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([])
  const [isInviting, setIsInviting] = useState(false)

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      showCustomToast('Error', 'Please enter an email address', 'error', 5000)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail.trim())) {
      showCustomToast(
        'Error',
        'Please enter a valid email address',
        'error',
        5000
      )
      return
    }

    if (inviteEmail.trim().toLowerCase().endsWith('@gmail.com')) {
      showCustomToast(
        'Error',
        'Gmail addresses are not allowed. Please use a different email provider.',
        'error',
        5000
      )
      return
    }

    setIsInviting(true)
    try {
      const name = inviteEmail.split('@')[0] // Fallback name

      const response = await fetch('/api/V1/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: inviteEmail.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData?.errorMessage ||
          errorData?.message ||
          (errorData?.errorCode === 'SH174'
            ? 'All seats are currently occupied. Please upgrade your subscription.'
            : `Failed to invite ${inviteEmail}`)
        showCustomToast('Error', errorMessage, 'error', 5000)
        return
      }

      showCustomToast('Success', 'Member invited successfully', 'success', 5000)

      setInvitedMembers([
        ...invitedMembers,
        {
          id: Date.now(),
          initials: name.substring(0, 2).toUpperCase(),
          name: name,
          role: 'View only'
        }
      ])
      setInviteEmail('')
    } catch (error: any) {
      showCustomToast(
        'Error',
        error.message || 'An unexpected error occurred',
        'error',
        5000
      )
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className='inline-flex h-full w-full flex-col items-center justify-start gap-8 rounded-2xl bg-white p-6'>
      {/* Header */}
      <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
        <div className='self-stretch font-inter text-2xl font-semibold text-[#101828]'>
          Welcome {firstName},
        </div>
        <div className='self-stretch font-inter text-2xl font-normal text-[#A7A6CC]'>
          Optimising your AI workforce
        </div>
      </div>

      <div className='inline-flex flex-1 items-start justify-start gap-6 self-stretch'>
        {/* Left Panel */}
        <div className='inline-flex w-[349px] flex-col items-start justify-between self-stretch pb-4'>
          <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
            <div className='flex w-full flex-col items-start justify-start gap-2'>
              {/* Company Info */}
              <div className='flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
                  Your Company
                </div>
                <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-md'>
                  <div className='flex h-10 w-10 items-center justify-center gap-[6.67px] rounded-[6.67px] bg-gradient-to-br from-[#D588FC] to-[#007BFF] outline outline-[1.11px] outline-[#F3F4F6]'>
                    <div className='h-[12.13px] w-[17.60px] bg-white' />
                    <div className='h-[12.13px] w-[17.60px] bg-white' />
                  </div>
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
                    <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                      <div className='self-stretch break-words font-inter text-sm font-medium text-[#101828]'>
                        {companyName}
                      </div>
                      <div className='self-stretch break-words font-inter text-xs font-normal leading-[14.40px] text-[#1447E6]'>
                        {websiteUrl}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className='flex flex-col items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
                  Your Profile
                </div>
                <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-md'>
                  <div className='flex items-center justify-start gap-2'>
                    <div className='h-10 w-10 rounded-md bg-gray-200 outline outline-[1.11px] outline-[#F3F4F6]' />
                  </div>
                  <div className='inline-flex flex-1 flex-col items-start justify-start gap-2'>
                    <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                      <div className='self-stretch break-words font-inter text-sm font-medium text-[#101828]'>
                        {firstName} {lastName}
                      </div>
                      <div className='self-stretch break-words font-inter text-xs font-normal leading-[14.40px] text-[#1447E6]'>
                        {email}
                      </div>
                    </div>

                    <div className='inline-flex items-center justify-start gap-2 self-stretch'>
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        {currentRole}
                      </div>
                      <div className='h-0.5 w-0.5 rounded-full bg-[#99A1AF]' />
                      <div className='flex items-center justify-start gap-[6px]'>
                        <div className='relative h-3 w-3'>
                          <svg
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <circle
                              cx='8.94995'
                              cy='2.28998'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='3.03003'
                              cy='2.28998'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='9.72998'
                              cy='6.00995'
                              r='1.25995'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='2.25995'
                              cy='6.00995'
                              r='1.25995'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <circle
                              cx='5.94995'
                              cy='6.01996'
                              r='1.28998'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                            <ellipse
                              cx='6.00495'
                              cy='9.74502'
                              rx='1.98499'
                              ry='1.25494'
                              stroke='#637381'
                              strokeWidth='0.75'
                            />
                          </svg>
                        </div>
                        <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                          {teamSize}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add phone number CTA */}
            <div className='mt-2 inline-flex w-full flex-col items-start justify-start gap-4 rounded-[20px] bg-[#EEF6FF] p-2'>
              <div className='inline-flex items-start justify-start gap-4 self-stretch rounded-xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                <div className='relative mt-0.5 flex h-5 w-4 items-center justify-center'>
                  <img
                    src='/onBoarding-v2.1/phone.svg'
                    alt='Phone'
                    className='h-full w-full object-contain'
                  />
                </div>
                <div className='inline-flex flex-1 flex-col items-start justify-start gap-3 opacity-80'>
                  <div className='flex flex-col items-start justify-start gap-1'>
                    <div className='self-stretch break-words font-inter text-sm font-medium text-[#4A5565]'>
                      Add phone number
                    </div>
                    <div className='inline-flex items-center justify-start gap-1 self-stretch'>
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        Takes 10 secs
                      </div>
                      <div className='h-[2px] w-[2px] rounded-full bg-[#99A1AF]' />
                      <div className='break-words font-inter text-xs font-normal leading-[14.40px] text-[#6A7282]'>
                        Optional
                      </div>
                    </div>
                  </div>
                  <div className='inline-flex cursor-pointer items-start justify-start'>
                    <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                      <div className='relative h-4 w-4'>
                        <div
                          className='absolute left-[2px] top-[2px] h-3 w-3 bg-[#6863FB]'
                          style={{
                            maskImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M6 1V11M1 6H11' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            WebkitMaskImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M6 1V11M1 6H11' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center'
                          }}
                        />
                      </div>
                      <div className='break-words font-inter text-sm font-semibold leading-tight text-[#6863FB]'>
                        Add now
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-start rounded-full bg-gradient-to-r from-[#F5ECFF] to-[#EDF9FF] px-1.5 py-0.5'>
                  <div className='break-words font-inter text-[10px] font-medium leading-[15px] text-[#F49C46]'>
                    +2 AI Credits
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You Unlock */}
          <div className='mt-6 flex flex-col items-start justify-start gap-4 self-stretch'>
            <div className='self-stretch break-words font-inter text-xs font-medium uppercase text-[#6A7282]'>
              WHAT YOU UNLOCK
            </div>
            <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
              <div className='inline-flex items-center justify-start gap-3 self-stretch'>
                <div className='flex h-4 w-4 items-center justify-center'>
                  <img
                    src='/onBoarding-v2.1/dweep.svg'
                    alt='Dweep AI'
                    className='h-full w-full'
                  />
                </div>
                <div
                  className='flex-1 break-words font-inter text-sm font-normal'
                  style={{
                    backgroundImage:
                      'linear-gradient(122.24deg, #D588FC 16.63%, #007BFF 44.4%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  8 Dweep AI credits
                </div>
              </div>
              <div className='inline-flex items-center justify-start gap-3 self-stretch'>
                <div className='relative flex h-4 w-4 items-center justify-center overflow-hidden'>
                  <img
                    src='/onBoarding-v2.1/access.svg'
                    alt='Access'
                    className='h-full w-full'
                  />
                </div>
                <div className='flex-1 break-words font-inter text-sm font-normal text-[#6A7282]'>
                  Access to 20+ integrations
                </div>
              </div>
              <div className='inline-flex items-start justify-start gap-3 self-stretch'>
                <div className='relative flex h-4 w-4 items-center justify-center'>
                  <img
                    src='/onBoarding-v2.1/partnerportfolio.svg'
                    alt='Partner Portfolio'
                    className='h-full w-full'
                  />
                </div>
                <div className='flex-1 break-words font-inter text-sm font-normal text-[#6A7282]'>
                  Effortlessly import your current <br />
                  partner portfolio
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='relative z-10 inline-flex flex-1 flex-col items-start justify-between self-stretch rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
          {/* Header */}
          <div className='flex flex-col items-start justify-start gap-6 self-stretch'>
            <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
              <div className='break-words text-left font-inter text-xs font-medium uppercase text-[#99A1AF]'>
                Almost there
              </div>
              <div className='break-words text-left font-inter text-sm font-normal text-[#4A5565]'>
                Just a few quick questions to tailor Sharkdom to how you work.
              </div>
            </div>

            <div className='inline-flex items-center justify-center gap-3 self-stretch'>
              {/* Step 1 */}
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#007A55]'>
                  <svg
                    width='8'
                    height='6'
                    viewBox='0 0 8 6'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 3L3 5L7 1'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col justify-center whitespace-nowrap break-words font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 1
                </div>
              </div>
              <div className='h-0 w-3 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>

              {/* Step 2 */}
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#007A55]'>
                  <svg
                    width='8'
                    height='6'
                    viewBox='0 0 8 6'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 3L3 5L7 1'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col justify-center whitespace-nowrap break-words font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 2
                </div>
              </div>
              <div className='h-0 w-3 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>

              {/* Step 3 */}
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#007A55]'>
                  <svg
                    width='8'
                    height='6'
                    viewBox='0 0 8 6'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 3L3 5L7 1'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col justify-center whitespace-nowrap break-words font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 3
                </div>
              </div>
              <div className='h-0 w-3 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>

              {/* Step 4 */}
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <div className='flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#007A55]'>
                  <svg
                    width='8'
                    height='6'
                    viewBox='0 0 8 6'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1 3L3 5L7 1'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
                <div className='flex flex-col justify-center whitespace-nowrap break-words font-inter text-xs font-normal leading-tight text-[#6A7282]'>
                  Step 4
                </div>
              </div>
              <div className='h-0 w-3 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>

              {/* Step 5 */}
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
                <img
                  src='/onBoarding-v2.1/stepicon.svg'
                  alt='Step Icon'
                  className='h-4 w-4'
                />
                <div className='whitespace-nowrap break-words font-inter text-xs font-semibold leading-tight text-[#6863FB]'>
                  Step 5
                </div>
              </div>
            </div>

            <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
              <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                <div className='self-stretch break-words text-center font-inter text-lg font-semibold text-[#101828]'>
                  Who else is working on partnerships?
                </div>
              </div>
              <div className='self-stretch break-words text-center font-inter text-sm font-normal leading-[18.20px] text-[#6A7282]'>
                Add teammates so they can access pipeline data, partner records,
                and co-sell activity from day one. You can always add more
                later.
              </div>
            </div>

            <div className='flex flex-col items-start justify-start gap-6 self-stretch'>
              <div className='inline-flex items-end justify-end gap-3 self-stretch'>
                <div className='inline-flex flex-1 flex-col items-start justify-start'>
                  <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                    <div className='self-stretch break-words font-inter text-sm font-medium leading-tight text-[#666666]'>
                      Member email
                    </div>
                    <div className='inline-flex items-center justify-start gap-3 self-stretch overflow-hidden rounded-lg bg-white px-4 py-2 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                      <input
                        type='email'
                        placeholder='johndoe@email.com'
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className='flex-1 break-words bg-transparent font-inter text-base font-normal leading-normal text-[#1A1A1A] outline-none'
                      />
                    </div>
                  </div>
                </div>
                <div className='inline-flex w-[160px] flex-col items-start justify-start'>
                  <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
                    <div className='self-stretch break-words font-inter text-sm font-medium leading-tight text-[#666666]'>
                      Role
                    </div>
                    <div className='inline-flex cursor-pointer items-center justify-between self-stretch overflow-hidden rounded-lg bg-white px-4 py-2.5 outline outline-1 outline-offset-[-1px] outline-[#F3F4F6]'>
                      <div className='whitespace-nowrap break-words font-inter text-base font-normal leading-normal text-[#666666]'>
                        View only
                      </div>
                      <div className='flex items-center justify-start gap-1'>
                        <div className='relative flex h-4 w-4 items-center justify-center'>
                          <svg
                            width='12'
                            height='8'
                            viewBox='0 0 12 8'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M1 1.5L6 6.5L11 1.5'
                              stroke='#333333'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex cursor-pointer items-start justify-start ${isInviting ? 'pointer-events-none opacity-50' : ''}`}
                  onClick={handleInvite}
                >
                  <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#E9E8FF] px-4 py-2.5 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-offset-[-1px] outline-[#E9E8FF]'>
                    <div className='break-words font-inter text-sm font-semibold leading-tight text-[#6863FB]'>
                      {isInviting ? 'Inviting...' : 'Invite'}
                    </div>
                  </div>
                </div>
              </div>

              <div className='self-stretch break-words font-inter text-sm font-semibold text-[#181D27]'>
                Invited members
              </div>

              <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
                {invitedMembers.map((member, i) => (
                  <React.Fragment key={member.id}>
                    <div className='inline-flex items-center justify-start gap-4 self-stretch rounded-md'>
                      <div className='flex flex-1 items-center justify-start gap-3'>
                        <div className='flex h-6 w-6 items-center justify-center gap-1 rounded bg-[#EEF6FF]'>
                          <div className='flex flex-col justify-center break-words font-inter text-[10px] font-medium text-[#6863FB]'>
                            {member.initials}
                          </div>
                        </div>
                        <div className='flex flex-col justify-center break-words font-inter text-sm font-medium text-[#4A5565]'>
                          {member.name}
                        </div>
                      </div>
                      <div className='flex-1 break-words font-inter text-sm font-medium leading-[16.80px] text-[#4A5565]'>
                        {member.role}
                      </div>
                      <div className='group relative flex h-4 w-4 cursor-pointer items-center justify-center'>
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='group-hover:opacity-80'
                        >
                          <path
                            d='M2 4H14M5.33333 4V2.66667C5.33333 2.29848 5.63181 2 6 2H10C10.3682 2 10.6667 2.29848 10.6667 2.66667V4M6.66667 7.33333V11.3333M9.33333 7.33333V11.3333M3.33333 4H12.6667V13.3333C12.6667 13.7015 12.3682 14 12 14H4C3.63181 14 3.33333 13.7015 3.33333 13.3333V4Z'
                            stroke='#C70036'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </div>
                    </div>
                    {i < invitedMembers.length - 1 && (
                      <div className='h-0 self-stretch outline outline-[0.50px] outline-offset-[-0.25px] outline-[#F3F4F6]'></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-8 inline-flex items-center justify-between self-stretch'>
            <button onClick={onPrev} className='flex items-start justify-start'>
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-white px-4 py-2 outline outline-1 outline-offset-[-1px] outline-[#CCCCCC]'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M10 12L6 8L10 4'
                    stroke='#212B36'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <div className='break-words font-inter text-sm font-semibold leading-tight text-[#1A1A1A]'>
                  Previous
                </div>
              </div>
            </button>
            <button
              onClick={onNext}
              className='flex items-start justify-start disabled:cursor-not-allowed'
            >
              <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#6863FB] px-4 py-2 shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)] outline outline-1 outline-offset-[-1px] outline-[#6863FB] transition-all hover:bg-[#5651D9]'>
                <div className='break-words font-inter text-sm font-semibold leading-tight text-white'>
                  Next
                </div>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M6 12L10 8L6 4'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
