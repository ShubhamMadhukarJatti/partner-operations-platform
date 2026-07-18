import React from 'react'
import { IconQuestionMark } from '@tabler/icons-react'
import { InfoCircle, MoneyRecive, People, TrendUp } from 'iconsax-react'
import { Handshake, InfoIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { AiStarIconSmall, QuestionCircleMark } from '@/components/icons/icons'

const NewOnboardingForm: React.FC<{ websiteExistedError: Boolean }> = ({
  websiteExistedError
}) => {
  const { control } = useFormContext()

  return (
    <div className='mb-6'>
      <div>
        <h1 className='fds-heading text-text-100'>Tell Us About Yourself</h1>
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
              <FormLabel className='fds-text flex items-center gap-1  text-text-100'>
                My role <InfoCircle size={16} />
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
                        className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <People
                            size={28}
                            className='fds-text [&:has(~[data-state=checked])]:text-primary-light-blue'
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
                        className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <Handshake
                            size={28}
                            className='fds-text [&:has(~[data-state=checked])]:text-primary-light-blue'
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
                        className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <TrendUp
                            size={28}
                            className='fds-text [&:has(~[data-state=checked])]:text-primary-light-blue'
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
                        className='fds-text group flex cursor-pointer items-center justify-between rounded-lg border p-4 font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                      >
                        <div className='flex flex-1 gap-3 font-medium'>
                          <MoneyRecive
                            size={28}
                            className='fds-text [&:has(~[data-state=checked])]:text-primary-light-blue'
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
        <FormField
          control={control}
          name='step2.website'
          rules={{
            required: 'Website is required',
            pattern: {
              value:
                /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*\/?$/,
              message: 'Enter a valid URL'
            }
          }}
          render={({ field }) => (
            <FormItem className=' flex-1 shrink-0'>
              <FormControl>
                <div className='flex flex-col   gap-6'>
                  <OutlinedInput
                    label='Website URL'
                    placeholder='Enter your website url'
                    {...field}
                    type='url'
                    className='font-base  bg-transparent leading-normal text-text-100'
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {websiteExistedError && (
          <div className='flex w-full gap-4 rounded-xl border border-[#FC362F] p-4 '>
            <div className='relative'>
              <div className='relative flex h-5 w-5 shrink-0 items-center justify-center '>
                <InfoIcon
                  size={20}
                  stroke='#D92D20'
                  className='absolute rotate-[180deg]'
                />
                <div className='absolute inset-0 shrink-0 animate-scalePulseBlur rounded-full border border-[#FC362F]'></div>
              </div>{' '}
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-semibold'>
                Company is already registered!
              </p>
              <p className='text-sm font-normal text-[#535862]'>
                To signing up with this company, please request an access!
              </p>
              <Button
                type='button'
                variant={'link'}
                className='mt-4 h-auto w-fit p-0 font-semibold'
              >
                Request Access
              </Button>
            </div>
          </div>
        )}

        <FormField
          control={control}
          name='step2.visibility'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between'>
              <div className='space-y-0.5'>
                <FormLabel className='text-sm text-[#2A3241]'>
                  Show my company on the marketplace
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className=''>
          <p className='flex items-center gap-2 text-sm font-semibold text-[#3E50F7]'>
            <AiStarIconSmall /> Autofill Details Using AI{' '}
            <span className='ml-2'>
              <QuestionCircleMark />
            </span>
          </p>
          <p className='mt-1 text-sm text-[#7688A8]'>
            AI will fetch data from your given website automatically to reduce
            your work
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewOnboardingForm
