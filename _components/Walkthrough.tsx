'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'

const Walkthrough: React.FC = () => {
  const [run, setRun] = useState<boolean>(false)

  useEffect(() => {
    // Check if walkthrough has been completed before
    const hasCompletedWalkthrough = localStorage.getItem(
      'walkthrough_completed'
    )

    // Run walkthrough only if it hasn't been completed
    if (!hasCompletedWalkthrough) {
      setRun(true)
    }
  }, [])

  // Define the walkthrough steps
  const steps: Step[] = [
    {
      target: '.marketplace-menu',
      content: (
        <div className='flex flex-col items-start gap-2'>
          <h4 className='text-shark-lg font-bold text-text-100'>
            Explore our marketplace
          </h4>
          <Image
            src='/walk-1.png'
            alt='walkrhough-marketplace'
            height={188}
            width={312}
          />
          <p className='text-left text-shark-sm text-text-80 '>
            Find the different partners, explore about partners with valid info
            provided in our platform, and build your partnerships
          </p>
        </div>
      ),
      placement: 'right',
      spotlightPadding: 0
    },

    {
      target: '.persona-menu',
      content: (
        <div className='flex flex-col items-start gap-2'>
          <h4 className='text-left text-shark-lg font-bold text-text-100'>
            Create customer persona’s
          </h4>
          <Image
            src='/walk-2.png'
            alt='walkrhough-marketplace'
            height={188}
            width={312}
          />
          <p className='text-left text-shark-sm text-text-80 '>
            Supercharge your business with data-driven matchmaking. Upload
            customer data or integrate your CRM to create your Ideal Customer
            Persona.
          </p>
        </div>
      ),
      placement: 'right'
    },
    {
      target: '.partner-menu',
      content: (
        <div className='flex flex-col items-start gap-2'>
          <h4 className='text-left text-shark-lg font-bold text-text-100'>
            Manage proposals online and in one space.
          </h4>
          <Image
            src='/walk-3.png'
            alt='walkrhough-marketplace'
            height={188}
            width={312}
          />
          <p className='text-left text-shark-sm text-text-80 '>
            Send more proposals and keep track of any terms update from your
            partners.
          </p>
        </div>
      ),
      placement: 'right'
    },

    {
      target: '.offline-partner-menu',
      content: (
        <div className='flex flex-col items-start gap-2'>
          <h4 className='text-shark-lg font-bold text-text-100'>
            Bring your offline partners online
          </h4>
          <Image
            src='/walk-4.png'
            alt='walkrhough-marketplace'
            height={188}
            width={312}
          />
          <p className='text-left text-shark-sm text-text-80 '>
            Bring all your partners online, send more proposals and manage
            everything online and in one space.
          </p>
        </div>
      ),
      placement: 'right'
    },
    {
      target: '.learn',
      content: (
        <div className='flex flex-col items-start gap-2'>
          <h4 className='text-shark-lg font-bold text-text-100'>
            Bring your offline partners online
          </h4>
          <Image
            src='/walk-4.png'
            alt='walkrhough-marketplace'
            height={188}
            width={312}
          />
          <p className='text-left text-shark-sm text-text-80 '>
            Bring all your partners online, send more proposals and manage
            everything online and in one space.
          </p>
        </div>
      ),
      placement: 'left'
    }
  ]

  // Handle walkthrough events (e.g., completion, skipping, etc.)
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      // Mark walkthrough as completed in local storage
      localStorage.setItem('walkthrough_completed', 'true')

      // Stop the walkthrough
      setRun(false)
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      disableScrolling
      spotlightPadding={4}
      showSkipButton={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.2)',
          primaryColor: '#185DDC', // Blue for buttons

          zIndex: 10000
        },
        spotlight: {
          borderRadius: '8px'
        },
        tooltip: {
          textAlign: 'center' // Tooltip text alignment
        },
        buttonClose: {
          backgroundColor: 'transparent', // Custom close button color
          color: 'black',
          fontSize: '14px',
          padding: '12px',
          fontWeight: 700,
          borderRadius: '8px',
          border: 'none'
        },
        buttonBack: {
          backgroundColor: 'transparent', // Custom next button color
          color: '#185DDC',
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '4px',
          lineHeight: '20px',
          fontWeight: 600,

          border: 'none'
        },

        buttonNext: {
          backgroundColor: '#185DDC', // Custom next button color
          color: '#fff',
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 600,
          lineHeight: '20px',
          border: 'none'
        }
      }}
      floaterProps={{
        hideArrow: true
      }}
    />
  )
}

export default Walkthrough
