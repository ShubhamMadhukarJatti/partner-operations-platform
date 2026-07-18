'use client'

import * as React from 'react'
import { Search } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

import IntegrationAppCard from './integration-app-card'

const categories = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'signing', label: 'Signing' },
  { id: 'marketing', label: 'Marketing' }
]

type Props = {
  integrations: any
}

export default function MoreIntegrationApps({ integrations }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  )

  const filteredIntegrations = integrations.filter((integration: any) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(integration?.category?.toLowerCase())

    return matchesSearch && matchesCategory
  })

  return (
    <div className='flex   rounded-xl border border-text-20 dark:border-border'>
      {/* Left Sidebar */}
      {/* <div className='hidden w-64 border-r border-text-20 bg-background lg:block'>
        <div className='space-y-3 '>
          <div className='space-y-3 border-b border-text-20 p-4'>
            <h4 className='fds-text-sm text-text-100'>
              Search for Integrations
            </h4>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-text-60' />
              <Input
                placeholder='Search '
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='space-y-3 px-4'>
            <h3 className='fds-text-sm text-text-100'>
              Categories
            </h3>
            <ScrollArea className=' min-h-[50vh]'>
              <div className='space-y-3'>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      className='rounded'
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.id
                          ])
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter(
                              (id) => id !== category.id
                            )
                          )
                        }
                      }}
                    />
                    <Label
                      htmlFor={category.id}
                      className='fds-text'
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className='flex-1 p-3 lg:p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='fds-text-semibold text-text-100 dark:text-white'>
              More Integrations
            </h2>
            <p className='text-shark-sm text-text-80 dark:text-gray-400'>
              Streamline Operations and Boost Efficiency
            </p>
          </div>
        </div>
        <div className='grid gap-6 md:grid-cols-3 '>
          {filteredIntegrations.map((integration: any) => (
            <IntegrationAppCard
              key={integration.id}
              integration={integration}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
