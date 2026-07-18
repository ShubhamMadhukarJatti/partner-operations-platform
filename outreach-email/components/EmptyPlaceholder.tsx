// components/EmptyEmailsPage.tsx
'use client'

import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import EmptyPlaceholder from '../../../../../../public/Emplty-placeholder.svg'

type Props = {
  onSend?: () => void
  message?: {
    title?: string
    subtitle?: string
    button?: string
  }
}

export default function EmptyEmailsPage({
  onSend,
  message = {
    title: 'No Emails!',
    subtitle:
      "It looks like you haven't sent any emails yet. When you start sending emails, all your emails will appear here!",
    button: 'Send your first email'
  }
}: Props) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#F0F2F2] px-4'>
      <div className='w-full max-w-xl text-center'>
        <div className='mx-auto mb-6 h-[160px] w-[160px]'>
          <Image src={EmptyPlaceholder} alt='img' height={160} width={160} />
        </div>

        {/* Title */}
        <h2 className='mb-2 text-lg font-bold text-gray-900'>
          {message.title}
        </h2>

        {/* Subtitle */}
        <div className='flex justify-center'>
          <p className='mb-6 w-[400px] text-center text-sm text-gray-500'>
            {message.subtitle}
          </p>
        </div>

        {/* Button */}
        <div className='flex justify-center'>
          <Button
            variant='primary'
            onClick={onSend}
            className='inline-flex items-center gap-2'
            aria-label={message.button}
          >
            <span>{message.button}</span>

            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='17'
              height='18'
              viewBox='0 0 17 18'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M14.0818 0.935123C14.4486 0.802307 14.8457 0.77677 15.2265 0.861504C15.6073 0.946239 15.9561 1.13773 16.232 1.41355C16.5079 1.68937 16.6994 2.03809 16.7842 2.41884C16.8689 2.79959 16.8434 3.1966 16.7105 3.56336L12.5364 16.0677C12.4266 16.4011 12.233 16.7007 11.974 16.9377C11.7151 17.1747 11.3996 17.3412 11.0577 17.4211C10.7163 17.5047 10.3591 17.4979 10.0211 17.4015C9.6831 17.3051 9.37606 17.1223 9.13019 16.8712L6.97169 14.7274L4.72152 15.8892C4.60671 15.9483 4.47849 15.9765 4.34946 15.9711C4.22043 15.9657 4.09504 15.9267 3.98561 15.8582C3.87618 15.7896 3.78649 15.6937 3.72535 15.58C3.66422 15.4663 3.63374 15.3386 3.63691 15.2095L3.73216 11.4814L0.761696 8.51036C0.524633 8.27413 0.349865 7.98281 0.253042 7.66249C0.156218 7.34216 0.140362 7.00283 0.206892 6.67487C0.273037 6.31741 0.433185 5.984 0.67088 5.70891C0.908575 5.43382 1.21524 5.22696 1.55938 5.1096L1.56533 5.10721L14.0818 0.935123ZM14.9032 2.31233C14.7893 2.28688 14.6702 2.2977 14.5627 2.34328L2.03798 6.51775C1.94347 6.55026 1.8594 6.60747 1.79449 6.68346C1.72959 6.75945 1.68622 6.85143 1.66891 6.94984L1.66534 6.9665C1.64687 7.05397 1.6506 7.14467 1.67618 7.23033C1.70176 7.31599 1.74837 7.39388 1.81178 7.45692L4.13338 9.77567L11.6697 4.80368C11.7943 4.72204 11.945 4.69007 12.092 4.7141C12.239 4.73813 12.3717 4.81641 12.4638 4.93347C12.5559 5.05054 12.6008 5.19788 12.5895 5.34641C12.5783 5.49494 12.5118 5.63385 12.4031 5.73571L5.19656 12.4777L5.15727 13.9894L6.77048 13.1562C6.91034 13.0836 7.06962 13.0573 7.22538 13.0811C7.38114 13.1048 7.52535 13.1774 7.63722 13.2883L10.1826 15.8201L10.1898 15.8273C10.2552 15.895 10.3372 15.9443 10.4277 15.9702C10.5183 15.9961 10.614 15.9977 10.7053 15.9749L10.7148 15.9725C10.809 15.951 10.896 15.9055 10.9673 15.8404C11.0387 15.7753 11.092 15.6929 11.122 15.6011V15.5987L15.3021 3.08128L15.3104 3.05747C15.339 2.98204 15.3508 2.90133 15.3453 2.82088C15.3397 2.74043 15.3168 2.66213 15.2781 2.59136C15.2394 2.52059 15.1859 2.45901 15.1212 2.41085C15.0565 2.36269 14.9821 2.32908 14.9032 2.31233Z'
                fill='white'
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
