'use client'

import { useState } from 'react'
import { ConfigType } from '@/types'
import { Cpu, I3Dcube, InfoCircle, MoneySend } from 'iconsax-react'
import { Boxes, Instagram, TrendingUp } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import useFormStore from '@/lib/stores/useFormStore'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

const YourGoalsStep = ({
  sectors,
  onBoardingData,
  setOnboardingData,
  configuration
}: {
  sectors: { value: string; label: string }[]
  onBoardingData: any
  setOnboardingData: any
  configuration: {
    preferredSectors: ConfigType[]
    preferredPartnerships: ConfigType[]
  }
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { nextStep, setStep } = useFormStore()
  const [selectedSectors, setSelectedSectors] = useState<
    Record<string, string>
  >(onBoardingData.goalsStep.sectors)

  const [selectedPartnershipTypes, setSelectedPartnershipTypes] = useState<
    string[]
  >(onBoardingData.goalsStep.partnerTypes)
  type Error = {
    preferredSector?: {
      message: string
    }
    preferredPartnershipType?: {
      message: string
    }
  }

  const partnershipType = [
    {
      logo: <I3Dcube size={28} />,
      label: 'Strategic',
      value: 'A'
    },
    {
      logo: <Cpu size={28} />,
      label: 'Technology',
      value: 'B'
    },
    {
      logo: <TrendingUp className=' size-7' />,
      label: 'Marketing',
      value: 'C'
    },
    {
      logo: <MoneySend className=' size-7 ' />,
      label: 'Sales',
      value: 'F'
    },
    {
      logo: <Boxes className=' size-7 ' />,
      label: 'Brand licensing',
      value: 'E'
    },
    {
      logo: <Instagram className=' size-7' />,
      label: 'Social channels',
      value: 'G'
    },
    {
      logo: <I3Dcube className=' size-7' />,
      label: 'Community',
      value: 'D'
    }
  ]

  const { control } = useFormContext()

  return (
    <div className='mb-6 '>
      <div>
        <h1 className='text-shark-xl font-bold text-text-100'>
          What are you looking for?
        </h1>
        <p className='mt-1 text-shark-sm text-text-60'>
          Let us know your goals so we can match you with the right
          opportunities.
        </p>
      </div>
      <div className='hide-scrollbar mt-6 flex flex-col gap-6 overflow-y-auto'>
        <FormField
          control={control}
          name='step3.preferredSectors'
          rules={{ required: 'Select at least one sector' }}
          render={({ field, fieldState: { error } }) => (
            <FormItem className=''>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger className='h-14 w-full border-none focus:border-none focus:ring-0'>
                    <div className='relative flex h-12  w-full items-center rounded-lg border p-2'>
                      {field.value?.length > 0 ? (
                        <p className='w-full text-left text-sm capitalize'>
                          {field.value.length > 7
                            ? `${field.value
                                .slice(0, 7)
                                .map((item: string) => item.toLowerCase())
                                .join(', ')}...`
                            : field.value
                                .map((item: string) => item.toLowerCase())
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

                  <DropdownMenuContent>
                    <ScrollArea className='h-72 w-60 rounded-md border'>
                      {sectors.map((sector, idx) => (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={field.value?.includes(sector.label)}
                          id={sector.value}
                          onClick={(e: any) => {
                            e.preventDefault()
                            const updatedSectors = field.value || []
                            if (updatedSectors.includes(sector.label)) {
                              field.onChange(
                                updatedSectors.filter(
                                  (value: any) => value !== sector.label
                                )
                              )
                            } else {
                              field.onChange([...updatedSectors, sector.label])
                            }
                          }}
                        >
                          {sector.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              {error && (
                <FormMessage className='text-xs text-red-600'>
                  {error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='step3.preferredPartnershipTypes'
          rules={{ required: 'Select at least one partnership type' }}
          render={({ field, fieldState: { error } }) => (
            <FormItem className='space-y-4'>
              <FormLabel className='flex items-center gap-1 text-shark-base text-text-100'>
                Preferred Partnership Types <InfoCircle size={16} />
              </FormLabel>

              <FormControl>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                  {configuration?.preferredPartnerships.map((type, idx) => {
                    const logo = partnershipType.find(
                      (item) => item.value === type.key
                    )?.logo

                    const isSelected = field.value?.includes(type.value)

                    return (
                      <Label
                        key={idx}
                        className={cn(
                          'flex items-center justify-between rounded-lg border-[0.5px] border-text-40 bg-white p-4 text-sm font-medium capitalize text-text-100',
                          isSelected
                            ? 'border border-primary-light-blue bg-shark-blue-50 text-primary-light-blue'
                            : 'border-text-40'
                        )}
                      >
                        <div
                          className='flex items-center gap-3 text-shark-base font-medium'
                          onClick={() => {
                            const valueArray = field.value || []
                            if (valueArray.includes(type.value)) {
                              field.onChange(
                                valueArray.filter(
                                  (el: any) => el !== type.value
                                )
                              )
                            } else {
                              field.onChange([...valueArray, type.value])
                            }
                          }}
                        >
                          {logo}
                          {type.value.toLowerCase()}
                        </div>

                        <Checkbox
                          checked={isSelected}
                          // onCheckedChange={(checked) => {
                          //   const valueArray = field.value || []
                          //   if (checked) {
                          //     field.onChange([...valueArray, type.id])
                          //   } else {
                          //     field.onChange(
                          //       valueArray.filter(
                          //         (value: any) => value !== type.id
                          //       )
                          //     )
                          //   }
                          // }}

                          onCheckedChange={() => {
                            const valueArray = field.value || []
                            if (valueArray.includes(type.value)) {
                              field.onChange(
                                valueArray.filter(
                                  (el: any) => el !== type.value
                                )
                              )
                            } else {
                              field.onChange([...valueArray, type.value])
                            }
                          }}
                        />
                      </Label>
                    )
                  })}
                </div>
              </FormControl>

              {error && (
                <FormMessage className='text-xs text-red-600'>
                  {error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default YourGoalsStep
