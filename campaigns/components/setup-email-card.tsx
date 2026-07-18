import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'iconsax-react'

import { getCurrentOrganization } from '@/lib/db/organization'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'

import { EmailSetupFormValuesTypes } from './emailSetupForm'
import { SetupEmailDialogFirstStep } from './setupEmailSteps/setupEmailDialogFirstStep'
import { SetupEmailDialogSecondStep } from './setupEmailSteps/setupEmailDialogSecondStep'

const SetupEmailCard: React.FC<{
  domain: string | null
  isEmailDomainRecordsLoading: boolean
  isVerified: boolean
}> = ({ domain, isEmailDomainRecordsLoading, isVerified }) => {
  if (isEmailDomainRecordsLoading || isVerified) return null

  if (!!domain) {
    return <SetupEmailComponentPending />
  }

  return (
    <div
      className='h-134 ml-0 cursor-pointer rounded-2xl border p-4 pb-5 pt-5 text-white'
      style={{
        background: 'linear-gradient(101.31deg, #0062F1 0.05%, #00398B 100.05%)'
      }}
    >
      <div className='mb-6 flex flex-col gap-2'>
        <p className='text-shark-base font-bold'>
          Set Up Email to Launch Campaigns!
        </p>
        <p className='text-shark-xs font-medium'>
          Add your email address and domain to start sending automated email
          campaigns.
        </p>
      </div>
      <SetupEmailStartNowButton />
    </div>
  )
}

const SetupEmailComponentPending = () => {
  return (
    <div
      className='h-134 flex cursor-pointer flex-col justify-center gap-4 rounded-2xl border border-[#FCAA3F] p-4 pr-8 text-black'
      style={{
        background: '#FCAA3F33'
      }}
    >
      <div className='flex flex-col gap-2'>
        <p className='text-shark-base font-bold'>Email Set Up in progress</p>
        <p className='text-shark-xs font-medium'>
          Your email setup is underway. We’ll notify you once everything is
          ready to go!
        </p>
      </div>
    </div>
  )
}

const SetupEmailStartNowButton = () => {
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(false)

  return (
    <div>
      <button
        onClick={() => setIsDialogueOpen(true)}
        className='flex w-32 transform transition-all duration-300 ease-in-out hover:scale-105'
      >
        <p className='mr-2 text-shark-xs font-bold'>Start Now</p>
        <ArrowRight size={16} color='white' />
      </button>
      <Dialog open={isDialogueOpen} onOpenChange={setIsDialogueOpen}>
        <SetupEmailStartNowDialogContent
          setIsDialogueOpen={setIsDialogueOpen}
          onClickStepTwoNextBtn={() => setIsDialogueOpen(false)}
        />
      </Dialog>
    </div>
  )
}

const SetupEmailStartNowDialogContent = ({
  setIsDialogueOpen,
  onClickStepTwoNextBtn
}: {
  setIsDialogueOpen: (open: boolean) => void
  onClickStepTwoNextBtn: () => void
}) => {
  const [currentStep, setCurrentStep] = useState<SetupEmailStartNowDialogSteps>(
    SetupEmailStartNowDialogSteps.StepOne
  )

  const onClickStepOneNextBtn = async (formData: EmailSetupFormValuesTypes) => {
    try {
      const organization = await getCurrentOrganization()

      const response = await fetch('/api/email/addDomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          organizationId: organization.id
        })
      })

      if (!response.ok) {
        const { message } = await response.json()
        showCustomToast(
          'Error',
          message || 'Something went wrong!',
          'error',
          5000
        )
        throw new Error('Failed to post dns records')
      }

      showCustomToast('Success', 'Saved!', 'success', 2000)

      setCurrentStep(SetupEmailStartNowDialogSteps.StepTwo)
    } catch (error) {
      console.error('Error while fetching dns records:', error)
    }
  }

  return (
    <DialogContent
      hideCloseBtn={true}
      className='flex max-w-xl flex-col gap-6 border-4 px-5 py-4'
    >
      <DialogHeader>
        <div className='width-full flex justify-between'>
          <button
            onClick={() => {
              setIsDialogueOpen(false)
            }}
            className='flex items-center gap-2 text-[#0062F1] hover:cursor-pointer'
          >
            <ArrowLeft size={20} color='#0062F1' />
            <p className='text-md font-bold'>Back</p>
          </button>
        </div>
      </DialogHeader>
      {currentStep === SetupEmailStartNowDialogSteps.StepOne && (
        <SetupEmailDialogFirstStep
          onClickStepOneNextBtn={onClickStepOneNextBtn}
        />
      )}
      {currentStep === SetupEmailStartNowDialogSteps.StepTwo && (
        <SetupEmailDialogSecondStep
          onClickStepTwoNextBtn={onClickStepTwoNextBtn}
        />
      )}
    </DialogContent>
  )
}

export enum SetupEmailStartNowDialogSteps {
  StepOne = 1,
  StepTwo = 2
}

export default SetupEmailCard
