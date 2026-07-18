'use client'

import { useState } from 'react'
import { InfoCircle } from 'iconsax-react'
import { useFormContext } from 'react-hook-form'

import { getExistingOrganizations } from '@/lib/actions/onboarding'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { showCustomToast } from '@/components/custom-toast'

import AutofillModal from './autofill-modal'
import SuggestionInput from './company-name-input'

const StartupDetailsStep = ({
  sectors,
  setPayment
}: {
  sectors: {
    value: string
    label: string
  }[]
  onBoardingData: any
  setOnboardingData: any
  setPayment?: any
}) => {
  const { control, getValues, setValue } = useFormContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const [enableManualInput, setEnableManualInput] = useState<boolean>(false)

  const handleConfirm = async () => {
    setEnableManualInput(false)
    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (key === 'isAgency') {
        if (setPayment) {
          setPayment(value)
        }
      }
      if (key === 'sector') {
        const matchedSector = sectors.find(
          (s) => s.label.toLowerCase() === value.toLowerCase()
        )
        const sector = matchedSector ? matchedSector.value : 'R'

        setValue('step2.sector', sector, {
          shouldValidate: true
        })
      } else {
        setValue(`step2.${key}`, value, { shouldValidate: true })
      }
    })

    const websiteUrl = getValues('step2.website')
    const extractDomain = (url: string) => {
      const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i
      const match = url.match(regex)
      return match ? match[1].split('.')[0] : null
    }

    const legalName = extractDomain(websiteUrl)
    const response = await getExistingOrganizations(legalName!)
    // Check if the response includes a matching organization name
    const isExistingOrganization = response.some(
      (org: { organizationName: string }) =>
        org.organizationName.toLowerCase() === legalName?.toLowerCase()
    )

    // Check if the legalName matches any existing suggestions or API response
    if (!isExistingOrganization) {
      setValue('step2.legalName', legalName, { shouldValidate: true })
    } else {
      showCustomToast(
        'Warning',
        'Name matches an existing organization. Select it from dropdown.',
        'error',
        5000
      )
    }

    setOpen(false)
  }

  const handleAutofill = async (e: React.MouseEvent) => {
    e.preventDefault()
    const websiteUrl = getValues('step2.website').replace(/\/$/, '')

    if (websiteUrl === '')
      return showCustomToast('Warning', 'Enter a valid URL', 'error', 5000)

    setLoading(true)

    try {
      const res = await fetch(`/api/onboarding-autofill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site: websiteUrl.startsWith('https://')
            ? websiteUrl
            : `https://${websiteUrl}`
        })
      })
      const data = await res.json()

      if (res.status === 200) {
        setData(data)
        setOpen(true)
      }
    } catch (error) {
      console.log(error)
      showCustomToast(
        'Error',
        'We are facing some error try putting manually.',
        'error',
        5000
      )
      setEnableManualInput(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mb-6'>
      <AutofillModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        data={data}
      />

      <div>
        <h1 className='text-shark-xl font-bold text-text-100'>
          Your Company Details
        </h1>
        <p className='mt-1 text-shark-sm text-text-60'>
          Tell us about your company to help us better understand your
          background and needs for partnerships.
        </p>
      </div>
      <div className='hide-scrollbar  mt-6 flex flex-col gap-6'>
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
                    placeholder='Enter your name'
                    {...field}
                    type='url'
                    className='font-base  bg-transparent leading-normal text-text-100'
                  />

                  {/* <Button
                    className='m-0 w-fit bg-white p-0 text-shark-base font-medium text-primary hover:bg-transparent hover:text-primary-light-blue'
                    onClick={handleAutofill}
                    disabled={loading}
                    loading={loading}
                  >
                    {loading ? (
                      'Loading...'
                    ) : (
                      <>
                        {' '}
                        <svg
                          width='20'
                          height='22'
                          viewBox='0 0 20 22'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M7.10613 3.448C7.70413 1.698 10.1221 1.645 10.8311 3.289L10.8911 3.449L11.6981 5.809C11.8831 6.35023 12.1819 6.84551 12.5746 7.26142C12.9672 7.67734 13.4444 8.00421 13.9741 8.22L14.1911 8.301L16.5511 9.107C18.3011 9.705 18.3541 12.123 16.7111 12.832L16.5511 12.892L14.1911 13.699C13.6497 13.8838 13.1542 14.1826 12.7381 14.5753C12.3221 14.9679 11.995 15.4452 11.7791 15.975L11.6981 16.191L10.8921 18.552C10.2941 20.302 7.87613 20.355 7.16813 18.712L7.10613 18.552L6.30013 16.192C6.11531 15.6506 5.8165 15.1551 5.42387 14.739C5.03124 14.3229 4.55392 13.9959 4.02413 13.78L3.80813 13.699L1.44813 12.893C-0.302872 12.295 -0.355872 9.877 1.28813 9.169L1.44813 9.107L3.80813 8.301C4.34936 8.11606 4.84464 7.81719 5.26055 7.42457C5.67646 7.03195 6.00334 6.55469 6.21913 6.025L6.30013 5.809L7.10613 3.448ZM8.99913 4.094L8.19313 6.454C7.91152 7.2793 7.4534 8.0333 6.85066 8.6635C6.24793 9.29369 5.51507 9.78493 4.70313 10.103L4.45313 10.194L2.09313 11L4.45313 11.806C5.27843 12.0876 6.03243 12.5457 6.66262 13.1485C7.29282 13.7512 7.78405 14.4841 8.10213 15.296L8.19313 15.546L8.99913 17.906L9.80513 15.546C10.0867 14.7207 10.5449 13.9667 11.1476 13.3365C11.7503 12.7063 12.4832 12.2151 13.2951 11.897L13.5451 11.807L15.9051 11L13.5451 10.194C12.7198 9.91239 11.9658 9.45427 11.3356 8.85154C10.7054 8.2488 10.2142 7.51595 9.89613 6.704L9.80613 6.454L8.99913 4.094ZM16.9991 1.80688e-07C17.1862 -2.35972e-07 17.3695 0.0524783 17.5283 0.151472C17.687 0.250465 17.8148 0.392003 17.8971 0.56L17.9451 0.677L18.2951 1.703L19.3221 2.053C19.5096 2.1167 19.674 2.23462 19.7944 2.39182C19.9148 2.54902 19.9858 2.73842 19.9984 2.93602C20.011 3.13362 19.9647 3.33053 19.8653 3.50179C19.766 3.67304 19.618 3.81094 19.4401 3.898L19.3221 3.946L18.2961 4.296L17.9461 5.323C17.8823 5.51043 17.7643 5.6747 17.6071 5.79499C17.4498 5.91529 17.2604 5.98619 17.0628 5.99872C16.8652 6.01125 16.6683 5.96484 16.4971 5.86538C16.3259 5.76591 16.1881 5.61787 16.1011 5.44L16.0531 5.323L15.7031 4.297L14.6761 3.947C14.4886 3.8833 14.3243 3.76538 14.2039 3.60819C14.0835 3.45099 14.0125 3.26158 13.9999 3.06398C13.9872 2.86638 14.0335 2.66947 14.1329 2.49821C14.2323 2.32696 14.3803 2.18906 14.5581 2.102L14.6761 2.054L15.7021 1.704L16.0521 0.677C16.1196 0.479426 16.2471 0.307909 16.417 0.186499C16.5868 0.065089 16.7904 -0.000125281 16.9991 1.80688e-07Z'
                            fill='#0062F1'
                          />
                        </svg>
                        <span className='ml-2.5'>
                          Autofill Details Using AI
                        </span>
                      </>
                    )}
                  </Button> */}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=' flex flex-col gap-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <FormField
              control={control}
              name='step2.legalName'
              rules={{ required: 'Company Name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <SuggestionInput
                        register={field}
                        setValue={setValue}
                        enableManualInput={enableManualInput}
                      />
                      {/* <Input
                      placeholder='Enter your company name'
                      {...field}
                      className='font-base  max-w-md bg-transparent leading-normal text-text-100'
                    /> */}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='step2.sector'
              render={({ field }) => (
                <FormItem>
                  <FormControl className='relative max-w-md'>
                    <>
                      <Select
                        name='step2.sector'
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                        disabled={enableManualInput}
                      >
                        <SelectTrigger
                          label='Sector'
                          className='rounded-lg bg-transparent text-text-100 placeholder:text-text-60'
                        >
                          <SelectValue
                            placeholder='Select sector'
                            className='text-text-100 placeholder:text-text-100'
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((sector: any) => (
                            <SelectItem
                              key={sector.value}
                              value={sector.value}
                              id={sector.label}
                              className='lowercase'
                            >
                              <p className='lowercase first-letter:uppercase'>
                                {sector.label}
                              </p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name='step2.briefDescription'
            rules={{
              required: 'One line description is required',
              minLength: { value: 20, message: 'Min length is 20' }
            }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OutlinedInput
                    label='One line description'
                    placeholder='ex. Zomato–Food delivery app'
                    {...field}
                    className='font-base   bg-transparent leading-normal text-text-100'
                    disabled={enableManualInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='step2.companyType'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel className='flex items-center gap-1 text-shark-base  text-text-100'>
                  Market Segment <InfoCircle size={16} />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='grid grid-cols-1 gap-3 md:grid-cols-3'
                    disabled={enableManualInput}
                  >
                    <FormItem className='  '>
                      <FormControl>
                        <Label
                          htmlFor='B2B'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              B2B
                            </span>
                          </div>
                          <RadioGroupItem
                            value='B2B'
                            id='B2B'
                            className='peer '
                          />
                        </Label>
                      </FormControl>
                    </FormItem>
                    <FormItem className=''>
                      <FormControl>
                        <Label
                          htmlFor='B2C'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              B2C
                            </span>
                          </div>
                          <RadioGroupItem
                            value='B2C'
                            id='B2C'
                            className='peer '
                          />
                        </Label>
                      </FormControl>
                    </FormItem>
                    <FormItem className=''>
                      <FormControl>
                        <Label
                          htmlFor='B2B2C'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              B2B2C
                            </span>
                          </div>
                          <RadioGroupItem
                            value='B2B2C'
                            id='B2B2C'
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
            name='step2.onboardedPartners'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel className='flex items-center gap-1 text-shark-base  text-text-100'>
                  How many current partners do you have?{' '}
                  <InfoCircle size={16} />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='grid grid-cols-1 gap-3 md:grid-cols-3'
                    disabled={enableManualInput}
                  >
                    <FormItem className='  '>
                      <FormControl>
                        <Label
                          htmlFor='ZERO'
                          className='group flex cursor-pointer items-center  justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              0
                            </span>
                          </div>
                          <RadioGroupItem
                            value='ZERO'
                            id='ZERO'
                            className='peer '
                          />
                        </Label>
                      </FormControl>
                    </FormItem>
                    <FormItem className=''>
                      <FormControl>
                        <Label
                          htmlFor='LESS_THAN_FIVE'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              {'<5'}
                            </span>
                          </div>
                          <RadioGroupItem
                            value='LESS_THAN_FIVE'
                            id='LESS_THAN_FIVE'
                            className='peer '
                          />
                        </Label>
                      </FormControl>
                    </FormItem>
                    <FormItem className=''>
                      <FormControl>
                        <Label
                          htmlFor='BETWEEN_5_AND_20'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              5-20
                            </span>
                          </div>
                          <RadioGroupItem
                            value='BETWEEN_5_AND_20'
                            id='BETWEEN_5_AND_20'
                            className='peer '
                          />
                        </Label>
                      </FormControl>
                    </FormItem>

                    <FormItem className=''>
                      <FormControl>
                        <Label
                          htmlFor='MORE_THAN_20'
                          className='group flex cursor-pointer items-center justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                        >
                          <div className='flex flex-1 gap-3 font-medium'>
                            <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                              {'>20'}
                            </span>
                          </div>
                          <RadioGroupItem
                            value='MORE_THAN_20'
                            id='MORE_THAN_20'
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

          {/* <FormField
            control={control}
            name='step2.companyType'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-bold leading-normal text-text-70'>
                  Market segment
                </FormLabel>

                <FormControl className='max-w-md'>
                  <Select
                    name='step2.companyType'
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      // setValue('step2.companyType', value, { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger
                      label=''
                      className='font-base max-w-md  rounded-md bg-transparent leading-normal text-text-100  placeholder:text-text-100'
                    >
                      <SelectValue
                        placeholder='Select segment'
                        className='text-text-100 placeholder:text-text-100'
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='B2B'>B2B</SelectItem>
                      <SelectItem value='B2C'>B2C</SelectItem>
                      <SelectItem value='B2B2C'>B2B2C</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* 
          <FormField
            control={control}
            name='step2.about'
            rules={{
              required: 'A brief description is required',
              maxLength: {
                value: 500,
                message: 'Maximum length is 500 characters'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base font-bold leading-normal text-text-70'>
                  Brief description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=''
                    {...field}
                    className='font-base  max-w-md bg-transparent leading-normal text-text-100'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default StartupDetailsStep
