'use client'

import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { TootipIcon } from '../icons/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type TabType = {
  label: string
  value: string
  onClick?: () => void
  count?: number
  tabContent?: React.ReactNode
  tooltipText?: string
}

type PageHeaderProps = {
  backButton?: React.ReactNode
  title: any
  description?: string
  actionButtons?: React.ReactNode
  tabs?: TabType[]
  currentTab?: string
  onTabChange?: (tab: string) => void
  cards?: React.ReactNode
  customTitle?: React.ReactNode
  tableDataUI?: boolean
  details?: string
  toolTip?: boolean
}

const PageHeader = ({
  backButton,
  title,
  customTitle,
  description,
  actionButtons,
  tabs,
  currentTab,
  onTabChange,
  cards,
  tableDataUI,
  details,
  toolTip
}: PageHeaderProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    currentTab || tabs?.[0]?.value || ''
  )

  useEffect(() => {
    setActiveTab(currentTab || tabs?.[0]?.value || '')
  }, [currentTab, tabs])

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-2 bg-[#F9FAFB] dark:bg-transparent',
        tabs?.length ? 'border-none' : 'border-b'
      )}
    >
      {title && (
        <div
          className={`${tableDataUI ? 'border-b dark:border-border' : 'border-none'} w-full bg-white px-4 dark:bg-transparent lg:px-8`}
        >
          <h1
            className={`-mb-[1px] inline-block ${tableDataUI ? 'border-b-2 dark:border-border' : ''} border-black py-3 text-xl font-bold text-text-100 dark:text-foreground`}
          >
            <div className='flex items-center gap-4'>
              {backButton && <div>{backButton}</div>}
              {title}
              {toolTip && (
                <div className='flex items-end'>
                  <Tooltip>
                    <TooltipTrigger>
                      <TootipIcon />
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                      Your existings partnerships before jumping to sharkdom
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </h1>
        </div>
      )}
      {tableDataUI && (
        <div
          className={cn(
            'flex w-full flex-col justify-between gap-2 bg-white px-2 py-2 dark:bg-transparent md:flex-row md:items-center md:gap-1 lg:px-8',
            tabs?.length ? 'pt-4' : 'py-2',
            actionButtons ? 'border-b' : 'border-none'
          )}
        >
          <div className='flex w-full items-center justify-start gap-2'>
            <div>
              {customTitle}

              <p className='text-sm text-text-80 dark:text-muted-foreground'>
                {description}
              </p>
            </div>
          </div>

          {actionButtons && <div className='flex gap-2'>{actionButtons}</div>}
        </div>
      )}
      <div className='w-full'>
        <div
          className={`${tableDataUI ? 'm-4 rounded-lg border border-[#DEE2E6] dark:border-border ' : ''}`}
        >
          {tabs && (
            <Tabs
              value={activeTab || tabs[0]?.value || ''}
              onValueChange={(value) => {
                setActiveTab(value)
                onTabChange?.(value)
              }}
              className='overflow-y-hidden'
            >
              <TabsList className='flex items-start justify-start overflow-y-hidden rounded-none border-b bg-white px-5 dark:border-border dark:bg-transparent'>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => {
                      tab.onClick?.()
                    }}
                    className=' relative rounded-lg px-2 text-sm font-semibold text-text-100 hover:bg-text-20 data-[state=active]:text-primary-blue data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground dark:data-[state=active]:text-indigo-400 lg:px-4'
                  >
                    {tab.label}

                    {tab.count !== undefined && (
                      <span className='ml-1'>({tab.count})</span>
                    )}
                    {toolTip && tab.tooltipText && (
                      <div className='flex pl-1'>
                        <Tooltip>
                          <TooltipTrigger>
                            <TootipIcon />
                          </TooltipTrigger>
                          <TooltipContent
                            side='top'
                            className='max-w-[220px] whitespace-normal break-words text-sm font-normal leading-snug'
                          >
                            {tab.tooltipText}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                    {activeTab === tab.value && (
                      <hr className='absolute -bottom-1 left-0 h-[4px] rounded-full bg-black dark:bg-indigo-400'></hr>
                    )}
                    {details && <div className='border-b'>{details}</div>}
                  </TabsTrigger>
                ))}
              </TabsList>
              {cards !== null && cards}
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.tabContent}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
