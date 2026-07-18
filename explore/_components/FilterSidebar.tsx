'use client'

import React, { useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Sliders,
  Star,
  Tag,
  UserSquare,
  X
} from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'
import { Switch } from '@/components/ui/switch'

export interface FilterSidebarProps {
  partnershipType: string[]
  useCase: string[]
  sector: string[]
  compliance: string[]
  region: string[]
  onPartnershipChange: (values: string[]) => void
  onUseCaseChange: (values: string[]) => void
  onSectorChange: (values: string[]) => void
  onComplianceChange: (values: string[]) => void
  onRegionChange: (values: string[]) => void
  onResetAll: () => void
  onClose?: () => void
  selectedSort?: string
  onSortChange?: (sort: string) => void
  isShortlisted?: boolean
  onShortlistedChange?: (val: boolean) => void
}

const prettify = (s?: string) =>
  s
    ? s
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
        .join(' ')
    : ''

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  partnershipType,
  useCase,
  sector,
  compliance,
  region,
  onPartnershipChange,
  onUseCaseChange,
  onSectorChange,
  onComplianceChange,
  onRegionChange,
  onResetAll,
  onClose,
  selectedSort = 'recommended',
  onSortChange,
  isShortlisted = false,
  onShortlistedChange
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickFilters: true,
    sector: true
  })

  const {
    preferredPartnerships,
    preferredSubSectors,
    compliance: complianceConfig
  } = useSpecificConfigData?.([
    'PREFERRED_PARTNERSHIPS',
    'PREFERRED_SUB_SECTORS',
    'COMPLIANCE'
  ]) ?? {
    preferredPartnerships: [],
    preferredSubSectors: [],
    compliance: []
  }

  const partnershipOptions = useMemo(
    () =>
      (preferredPartnerships ?? []).map((item: any) => ({
        id: item.id,
        label: item.value,
        value: item.value
      })),
    [preferredPartnerships]
  )

  const useCaseOptions = useMemo(
    () =>
      (preferredSubSectors ?? []).map((item: any) => ({
        id: item.id,
        label: prettify(item.key),
        value: item.key
      })),
    [preferredSubSectors]
  )

  const sectorOptions = useMemo(
    () => [
      { id: 'product', label: 'Product', value: 'PRODUCT' },
      { id: 'service', label: 'Service Providers', value: 'SERVICE' },
      { id: 'agency', label: 'Agencies', value: 'AGENCY' }
    ],
    []
  )

  const complianceOptions = useMemo(
    () =>
      (complianceConfig ?? []).map((item: any) => ({
        id: item.id,
        label: prettify(item.key),
        value: item.key
      })),
    [complianceConfig]
  )

  const regionOptions = useMemo(
    () => [
      { id: 'apac', label: 'APAC', value: 'APAC' },
      { id: 'north_america', label: 'North America', value: 'NORTH_AMERICA' },
      { id: 'europe', label: 'Europe', value: 'EUROPE' },
      { id: 'mena', label: 'MENA', value: 'MENA' }
    ],
    []
  )

  const quickFiltersOptions = useMemo(
    () => [
      { label: 'Recommended', value: 'recommended' },
      { label: 'High match percentage', value: 'high_match' },
      { label: 'Popular', value: 'popular' },
      { label: 'More active partners', value: 'more_active' },
      { label: 'Less acknowledgement time', value: 'less_ack_time' }
    ],
    []
  )

  const totalActiveFilters =
    partnershipType.length +
    useCase.length +
    sector.length +
    compliance.length +
    region.length

  const totalQuickFiltersActive = selectedSort !== 'recommended' ? 1 : 0
  const totalActiveCount =
    totalActiveFilters + totalQuickFiltersActive + (isShortlisted ? 1 : 0)
  const hasActiveFilters = totalActiveCount > 0

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleValue = (
    current: string[],
    value: string,
    onChange: (values: string[]) => void
  ) => {
    if (current.includes(value)) {
      onChange(current.filter((v) => v !== value))
    } else {
      onChange([...current, value])
    }
  }

  const handleClearAll = () => {
    onResetAll()
    if (onSortChange) onSortChange('recommended')
    if (onShortlistedChange) onShortlistedChange(false)
  }

  const sections = [
    {
      key: 'quickFilters',
      label: 'Quick Filters',
      icon: <Sliders className='h-4 w-4' />,
      options: quickFiltersOptions,
      isSingleSelect: true,
      selected: [selectedSort],
      onChange: (values: string[]) => {
        // Since it's single select acting like a radio button, the new value is the last one in the array
        const newVal =
          values.length > 0 ? values[values.length - 1] : 'recommended'
        if (onSortChange) onSortChange(newVal)
      }
    },
    {
      key: 'sector',
      label: 'Sector',
      icon: <Tag className='h-4 w-4' />,
      options: sectorOptions,
      selected: sector,
      onChange: onSectorChange
    },
    {
      key: 'partnershipType',
      label: 'Partnership type',
      icon: <UserSquare className='h-4 w-4' />,
      options: partnershipOptions,
      selected: partnershipType,
      onChange: onPartnershipChange
    },
    {
      key: 'region',
      label: 'Region',
      icon: <Globe className='h-4 w-4' />,
      options: regionOptions,
      selected: region,
      onChange: onRegionChange
    },
    {
      key: 'useCase',
      label: 'Use case',
      icon: <FileText className='h-4 w-4' />,
      options: useCaseOptions,
      selected: useCase,
      onChange: onUseCaseChange
    }
  ]

  return (
    <div className='flex max-h-[calc(100vh-120px)] w-full flex-col overflow-hidden rounded-2xl bg-[#FCFDFF] outline outline-1 outline-[#F2F2F2] dark:bg-[var(--colors-background-card)] dark:outline-border'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#F2F4F7] p-5 dark:border-border'>
        <div className='flex items-center gap-2'>
          <span className='text-[17px] font-medium text-[#101828] dark:text-foreground'>
            Filters
          </span>
          {totalActiveCount > 0 && (
            <span className='flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#EBE5FF] px-1.5 text-[12px] font-semibold text-[#6863FB] dark:bg-[#6863FB]/20 dark:text-[#a78bfa]'>
              {totalActiveCount}
            </span>
          )}
        </div>
        <div className='flex items-center gap-2.5'>
          <button
            onClick={handleClearAll}
            className='text-[14px] font-medium text-[#6863FB] hover:text-[#5229CC] dark:text-[#a78bfa]'
            type='button'
          >
            Clear all
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-muted dark:hover:bg-muted/80'
              type='button'
              aria-label='Close filters'
            >
              <X
                size={14}
                className='text-[#323232] dark:text-muted-foreground'
              />
            </button>
          )}
        </div>
      </div>

      {/* Shortlisted Row */}
      <div className='flex items-center justify-between border-b border-[#F2F4F7] px-5 py-4 dark:border-border'>
        <div className='flex items-center gap-2.5 text-[#475467] dark:text-foreground'>
          <Star className='h-4 w-4' />
          <span className='text-[15px] font-medium'>Shortlisted</span>
        </div>
        <Switch
          checked={isShortlisted}
          onCheckedChange={(checked) => onShortlistedChange?.(checked)}
        />
      </div>

      {/* Accordion Sections */}
      <div className='hide-scrollbar min-h-0 flex-1 overflow-y-auto pb-0 pt-2'>
        {sections.map((section) => {
          const isOpen = openSections[section.key]

          return (
            <div
              key={section.key}
              className='border-b border-[#F2F4F7] last:border-0 dark:border-border'
            >
              {/* Section header */}
              <button
                type='button'
                onClick={() => toggleSection(section.key)}
                className='flex w-full items-center justify-between px-5 py-[18px] hover:bg-gray-50/50 dark:hover:bg-muted/10'
              >
                <div className='flex items-center gap-2.5 text-[#475467] dark:text-foreground'>
                  {section.icon}
                  <span className='text-[15px] font-medium leading-none'>
                    {section.label}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className='text-[#667085]' />
                ) : (
                  <ChevronDown size={18} className='text-[#667085]' />
                )}
              </button>

              {/* Section content */}
              {isOpen && (
                <div className='flex flex-col gap-3 px-[42px] pb-5'>
                  {section.options.map((opt: any) => {
                    const checked = section.isSingleSelect
                      ? section.selected[0] === opt.value
                      : section.selected.includes(opt.value)

                    return (
                      <label
                        key={opt.value}
                        className='group flex cursor-pointer items-start gap-3'
                      >
                        <div className='relative flex items-center pt-0.5'>
                          <input
                            type='checkbox'
                            checked={checked}
                            onChange={() => {
                              if (section.isSingleSelect) {
                                section.onChange([opt.value])
                              } else {
                                toggleValue(
                                  section.selected,
                                  opt.value,
                                  section.onChange
                                )
                              }
                            }}
                            className='peer sr-only'
                          />
                          {/* Custom Checkbox UI */}
                          <div
                            className={`
                            flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border
                            transition-colors duration-200
                            ${
                              checked
                                ? 'border-[#6863FB] bg-[#6863FB] dark:border-[#6863FB] dark:bg-[#6863FB]'
                                : 'border-[#D0D5DD] bg-white group-hover:border-[#6863FB] dark:border-[#475467] dark:bg-transparent'
                            }
                          `}
                          >
                            {checked && (
                              <Check
                                size={12}
                                strokeWidth={3}
                                className='text-white'
                              />
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-[14px] ${checked ? 'font-medium text-[#101828] dark:text-foreground' : 'text-[#475467] dark:text-muted-foreground'}`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(FilterSidebar)
