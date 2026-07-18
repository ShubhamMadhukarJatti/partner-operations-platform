'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import { JointPitchCard } from './_components/JointPitchCard'

export function CosellWorkspaceClient() {
  const params = useParams()
  const searchParams = useSearchParams()

  const partnerOrgId =
    typeof params.partnerOrgId === 'string'
      ? params.partnerOrgId
      : Array.isArray(params.partnerOrgId)
        ? (params.partnerOrgId[0] ?? '')
        : ''

  const accountId = searchParams.get('account') ?? ''
  const accountName = searchParams.get('accountName') ?? ''
  const type = searchParams.get('type') ?? ''

  const reportHref =
    partnerOrgId && type
      ? `/partner-mapping/report?${new URLSearchParams({ partner: partnerOrgId, type }).toString()}`
      : partnerOrgId
        ? `/partner-mapping/report?partner=${encodeURIComponent(partnerOrgId)}`
        : '/partner-mapping'

  const contextOk = Boolean(partnerOrgId && accountId)

  const accountTitle =
    accountName.trim() || (accountId ? `Account ${accountId}` : '')

  return (
    <GradientPageBackground className='min-h-[calc(100vh-4rem)]'>
      <div className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mb-4 text-sm text-[#4D5C78]'>
          <Link
            href={reportHref}
            className='font-medium text-[#5B76FF] hover:underline'
          >
            ← Compare report
          </Link>
        </div>

        {!contextOk && (
          <div className='mb-4 rounded-lg border border-[#CA8A04] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]'>
            Add <strong>?account=</strong> (shared account id) to the URL to
            load this workspace in full context.
          </div>
        )}

        <h1 className='mb-6 text-[22px] font-bold leading-8 text-[#303141]'>
          Co-sell workspace
          {accountTitle ? (
            <span className='ml-2 text-base font-normal text-[#64748B]'>
              · {accountTitle}
            </span>
          ) : null}
        </h1>

        {partnerOrgId ? (
          <div className='max-w-3xl'>
            <JointPitchCard partnerOrgId={partnerOrgId} />
          </div>
        ) : (
          <p className='text-sm text-[#64748B]'>
            Missing partner in the URL. Open this page from the compare report
            flow.
          </p>
        )}
      </div>
    </GradientPageBackground>
  )
}
