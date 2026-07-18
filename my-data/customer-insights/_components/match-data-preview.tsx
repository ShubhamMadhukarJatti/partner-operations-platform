import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  useCreatePersona,
  useCreatePersonaOverlap
} from '@/http-hooks/partner-match'
import { RootState } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'iconsax-react'
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

import { recordType } from '../../_components/Segment'
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
  // Handle case where csvData is null/undefined or empty
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
    return []
  }

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
  // Prevent duplicate POSTs if the submit handler fires twice (e.g. double-click / event duplication).
  const isSubmittingRef = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const frequencies = ['1 Week', '15 days', '30 days', '90 days']
  // Helper: flatten object data (HubSpot, Zoho) to array of flat objects
  const flattenObjectData = React.useCallback((dataArr: any[]) => {
    if (!Array.isArray(dataArr) || dataArr.length === 0) return []
    // If first row has 'properties', treat as object data (HubSpot/Zoho)
    if (dataArr[0]?.properties) {
      return dataArr.map((row) => ({ ...row.properties }))
    }
    return dataArr
  }, [])

  // Memoize preview data to prevent recalculation on every render
  const previewData = React.useMemo(
    () => flattenObjectData(csvData),
    [csvData, flattenObjectData]
  )

  // Memoize headers to prevent recalculation on every render
  const headers = React.useMemo(() => {
    return csvHeaders && csvHeaders.length > 0
      ? csvHeaders
      : previewData.length > 0
        ? Object.keys(previewData[0])
        : []
  }, [csvHeaders, previewData])

  // Memoize the mapping calculations to prevent recalculation on every render
  const mappingData = React.useMemo(() => {
    const result = Object.entries(selectedMapping).map(
      ([key, value], index) => {
        if (value === 'other') {
          return { key, value, index, count: 0, isOther: true }
        }

        const fieldName = value
        const allValues = previewData.map((row) => row?.[fieldName])
        const values = allValues.filter(Boolean)

        return {
          key,
          value,
          index,
          count: values.length,
          isOther: false,
          allValues
        }
      }
    )

    console.log('Full csvData:', csvData)
    console.log('Selected mapping:', selectedMapping)
    console.log('Mapping data calculated:', result)

    return result
  }, [selectedMapping, previewData, csvData])

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
    if (isSubmittingRef.current || createPersona.isPending) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    // Extract sites and names from csvData based on selected mapping
    // const sitesIndex = csvHeaders.indexOf(selectedMapping['Website'] || '')
    // const namesIndex = csvHeaders.indexOf(selectedMapping['Full Name'] || '')
    console.log({ csvData })

    const fields = transformCsvData(csvData, selectedMapping)
    console.log(fields)

    // const sites =
    //   sitesIndex !== -1
    //     ? csvData.map((row) => row[sitesIndex]).filter(Boolean)
    //     : []

    // const names =
    //   namesIndex !== -1
    //     ? csvData.map((row) => row[namesIndex]).filter(Boolean)
    //     : []

    // Get the mapped frequency with a type-safe fallback
    const value = data.name
    const mappedFrequency = frequencyMapping[frequency] || ('WEEKLY' as const)
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
      fieldToColumnMapping: selectedMapping
    }

    console.log(payload)

    // Call the mutation
    createPersona.mutate(payload, {
      onSuccess: () => {
        // Close modal on success
        setIsOpen(false)
      },
      onSettled: () => {
        isSubmittingRef.current = false
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className='mt-8 w-full'>
      <Button
        variant={'link'}
        onClick={() => setIsOpen(false)}
        className='fds-text-sm mb-6 flex items-center px-0 text-primary-blue '
      >
        <ArrowLeft size={16} className='mr-1' />
        Back to Home
      </Button>

      <div>
        <h3 className='fds-text-lead-semibold text-text-100'>
          Marketing data preview
        </h3>
        <p className='mt-1 text-shark-sm text-text-80'>
          Details from the connected source
        </p>
      </div>
      <hr className='my-5 bg-text-20' />
      <div className='grid grid-cols-3 gap-0 rounded-lg border border-text-20 bg-background-ghost-white'>
        {mappingData.map((item) => {
          if (item.isOther) {
            return (
              <div
                key={`${item.key}-${item.index}`}
                className={`flex flex-col gap-1 p-4 ${
                  item.index % 3 !== 2 ? 'border-r' : ''
                } ${item.index < 3 ? 'border-b' : ''} border-text-20`}
              >
                <span className='text-xl font-bold leading-6 text-text-100'>
                  --,--
                </span>
                <span className='text-sm leading-4 text-text-80'>{` ${item.key}`}</span>
              </div>
            )
          }

          if (item.count === 0) return null

          return (
            <div
              key={`${item.key}-${item.index}`}
              className={`flex flex-col gap-1 p-4 ${
                item.index % 3 !== 2 ? 'border-r' : ''
              } ${item.index < 3 ? 'border-b' : ''} border-text-20`}
            >
              <span className='text-xl font-bold leading-6 text-text-100'>
                {item.count}
              </span>
              <span className='text-sm leading-4 text-text-80'>{` ${item.key}`}</span>
            </div>
          )
        })}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreatePersona)} className=''>
          <div className='mb-6 mt-6'>
            <FormField
              control={form.control}
              name={`name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OutlinedInput
                      label='Name your import'
                      placeholder='Marketing Data - Aug 20XX'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </div>
          {dataSource !== 'CSV' && (
            <div className='rounded-lg bg-[#F1F1F1] p-4'>
              <div className='space-y-4'>
                <h3 className='fds-text text-text-100'>
                  How frequently do you want your data to be refreshed?
                </h3>
                <ToggleGroup
                  type='single'
                  value={frequency}
                  onValueChange={(value) => {
                    if (value) setFrequency(value)
                  }}
                  className='grid grid-cols-4 gap-2 bg-[#FAFAFA]'
                >
                  {frequencies.map((option) => (
                    <ToggleGroupItem
                      key={option}
                      value={option}
                      className='h-10 rounded-md data-[state=on]:border data-[state=on]:border-[#D5D7DA] data-[state=on]:bg-white data-[state=on]:shadow-sm'
                    >
                      {option}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
          )}

          <div className=' mb-12 mt-6 bg-[#FDF3E3] p-4'>
            <p className='text-shark-sm text-text-90'>
              Confirming this step will reduce your attempt size as we have
              limited AI tries
            </p>
          </div>

          <Button
            type='submit'
            variant='primary'
            disabled={isSubmitting || createPersona.isPending}
            className='fds-text-semibold w-[218px] rounded-md bg-primary-blue py-2 text-white transition-colors hover:bg-primary-blue disabled:opacity-50'
          >
            {isSubmitting || createPersona.isPending
              ? 'Creating...'
              : 'Confirm & Import'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default MatchDataPreview
