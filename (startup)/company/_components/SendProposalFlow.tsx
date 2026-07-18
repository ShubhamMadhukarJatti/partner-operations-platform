'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { Trash } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { ImageFallback } from '@/components/shared/image-with-fallback'
import { canSendProposals } from '@/app/(app)/(dashboard-pages)/_components/utils/ProposalChecks'

import SendProposalOrgInfo from './send-proposal-org-info'

type Benefit = {
  benefit: string
  description: string
  hint?: string
}

type Props = {
  receiverOrg: OrganizationType
  userId: string
  token: string

  options: { option: string; hint: string; category: string }[]
}

const SendProposalFlow: React.FC<Props> = ({
  receiverOrg,
  userId,
  token,

  options
}) => {
  const senderOrg = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [offers, setOffers] = useState<Benefit[]>([])
  const [expectations, setExpectations] = useState<Benefit[]>([])
  const [screen, setScreen] = useState<
    'expectations' | 'offers' | 'summary' | 'sent' | 'first-proposal'
  >('expectations')
  const [isFirstProposal, setIsFirstProposal] = useState(false)

  const router = useRouter()

  const groupedOptions = options?.reduce((acc: any, option) => {
    const { category, ...rest } = option
    acc[category] = acc[category] || []
    acc[category].push(rest)
    return acc
  }, {})

  const handleSelectBenefit = useCallback(
    (value: string, isSenderBenefit: boolean) => {
      const hint = options.find((elem) => elem.option === value)?.hint || ''
      const newBenefit = { benefit: value, description: '', hint }

      if (isSenderBenefit) {
        setOffers((prev) => [...prev, newBenefit])
      } else {
        setExpectations((prev) => [...prev, newBenefit])
      }
      setSelectedOption('')
    },
    [options]
  )

  const handleUpdateBenefit = useCallback(
    (index: number, description: string, isSenderBenefit: boolean) => {
      const updateFunction = (prev: Benefit[]) =>
        prev.map((item, i) => (i === index ? { ...item, description } : item))

      if (isSenderBenefit) {
        setOffers(updateFunction)
      } else {
        setExpectations(updateFunction)
      }
    },
    []
  )

  const handleRemoveBenefit = useCallback(
    (index: number, isSenderBenefit: boolean) => {
      const removeFunction = (prev: Benefit[]) =>
        prev.filter((_, i) => i !== index)

      if (isSenderBenefit) {
        setOffers(removeFunction)
      } else {
        setExpectations(removeFunction)
      }
    },
    []
  )

  const handleSendProposal = async () => {
    if (
      !canSendProposals(
        senderOrg?.planCode || 'FREE',
        // fix this TODO send the coorect variable and update the credits types
        senderOrg?.credits?.aiProposalLeft || 0
      )
    ) {
      showCustomToast('Warning', 'Insufficient AI credits.', 'error', 5000)
      return
    }

    setIsLoading(true)
    try {
      const senderBenefits = offers.map(({ benefit, description }) => ({
        benefit,
        description
      }))
      const receiverBenefits = expectations.map(({ benefit, description }) => ({
        benefit,
        description
      }))

      console.log(
        senderBenefits,
        receiverBenefits,
        senderOrg.id,
        receiverOrg.id,
        userId,
        'benefits'
      )

      const response = await fetch('/api/organizationCollaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senderOrganizationId: senderOrg.id,
          receiverOrganizationId: receiverOrg.id,
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

      const data = await response.json()
      console.log(data, 'data')

      setIsFirstProposal(senderOrg.organizationCollaborations === null)
      setScreen('sent')
    } catch (error) {
      console.error(error)
      showCustomToast(
        'Error',
        'Failed to send proposal. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (isFirstProposal) {
      setScreen('first-proposal')
    } else {
      router.push('/dashboard')
    }
  }

  const renderBenefitInputs = (
    benefits: Benefit[],
    isSenderBenefit: boolean
  ) => (
    <div className='space-y-4'>
      {benefits.map((benefit, index) => (
        <div key={index} className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor={`${benefit.benefit}-${index}`}>
              {benefit.benefit}
            </Label>
            <Button
              size='xs'
              onClick={() => handleRemoveBenefit(index, isSenderBenefit)}
              variant='secondary'
            >
              <Trash size={14} />
            </Button>
          </div>
          <Textarea
            id={`${benefit.benefit}-${index}`}
            placeholder={benefit.hint}
            value={benefit.description}
            onChange={(e) =>
              handleUpdateBenefit(index, e.target.value, isSenderBenefit)
            }
            className='h-20 border border-border'
          />
        </div>
      ))}
    </div>
  )

  const renderScreen = () => {
    switch (screen) {
      case 'sent':
        return (
          <div className='flex  flex-col items-center  rounded-md border border-[#ccc] p-5'>
            <Image
              alt='shoutout-request-sent'
              src={'/assets/Mail.svg'}
              height={161}
              width={250}
            ></Image>
            <h1 className='mt-8 text-center text-2xl font-semibold text-[#101828]'>
              Proposal sent!
            </h1>
            <p className='max-w-sm py-2 text-center text-base leading-5 text-[#475467]'>
              Proposal sent to {receiverOrg.name} successfully.{' '}
              {receiverOrg.name} typically responds within 18 hours. You will be
              notified via email once they respond.
            </p>

            <div className='mt-9 w-fit  '>
              <Button
                className='h-[3rem] w-full text-lg font-semibold'
                onClick={handleNext}
              >
                {isFirstProposal ? 'Next' : ' Back to dashboard'}
              </Button>
            </div>
          </div>
        )

      case 'first-proposal':
        return (
          <div className='flex  flex-col items-center  rounded-md border border-[#ccc] p-5'>
            <Image
              alt='shoutout-request-sent'
              src={'/assets/congrats.svg'}
              height={211}
              width={171}
            ></Image>
            <h1 className='mt-8 text-center text-2xl font-semibold text-[#101828]'>
              Congratulations!
            </h1>
            <p className='max-w-sm py-2 text-center text-base leading-5 text-[#475467]'>
              Congratulations on submitting your first proposal!
            </p>

            <div className='mt-9 w-fit  '>
              <Button
                className='h-[3.25rem] w-full text-base font-semibold'
                onClick={() => router.push('/dashboard')}
              >
                Back to dashboard
              </Button>
            </div>
          </div>
        )
      case 'expectations':
        return (
          <div className='flex h-full w-full flex-col justify-between p-4'>
            <div className='my-2 flex flex-col items-center justify-center'>
              <h2 className='text-base font-medium text-muted-foreground'>
                In House Proposal
              </h2>
              <h3 className='text-2xl font-normal capitalize'>
                {senderOrg?.name} X {receiverOrg?.name}
              </h3>
              <Separator className='my-2' />
              <h2 className='text-medium mt-4 text-primary'>
                Expectations from
              </h2>
              <div className='mt-1 flex items-center gap-2'>
                <Image
                  src={receiverOrg?.logoUrl}
                  alt=''
                  width={100}
                  height={100}
                  className='h-10 w-10 rounded-full p-0'
                />

                <h3 className='text-3xl font-medium'>{receiverOrg?.name}</h3>
              </div>
            </div>
            <ScrollArea className='h-full p-1'>
              <div className='space-y-2 p-2'>
                <Label htmlFor='select-expectations' className=''>
                  Select Partnership types
                </Label>
                <Select
                  value={selectedOption}
                  onValueChange={(e) => handleSelectBenefit(e, false)}
                >
                  <SelectTrigger
                    name='select-expectations'
                    id='select-expectations'
                    className='rounded-md first-letter:uppercase'
                  >
                    <SelectValue placeholder='Select Partnership Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className='h-60'>
                      {Object.keys(groupedOptions)?.length &&
                        Object.entries(groupedOptions).map(
                          ([category, options]) => (
                            <SelectGroup key={category}>
                              <SelectLabel>{category}</SelectLabel>
                              {Array.isArray(options) &&
                                options?.length > 0 &&
                                options?.map(
                                  (option: {
                                    option: string
                                    hint: string
                                    category: string
                                  }) => (
                                    <SelectItem
                                      className='capitalize'
                                      key={option?.option}
                                      value={option?.option}
                                    >
                                      {option.option
                                        .toLowerCase()
                                        .replace(/_/g, ' ')}
                                    </SelectItem>
                                  )
                                )}
                            </SelectGroup>
                          )
                        )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <div className='flex flex-col gap-4 pt-4'>
                  {expectations.map((expectation, index) => (
                    <div className='space-y-2' key={expectation?.benefit}>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={expectation.benefit} className=''>
                          {expectation.benefit}
                        </Label>
                        <Button
                          size='xs'
                          onClick={() => {
                            const newExpectations = [...expectations]
                            newExpectations.splice(index, 1)
                            setExpectations(newExpectations)
                            setSelectedOption('')
                            // setPlaygroundOptions([
                            //   ...playgroundOptions,
                            //   expectation.benefit
                            // ])
                          }}
                          className='flex items-center'
                          variant='secondary'
                        >
                          <Trash size={14} className='' />
                        </Button>
                      </div>
                      <Textarea
                        required
                        id={expectation.benefit}
                        placeholder={expectation.hint}
                        value={expectation.description}
                        onChange={(e) => {
                          const newExpectations = [...expectations]
                          newExpectations[index].description = e.target.value
                          setExpectations(newExpectations)
                        }}
                        className='h-20 border border-border'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
            <div className='flex justify-end border-t pt-4'>
              <Button
                onClick={() => setScreen('offers')}
                disabled={expectations.length === 0}
                className='h-9 rounded-sm px-2'
              >
                Next Step
              </Button>
            </div>
          </div>
        )
      case 'offers':
        return (
          <div className='flex h-full w-full flex-col justify-between p-4'>
            <div className='my-2 flex flex-col items-center justify-center'>
              <h2 className='text-base font-medium text-muted-foreground'>
                In House Proposal
              </h2>
              <h3 className='text-2xl font-normal capitalize'>
                {senderOrg?.name} X {receiverOrg?.name}
              </h3>
              <Separator className='my-2' />
              <h2 className='text-medium mt-4 text-primary'>Offers from</h2>
              <div className='mt-1 flex items-center gap-2'>
                <ImageFallback
                  src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${senderOrg.id}`}
                  alt=''
                  width={100}
                  height={100}
                  className='h-10 w-10 rounded-full p-0'
                />

                <h3 className='text-3xl font-medium'>{senderOrg.name}</h3>
              </div>
            </div>
            <ScrollArea className='h-full p-1'>
              <div className='space-y-2 p-2'>
                <Label htmlFor='select-offers' className=''>
                  Select Partnership types.
                </Label>
                <Select
                  value={selectedOption}
                  onValueChange={(value) => handleSelectBenefit(value, true)}
                >
                  <SelectTrigger
                    name='select-offers'
                    id='select-offers'
                    className='rounded-lg first-letter:uppercase'
                  >
                    <SelectValue placeholder='Select Partnership Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className='h-60'>
                      {/* @ts-ignore */}
                      {Object.entries(groupedOptions).map(
                        ([category, options]) => (
                          <SelectGroup key={category}>
                            <SelectLabel>{category}</SelectLabel>
                            {Array.isArray(options) &&
                              options?.length > 0 &&
                              options?.map((option) => (
                                <SelectItem
                                  className='capitalize'
                                  key={option.option}
                                  value={option.option}
                                >
                                  {option.option
                                    .toLowerCase()
                                    .replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        )
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <div className='flex flex-col gap-4 pt-4'>
                  {offers.map((offer, index) => (
                    <div className='space-y-2' key={offer.benefit}>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor={offer.benefit} className=''>
                          {offer.benefit}
                        </Label>
                        <Button
                          size='xs'
                          onClick={() => {
                            const newOffers = [...offers]
                            newOffers.splice(index, 1)
                            setOffers(newOffers)
                            setSelectedOption('')
                            // setPlaygroundOptions([
                            //   ...playgroundOptions,
                            //   offer.benefit
                            // ])
                          }}
                          className='flex items-center'
                          variant='secondary'
                        >
                          <Trash size={14} className='' />
                        </Button>
                      </div>
                      <Textarea
                        required
                        id={offer.benefit}
                        value={offer.description}
                        onChange={(e) => {
                          const newOffers = [...offers]
                          newOffers[index].description = e.target.value
                          setOffers(newOffers)
                        }}
                        className='h-20 border border-border'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
            <div className='flex flex-row items-center justify-between border-t pt-4'>
              <Button
                className=''
                variant='ghost'
                onClick={() => setScreen('expectations')}
              >
                Back
              </Button>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={() => setScreen('summary')}
                  disabled={offers.length === 0}
                  className='h-9 rounded-sm px-2'
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        )
      case 'summary':
        return (
          <div className='flex h-full w-full flex-col justify-between p-4'>
            <div className='my-2 flex flex-col items-center justify-center'>
              <h2 className='text-base font-medium text-muted-foreground'>
                In House Proposal
              </h2>
              <h3 className='text-2xl font-normal capitalize'>
                {senderOrg?.name} X {receiverOrg?.name}
              </h3>
              <Separator className='my-2' />
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-col gap-2'>
                  <span className='text-sm text-primary'>Offer from</span>
                  <span className='inline-flex items-center gap-2 text-xl font-medium capitalize'>
                    <ImageFallback
                      src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${senderOrg?.id}`}
                      alt=''
                      width={50}
                      height={50}
                      className='h-10 w-10 rounded-full p-0'
                    />
                    {senderOrg?.name}
                  </span>
                </div>
                <div className='flex flex-col gap-2 text-right'>
                  <span className='text-sm text-primary'>
                    Expectations from
                  </span>
                  <span className='inline-flex items-center gap-2 text-xl font-medium capitalize'>
                    <ImageFallback
                      src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${receiverOrg?.id}`}
                      alt=''
                      width={50}
                      height={50}
                      className='h-10 w-10 rounded-full p-0'
                    />
                    {receiverOrg?.name}
                  </span>
                </div>
              </div>
            </div>
            <Separator className='my-2' />
            <ScrollArea className='h-full p-1'>
              <h3 className='font-medium'>Offers from {senderOrg?.name}</h3>
              <div className='my-2 flex flex-col gap-2 indent-4'>
                {Array.isArray(offers) &&
                  offers?.length > 0 &&
                  offers.map((offer, index) => (
                    <div className='space-y-2' key={offer?.benefit}>
                      <div className='flex flex-col gap-2'>
                        <h3 className=''>{`${index + 1}. ${
                          offer?.benefit
                        }`}</h3>
                        <p className='text-muted-foreground'>
                          {offer?.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <Separator className='my-2' />
              <h3 className='font-medium'>
                Expectations from {receiverOrg?.name}
              </h3>

              <div className='my-2 flex flex-col gap-2 indent-4'>
                {Array.isArray(expectations) &&
                  expectations?.length > 0 &&
                  expectations.map((expectation, index) => (
                    <div className='space-y-2' key={expectation?.benefit}>
                      <div className='flex flex-col gap-2'>
                        <h3 className=''>{`${index + 1}. ${
                          expectation?.benefit
                        }`}</h3>
                        <p className='text-muted-foreground'>
                          {expectation?.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <div className='flex flex-row items-center justify-between border-t pt-4'>
              <Button
                className=''
                variant='ghost'
                onClick={() => setScreen('offers')}
              >
                Back
              </Button>
              <div className='flex items-center gap-2'>
                <Button
                  loading={isLoading}
                  loadingText='Sending Proposal'
                  onClick={handleSendProposal}
                  className='h-9 rounded-sm px-2'
                >
                  Send Proposal
                </Button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className='h-full p-6'>
      {['first-proposal', 'sent'].includes(screen) ? (
        <div className='flex h-full items-center justify-center'>
          <div className='max-w-md flex-1 rounded-md  '>{renderScreen()}</div>
        </div>
      ) : (
        <div className='flex flex-col  gap-2.5'>
          <div className='flex w-full max-w-5xl justify-between rounded-lg bg-primary px-4 py-0 text-white'>
            <div className='flex items-center gap-3'>
              <Image
                alt='ai-edit-icon'
                src={'/icons/ai-edit.svg'}
                height={16}
                width={16}
              />
              <p>Write proposals in one click with AI proposals.</p>
            </div>
            <Button
              className='px-0 font-semibold text-white no-underline'
              variant={'link'}
            >
              Try Now
            </Button>
          </div>
          <div className='flex w-full max-w-5xl flex-col gap-2.5 lg:flex-row'>
            <div className='flex-1 rounded-md  border border-[#d4d4d4]'>
              {renderScreen()}
            </div>
            <SendProposalOrgInfo receiverOrg={receiverOrg} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SendProposalFlow
