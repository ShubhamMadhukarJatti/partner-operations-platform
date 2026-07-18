'use client'

import React from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react' // For expandable items

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox' // Assuming Checkbox exists

import { Label } from '@/components/ui/label'

const PartnerGroupAccessSection = () => {
  // Placeholder state for expandable items
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({})
  // State for selected access level
  const [selectedAccess, setSelectedAccess] = React.useState<
    'Full Access' | 'Only Count' | 'Hidden'
  >('Full Access')

  const toggleExpand = (item: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      [item]: !prevState[item]
    }))
  }

  return (
    <section className='container mx-auto px-4 py-12 md:py-20'>
      <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2'>
        {/* Left Section: Partner Group Access Card */}
        <Card className='mx-auto w-full max-w-md md:mx-0'>
          <CardHeader>
            <CardTitle className='text-xl'>Partner Group Access</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* General Access */}
            <div>
              <h4 className='mb-3 text-lg font-semibold'>General Access</h4>
              <div className='flex'>
                <Button
                  variant='outline'
                  className={`flex-1 ${selectedAccess === 'Full Access' ? 'border-green-300 bg-green-100 text-green-800' : ''}`}
                  onClick={() => setSelectedAccess('Full Access')}
                >
                  Full Access
                </Button>
                <Button
                  variant='outline'
                  className={`flex-1 ${selectedAccess === 'Only Count' ? 'border-green-300 bg-green-100 text-green-800' : ''}`}
                  onClick={() => setSelectedAccess('Only Count')}
                >
                  Only Count
                </Button>
                <Button
                  variant='outline'
                  className={`flex-1 ${selectedAccess === 'Hidden' ? 'border-red-300 bg-red-100 text-red-800' : ''}`}
                  onClick={() => setSelectedAccess('Hidden')}
                >
                  Hidden
                </Button>
              </div>
            </div>

            {/* Description based on selected access */}
            <div className='text-sm text-muted-foreground'>
              {selectedAccess === 'Full Access' && (
                <>
                  <p>Your partners can see all the details of your Segments.</p>
                  {/* Select Fields to Share */}
                  <div className='space-y-3'>
                    <h4 className='text-lg font-semibold'>
                      Select Fields to share
                    </h4>
                    <div className='space-y-2'>
                      {/* Example Checkbox Item */}
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='customers' checked={true} />
                        <Label htmlFor='customers'>Customers</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='deal-size' checked={true} />
                        <Label htmlFor='deal-size'>Deal Size</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='pipeline-status' checked={true} />
                        <Label htmlFor='pipeline-status'>Pipeline Status</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='domain' checked={true} />
                        <Label htmlFor='domain'>Domain</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='work-email' checked={true} />
                        <Label htmlFor='work-email'>Work Mails</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Checkbox id='contact' checked={true} />
                        <Label htmlFor='contact'>Contact</Label>
                      </div>

                      {/* Example Expandable Item: Open Opportunity */}
                      <div>
                        <button
                          className='flex w-full items-center space-x-2 text-left'
                          onClick={() => toggleExpand('openOpportunity')}
                        >
                          {expanded['openOpportunity'] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                          <Checkbox
                            id='open-opportunity'
                            checked={true}
                            className='mr-2'
                          />
                          <Label htmlFor='open-opportunity'>
                            Open Opportunity
                          </Label>
                        </button>
                        {expanded['openOpportunity'] && (
                          <div className='ml-6 mt-2 space-y-2'>
                            {/* Nested items here */}
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='nested-item-1' />
                              <Label htmlFor='nested-item-1'>
                                Nested Item 1
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          className='flex w-full items-center space-x-2 text-left'
                          onClick={() => toggleExpand('prospects')}
                        >
                          {expanded['prospects'] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                          <Checkbox
                            id='prospects'
                            checked={true}
                            className='mr-2'
                          />
                          <Label htmlFor='prospects'>Prospects</Label>
                        </button>
                        {expanded['prospects'] && (
                          <div className='ml-6 mt-2 space-y-2'>
                            {/* Nested items here */}
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='nested-item-2' />
                              <Label htmlFor='nested-item-2'>
                                Nested Item 2
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {selectedAccess === 'Only Count' && (
                <p>
                  Your partners can see a summary count of overlaps for this
                  Segments. No specifics about the overlaps, including name or
                  any other data, is shared
                </p>
              )}
              {selectedAccess === 'Hidden' && (
                <p>Your partners cannot access this data</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-4'>
              <Button variant='ghost'>Cancel</Button>
              <Button>Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Section: Heading and Description */}
        <div className='flex flex-col justify-center space-y-4'>
          <h2 className='text-3xl font-bold leading-tight tracking-tight md:text-4xl'>
            Be the <span className='text-[#00AD3C]'>Owner</span> of the
            <br />
            data being shared
          </h2>
          <p className='text-lg text-muted-foreground'>
            Restrict your partners to access your customers data depending on
            the results from partner and add group based permission to create
            joint email marketing programs.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PartnerGroupAccessSection
