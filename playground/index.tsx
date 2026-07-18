'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ConfigType, type OrganizationType } from '@/types'
import { Copy, Trash } from 'iconsax-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

type Props = {
  token: string
  organization: OrganizationType
}

type ProposalResponse = {
  evaluateProposal: {
    validResponse?: string
    invalidResponse?: {
      message: string
      justification: string
      suggestions: string
    }
  }
}

type ToneOptions = {
  standard: string
  fluency: string
  natural: string
  formal: string
  academic: string
  simple: string
  creative: string
  expanded: string
  shortened: string
}

export const Playground = ({ token, organization }: Props) => {
  const [playgroundData, setPlaygroundData] = useState<ConfigType[]>([])
  const [partnershipTypes, setPartnershipTypes] = useState<string[]>([])
  const [proposalTone, setProposalTone] = useState<string>('')

  const [partnershipType, setPartnershipType] = useState('')
  const [isOptionsLoading, setIsOptionsLoading] = useState(true)
  const [benefits, setBenefits] = useState<string[]>([])

  // ------------
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [completion, setCompletion] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [invalidResponse, setInvalidResponse] = useState<
    ProposalResponse['evaluateProposal']['invalidResponse'] | null
  >(null)
  const [toneOptions, setToneOptions] = useState<ToneOptions | null>(null)
  const [toneVariations, setToneVariations] = useState<ToneOptions | null>(null)

  useEffect(() => {
    const getPlaygroundData = async () => {
      try {
        const response = await fetch(
          `/api/configuration/allActiveByType?type=PLAYGROUND`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const data: ConfigType[] = await response.json()

        const partnershipTypes = Array.from(
          new Set(data.map((item) => item.key.split('_')[0]))
        )

        setPartnershipTypes(partnershipTypes)
        setPartnershipType(partnershipTypes[0])
        setPlaygroundData(data)
        setIsOptionsLoading(false)
      } catch (error) {
        showCustomToast('Error', 'Something went wrong!', 'error', 5000)
      }
    }

    getPlaygroundData()
  }, [])

  useEffect(() => {
    const data = playgroundData
      .filter((item) => item.key.split('_')[0] === partnershipType)
      .map((item) => {
        return item.value
      })
    setBenefits(data)
    setSelectedBenefits([])
    setSelectedExpectations([])
    setInput('')
  }, [partnershipType, playgroundData, setInput])

  const analysisRef = useRef<null | HTMLDivElement>(null)

  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])
  const [selectedExpectations, setSelectedExpectations] = useState<string[]>([])

  const handleOffers = (e: any) => {
    if (e.target.checked) {
      setSelectedBenefits([...selectedBenefits, e.target.value])
    } else {
      setSelectedBenefits(
        selectedBenefits.filter((item) => item !== e.target.value)
      )
    }
  }

  const handleExpectations = (e: any) => {
    if (e.target.checked) {
      setSelectedExpectations([...selectedExpectations, e.target.value])
    } else {
      setSelectedExpectations(
        selectedExpectations.filter((item) => item !== e.target.value)
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    setInput(
      `We would propose a ${partnershipType
        .toLowerCase()
        .replace(/_/g, ' ')} partnership with your startup${
        selectedBenefits.length > 0
          ? ` We offer ${selectedBenefits.join(', ')} `
          : ''
      }${
        selectedExpectations.length > 0
          ? `and expect ${selectedExpectations.join(', ')} in return`
          : ''
      }.
      `
    )

    setIsValid(null)
    setInvalidResponse(null)
    setToneOptions(null)
    setCompletion('')
  }, [selectedBenefits, selectedExpectations, partnershipType, setInput])

  type Credits = {
    organziationId: number
    aiProposalCredits: number
    playgroundCredits: number
  }

  const getCredits = async () => {
    const creditsData = await fetch(
      `/api/credits?organizationId=${organization.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!creditsData.ok) {
      throw new Error('Failed to fetch credits')
    }

    const credits: Credits = await creditsData.json()
    return credits
  }

  const analyse = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input === '') {
      showCustomToast(
        'Error',
        'Please Select few options to analyse the proposal',
        'error',
        5000
      )
      return
    }

    try {
      const credits: any = await getCredits()
      console.log(credits, `playground credits`)

      if (credits.playgroundLeft > 0) {
        e.preventDefault()
        setIsLoading(true)
        setCompletion('')
        setIsValid(null)
        setInvalidResponse(null)
        setToneVariations(null)

        try {
          const response = await fetch('/api/completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: input })
          })

          if (!response.body) {
            throw new Error('ReadableStream not supported')
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let result = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value)
            result += chunk
            setCompletion((prev) => prev + chunk)
          }

          const parsedResponse = JSON.parse(result)
          console.log('Parsed response:', parsedResponse.toneVariations)

          if (parsedResponse.valid) {
            setIsValid(true)
            setProposalTone('standard')
            setInvalidResponse(null)
            setToneVariations(parsedResponse.toneVariations)
          } else {
            setIsValid(false)
            setInvalidResponse(
              parsedResponse.validationResult.evaluateProposal.invalidResponse
            )
          }

          const responseCredits = await fetch(`/api/credits`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              organizationId: organization.id,
              playgroundCredits: 1,
              aiProposalCredits: 0
            })
          })
          if (!responseCredits.ok) {
            throw new Error('Failed to update credits')
          }
        } catch (error) {
          console.error('Error fetching completion:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        showCustomToast(
          'Error',
          'You do not have enough credits to analyse this proposal',
          'error',
          5000
        )
      }
    } catch (error) {
      showCustomToast('Error', 'Failed to fetch credits', 'error', 5000)
    }
  }

  return (
    <main className='flex flex-col gap-4 p-4'>
      <div>
        <h1 className='fds-heading text-[0F172A]'>Proposal Playground</h1>
        <p className='mt-2 text-shark-sm text-[#475569]'>
          Try out different proposals and see if they are valid under
          sharkdom&apos;s platform, Using our custom A.I powered model.
        </p>
      </div>
      <div className='flex h-full flex-col-reverse gap-4 lg:flex-row'>
        <div className='flex flex-1 flex-col rounded-2xl border border-text-20 p-4'>
          <form className='flex flex-col gap-4' onSubmit={analyse}>
            <div>
              <textarea
                id='proposal'
                name='proposal'
                className='fds-text h-auto min-h-[50px] w-full resize-none overflow-hidden border-none text-text-60 outline-none disabled:bg-white'
                value={input}
                onChange={handleInputChange}
                placeholder='Type here to create proposal...'
                rows={14}
              />

              <div className='flex items-center justify-between'>
                <span className='fds-text text-text-100'>
                  {input.split(' ')?.length} words
                </span>

                <Button
                  variant={'link'}
                  onClick={(e: any) => {
                    e.preventDefault()
                    setInput('')
                  }}
                >
                  <Trash size={20} color='#FC362F' />
                </Button>
              </div>
            </div>

            <div className='flex items-center justify-center'>
              <Separator className='hidden bg-text-20 text-text-20 lg:flex lg:w-[183px]' />
              <Button
                className='fds-text-sm h-10  w-[190px] max-w-xs self-center rounded-lg bg-primary-light-blue text-white disabled:bg-text-20 disabled:text-text-60 '
                type='submit'
                loading={isLoading}
                loadingText='Analysing...'
                disabled={input === ''}
              >
                Analyse Proposal
              </Button>
              <Separator className='hidden bg-text-20 text-text-20 lg:flex lg:w-[183px]' />
            </div>

            <div ref={analysisRef} className='h-full flex-grow  '>
              <div className='h-full '>
                {isValid === null && <p></p>}

                {isValid === false && invalidResponse && (
                  <div className='space-y-1.5  '>
                    <p className='font-bold text-semantic-danger'>
                      {invalidResponse.message}
                    </p>
                    <p className='text-shark-base text-text-100'>
                      <span className='font-bold'>Justification:</span>{' '}
                      {invalidResponse.justification}
                    </p>
                    <p className='text-shark-base text-primary-light-blue'>
                      <span className='font-bold'>Suggestion:</span>{' '}
                      {invalidResponse.suggestions}
                    </p>
                  </div>
                )}

                {isValid && toneVariations && (
                  <div className='space-y-4'>
                    {proposalTone && (
                      <div className=''>
                        <p className='text-semantic-success'>
                          The partnership is valid.
                        </p>

                        <p>
                          {toneVariations
                            ? toneVariations[proposalTone as keyof ToneOptions]
                            : ''}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='mt-auto flex items-center justify-between'>
                <span className='fds-text text-text-100'>
                  <span className='fds-text text-text-100'>
                    {' '}
                    {isValid
                      ? `${toneVariations?.[proposalTone as keyof ToneOptions]?.split(' ').length} words`
                      : `${completion?.split(' ').length} words`}{' '}
                  </span>
                </span>
                {isValid && (
                  <Button
                    variant={'link'}
                    onClick={(e: any) => {
                      e.preventDefault()
                      completion &&
                        navigator.clipboard.writeText(
                          toneVariations
                            ? toneVariations[proposalTone as keyof ToneOptions]
                            : ''
                        )

                      showCustomToast('Success', 'Copied', 'success', 5000)
                    }}
                  >
                    <Copy size={20} color='#0062F1' />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
        <Separator orientation='vertical' className='hidden h-full lg:block' />
        <Separator className='block lg:hidden' />
        <aside className='flex flex-1 flex-col gap-6'>
          <div className='space-y-2'>
            <h4 className='fds-text-semibold text-text-100'>
              Partnership Type
            </h4>

            <div className='flex flex-wrap items-center gap-2'>
              {partnershipTypes.map((partnership: any) => (
                <Button
                  className={cn(
                    'fds-text h-[33px] rounded-full border border-text-20 bg-white capitalize text-text-100 hover:bg-background-ghost-white hover:text-text-100',
                    {
                      'bg-primary-light-blue text-white hover:bg-primary-light-blue hover:text-white':
                        partnership === partnershipType
                    }
                  )}
                  key={partnership}
                  onClick={() => setPartnershipType(partnership)}
                >
                  {partnership.toLowerCase().replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='fds-text-semibold text-text-100'>Proposal Tones</h4>

            <div className='flex flex-wrap items-center gap-2'>
              {[
                'standard',
                'fluency',
                'natural',
                'formal',
                'academic',
                'simple',
                'creative',
                'expand',
                'shortan'
              ].map((tone: any) => (
                <Button
                  className={cn(
                    'fds-text h-[33px] rounded-full border border-text-20 bg-white capitalize text-text-100 hover:bg-background-ghost-white hover:text-text-100',
                    {
                      'bg-primary-light-blue text-white hover:bg-primary-light-blue hover:text-white':
                        tone === proposalTone
                    }
                  )}
                  disabled={!isValid}
                  key={tone}
                  onClick={() => setProposalTone(tone)}
                >
                  {tone.toLowerCase().replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='fds-text-semibold text-text-100'>
              Benefits we Offer
            </h4>

            <div className=' flex flex-col items-start gap-4'>
              {isOptionsLoading
                ? [...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className='mb-2 h-6 w-full rounded-md bg-gray-300'
                    />
                  ))
                : benefits.map((item, i) => {
                    const key = `${item
                      .toLowerCase()
                      .replace(/ /g, '_')}${partnershipType}`
                    return (
                      <div
                        key={`${item}_expectation`}
                        className='flex  items-start gap-4'
                      >
                        <Input
                          type='checkbox'
                          aria-label={`${item}`}
                          id={key}
                          name={item}
                          value={item}
                          className='h-4 w-4 border-[1.5px] accent-text-80'
                          onChange={handleOffers}
                        />
                        <Label htmlFor={key} className='fds-text text-text-100'>
                          {item}
                        </Label>
                      </div>
                    )
                  })}
            </div>
          </div>

          <div className='space-y-4'>
            <h4 className='fds-text-semibold text-text-100'>
              Expected benefits from partner
            </h4>

            <div className=' flex flex-col items-start gap-4'>
              {isOptionsLoading
                ? [...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className='mb-2 h-6 w-full rounded-md bg-gray-300'
                    />
                  ))
                : benefits.map((item, i) => (
                    <div
                      key={`${item}_expectation`}
                      className='flex items-start gap-4'
                    >
                      <Input
                        type='checkbox'
                        aria-label={`${item} expectation`}
                        id={`${item}_expectation`}
                        name={`${item}_expectation`}
                        value={item}
                        className='h-4 w-4 accent-text-80'
                        onChange={handleExpectations}
                      />
                      <Label
                        htmlFor={`${item}_expectation`}
                        className='fds-text text-text-100'
                      >
                        {item}
                      </Label>
                    </div>
                  ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
