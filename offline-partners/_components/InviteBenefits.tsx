import React, { useEffect, useState } from 'react'
import { useSendInvite } from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { ArrowLeft } from 'iconsax-react'
import { ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay
} from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'
import { RightEnvelopIcon } from '@/components/icons/icons'

import Step1 from './steps/step1'
import Step2 from './steps/step2'
import Step3 from './steps/step3'

type Recipient = { name: string; email: string }

const InviteBenefits: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  partnerName?: string
  partnerEmail?: string
}> = ({ open, setOpen, partnerName, partnerEmail }) => {
  const { organization: currentOrg } = useSelector(
    (state: RootState) => state.currentOrg
  )
  const orgName = currentOrg?.name ?? 'us'
  const orgId = currentOrg?.id

  const { mutateAsync: sendInvite, isPending: isSendingInvite } =
    useSendInvite()

  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [policyChecked, setPolicyChecked] = useState(false)

  // Initialize recipients when partner context is provided
  useEffect(() => {
    if (open && partnerName?.trim() && partnerEmail?.trim()) {
      setRecipients([{ name: partnerName.trim(), email: partnerEmail.trim() }])
    } else if (open) {
      setRecipients([])
    }
    if (!open) setPolicyChecked(false)
  }, [open, partnerName, partnerEmail])

  const defaultSteps = [
    { id: 'step-1', step: 1, isActive: true, isVisited: false },
    { id: 'step-2', step: 2, isActive: false, isVisited: false },
    { id: 'step-3', step: 3, isActive: false, isVisited: false }
  ]

  const [steps, setSteps] = React.useState(defaultSteps)
  const activeStep = steps.find((step) => step.isActive)

  const resetState = () => {
    setSteps(defaultSteps)
    setRecipients([])
    setPolicyChecked(false)
  }

  const handleSentInvite = async () => {
    const invites = recipients
      .filter((r) => r.email?.trim())
      .map((r) => ({ email: r.email.trim(), name: r.name?.trim() || '' }))
    if (invites.length === 0) {
      showCustomToast(
        'Error',
        'Please add at least one recipient with an email address.',
        'error',
        5000
      )
      return
    }
    if (!orgId) {
      showCustomToast(
        'Error',
        'Organization context is missing. Please try again.',
        'error',
        5000
      )
      return
    }
    try {
      await sendInvite({
        organizationId: orgId,
        invites
      })
      showCustomToast('Success', 'Invited', 'success', 3000)
      resetState()
      setOpen(false)
    } catch (error) {
      console.error('Failed to send invite:', error)
    }
  }

  const goToPreviousStep = () => {
    setSteps((prevSteps) => {
      const currentIndex = prevSteps.findIndex((s) => s.isActive)
      if (currentIndex <= 0) return prevSteps // already at first step

      return prevSteps.map((step, index) => {
        if (index === currentIndex) {
          return { ...step, isActive: false }
        }
        if (index === currentIndex - 1) {
          return { ...step, isActive: true } // go back
        }
        return step
      })
    })
  }

  const renderFooter = () => {
    switch (activeStep?.step) {
      case 1:
        return (
          <Button
            variant='primary'
            className='flex items-center gap-2'
            onClick={goToNextStep}
          >
            Send
            <ArrowRight size={18} />
          </Button>
        )

      case 2:
        return (
          <div className='flex w-full items-center justify-between'>
            <Button variant='primary'>Copy Link</Button>
            <div className='flex gap-2'>
              <Button variant='primary' onClick={goToPreviousStep}>
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button
                variant='primary'
                className='flex items-center gap-2'
                onClick={goToNextStep}
              >
                Next <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex w-full items-center justify-end gap-6 border-t pt-4'>
            <Button variant='primary' onClick={goToPreviousStep}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              variant='primary'
              className='flex items-center gap-2'
              onClick={handleSentInvite}
              disabled={
                isSendingInvite || recipients.length === 0 || !policyChecked
              }
            >
              {isSendingInvite ? 'Sending...' : 'Sent Invite'}{' '}
              <RightEnvelopIcon color='#fff' />
            </Button>
          </div>
        )

      default:
        return (
          <Button variant='primary' onClick={() => setOpen(false)}>
            Close
          </Button>
        )
    }
  }

  const StepIndicator = ({
    steps,
    onStepClick
  }: {
    steps: any[]
    onStepClick: (index: number) => void
  }) => {
    return (
      <div className='flex w-full gap-1'>
        {steps.map((step, idx) => (
          <div
            key={step.id}
            onClick={() =>
              (step.isVisited || step.isActive) && onStepClick(idx)
            } // ✅ only clickable if visited/active
            className={cn(
              'h-2 w-full cursor-pointer rounded-lg border',
              idx === 0 ? 'rounded-l-md' : '',
              idx === steps.length - 1 ? 'rounded-r-md' : '',
              step.isVisited || step.isActive
                ? 'bg-[#3E50F7]'
                : 'bg-[#E5EFFE33]'
            )}
          />
        ))}
      </div>
    )
  }

  const goToNextStep = () => {
    setSteps((prevSteps) => {
      const currentIndex = prevSteps.findIndex((s) => s.isActive)
      if (currentIndex === -1 || currentIndex === prevSteps.length - 1)
        return prevSteps

      return prevSteps.map((step, index) => {
        if (index === currentIndex) {
          return { ...step, isActive: false, isVisited: true }
        }
        if (index === currentIndex + 1) {
          return { ...step, isActive: true }
        }
        return step
      })
    })
  }
  const handleStepClick = (index: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step, idx) => {
        if (idx === index) {
          return { ...step, isActive: true }
        }
        return { ...step, isActive: false }
      })
    )
  }

  const stepTitles: Record<number, string> = {
    1: 'Invite Benefits',
    2: 'Compose Invite',
    3: 'Review & Send'
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetState()
        setOpen(nextOpen)
      }}
    >
      <DialogContent className='flex max-h-[95vh] max-w-lg flex-col'>
        {/* Header (fixed at top) */}
        <DialogHeader className='sticky top-0 z-10 mt-4 bg-white px-4'>
          <div className='flex justify-between'>
            <p className='pb-2 text-lg font-bold'>
              {stepTitles[activeStep?.step ?? 0]}
            </p>
            <p className='text-sm text-[#ADB5BD]'>
              Step {activeStep?.step} of {steps.length}
            </p>
          </div>
          <div className='space-y-2'>
            <StepIndicator steps={steps} onStepClick={handleStepClick} />
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 overflow-y-auto px-4'>
          <div className='mt-2'>
            {activeStep?.step === 1 && <Step1 />}
            {activeStep?.step === 2 && (
              <Step2
                partnerName={partnerName}
                partnerEmail={partnerEmail}
                orgName={orgName}
                recipients={recipients}
                setRecipients={setRecipients}
              />
            )}
            {activeStep?.step === 3 && (
              <Step3
                partnerName={partnerName}
                partnerEmail={partnerEmail}
                orgName={orgName}
                recipients={recipients}
                policyChecked={policyChecked}
                onCheckedChange={setPolicyChecked}
              />
            )}
          </div>
        </div>

        {/* Footer (fixed at bottom) */}
        <DialogFooter className='mt-auto border-t bg-white px-4 py-3'>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteBenefits
