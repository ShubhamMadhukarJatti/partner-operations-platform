import React from 'react'
import { InfoCircle, MoneyRecive, People, TrendUp } from 'iconsax-react'
import { Handshake } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const UserOnboardingForm: React.FC = () => {
  const { control } = useFormContext()

  return (
    <div>
      <div>
        <h1 className='text-shark-xl font-bold text-text-100'>
          Tell Us About Yourself
        </h1>
        <p className='mt-1 text-shark-sm text-text-60'>
          Share a few details about yourself to help us personalize your
          experience.
        </p>
      </div>
      <div className='mt-6 flex flex-col gap-6 '>
        <FormField
          control={control}
          name='step1.name'
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OutlinedInput
                  label='Full Name'
                  placeholder='Enter your name'
                  {...field}
                  className='font-base   bg-transparent leading-normal text-text-100'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='step1.roleSpecs'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel className='flex items-center gap-1 text-shark-base  text-text-100'>
                My role is <InfoCircle size={16} />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='grid grid-cols-1 gap-3 md:grid-cols-2'
                >
                  <FormItem className='  '>
                    <FormControl>
                      <Label
                        htmlFor='FOUNDING_MEMBER'
                        className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <People
                            size={28}
                            className='text-shark-base [&:has(~[data-state=checked])]:text-primary-light-blue'
                          />
                          <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                            Founding team
                          </span>
                        </div>
                        <RadioGroupItem
                          value='FOUNDING_MEMBER'
                          id='FOUNDING_MEMBER'
                          className='peer '
                        />
                      </Label>
                    </FormControl>
                  </FormItem>
                  <FormItem className='min-w-[150px]'>
                    <FormControl>
                      <Label
                        htmlFor='PARTNERSHIP_TEAM'
                        className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <Handshake
                            size={28}
                            className='text-shark-base [&:has(~[data-state=checked])]:text-primary-light-blue'
                          />
                          <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                            Partnership
                          </span>
                        </div>
                        <RadioGroupItem
                          value='PARTNERSHIP_TEAM'
                          id='PARTNERSHIP_TEAM'
                          className='peer '
                        />
                      </Label>
                    </FormControl>
                  </FormItem>
                  <FormItem className=''>
                    <FormControl>
                      <Label
                        htmlFor='MARKETING_TEAM'
                        className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <TrendUp
                            size={28}
                            className='text-shark-base [&:has(~[data-state=checked])]:text-primary-light-blue'
                          />
                          <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                            Growth
                          </span>
                        </div>
                        <RadioGroupItem
                          value='MARKETING_TEAM'
                          id='MARKETING_TEAM'
                          className='peer '
                        />
                      </Label>
                    </FormControl>
                  </FormItem>

                  <FormItem className='min-w-[150px]'>
                    <FormControl>
                      <Label
                        htmlFor='SALES_TEAM'
                        className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <MoneyRecive
                            size={28}
                            className='text-shark-base [&:has(~[data-state=checked])]:text-primary-light-blue'
                          />
                          <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                            Sales
                          </span>
                        </div>
                        <RadioGroupItem
                          value='SALES_TEAM'
                          id='SALES_TEAM'
                          className='peer '
                        />
                      </Label>
                    </FormControl>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default UserOnboardingForm
