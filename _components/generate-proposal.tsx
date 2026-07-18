'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import type {
  Credits,
  OrganizationType,
  SearchOrganizationResponse
} from '@/types'
import { useCompletion } from 'ai/react'
import { BadgeCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { showCustomToast } from '@/components/custom-toast'
import { ImageFallback } from '@/components/shared/image-with-fallback'

import { canSendProposals } from './utils/ProposalChecks'

type Props = {
  recieverOrg: SearchOrganizationResponse
  userId: string
  token: string
  senderOrg: OrganizationType
  options: { option: string; category: string }[]
  status: string | null
  credits: Credits
  partnershipType: string
}

export const GenerateProposal = ({
  recieverOrg,
  userId,
  token,
  senderOrg,
  options,
  status,
  credits,
  partnershipType
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { complete, isLoading } = useCompletion({
    api: `/api/generate-proposal?type=${partnershipType}`
  })

  const prompt = `${senderOrg.name} ${senderOrg.briefDescription} of tech sector and ${recieverOrg.name} ${recieverOrg.briefDescription} of fintech sector are looking to collaborate. replace startupA with ${senderOrg.name} and startupB with ${recieverOrg.name} in the following proposal.`

  const [result, setResult] = useState<{
    offers: { title: string; description: string }[]
    expectations: { title: string; description: string }[]
  } | null>(null)

  const [textIndex, setTextIndex] = useState(0)
  const texts = [
    ``,
    'Analysing both startup profiles',
    'Crafting a win-win proposal',
    'Almost done'
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, 2400)

    return () => clearInterval(intervalId)
  }, [])

  const generate = useCallback(async () => {
    // const credits = await getCredits()
    const completion = await complete(prompt)

    if (!completion) throw new Error('Failed to generate proposal')
    const res = JSON.parse(completion)

    console.log(res, `this is the ai api response `)

    setResult(res)

    const response = await fetch(`/api/credits`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        organizationId: senderOrg.id,
        playgroundCredits: 0,
        aiProposalCredits: 1
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update credits')
    }
  }, [complete, prompt])

  const handleSendProposal = async () => {
    setIsSubmitting(true)
    try {
      if (
        canSendProposals(
          senderOrg?.planCode || 'FREE',
          credits?.collaborationSent || 0
        )
      ) {
        if (!result) throw new Error('Proposal not generated')
        const senderBenefits = result.expectations.map((offer) => ({
          benefit: offer.title,
          description: offer.description
        }))
        const receiverBenefits = result.offers.map((expectation) => ({
          benefit: expectation.title,
          description: expectation.description
        }))

        const response = await fetch('/api/organizationCollaboration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            senderOrganizationId: senderOrg.id,
            receiverOrganizationId: recieverOrg.id,
            senderUserId: userId,
            status: 'PENDING',
            chatAccessAllowed: true,
            contactPersonUserId: userId,
            partnershipMouVersions: [
              {
                senderOrgcontactPerson: userId,
                status: 'PENDING_SIGN',
                senderBenefits: [...senderBenefits],
                receiverBenefits: [...receiverBenefits]
              }
            ]
          })
        })

        if (!response?.ok) {
          showCustomToast('Success', 'something went wrong', 'success', 5000)
          return
        }

        setIsOpen(false)
      } else {
        showCustomToast('Warning', 'Insufficient AI credits.', 'error', 5000)
      }
    } catch (error: any) {
      console.error(error.message)
      showCustomToast('Error', 'Something went wrong', 'error', 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* credits && credits.aiProposalCredits > 0  */}
      {true ? (
        <>
          {status === null ? (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger className='w-full' onClick={generate}>
                <Button className='w-full'>Create</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='flex h-full max-h-[90vh] w-full max-w-[97vw] gap-2 overflow-hidden border-none bg-transparent p-0 shadow-none lg:max-w-screen-lg xl:max-w-screen-xl'>
                {isLoading ? (
                  <div className='flex h-full w-full flex-1 flex-col items-center justify-center gap-20 rounded-xl border bg-card'>
                    <div className='flex flex-col items-center justify-center gap-1'>
                      <LoadingIcon className='size-16 border-[6px] border-t-muted text-primary' />

                      {textIndex === 0 ? (
                        <>
                          <h2 className='flex gap-0.5 text-xl font-medium text-primary'>
                            <Image
                              src='/icons/stars.svg'
                              width={16}
                              height={16}
                              alt=''
                              unoptimized
                            />
                            Your virtual partnership ally is thinking
                          </h2>
                          <p className='text-sm text-muted-foreground'>
                            Tip: To create best AI proposals, complete your
                            startup profile
                          </p>
                        </>
                      ) : (
                        <h3 className='mt-4 text-xl font-medium text-primary'>
                          {texts[textIndex]}
                        </h3>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='flex h-full w-full flex-1 rounded-xl border bg-card'>
                    <div className='flex h-full w-full flex-col justify-between px-6 pb-3 pt-6'>
                      <div className='flex flex-col items-center justify-center'>
                        <h2 className='text-base font-medium text-muted-foreground'>
                          In House Proposal
                        </h2>
                        <h3 className='text-2xl font-light capitalize'>
                          {senderOrg.name} x {recieverOrg.name}
                        </h3>
                        <Separator className='my-2' />
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex flex-col gap-2'>
                            <span className='text-sm text-primary'>
                              Offer from
                            </span>
                            <span className='inline-flex items-center gap-2 text-xl font-medium capitalize'>
                              <ImageFallback
                                src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${senderOrg.id}`}
                                alt=''
                                width={50}
                                height={50}
                                className='h-10 w-10 rounded-full p-0'
                              />
                              {senderOrg.name}
                            </span>
                            <div className='hidden flex-col sm:flex'>
                              {result &&
                                result.offers.map((offer) => (
                                  <span
                                    className='text-ellipsis text-muted-foreground'
                                    key={offer.title}
                                  >
                                    {offer.title}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className='flex flex-col gap-2 text-right'>
                            <span className='text-sm text-primary'>
                              Expectations from
                            </span>
                            <span className='inline-flex items-center gap-2 text-xl font-medium capitalize'>
                              <ImageFallback
                                src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${recieverOrg.id}`}
                                alt=''
                                width={50}
                                height={50}
                                className='h-10 w-10 rounded-full p-0'
                              />
                              {recieverOrg.name}
                            </span>
                            <div className='hidden flex-col sm:flex'>
                              {result &&
                                result.expectations.map((expectation) => (
                                  <span
                                    className='text-ellipsis text-muted-foreground'
                                    key={expectation.title}
                                  >
                                    {expectation.title}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className='my-2' />
                      <ScrollArea className='h-full p-1'>
                        <div className='mt-3'>
                          <h3 className='mb-2 font-medium'>
                            Epectations from {recieverOrg.name}
                          </h3>
                          {result &&
                            result.expectations.map((expectation, index) => (
                              <div
                                className='flex gap-2'
                                key={expectation.title}
                              >
                                <span className='font-mono'>{index + 1}.</span>
                                <div className='flex flex-col gap-1'>
                                  <h4 className=''>{expectation.title}</h4>
                                  <p className='text-muted-foreground'>
                                    {expectation.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className='mt-2'>
                          <h3 className='mb-2 font-medium'>
                            Offers from {senderOrg.name}
                          </h3>
                          {result &&
                            result.offers.map((offer, index) => (
                              <div className='flex gap-2' key={offer.title}>
                                <span>{index + 1}.</span>
                                <div className='flex flex-col gap-1'>
                                  <h4 className=''>{offer.title}</h4>
                                  <p className='text-muted-foreground'>
                                    {offer.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                      <AlertDialogFooter className='border-t pt-4'>
                        <AlertDialogCancel onClick={() => setIsOpen(false)}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          loadingText='Sending Proposal'
                          loading={isSubmitting}
                          onClick={handleSendProposal}
                        >
                          Send Proposal
                        </Button>
                      </AlertDialogFooter>
                    </div>
                  </div>
                )}

                <div className='hidden w-full max-w-xs flex-col overflow-hidden rounded-xl border bg-card md:flex'>
                  <div className='flex flex-col gap-2 bg-accent p-4'>
                    <div className='flex items-center gap-2'>
                      <ImageFallback
                        src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${recieverOrg.id}`}
                        alt=''
                        width={50}
                        height={50}
                        className='h-10 w-10 rounded-full border bg-white object-cover p-0'
                      />
                      <span className='inline-flex items-center gap-1 text-lg capitalize'>
                        {recieverOrg?.name}{' '}
                        <BadgeCheck
                          className={cn('hidden', {
                            'block fill-primary text-primary-foreground':
                              recieverOrg?.verified
                          })}
                          size={20}
                        />
                      </span>
                    </div>
                    <p className='text-muted-foreground first-letter:capitalize'>
                      {recieverOrg?.briefDescription}
                    </p>
                    <Separator />
                    <div className='text-muted-foreground'>
                      <h3>Open to partner for</h3>
                      <p className=' first-letter:uppercase'>
                        {(Array.isArray(
                          recieverOrg?.preferredPartnershipTypes
                        ) &&
                          recieverOrg?.preferredPartnershipTypes?.length > 0 &&
                          recieverOrg?.preferredPartnershipTypes
                            .map((type) => type?.area)
                            .join(', ')) ||
                          'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2 p-4'>
                    <div className='space-y-1'>
                      <h3>About Startup</h3>
                      <p className='text-muted-foreground first-letter:uppercase'>
                        {recieverOrg?.about || 'N/A'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <h3>Target Segment</h3>
                      <p className='text-muted-foreground first-letter:uppercase'>
                        {recieverOrg?.targetMarket || 'N/A'}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <h3>Addressing Problem</h3>
                      <p className='text-muted-foreground first-letter:uppercase'>
                        {(Array.isArray(recieverOrg?.services) &&
                          recieverOrg?.services?.length > 0 &&
                          recieverOrg?.services
                            .map((service) => service?.service)
                            .join(', ')) ||
                          'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </>
      ) : (
        <button
          className='flex size-9 items-center justify-center rounded-full bg-primary text-white'
          onClick={() =>
            showCustomToast(
              'Warning',
              'Insufficient AI credits.',
              'error',
              5000
            )
          }
        >
          <Image src='/icons/magic-pen.svg' width={16} height={16} alt='' />
          <div className='sr-only'>generate proposal</div>
        </button>
      )}
    </>
  )
}
