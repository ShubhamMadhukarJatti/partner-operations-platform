import React, { useState } from 'react'
import {
  useCreatePersona,
  useCreatePersonaOverlap
} from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'iconsax-react'
import { Check, ChevronDown, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { showCustomToast } from '@/components/custom-toast'

import { recordType } from '../../my-data/_components/Segment'
import { DataSource } from '../page'

type Props = {
  fileLink?: string
  csvData: any[]
  csvHeaders: string[]
  selectedMapping: Record<string, string>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataSource: DataSource
  recordType: recordType
}

const transformCsvData = (
  csvData: Record<string, string>[],
  selectedColumnName: Record<string, string>
) => {
  const headers = csvData[0] as any // first row is headers
  const dataRows = csvData.slice(1) // the rest are data rows

  // 1. Create a map of internal keys to header index
  const columnIndices: Record<string, number> = {}

  Object.entries(selectedColumnName).forEach(([internalKey, csvKey]) => {
    const index = headers.indexOf(csvKey)
    if (index !== -1) {
      columnIndices[internalKey] = index
    }
  })

  // 2. Generate the final array of objects using those indices
  const finalData = dataRows.map((row) => {
    const obj: Record<string, string> = {}

    Object.entries(columnIndices).forEach(([internalKey, index]) => {
      obj[internalKey] = row[index] ?? ''
    })

    return obj
  })

  return finalData
}

const formSchema = z.object({
  name: z.string().min(1, 'Enter name for you import')
})

const MatchDataPreview = ({
  fileLink,
  recordType,
  dataSource,
  csvData,
  csvHeaders,
  selectedMapping,
  setIsOpen
}: Props) => {
  const [value, setValue] = useState<string>('')
  const [frequency, setFrequency] = useState('1 Week')
  const createPersona = useCreatePersonaOverlap()
  const frequencies = ['1 Week', '15 days', '30 days', '90 days']
  console.log(csvData)

  // Get organization ID from Redux state
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  // Map UI frequency options to API frequency options
  const frequencyMapping: Record<
    string,
    'WEEKLY' | 'FIFTEEN_DAYS' | 'THIRTY_DAYS' | 'NINETY_DAYS'
  > = {
    '1 Week': 'WEEKLY',
    '15 days': 'FIFTEEN_DAYS',
    '30 days': 'THIRTY_DAYS',
    '90 days': 'NINETY_DAYS'
  }

  const handleCreatePersona = (data: z.infer<typeof formSchema>) => {
    // Extract sites and names from csvData based on selected mapping
    // const sitesIndex = csvHeaders.indexOf(selectedMapping['Website'] || '')
    // const namesIndex = csvHeaders.indexOf(selectedMapping['Full Name'] || '')
    console.log({ csvData })

    const finalMapping = { ...selectedMapping }

    // Silently inject ID mappings so the backend receives them without cluttering the UI
    const idKey = csvHeaders.find(
      (h) =>
        h?.toLowerCase() === 'id' ||
        h?.toLowerCase() === 'deal_id' ||
        h?.toLowerCase() === 'dealid' ||
        h?.toLowerCase() === 'contact_id' ||
        h?.toLowerCase() === 'account_id' ||
        h?.toLowerCase() === 'hs_object_id'
    )

    if (idKey) {
      finalMapping['dealId'] = idKey
    }

    const fields = transformCsvData(csvData, finalMapping)
    console.log(fields)

    // Get the mapped frequency with a type-safe fallback
    const value = data.name
    const mappedFrequency = frequencyMapping[frequency] || ('WEEK' as const)
    if (!(value && value.trim())) {
      showCustomToast(
        'Error',
        'Enter a valid name for your import',
        'error',
        5000
      )
      return
    }

    // Create payload
    const payload = {
      organizationId: organization?.id || 0,
      recordType,
      googleSheetLink: fileLink ?? '',
      frequency: mappedFrequency,
      personaName: value || 'Marketing Data Import',
      source: dataSource,
      fields: fields,
      fieldToColumnMapping: finalMapping
    }

    console.log(payload)

    // Call the mutation
    createPersona.mutate(payload, {
      onSuccess: () => {
        // Close modal on success
        setIsOpen(false)
      }
    })
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-[#E6F0FA] via-[#F4F1FD] to-[#E6F0FA] px-6 py-8'>
      <div className='w-full max-w-[700px]'>
        <Button
          variant={'link'}
          onClick={() => setIsOpen(false)}
          className='fds-text-sm mb-6 flex items-center px-0 text-primary-blue'
        >
          <ArrowLeft size={16} className='mr-1' />
          Back to Home
        </Button>

        <div className='mb-8 text-center'>
          <h3 className='text-2xl font-semibold text-[#111827]'>
            Marketing data preview
          </h3>
          <p className='mt-2 text-sm text-[#6B7280]'>
            Details from the connected source
          </p>
        </div>
        <div className='mb-6 flex w-full flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm'>
          <div className='flex w-full cursor-pointer items-center justify-between'>
            <div className='flex items-center gap-3'>
              <User className='h-6 w-6 text-[#6D28D9]' />
              <div className='flex flex-col'>
                <h4 className='text-[15px] font-bold text-[#1E1B4B]'>
                  {Math.max(0, csvData.length - 1)} records
                </h4>
                <p className='text-xs text-[#9CA3AF]'>
                  {
                    Object.values(selectedMapping).filter(
                      (v) => v && v !== 'other'
                    ).length
                  }{' '}
                  fields mapped &nbsp;•&nbsp; 100% emails
                </p>
              </div>
            </div>
            <ChevronDown className='h-5 w-5 text-[#9CA3AF]' />
          </div>

          <div className='ml-9 mt-1 flex flex-wrap gap-2'>
            {Object.entries(selectedMapping).map(([key, value]) => {
              if (!value || value === 'other') return null
              return (
                <span
                  key={key}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#374151'
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#7C3AED'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                  {key}
                </span>
              )
            })}
          </div>
        </div>
        <div className='pt-2'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePersona)}>
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name={`name`}
                  render={({ field }) => (
                    <FormItem>
                      <label className='text-sm font-semibold text-[#111827]'>
                        Name your import <span className='text-red-500'>*</span>
                      </label>
                      <FormControl>
                        <OutlinedInput
                          placeholder='Marketing Data - Aug 20XX'
                          className='mt-2'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              {dataSource !== 'CSV' && (
                <div className='mb-6'>
                  <label className='text-sm font-semibold text-[#111827]'>
                    How frequently do you want the data to be refreshed?{' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <div className='mt-3 flex items-center gap-6'>
                    {frequencies.map((option) => (
                      <label
                        key={option}
                        className='flex cursor-pointer items-center gap-2'
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${frequency === option ? 'border-[#8B5CF6]' : 'border-gray-300'}`}
                        >
                          {frequency === option && (
                            <div className='h-2 w-2 rounded-full bg-[#8B5CF6]' />
                          )}
                        </div>
                        <span className='text-sm text-[#4B5563]'>{option}</span>
                        <input
                          type='radio'
                          className='hidden'
                          value={option}
                          checked={frequency === option}
                          onChange={(e) => setFrequency(e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className='mb-8 flex items-start gap-3 rounded-xl bg-[#EEF2FF] p-4 text-[#4F46E5]'>
                <Check className='mt-0.5 h-5 w-5 flex-shrink-0' />
                <div>
                  <h5 className='text-sm font-semibold'>
                    Your data stays private
                  </h5>
                  <p className='mt-1 text-xs leading-snug'>
                    Partners only see account overlap, never your contacts. No
                    data is revealed before any data is shared.
                  </p>
                </div>
              </div>

              <Button
                type='submit'
                className='w-[218px] rounded-md bg-[#8B5CF6] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7C3AED]'
              >
                Confirm & Import
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default MatchDataPreview
