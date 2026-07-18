'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { SelectPartnershipType } from '@/app/(app)/(dashboard-pages)/_components/select-partnership-type'
import { canSendProposals } from '@/app/(app)/(dashboard-pages)/_components/utils/ProposalChecks'

const Proposal = ({
  currentOrganization,
  organization,
  user,
  token,
  collaboration,
  options,
  credits
}: any) => {
  const [showBanner, setShowBanner] = useState(false)
  const router = useRouter()

  return (
    <>
      <SelectPartnershipType
        credits={currentOrganization?.credits}
        recieverOrg={organization}
        userId={user.uid}
        token={token}
        senderOrg={currentOrganization}
        options={options}
        status={collaboration ? collaboration.status : null}
      />

      <Suspense
        fallback={
          <Button disabled loading size={'sm'} className=''>
            Loading
          </Button>
        }
      >
        {currentOrganization.briefDescription === null ||
        currentOrganization.about === null ||
        currentOrganization.services.length === 0 ? (
          <>
            {showBanner && (
              <div className='fixed left-1/2 top-4 z-50 -translate-x-1/2 transform'>
                <div className='z-[99] flex w-[506px] items-center justify-between rounded-lg border bg-card p-4'>
                  <div className=''>
                    <h2 className='text-base'>Your profile is offline...</h2>
                    <p className='text-sm text-muted-foreground'>
                      Update your profile to make it online & send proposals.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/profile')}
                    className='button-style cursor-pointer rounded-[81px] border-2 border-solid border-[#0062F1] px-4 py-2 text-sm text-primary'
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            <Button
              className='rounded-md border border-white bg-primary px-7 text-white hover:border hover:border-primary hover:bg-white hover:text-primary'
              onClick={() => {
                if (
                  canSendProposals(
                    currentOrganization?.planCode || 'FREE',
                    credits?.collaborationSent || 0
                  )
                ) {
                  setShowBanner(true)
                } else {
                  showCustomToast(
                    'Warning',
                    'Insufficient AI credits.',
                    'error',
                    5000
                  )
                }
              }}
            >
              Send Proposal
            </Button>
          </>
        ) : (
          <>
            {/* <SendProposal
              recieverOrg={organization}
              senderOrg={currentOrganization}
              userId={user.uid}
              token={token}
              options={options}
              status={collaboration ? collaboration.status : null}
              credits={credits as Credits}
            /> */}
            <Link
              href={
                organization?.id ? `/proposal/${organization.id}/send` : '#'
              }
            >
              <Button className='rounded-md border border-white bg-primary px-7 text-white hover:border hover:border-primary hover:bg-white hover:text-primary'>
                Send Proposal
              </Button>
            </Link>
          </>
        )}
      </Suspense>
    </>
  )
}

export default Proposal
