import React, { useEffect, useState } from 'react'
import { useSetPreferences } from '@/http-hooks/explore'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import Step1Form from './Step1Form'
import Step2Form from './Step2Form'
import Step3Form from './Step3Form'
import StepperNew from './Stepper'

export interface PreferenceType {
  preferredSectors: string[] | null
  preferredPartnershipTypes: string[] | null
  companyType: 'B2B' | 'B2C' | 'B2B2C' | null
  onboardedPartners:
    | 'ZERO'
    | 'LESS_THAN_FIVE'
    | 'BETWEEN_5_AND_20'
    | 'MORE_THAN_20'
    | null
  excludeCompanySize:
    | [
        | 'SOLO_ENTREPRENEURS'
        | 'SMALL_BUSINESSES'
        | 'STARTUPS'
        | 'MEDIUM_COMPANIES'
        | 'ENTERPRISES'
      ]
    | null
  excludePartnershipGoals:
    | [
        | 'INVESTMENT'
        | 'JOINT_VENTURE'
        | 'MARKETING_COLLABORATION'
        | 'TECHNOLOGY_SHARING'
        | 'RESOURCE_POOLING'
      ]
    | null
  avoidGeographicRegion:
    | [
        | 'NORTH_AMERICA'
        | 'EUROPE'
        | 'APAC'
        | 'SOUTH_AMERICA'
        | 'AUSTRALIA'
        | 'MENA'
      ]
    | null
  excludeBusinessMaturityLevel:
    | [
        | 'MVP'
        | 'PRE_REVENUE'
        | 'REVENUE_GENERATING'
        | 'SCALING_STAGE'
        | 'ESTABLISHED'
      ]
    | null
  excludeCompaniesTechnology:
    | [
        | 'WEB3_BLOCKCHAIN'
        | 'AI_ML'
        | 'AR_VR'
        | 'LEGACY_SYSTEMS'
        | 'NO_AND_LOW_CODE_PLATFORM'
      ]
    | null
  companySixMonthOperation: boolean
  companyFundRaising: boolean
}

const PreferenceDialog = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const { mutate: updatePreference, isPending } = useSetPreferences()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState<PreferenceType>({
    preferredSectors: [],
    preferredPartnershipTypes: [],
    companyType: null,
    onboardedPartners: null,
    excludeCompanySize: null,
    excludePartnershipGoals: null,
    avoidGeographicRegion: null,
    excludeBusinessMaturityLevel: null,
    excludeCompaniesTechnology: null,
    companySixMonthOperation: false,
    companyFundRaising: false
  })

  const renderFormComponent = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <Step1Form formData={formData} setFormData={setFormData} />
      case 2:
        return <Step2Form formData={formData} setFormData={setFormData} />
      case 3:
        return <Step3Form formData={formData} setFormData={setFormData} />
    }
  }

  const [initialStepData, setInitialStepData] = useState<
    Partial<Record<keyof typeof formData, any>>
  >({})

  // Fields related to each step
  const stepFields: Record<number, string[]> = {
    1: [
      'preferredSectors',
      'preferredPartnershipTypes',
      'companyType',
      'onboardedPartners'
    ],
    2: [
      'excludeCompanySize',
      'excludePartnershipGoals',
      'avoidGeographicRegion'
    ],
    3: [
      'excludeBusinessMaturityLevel',
      'excludeCompaniesTechnology',
      'companySixMonthOperation',
      'companyFundRaising'
    ]
  }

  useEffect(() => {
    // Save initial fields when step is rendered
    const fields = stepFields[currentStep]
    const initialData = {}
    fields.forEach((field) => {
      // @ts-ignore
      initialData[field] = formData[field]
    })
    setInitialStepData(initialData)
  }, [currentStep])

  const handleNext = () => {
    const fields = stepFields[currentStep]
    let isChanged = false

    for (let field of fields) {
      if (
        // @ts-ignore
        JSON.stringify(formData[field]) !==
        // @ts-ignore
        JSON.stringify(initialStepData[field])
      ) {
        isChanged = true
        break
      }
    }

    if (isChanged) {
      updatePreference(formData)
    }

    if (currentStep < 3) {
      setCurrentStep((step) => step + 1)
    }

    if (currentStep === 3) {
      setCurrentStep(1)
      setOpen(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1)
    }
  }

  useEffect(() => {
    setFormData({
      preferredSectors: organization?.preferredSectors?.map(
        (item: any) => item.area
      ),
      preferredPartnershipTypes: organization?.preferredPartnershipTypes?.map(
        (item: any) => item.area
      ),
      companyType: organization?.companyType,
      onboardedPartners: organization?.onboardedPartners,
      excludeCompanySize: organization?.excludeCompanySize ?? [],
      excludePartnershipGoals: organization?.excludePartnershipGoals ?? [],
      avoidGeographicRegion: organization?.avoidGeographicRegion ?? [],
      excludeBusinessMaturityLevel:
        organization?.excludeBusinessMaturityLevel ?? [],
      excludeCompaniesTechnology:
        organization?.excludeCompaniesTechnology ?? [],
      companySixMonthOperation: organization?.companySixMonthOperation,
      companyFundRaising: organization?.companyFundRaising
    })
  }, [organization])

  console.log({ organization })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='self-start rounded-[6px] bg-white px-3 py-1.5 text-xs font-semibold text-[#3E50F7]'>
        Set preferences
      </DialogTrigger>
      <DialogContent className='w-full max-w-[1086px] p-0 '>
        <div className='px-4 py-6 lg:px-6'>
          <div>
            <h2 className='text-2xl font-bold'>What are you looking for?</h2>
            <p className='pb-1 text-sm  text-[#7688A8]'>
              Set preferences as your goals so we can match you with the right
              opportunities.
            </p>
          </div>

          <ScrollArea className='h-[500px]'>
            <div className='px-0 py-4 lg:px-8 lg:py-8'>
              <div className='space-y-6'>
                <StepperNew currentStep={currentStep} />
                {renderFormComponent(currentStep)}
              </div>
              {/* Buttons */}
              <div></div>
            </div>
          </ScrollArea>

          <DialogFooter className='grid grid-cols-2 gap-4 px-8 pt-4'>
            <Button
              className='font-bold text-[#3E50F7]'
              disabled={currentStep === 1}
              onClick={() => handleBack()}
              variant={'outline'}
            >
              Back
            </Button>
            <Button onClick={() => handleNext()}>
              {currentStep < 3 ? 'Next' : 'Done'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreferenceDialog
