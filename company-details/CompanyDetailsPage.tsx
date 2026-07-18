'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { ArrowRight, Lightbulb } from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  CertificationsCard,
  type CertificationsCardRef
} from './CertificationsCard'
import type { CompanyDetailsCardRef } from './CompanyDetailsCard'
import CompanyDetailsCard from './CompanyDetailsCard'
import {
  PartnerProgramCard,
  type PartnerProgramCardRef
} from './PartnerProgramCard'
import { ResourcesCard, type ResourcesCardRef } from './ResourcesCard'

interface CompanyDetailsPageProps {
  className?: string
}

const CompanyDetailsPage: React.FC<CompanyDetailsPageProps> = ({
  className = ''
}) => {
  const companyDetailsRef = useRef<CompanyDetailsCardRef>(null)
  const certificationsRef = useRef<CertificationsCardRef>(null)
  const resourcesRef = useRef<ResourcesCardRef>(null)
  const partnerProgramRef = useRef<PartnerProgramCardRef>(null)

  const searchParams = useSearchParams()
  const tabParam = searchParams?.get('tab')

  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(tabParam || 'basic')

  // Sync if URL changes
  React.useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    } else {
      setActiveTab('basic')
    }
  }, [tabParam])

  const organization = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      if (activeTab === 'basic') {
        await companyDetailsRef.current?.handleSave()
      } else if (activeTab === 'certifications') {
        await certificationsRef.current?.handleSave()
      } else if (activeTab === 'resources') {
        await resourcesRef.current?.handleSave()
      } else if (activeTab === 'partner') {
        await partnerProgramRef.current?.handleSave()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    window.location.reload()
  }

  return (
    <div className={`mx-auto flex w-full max-w-[1200px] flex-col ${className}`}>
      {/* Top Header Section */}
      <div className='mb-6'>
        <Link
          href='/settings/company-details'
          className='mb-4 flex items-center gap-2 text-sm font-medium text-[#6863FB] hover:underline'
        >
          <ArrowRight className='h-4 w-4 rotate-180' /> Back to company details
        </Link>
        <div className='flex items-center justify-between'>
          <div className='text-sm font-medium text-[#9CA3AF]'>
            Settings / Company details / Profile preview /{' '}
            <span className='text-[#1F2937]'>Edit profile</span>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#1F2937] shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className='rounded-lg bg-[#6863FB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5b56e5] focus:outline-none disabled:opacity-50'
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className='relative z-10 flex gap-8'>
        {/* Left Inner Sidebar */}
        <div className='w-[240px] flex-shrink-0'>
          <div className='flex flex-col gap-1 rounded-[20px] border border-[#F3F4F6] bg-white/50 p-2 shadow-sm'>
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${activeTab === 'basic' ? 'bg-[#F3E8FF] font-semibold text-[#1F2937]' : 'font-medium text-[#6B7280] hover:bg-white/60'}`}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={
                  activeTab === 'basic' ? 'text-[#6863FB]' : 'text-[#6B7280]'
                }
              >
                <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                <line x1='16' y1='2' x2='16' y2='6'></line>
                <line x1='8' y1='2' x2='8' y2='6'></line>
                <line x1='3' y1='10' x2='21' y2='10'></line>
              </svg>
              Basic information
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${activeTab === 'certifications' ? 'bg-[#F3E8FF] font-semibold text-[#1F2937]' : 'font-medium text-[#6B7280] hover:bg-white/60'}`}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={
                  activeTab === 'certifications'
                    ? 'text-[#6863FB]'
                    : 'text-[#6B7280]'
                }
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${activeTab === 'resources' ? 'bg-[#F3E8FF] font-semibold text-[#1F2937]' : 'font-medium text-[#6B7280] hover:bg-white/60'}`}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={
                  activeTab === 'resources'
                    ? 'text-[#6863FB]'
                    : 'text-[#6B7280]'
                }
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
                <polyline points='14 2 14 8 20 8'></polyline>
                <line x1='16' y1='13' x2='8' y2='13'></line>
                <line x1='16' y1='17' x2='8' y2='17'></line>
                <polyline points='10 9 9 9 8 9'></polyline>
              </svg>
              Resources
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${activeTab === 'partner' ? 'bg-[#F3E8FF] font-semibold text-[#1F2937]' : 'font-medium text-[#6B7280] hover:bg-white/60'}`}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={
                  activeTab === 'partner' ? 'text-[#6863FB]' : 'text-[#6B7280]'
                }
              >
                <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                <circle cx='9' cy='7' r='4'></circle>
                <path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>
                <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
              </svg>
              Partner Program
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className='min-w-0 flex-1'>
          {activeTab === 'basic' && (
            <CompanyDetailsCard ref={companyDetailsRef} className='w-full' />
          )}

          {activeTab === 'certifications' && (
            <CertificationsCard
              ref={certificationsRef}
              setSaving={setIsSaving}
              className='w-full'
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesCard
              ref={resourcesRef}
              setSaving={setIsSaving}
              className='w-full'
            />
          )}

          {activeTab === 'partner' && (
            <PartnerProgramCard
              ref={partnerProgramRef}
              setSaving={setIsSaving}
              className='w-full'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailsPage
