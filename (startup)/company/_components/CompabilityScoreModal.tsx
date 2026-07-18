'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'
import { CloseCircle } from 'iconsax-react'

import { configSectors } from '@/config/data'
import { postPublicProfileEmail } from '@/lib/actions/public-profile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { showCustomToast } from '@/components/custom-toast'

export default function PartnershipDialog({
  setOpen,
  email,
  setEmailAlert,
  setEmail
}: {
  setOpen: (open: boolean) => void
  email: string
  setEmailAlert: (open: boolean) => void
  setEmail: (email: string) => void
}) {
  const [selectedSectors, setSelectedSectors] = useState<any[]>([])
  const [partnershipGoal, setPartnershipGoal] = useState<string>('')
  const [crossBorderPreference, setCrossBorderPreference] =
    useState<string>('Yes')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const values = {
      sectors: selectedSectors.map((item: any) => item.key),
      partnershipGoal,
      crossBorderPreference,
      email
    }

    try {
      const data = await postPublicProfileEmail(values)

      setOpen(false)
      showCustomToast(
        'Success',
        'Your partnership goals have been successfully submitted.',
        'success',
        5000
      )
      setEmailAlert(true)
    } catch (error) {
      console.error('Error submitting partnership goals:')
      showCustomToast(
        'Error',
        'Failed to submit partnership goals. Please try again.',
        'error',
        5000
      )
    } finally {
      setLoading(false)
      setEmail('')
    }
  }

  return (
    <>
      <Dialog defaultOpen>
        <DialogContent className='w-[415px]' hideCloseBtn>
          <DialogHeader>
            <DialogTitle className='text-shark-xl font-semibold text-text-100'>
              What are you looking for?
            </DialogTitle>
            <DialogDescription className='text-shark-80  max-w-sm text-shark-base'>
              Let us know your goals so we can match you with the right
              opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4 flex flex-col gap-6'>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className='h-14 w-full border-none focus:border-none focus:ring-0'>
                  <div className='relative flex h-12  w-full items-center rounded-lg border p-2'>
                    {selectedSectors.length > 0 ? (
                      <p className='w-full text-left text-sm capitalize'>
                        {selectedSectors.length > 7
                          ? `${selectedSectors
                              .slice(0, 7)
                              .map((item: any) => item?.key?.toLowerCase())
                              .join(', ')}...`
                          : selectedSectors
                              .map((item: any) => item?.key?.toLowerCase())
                              .join(', ')}
                      </p>
                    ) : (
                      <p className='w-full text-left text-sm text-gray-500'>
                        Select your preferred sectors...
                      </p>
                    )}
                    <label
                      className={cn(
                        'pointer-events-none absolute left-2 top-3 -translate-y-5 bg-background px-1 text-xs text-text-60 transition-all duration-200'
                      )}
                    >
                      I am looking to partner in sectors
                    </label>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='z-[9999]'>
                  <ScrollArea className='relative h-64 w-60 rounded-md border bg-white'>
                    {configSectors.map((sector: any, idx) => (
                      <DropdownMenuCheckboxItem
                        key={idx}
                        checked={selectedSectors.some(
                          (selected) => selected.key === sector.key
                        )}
                        id={sector.key}
                        onClick={(e: any) => {
                          e.preventDefault()

                          // Check if the sector already exists in the selected array
                          const updatedSectors = selectedSectors.some(
                            (selected) => selected.key === sector.key
                          )
                            ? selectedSectors.filter(
                                (selected) => selected.key !== sector.key
                              ) // Remove if exists
                            : [...selectedSectors, sector] // Add if not exists

                          setSelectedSectors(updatedSectors) // Update state
                        }}
                      >
                        {sector.key}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='relative z-10'>
              <Select onValueChange={setPartnershipGoal}>
                <SelectTrigger
                  label={'Choose your partnership goal'}
                  className='rounded-lg'
                >
                  <SelectValue placeholder='Choose one' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Solution Integration'>
                    Solution Integration
                  </SelectItem>
                  <SelectItem value='Increase awareness via Co-Marketing'>
                    Increase awareness via Co-Marketing
                  </SelectItem>
                  <SelectItem value='Increase Sales Channels'>
                    Increase Sales Channels
                  </SelectItem>
                  <SelectItem value='Looking for Referral Partners'>
                    Looking for Referral Partners
                  </SelectItem>
                  <SelectItem value='All the above'>All the above</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='relative z-10'>
              <Select onValueChange={setCrossBorderPreference}>
                <SelectTrigger
                  label={'Do you prefer Cross Border Partnerships?'}
                  className='rounded-lg'
                >
                  <SelectValue placeholder='Yes' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='yes'>Yes</SelectItem>
                  <SelectItem value='no'>No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-4 top-4'
            aria-label='Close'
            onClick={() => setOpen(false)}
          >
            <CloseCircle size={24} />
          </Button>
          <div className='grid gap-6 py-4'>
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700'
              onClick={handleSubmit}
              loading={loading}
            >
              Get Compatibility Score on your Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
