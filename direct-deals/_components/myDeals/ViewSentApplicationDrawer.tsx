'use client'

import React from 'react'
import { useGetDealDetails } from '@/http-hooks/deals'
import { CheckIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'

import DealPreview from '../DealPreview'

const defaultData = {
  creationTimestamp: '',
  dealId: '',
  organizationId: 0,
  offerDetail: '',
  restrictedSectors: [],
  channelAllowed: [],
  quotaRemaining: '',
  geography: '',
  approvalRequired: false,
  status: '',
  organizationName: '',
  logoUrl: '',
  organizationType: '',
  organizationBrief: ''
}

interface ViewSentApplicationDrawerProps {
  open: boolean
  setOpen: (e: boolean) => void
  dealId: string
}

const ViewSentApplicationDrawer: React.FC<ViewSentApplicationDrawerProps> = ({
  open,
  setOpen,
  dealId
}) => {
  const [step, setStep] = React.useState<number>(1)
  const { data, isLoading } = useGetDealDetails(dealId)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='p-0'>
        <div>
          <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
            <div className='flex gap-2'>
              <p className='text-shark-base sm:text-xl'>Program Details</p>
            </div>
            <div className='flex sm:gap-4'>
              <DrawerClose asChild>
                <Button
                  variant='link'
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  <X size={24} color='#2A3241' />
                </Button>
              </DrawerClose>
            </div>
          </div>
          {step === 1 && data && Object.keys(data).length > 0 ? (
            <DealPreview
              data={{ ...defaultData, ...data }}
              dealPreview={false}
            />
          ) : (
            <></>
          )}
        </div>
        <DrawerFooter className='border-t border-t-[#EAECF0]'>
          <Button
            className=' decoration-none flex gap-2 text-shark-base text-[#2C9E41]'
            variant={'link'}
          >
            <CheckIcon size={16} /> Application sent
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ViewSentApplicationDrawer
