'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ChevronDown, XCircle } from 'lucide-react'

import { Integration } from '@/types/integrations'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  CATEGORIES,
  FILTERS,
  INTEGRATION_STAGE,
  PARTNER_TYPE,
  SHARKDOM_PLAN
} from '../constants/filters'
import { AVAILABLE_INTEGRATIONS } from '../constants/integrations-list'
import IntegrationCard from './IntegrationCard'

interface Filter {
  label: string
  value: string
}

function Integrations() {
  const searchParams = useSearchParams()
  const [value, setValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Integration[]>([])
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [availableIntegrations, setAvailableIntegrations] = useState<
    Integration[]
  >(AVAILABLE_INTEGRATIONS)

  // Handle OAuth callback notifications
  useEffect(() => {
    const app = searchParams.get('app')
    const error = searchParams.get('error')

    if (app === 'MAILCHIMP') {
      setNotification({
        type: 'success',
        message: 'Successfully connected to Mailchimp!'
      })
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000)
    } else if (error === 'access_denied') {
      setNotification({
        type: 'error',
        message: 'Mailchimp connection was cancelled or denied.'
      })
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000)
    }
  }, [searchParams])

  const [accordionValue, setAccordionValue] = useState<string[]>([
    FILTERS.PARTNER_TYPE,
    FILTERS.SHARKDOM_PLAN,
    FILTERS.CATEGORIES,
    FILTERS.INTEGRATION_STAGE
  ])

  const [sortBy, setSortBy] = useState<string>('')

  const [partnerTypes, setPartnerTypes] = useState<Record<string, boolean>>(
    PARTNER_TYPE.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.value] = false
      return acc
    }, {})
  )
  const [sharkdomPlan, setSharkdomPlan] = useState<Record<string, boolean>>(
    SHARKDOM_PLAN.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.value] = false
      return acc
    }, {})
  )
  const [categories, setCategories] = useState<Record<string, boolean>>(
    CATEGORIES.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.value] = false
      return acc
    }, {})
  )
  const [integrationStage, setIntegrationStage] = useState<
    Record<string, boolean>
  >(
    INTEGRATION_STAGE.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.value] = false
      return acc
    }, {})
  )

  useEffect(() => {
    const selectedPartnerTypesSet = new Set<string>(
      Object.entries(partnerTypes)
        .filter(([key, value]) => value) // Filter keys with true values
        .map(([key]) => key) // Map the key only
    )

    const selectedSharkdomPlansSet = new Set<string>(
      Object.entries(sharkdomPlan)
        .filter(([key, value]) => value) // Filter keys with true values
        .map(([key]) => key) // Map the key only
    )

    const selectedCategoriesSet = new Set<string>(
      Object.entries(categories)
        .filter(([key, value]) => value) // Filter keys with true values
        .map(([key]) => key) // Map the key only
    )

    const selectedIntegrationStateSet = new Set<string>(
      Object.entries(integrationStage)
        .filter(([key, value]) => value) // Filter keys with true values
        .map(([key]) => key) // Map the key only
    )

    const filteredIntegrationsList = AVAILABLE_INTEGRATIONS.filter(
      (integration) => {
        if (selectedPartnerTypesSet.size > 0) {
          if (!selectedPartnerTypesSet.has(integration.partnerType))
            return false
        }

        if (selectedIntegrationStateSet.size > 0) {
          if (!selectedIntegrationStateSet.has(integration.integrationStage))
            return false
        }

        if (selectedCategoriesSet.size > 0) {
          if (!integration.categories.some((i) => selectedCategoriesSet.has(i)))
            return false
        }

        if (selectedSharkdomPlansSet.size > 0) {
          if (
            !integration.sharkdomPlan.some((i) =>
              selectedSharkdomPlansSet.has(i)
            )
          )
            return false
        }
        return true
      }
    )
    setAvailableIntegrations(filteredIntegrationsList)
  }, [partnerTypes, sharkdomPlan, categories, integrationStage])

  const handleOnChange = (value: string): void => {
    setValue(value)

    if (value?.length < 3) {
      setSearchResults([])
      return
    }

    const filtetedIntegrations = AVAILABLE_INTEGRATIONS.filter((integration) =>
      integration.name?.toLowerCase().includes(value?.toLowerCase())
    )
    setSearchResults(filtetedIntegrations)
  }

  const handleOnChangeCheckbox = (
    filterType: string,
    filter: Filter,
    checked: boolean
  ) => {
    switch (filterType) {
      case FILTERS.PARTNER_TYPE:
        setPartnerTypes((prev: Record<string, boolean>) => ({
          ...prev,
          [filter.value]: checked
        }))
        break
      case FILTERS.SHARKDOM_PLAN:
        setSharkdomPlan((prev: Record<string, boolean>) => ({
          ...prev,
          [filter.value]: checked
        }))
        break
      case FILTERS.CATEGORIES:
        setCategories((prev: Record<string, boolean>) => ({
          ...prev,
          [filter.value]: checked
        }))
        break
      case FILTERS.INTEGRATION_STAGE:
        setIntegrationStage((prev: Record<string, boolean>) => ({
          ...prev,
          [filter.value]: checked
        }))
        break
    }
  }

  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy)
    if (sortBy === 'newest')
      setAvailableIntegrations(
        availableIntegrations.sort((a, b) => b.order - a.order)
      )
    else
      setAvailableIntegrations(
        availableIntegrations.sort((a, b) => a.order - b.order)
      )
  }

  return (
    <section className='m-auto grid max-w-7xl grid-cols-1 gap-2 py-10 lg:grid-cols-4'>
      {/* Notification */}
      {notification && (
        <div className='col-span-full mb-4'>
          <div
            className={`flex items-center gap-3 rounded-lg p-4 ${
              notification.type === 'success'
                ? 'border border-green-200 bg-green-50 text-green-800'
                : 'border border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className='h-5 w-5' />
            ) : (
              <XCircle className='h-5 w-5' />
            )}
            <span className='font-medium'>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className='ml-auto text-sm underline hover:no-underline'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className='col-span-1 rounded-2xl border border-[#C6D1E1] px-3 py-5'>
        <div className='relative w-full'>
          <Command>
            <CommandInput
              value={value}
              placeholder='Search...'
              onValueChange={handleOnChange}
            />
            <CommandList
              className={`rounded-lg bg-white py-2 ${searchResults?.length > 0 ? 'border' : ''}`}
            >
              {searchResults &&
                searchResults.map((option) => (
                  <CommandItem
                    value={option.name}
                    key={option.name}
                    className='cursor-pointer p-2 hover:bg-gray-100'
                    disabled={false}
                  >
                    {option.name}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>

        <Accordion
          type='multiple'
          onValueChange={setAccordionValue}
          value={accordionValue}
        >
          <AccordionItem value={FILTERS.PARTNER_TYPE}>
            <AccordionTrigger>Partnership Type</AccordionTrigger>
            <AccordionContent>
              {PARTNER_TYPE.map((p) => (
                <div key={p.value} className='mb-2 flex items-center gap-2'>
                  <Checkbox
                    onCheckedChange={(checked: boolean) => {
                      handleOnChangeCheckbox(FILTERS.PARTNER_TYPE, p, checked)
                    }}
                    id={p.value}
                    checked={partnerTypes[p.value]}
                  />
                  <label htmlFor={p.value}>{p.label}</label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={FILTERS.SHARKDOM_PLAN}>
            <AccordionTrigger>Sharkdom Plan</AccordionTrigger>
            <AccordionContent>
              {SHARKDOM_PLAN.map((p) => (
                <div key={p.value} className='mb-2 flex items-center gap-2'>
                  <Checkbox
                    onCheckedChange={(checked: boolean) => {
                      handleOnChangeCheckbox(FILTERS.SHARKDOM_PLAN, p, checked)
                    }}
                    id={p.value}
                    checked={sharkdomPlan[p.value]}
                  />
                  <label htmlFor={p.value}>{p.label}</label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={FILTERS.CATEGORIES}>
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              {CATEGORIES.map((p) => (
                <div key={p.value} className='mb-2 flex items-center gap-2'>
                  <Checkbox
                    onCheckedChange={(checked: boolean) => {
                      handleOnChangeCheckbox(FILTERS.CATEGORIES, p, checked)
                    }}
                    id={p.value}
                    checked={categories[p.value]}
                  />
                  <label htmlFor={p.value}>{p.label}</label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={FILTERS.INTEGRATION_STAGE}>
            <AccordionTrigger>Integration Stage</AccordionTrigger>
            <AccordionContent>
              {INTEGRATION_STAGE.map((p) => (
                <div key={p.value} className='mb-2 flex items-center gap-2'>
                  <Checkbox
                    onCheckedChange={(checked: boolean) => {
                      handleOnChangeCheckbox(
                        FILTERS.INTEGRATION_STAGE,
                        p,
                        checked
                      )
                    }}
                    id={p.value}
                    checked={integrationStage[p.value]}
                  />
                  <label htmlFor={p.value}>{p.label}</label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className='col-span-3 rounded-2xl px-2'>
        <div className='relative flex justify-between'>
          <h2 className='mb-4 text-2xl font-semibold text-[#001736]'>
            All Integrations
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='focus:ring-none flex h-10 gap-2 rounded-xl border border-[#E4E7EE] p-0 px-2 text-sm font-bold capitalize text-[#2A3241] outline-none hover:bg-transparent'
              >
                {sortBy || 'Sort By'} <ChevronDown className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='z-20 w-12 bg-white' align='center'>
              {['newest', 'oldest'].map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleSortBy(type)}>
                  <span className='capitalize'>{type}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='grid grid-cols-1 gap-x-3 gap-y-6 py-3 lg:grid-cols-3'>
          {availableIntegrations.map((integration) => (
            <IntegrationCard
              key={`${integration.name}-card`}
              data={integration}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Integrations
