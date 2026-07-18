'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Credits, OrganizationType, SearchOrganizationResponse } from '@/types'
import { BadgeCheck, Trash } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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

type Props = {
  recieverOrg: SearchOrganizationResponse
  userId: string
  token: string
  senderOrg: OrganizationType
  options: { option: string; hint: string; category: string }[]
  status: string | null
  credits: Credits
}

const EditProposal = ({
  recieverOrg,
  userId,
  token,
  senderOrg,
  options,
  credits,
  status: proposalStatus
}: Props) => {
  const [status, setStatus] = useState<string | null>('PENDING')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const groupedOptions = options?.reduce((acc: any, option) => {
    const { category, ...rest } = option
    acc[category] = acc[category] || []
    acc[category].push(rest)
    return acc
  }, {})

  const [selectedOption, setSelectedOption] = useState<string>('')

  const [offers, setOffers] = useState<
    {
      benefit: string
      description: string
    }[]
  >([])

  const [expectations, setExpectations] = useState<
    {
      benefit: string
      description: string
      hint: string
    }[]
  >([])
  const [screen, setScreen] = useState<
    'offers' | 'expectations' | 'summary' | 'sent' | 'first-proposal'
  >('expectations')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [isFirstProposal, setIsFirstPropsal] = useState(false)

  const router = useRouter()

  const handleSelectOffer = (value: string) => {
    const hint = options?.find((elem) => elem?.option === value)?.hint || ''
    const offer = { benefit: value, description: '', hint }
    setOffers([...offers, offer])
    setSelectedOption('')
  }

  const handleSelectExpectation = (value: string) => {
    const hint = options?.find((elem) => elem?.option === value)?.hint || ''
    const expectation = { benefit: value, description: '', hint }
    setExpectations([...expectations, expectation])
    setSelectedOption('')
  }
  const handleSendProposal = async () => {
    try {
      setIsLoading(true)
      const senderBenefits = offers.map((offer) => ({
        benefit: offer.benefit,
        description: offer.description
      }))
      const receiverBenefits = expectations.map((expectation) => ({
        benefit: expectation.benefit,
        description: expectation.description
      }))

      await fetch('/api/organizationCollaboration', {
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

      //
      showCustomToast('Success', 'Proposal sent successfully', 'success', 5000)
      setIsOpen(false)
    } catch (error: any) {
      console.error(error.message)
      showCustomToast('Error', 'Something went wrong', 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setScreen('offers')
    setOffers([])
    setExpectations([])
    setSelectedOption('')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (isFirstProposal) {
      setScreen('first-proposal')
    } else {
      setIsOpen(false)
      setStatus('PENDING')
    }
  }

  const handleGoToDashboard = () => {
    setIsOpen(false)
    setStatus('PENDING')
  }

  return (
    <>
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <AlertDialogTrigger asChild>
          <Button className='h-[37px] rounded-lg bg-primary-light-blue text-sm font-bold text-white hover:bg-primary-light-blue'>
            Edit Proposal
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className='flex  h-full max-h-[90vh] w-full max-w-[97vw] flex-col  gap-2 overflow-hidden border-none bg-transparent p-0 shadow-none lg:max-w-screen-lg xl:max-w-screen-xl'>
          <div className='flex justify-between rounded-lg bg-primary px-4 py-0 text-white '>
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
          <div className='flex  h-full   gap-2 overflow-hidden border-none bg-transparent p-0 shadow-none lg:max-w-screen-lg xl:max-w-screen-xl'>
            <div className='flex h-full w-full flex-1 rounded-xl border bg-card'>
              {screen === 'expectations' && (
                <div className='flex h-full w-full flex-col justify-between p-4'>
                  <div className='my-2 flex flex-col items-center justify-center'>
                    <h2 className='text-base font-medium text-muted-foreground'>
                      In House Proposal
                    </h2>
                    <h3 className='text-2xl font-normal capitalize'>
                      {senderOrg.name} X {recieverOrg.name}
                    </h3>
                    <Separator className='my-2' />
                    <h2 className='text-medium mt-4 text-primary'>
                      Expectations from
                    </h2>
                    <div className='mt-1 flex items-center gap-2'>
                      <ImageFallback
                        src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${recieverOrg.id}`}
                        alt=''
                        width={100}
                        height={100}
                        className='h-10 w-10 rounded-full p-0'
                      />

                      <h3 className='text-3xl font-medium'>
                        {recieverOrg.name}
                      </h3>
                    </div>
                  </div>
                  <ScrollArea className='h-full p-1'>
                    <div className='space-y-2 p-2'>
                      <Label htmlFor='select-expectations' className=''>
                        Select Partnership types
                      </Label>
                      <Select
                        value={selectedOption}
                        onValueChange={handleSelectExpectation}
                      >
                        <SelectTrigger
                          name='select-expectations'
                          id='select-expectations'
                          className='first-letter:uppercase'
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
                                            key={option.option}
                                            value={option.option}
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
                          <div className='space-y-2' key={expectation.benefit}>
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
                                newExpectations[index].description =
                                  e.target.value
                                setExpectations(newExpectations)
                              }}
                              className='h-20 border border-border'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                  <AlertDialogFooter className='border-t pt-4'>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      onClick={() => setScreen('offers')}
                      disabled={expectations.length === 0}
                    >
                      Continue
                    </Button>
                  </AlertDialogFooter>
                </div>
              )}

              {screen === 'offers' && (
                <div className='flex h-full w-full flex-col justify-between p-4'>
                  <div className='my-2 flex flex-col items-center justify-center'>
                    <h2 className='text-base font-medium text-muted-foreground'>
                      In House Proposal
                    </h2>
                    <h3 className='text-2xl font-normal capitalize'>
                      {senderOrg.name} X {recieverOrg.name}
                    </h3>
                    <Separator className='my-2' />
                    <h2 className='text-medium mt-4 text-primary'>
                      Offers from
                    </h2>
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
                        onValueChange={handleSelectOffer}
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
                  <AlertDialogFooter className='flex flex-row items-center justify-between border-t pt-4'>
                    <Button
                      className=''
                      variant='ghost'
                      onClick={() => setScreen('expectations')}
                    >
                      Back
                    </Button>
                    <div className='flex items-center gap-2'>
                      <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        onClick={() => setScreen('summary')}
                        disabled={offers.length === 0}
                      >
                        Continue
                      </Button>
                    </div>
                  </AlertDialogFooter>
                </div>
              )}

              {screen === 'summary' && (
                <div className='flex h-full w-full flex-col justify-between p-4'>
                  <div className='my-2 flex flex-col items-center justify-center'>
                    <h2 className='text-base font-medium text-muted-foreground'>
                      In House Proposal
                    </h2>
                    <h3 className='text-2xl font-normal capitalize'>
                      {senderOrg?.name} X {recieverOrg?.name}
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
                            src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${recieverOrg?.id}`}
                            alt=''
                            width={50}
                            height={50}
                            className='h-10 w-10 rounded-full p-0'
                          />
                          {recieverOrg?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator className='my-2' />
                  <ScrollArea className='h-full p-1'>
                    <h3 className='font-medium'>
                      Offers from {senderOrg?.name}
                    </h3>
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
                      Expectations from {recieverOrg?.name}
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
                  <AlertDialogFooter className='flex flex-row items-center justify-between border-t pt-4'>
                    <Button
                      className=''
                      variant='ghost'
                      onClick={() => setScreen('offers')}
                    >
                      Back
                    </Button>
                    <div className='flex items-center gap-2'>
                      <AlertDialogCancel onClick={handleCancel}>
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        loading={isLoading}
                        loadingText='Sending Proposal'
                        onClick={handleSendProposal}
                      >
                        Send Proposal
                      </Button>
                    </div>
                  </AlertDialogFooter>
                </div>
              )}
            </div>
            <div className='hidden w-full max-w-xs flex-col overflow-hidden rounded-xl border bg-card md:flex'>
              <div className='flex flex-col gap-2 bg-accent p-4'>
                <div className='flex items-center gap-2'>
                  <ImageFallback
                    src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${recieverOrg?.id}`}
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
                    {(Array.isArray(recieverOrg?.preferredPartnershipTypes) &&
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
                        .map((service) => service.service)
                        .join(', ')) ||
                      'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default EditProposal
