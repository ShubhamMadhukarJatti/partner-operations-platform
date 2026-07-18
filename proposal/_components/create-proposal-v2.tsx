'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { proposalOffersExpectationsActions } from '@/redux/slices/proposal'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { ArrowLeft, ArrowRight, Check, Edit2, ExternalLink } from 'lucide-react'
// import { ArrowLeft, ArrowRight, Edit2 } from 'iconsax-react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import { showCustomToast } from '@/components/custom-toast'
import { TickmarkIcon } from '@/components/icons/icons'

import CompanyDetails from './CompanyDetails-v2'
import PartnerDetails from './PartnerDetails-v2'
import PartnershipType from './PartnershipType'
import ProposalPoints from './proposal-points'
import ProposalSentDialog from './proposal-sent-dialog'
import { Step2Expectations } from './step2-expectations'
import { Step3Offers } from './step3-offers'
import { Step4Preview } from './step4-preview'
import { Step5Success } from './step5-success'

export type TBenefit = {
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

const CreateProposal = ({ receiverOrg, userId, token, options }: Props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const offersExpectationsSaved = useSelector(
    (state: RootState) => state.proposalOffersExpectations
  )
  const { updateOffersExpectations } = proposalOffersExpectationsActions
  const [openProposalModal, setOpenProposalModal] = useState(false)

  const { loading: orgLoading, organization } = saved
  console.log(organization, 'organization')
  const { offers: userSelectedOffers, expectations: userSelectedExpectations } =
    offersExpectationsSaved
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState<TBenefit[]>([])
  const [expectations, setExpectations] = useState<TBenefit[]>([])
  const [selectedOption, setSelectedOption] = useState('')
  const [isManual, setIsManual] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  const groupedOptions = options?.reduce((acc: any, option) => {
    const { category, ...rest } = option
    acc[category] = acc[category] || []
    acc[category].push(rest)
    return acc
  }, {})
  const { unreadCount } = useSelector((state: RootState) => state.notification)
  const [step, setStep] = useState(1)

  const loadingTexts = [``, 'Crafting a win-win proposal', 'Almost done']

  useEffect(() => {
    if (isGeneratingAI) {
      const intervalId = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length)
      }, 2400)

      return () => clearInterval(intervalId)
    }
  }, [isGeneratingAI])

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

  const handleSendProposal = async () => {
    if (organization?.credits?.collaborationsLeft <= 0) {
      showCustomToast(
        'Insufficient Credits',
        "You don't have enough credit to proceed further - Upgrade Now",
        'error',
        5000
      )
      return
    }

    setIsLoading(true)
    try {
      const senderBenefits = expectations.map(({ benefit, description }) => ({
        benefit,
        description
      }))
      const receiverBenefits = offers.map(({ benefit, description }) => ({
        benefit,
        description
      }))

      if (senderBenefits.length === 0 || receiverBenefits.length === 0) {
        showCustomToast(
          'Missing Information',
          'Please add at least one benefit for both sender and receiver.',
          'error',
          5000
        )
        return
      } else if (
        senderBenefits.some((benefit) => benefit.description.length === 0)
      ) {
        showCustomToast(
          'Missing Description',
          'Please add a description for all sender benefits.',
          'error',
          5000
        )
        return
      } else if (
        receiverBenefits.some((benefit) => benefit.description.length === 0)
      ) {
        showCustomToast(
          'Missing Description',
          'Please add a description for all receiver benefits.',
          'error',
          5000
        )
        return
      }

      const response = await fetch('/api/organizationCollaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senderOrganizationId: organization.id,
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

      // Navigate to step 5 instead of showing modal
      setStep(5)
      // console.log(data, 'data')
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

  const onClickApiListing = () => {
    dispatch(updateOffersExpectations({ offers, expectations }))
  }

  useEffect(() => {
    if (userSelectedOffers.length > 0) {
      setOffers([...userSelectedOffers])
    }

    if (userSelectedExpectations.length > 0) {
      setExpectations([...userSelectedExpectations])
    }
  }, [userSelectedOffers, userSelectedExpectations])

  const triggerVibration = () => {
    setIsVibrating(true)
    setTimeout(() => setIsVibrating(false), 2500) // Reset vibration after 500ms
  }

  useEffect(() => {
    if (unreadCount > 0) {
      triggerVibration() // Trigger vibration when unreadCount is updated
    }
  }, [unreadCount])

  const handlePrevious = () => {
    if (step === 1) {
      router.push('/explore')
    }
    if (step === 2) {
      setStep(1)
      setIsManual(false)
      setOffers([])
      setExpectations([])
      // Clear Redux state when going back to step 1
      dispatch(updateOffersExpectations({ offers: [], expectations: [] }))
    } else if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleLeave = () => {
    router.push('/explore') // Takes user back to where they came from
  }

  const handleBuildWithAI = async () => {
    setIsGeneratingAI(true)
    setTextIndex(0)

    try {
      // const prompt = `${organization.name} ${organization.briefDescription} of tech sector and ${receiverOrg.name} ${receiverOrg.briefDescription} of fintech sector are looking to collaborate. replace startupA with ${organization.name} and startupB with ${receiverOrg.name} in the following proposal.`
      const prompt = `${organization.name} is ${organization.briefDescription} and ${organization.about}, ${organization.name} prefers ${organization?.preferredSectors.length ? organization?.preferredSectors?.map((sector: any) => sector.area).join(', ') : ''} and ${receiverOrg.name} is ${receiverOrg.briefDescription} and ${receiverOrg.about}, ${receiverOrg.name} prefers ${receiverOrg?.preferredSectors?.length ? receiverOrg?.preferredSectors?.map((sector: any) => sector.area).join(', ') : ''} `

      const response = await fetch(`/api/generate-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: prompt
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate proposal')
      }

      const completion = await response.text()
      const res = JSON.parse(completion)

      console.log('Raw API Response:', res)

      // Handle the new response format with proposal.details wrapper
      const responseData = res.proposal?.details || res.details || res
      console.log('Response Data:', responseData)

      const mappedOffers =
        responseData.offerings?.map(
          (item: { text: string; threshold: number }) => {
            const fullText = item.text.trim()

            // Handle the new format: "subheading:actual_title: description"
            let textToParse = fullText
            if (fullText.startsWith('subheading:')) {
              textToParse = fullText.substring('subheading:'.length).trim()
            }

            // Extract heading from the text (everything before the first colon)
            const colonIndex = textToParse.indexOf(':')
            const benefit =
              colonIndex > 0
                ? textToParse.substring(0, colonIndex).trim()
                : textToParse
            const description =
              colonIndex > 0
                ? textToParse.substring(colonIndex + 1).trim()
                : textToParse

            console.log('Parsed Offer:', {
              original: fullText,
              parsed: textToParse,
              benefit,
              description
            })

            return {
              benefit,
              description
            }
          }
        ) || []

      const mappedExpectations =
        responseData.expectations?.map(
          (item: { text: string; threshold: number }) => {
            const fullText = item.text.trim()

            // Handle the new format: "subheading:actual_title: description"
            let textToParse = fullText
            if (fullText.startsWith('subheading:')) {
              textToParse = fullText.substring('subheading:'.length).trim()
            }

            // Extract heading from the text (everything before the first colon)
            const colonIndex = textToParse.indexOf(':')
            const benefit =
              colonIndex > 0
                ? textToParse.substring(0, colonIndex).trim()
                : textToParse
            const description =
              colonIndex > 0
                ? textToParse.substring(colonIndex + 1).trim()
                : textToParse

            console.log('Parsed Expectation:', {
              original: fullText,
              parsed: textToParse,
              benefit,
              description
            })

            return {
              benefit,
              description
            }
          }
        ) || []

      console.log('Setting expectations:', mappedExpectations)
      console.log('Setting offers:', mappedOffers)

      setExpectations(mappedExpectations)
      setOffers(mappedOffers)

      // Update credits
      const creditsResponse = await fetch(`/api/credits`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          organizationId: organization.id,
          playgroundCredits: 0,
          aiProposalCredits: 1
        })
      })

      if (!creditsResponse.ok) {
        console.warn('Failed to update credits')
      }

      // Skip directly to step 4 (Preview) after generating
      setStep(4)
    } catch (error) {
      console.error('Error generating proposal:', error)
      showCustomToast(
        'Error',
        'Failed to generate proposal. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsGeneratingAI(false)
      setTextIndex(0)
    }
  }

  // Step navigation handlers
  const handleStep1Continue = () => {
    setStep(2)
  }

  const handleStep2Previous = () => {
    setStep(1)
    setIsManual(false)
  }

  const handleStep2Continue = () => {
    setStep(3)
  }

  const handleStep3Previous = () => {
    setStep(2)
  }

  const handleStep3Continue = () => {
    setStep(4)
  }

  // Progress Steps Component
  const ProgressSteps = () => {
    const isStep1Complete = step > 1 || isManual
    const isStep2Complete =
      (step > 2 && expectations.length > 0) ||
      (step >= 4 && expectations.length > 0)
    const isStep3Complete =
      (step > 3 && offers.length > 0) || (step >= 4 && offers.length > 0)
    const isStep4Complete = step > 4

    return (
      <div
        className='flex h-full flex-col p-6'
        style={{ backgroundColor: '#f8faff' }}
      >
        <div className='mb-8 flex-shrink-0'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Progress Steps
          </h2>
          <p className='mt-1 text-sm text-gray-500'>
            Track each step as you build your enquiry to{' '}
            <span className='font-medium'>{receiverOrg.name}</span> at a glance.
            Follow the steps below and send the enquiry.
          </p>
        </div>

        <div className='min-h-0 flex-1 space-y-4 overflow-y-auto'>
          {/* Step 1: Select Workflow */}
          <div
            className={`rounded-lg p-3 ${step === 1 ? '' : 'bg-transparent'}`}
            style={{
              backgroundColor: step === 1 ? '#e6effe' : 'transparent'
            }}
          >
            <div className='flex items-center justify-between'>
              <div
                className='text-base'
                style={{
                  color: step === 1 ? '#10366F' : '#9ca3af',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                Step 1:{' '}
                <span style={{ fontWeight: '700' }}>Select Workflow</span>
              </div>
              {isStep1Complete && (
                <TickmarkIcon className='h-6 w-6' color='#22c55e' />
              )}
            </div>
            {step === 1 && !isStep1Complete && (
              <div className='mt-1 text-sm text-blue-600'>
                Start Creating Proposal
              </div>
            )}
          </div>

          {/* Step 2: Expectations */}
          <div
            className={`rounded-lg p-3 ${step === 2 ? '' : 'bg-transparent'}`}
            style={{
              backgroundColor: step === 2 ? '#e6effe' : 'transparent'
            }}
          >
            <div className='flex items-center justify-between'>
              <div
                className='text-base'
                style={{
                  color: step === 2 ? '#10366F' : '#9ca3af',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                Step 2: <span style={{ fontWeight: '700' }}>Expectations</span>
              </div>
              {isStep2Complete && (
                <TickmarkIcon className='h-6 w-6' color='#22c55e' />
              )}
            </div>
            {step === 2 && (
              <div className='mt-1 text-sm text-blue-600'>Set Expectations</div>
            )}
          </div>

          {/* Step 3: Offers */}
          <div
            className={`rounded-lg p-3 ${step === 3 ? '' : 'bg-transparent'}`}
            style={{
              backgroundColor: step === 3 ? '#e6effe' : 'transparent'
            }}
          >
            <div className='flex items-center justify-between'>
              <div
                className='text-base'
                style={{
                  color: step === 3 ? '#10366F' : '#9ca3af',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                Step 3: <span style={{ fontWeight: '700' }}>Offers</span>
              </div>
              {isStep3Complete && (
                <TickmarkIcon className='h-6 w-6' color='#22c55e' />
              )}
            </div>
            {step === 3 && (
              <div className='mt-1 text-sm text-blue-600'>
                Define Your Offers
              </div>
            )}
          </div>

          {/* Step 4: Preview */}
          <div
            className={`rounded-lg p-3 ${step === 4 ? '' : 'bg-transparent'}`}
            style={{
              backgroundColor: step === 4 ? '#e6effe' : 'transparent'
            }}
          >
            <div className='flex items-center justify-between'>
              <div
                className='text-base'
                style={{
                  color: step === 4 ? '#10366F' : '#9ca3af',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                Step 4: <span style={{ fontWeight: '700' }}>Preview</span>
              </div>
              {isStep4Complete && (
                <TickmarkIcon className='h-6 w-6' color='#22c55e' />
              )}
            </div>
            {step === 4 && (
              <div className='mt-1 text-sm text-blue-600'>Review & Confirm</div>
            )}
          </div>

          {/* Step 5: Send */}
          <div
            className={`rounded-lg p-3 ${step === 5 ? '' : 'bg-transparent'}`}
            style={{
              backgroundColor: step === 5 ? '#e6effe' : 'transparent'
            }}
          >
            <div className='flex items-center justify-between'>
              <div
                className='text-base'
                style={{
                  color: step === 5 ? '#10366F' : '#9ca3af',
                  fontSize: '16px',
                  fontWeight: '400'
                }}
              >
                Step 5: <span style={{ fontWeight: '700' }}>Send</span>
              </div>
            </div>
            {step === 5 && (
              <div className='mt-1 text-sm text-blue-600'>Send & Cool-Down</div>
            )}
          </div>
        </div>

        {/* Leave Button - Fixed at absolute bottom */}
        <div className='mt-auto border-t border-gray-100 pt-6'>
          <button
            onClick={handleLeave}
            className='flex w-full items-center gap-2 rounded-lg border border-gray-300 p-3 text-gray-600 transition-colors hover:bg-gray-50'
          >
            <ExternalLink size={16} />
            Leave
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* AI Generation Loading Overlay */}
      {isGeneratingAI && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='flex h-full w-full flex-1 flex-col items-center justify-center gap-20 rounded-xl border bg-card p-10'>
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
                    Tip: To create best AI proposals, complete your startup
                    profile
                  </p>
                </>
              ) : (
                <h3 className='mt-4 text-xl font-medium text-primary'>
                  {loadingTexts[textIndex]}
                </h3>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='flex h-full flex-col'>
        {/* Main Content Area */}
        <div className='flex flex-1 overflow-hidden'>
          {/* Progress Steps Sidebar */}
          <div className='flex h-full w-80 flex-col'>
            <ProgressSteps />
          </div>

          {/* Main Content */}
          <div className='flex flex-1 flex-col'>
            {/* Main container */}
            <div className='mx-auto flex w-full flex-1 flex-col overflow-hidden'>
              {/* Heading and Send Enquiry section */}
              {/* <div className='px-8 py-6'>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={handlePrevious}
                  className='flex items-center gap-2 border-none bg-transparent hover:bg-transparent'
                >
                  <ArrowLeft size={24} color='#2A3241' />
                </Button>
                <div>
                  <h5 className='text-shark- font-bold'>
                    Add details for partner enquiry
                  </h5>
                  <span className='text-shark-xs font-normal text-text-100'>
                    Step {step} of 2
                  </span>
                </div>
              </div>
            </div> */}

              {/* <div className='mb-4 grid grid-cols-1 gap-6 px-8 md:grid-cols-2'>
              <PartnerDetails receiverOrg={receiverOrg} />
              <CompanyDetails organizationData={organization} />
            </div> */}

              {/* Step 1: Partnership Type Selection */}
              {step === 1 && (
                <PartnershipType
                  setExpectations={setExpectations}
                  setOffers={setOffers}
                  setStep={setStep}
                  setIsManual={setIsManual}
                  partnerName={receiverOrg.name}
                  dispatch={dispatch}
                  updateOffersExpectations={updateOffersExpectations}
                  onBuildWithAI={handleBuildWithAI}
                />
              )}

              {/* Step 2: Expectations */}
              {step === 2 && (
                <Step2Expectations
                  expectations={expectations}
                  setExpectations={setExpectations}
                  options={options}
                  receiverOrgName={receiverOrg.name}
                  senderOrgName={organization.name}
                  senderOrgData={{
                    name: organization.name,
                    logoUrl: organization.logoUrl,
                    preferredPartnershipTypes:
                      organization.preferredPartnershipTypes || []
                  }}
                  receiverOrgData={{
                    name: receiverOrg.name,
                    logoUrl: receiverOrg.logoUrl,
                    preferredPartnershipTypes:
                      receiverOrg.preferredPartnershipTypes || []
                  }}
                />
              )}

              {/* Step 3: Offers */}
              {step === 3 && (
                <Step3Offers
                  offers={offers}
                  setOffers={setOffers}
                  options={options}
                  receiverOrgName={receiverOrg.name}
                  senderOrgName={organization.name}
                  senderOrgData={{
                    name: organization.name,
                    logoUrl: organization.logoUrl,
                    preferredPartnershipTypes:
                      organization.preferredPartnershipTypes || []
                  }}
                  receiverOrgData={{
                    name: receiverOrg.name,
                    logoUrl: receiverOrg.logoUrl,
                    preferredPartnershipTypes:
                      receiverOrg.preferredPartnershipTypes || []
                  }}
                />
              )}

              {/* Step 4: Preview */}
              {step === 4 && (
                <>
                  {console.log('Rendering Step 4 with:', {
                    step,
                    expectationsCount: expectations.length,
                    offersCount: offers.length,
                    expectations,
                    offers
                  })}
                  <Step4Preview
                    expectations={expectations}
                    offers={offers}
                    receiverOrgName={receiverOrg.name}
                    senderOrgName={organization.name}
                    senderOrgData={{
                      name: organization.name,
                      logoUrl: organization.logoUrl,
                      preferredPartnershipTypes:
                        organization.preferredPartnershipTypes || []
                    }}
                    receiverOrgData={{
                      name: receiverOrg.name,
                      logoUrl: receiverOrg.logoUrl,
                      preferredPartnershipTypes:
                        receiverOrg.preferredPartnershipTypes || []
                    }}
                    onRemoveExpectation={(index) => {
                      const newExpectations = [...expectations]
                      newExpectations.splice(index, 1)
                      setExpectations(newExpectations)
                    }}
                    onRemoveOffer={(index) => {
                      const newOffers = [...offers]
                      newOffers.splice(index, 1)
                      setOffers(newOffers)
                    }}
                    onUpdateExpectationDescription={(index, description) => {
                      const newExpectations = expectations.map((exp, i) =>
                        i === index ? { ...exp, description } : exp
                      )
                      setExpectations(newExpectations)
                    }}
                    onUpdateOfferDescription={(index, description) => {
                      const newOffers = offers.map((offer, i) =>
                        i === index ? { ...offer, description } : offer
                      )
                      setOffers(newOffers)
                    }}
                  />
                </>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <Step5Success
                  receiverOrgName={receiverOrg.name}
                  senderOrgName={organization.name}
                  senderOrgData={{
                    name: organization.name,
                    logoUrl: organization.logoUrl,
                    preferredPartnershipTypes:
                      organization.preferredPartnershipTypes || []
                  }}
                  receiverOrgData={{
                    name: receiverOrg.name,
                    logoUrl: receiverOrg.logoUrl,
                    preferredPartnershipTypes:
                      receiverOrg.preferredPartnershipTypes || []
                  }}
                />
              )}

              {/* Legacy combined form (temporary - for steps 6+) */}
              {step > 5 &&
                ((offers.length > 0 && expectations.length > 0) ||
                  isManual) && (
                  <div className='border-t border-[#E4E7EE] bg-[#f9fafb] p-2 px-8 pb-16'>
                    <h1 className='mt-4 text-xl font-semibold'>
                      Details for your proposal
                    </h1>
                    <p className='mb-2 text-sm text-gray-600'>
                      Enter details of what you expect and offer
                    </p>
                    <div className='mb-4 rounded-lg bg-[#00970A] p-2'>
                      <p className='flex items-center justify-between text-sm text-gray-100'>
                        <span>
                          <span className='font-bold'>Did you know?</span> The
                          chances of getting this proposal approved increases by
                          65% if you do a customer persona match. It is free and
                          super easy!
                        </span>{' '}
                        <span className='text-xs font-bold text-white'>
                          Take me to Customer Persona
                        </span>
                      </p>
                    </div>
                    <div className='mb-4 grid grid-cols-1 lg:grid-cols-2'>
                      <ProposalPoints
                        heading={`Expectation Proposal form ${receiverOrg.name}`}
                        groupedOptions={groupedOptions}
                        points={expectations}
                        handleSelect={handleSelectBenefit}
                        selectedOption={selectedOption}
                        isBenefit={false}
                        setPoints={setExpectations}
                        setSelectedOption={setSelectedOption}
                        className='border-r-0'
                      />
                      <ProposalPoints
                        heading={`Offers Proposal form ${organization.name}`}
                        groupedOptions={groupedOptions}
                        points={offers}
                        handleSelect={handleSelectBenefit}
                        selectedOption={selectedOption}
                        isBenefit
                        setPoints={setOffers}
                        setSelectedOption={setSelectedOption}
                      />
                    </div>

                    <ProposalSentDialog
                      isOpen={openProposalModal}
                      setIsOpen={setOpenProposalModal}
                      org={receiverOrg}
                    />
                  </div>
                )}
              {/* Footer section with timer and navigation buttons - commented out */}

              {/* <div
                className='absolute bottom-0 right-0 z-10 flex w-full items-center justify-between border-t border-[#E4E7EE] bg-white px-6 py-2 pt-1'
                style={{ width: 'calc(100% - 20rem)' }}
              >
                <p className='text-xs text-gray-500'>
                  <span className='mr-2 inline-block'>⏱️</span>
                  Takes less than 5 minutes to complete
                </p>
                <div className='flex gap-4'>
                  {offers.length < 1 &&
                    expectations.length < 1 &&
                    !isManual && (
                      <>
                        <Button
                          variant='outline'
                          className='border border-[#3E50F7] text-[#3E50F7]'
                          onClick={() => {
                            setIsManual(true)
                            setStep(2)
                          }}
                        >
                          <Edit2 size={16} /> Build Manually
                        </Button>
                        <Button onClick={handleBuildWithAI}>
                          Build With AI <ArrowRight size={16} />
                        </Button>
                      </>
                    )}
                  {((offers.length > 0 && expectations.length > 0) ||
                    isManual) && (
                    <>
                      <Button
                        variant='outline'
                        className='border border-[#3E50F7] text-[#3E50F7]'
                        onClick={() => {
                          setOffers([])
                          setExpectations([])
                          setStep(1)
                          setIsManual(false)
                        }}
                      >
                        <ArrowLeft size={16} /> Previous
                      </Button>
                      <Button onClick={handleSendProposal} loading={isLoading}>
                        Submit Proposal <ArrowRight size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        {step > 1 && step < 5 && (
          <div className='flex-shrink-0 border-t border-gray-200 bg-white px-8 py-6'>
            <div className='mx-auto flex w-full justify-between'>
              <div>
                <Button
                  variant='outline'
                  onClick={
                    step === 2
                      ? handleStep2Previous
                      : step === 3
                        ? handleStep3Previous
                        : step === 4
                          ? () => setStep(3)
                          : handlePrevious
                  }
                  className='border border-gray-300 text-gray-700 hover:bg-gray-50'
                >
                  <ArrowLeft size={16} className='mr-2' />
                  Previous
                </Button>
              </div>
              <div>
                {step === 2 && (
                  <Button
                    onClick={handleStep2Continue}
                    disabled={
                      expectations.length === 0 ||
                      !expectations.every(
                        (exp) => exp.description.trim().length > 0
                      )
                    }
                    className='bg-[#3E50F7] text-white hover:bg-[#3E50F7]/90'
                  >
                    Continue to Offers
                    <ArrowRight size={16} className='ml-2' />
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    onClick={handleStep3Continue}
                    disabled={
                      offers.length === 0 ||
                      !offers.every(
                        (offer) => offer.description.trim().length > 0
                      )
                    }
                    className='bg-[#3E50F7] text-white hover:bg-[#3E50F7]/90'
                  >
                    Continue to Preview
                    <ArrowRight size={16} className='ml-2' />
                  </Button>
                )}
                {step === 4 && (
                  <Button onClick={handleSendProposal} loading={isLoading}>
                    Submit Proposal <ArrowRight size={16} className='ml-2' />
                  </Button>
                )}
                {step > 4 &&
                  ((offers.length > 0 && expectations.length > 0) ||
                    isManual) && (
                    <Button onClick={handleSendProposal} loading={isLoading}>
                      Submit Proposal <ArrowRight size={16} />
                    </Button>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CreateProposal
