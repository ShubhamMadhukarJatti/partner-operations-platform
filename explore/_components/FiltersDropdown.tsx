'use client'

import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface AdvanceFilterProp {
  searchQuery?: string
  setSearchQuery?: React.Dispatch<SetStateAction<string>>
  setPartnershipType?: React.Dispatch<SetStateAction<string>>
  partnershipType?: string
  setSubSectorsCommaSeparated?: React.Dispatch<SetStateAction<string>>
  subSectorsCommaSeparated?: string
  setSectorsCommaSeparated?: React.Dispatch<SetStateAction<string>>
  sectorsCommaSeparated?: string
  complianceCommaSeparated?: string
  setComplianceCommaSeparated?: React.Dispatch<SetStateAction<string>>
  regionCommaSeparated?: string
  setRegionCommaSeparated?: React.Dispatch<SetStateAction<string>>

  onFiltersApplied?: (selected: {
    partnershipType: string[]
    useCase: string[]
    sector: string[]
    compliance: string[]
    region: string[]
  }) => void
}

const FilterDropdownAdvance: React.FC<AdvanceFilterProp> = ({
  searchQuery,
  setSearchQuery,
  setPartnershipType,
  partnershipType,
  setSubSectorsCommaSeparated,
  subSectorsCommaSeparated,
  setSectorsCommaSeparated,
  sectorsCommaSeparated,
  complianceCommaSeparated,
  setComplianceCommaSeparated,
  regionCommaSeparated,
  setRegionCommaSeparated,
  onFiltersApplied
}) => {
  const queryClient = useQueryClient()

  // fetch options
  const {
    isLoading,
    isError,
    preferredPartnerships,
    preferredSubSectors,
    compliance: complianceConfig
  } = useSpecificConfigData?.([
    'PREFERRED_PARTNERSHIPS',
    'PREFERRED_SUB_SECTORS',
    'COMPLIANCE'
  ]) ?? {
    isLoading: false,
    isError: false,
    preferredPartnerships: [],
    preferredSubSectors: [],
    compliance: []
  }

  // prettify helper (BRAND_LICENSING -> Brand Licensing)
  const prettify = (s?: string) =>
    s
      ? s
          .replace(/_/g, ' ')
          .toLowerCase()
          .split(' ')
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
          .join(' ')
      : ''

  // *** MAPPINGS AS REQUESTED ***
  const partnershipOptions = useMemo(
    () =>
      (preferredPartnerships ?? []).map((item: any) => ({
        id: item.id,
        label: item.value,
        value: item.value // Pass the value (human-readable label) instead of key
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

  // parseCsv accepts undefined now
  const parseCsv = (csv?: string) => (csv ? csv.split(',').filter(Boolean) : [])

  // applied (current) arrays — use parseCsv safely
  const appliedPartnerships = parseCsv(partnershipType)
  const appliedSubSectors = parseCsv(subSectorsCommaSeparated)
  const appliedSectors = parseCsv(sectorsCommaSeparated)
  const appliedCompliance = parseCsv(complianceCommaSeparated)
  const appliedRegion = parseCsv(regionCommaSeparated)

  // staged selections (maps of sectionKey -> string[])
  const [open, setOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

  // stagedSelected holds the arrays for the two sections while editing
  const buildStagedFromApplied = () => ({
    partnershipType: [...appliedPartnerships],
    useCase: [...appliedSubSectors],
    sector: [...appliedSectors],
    compliance: [...appliedCompliance],
    region: [...appliedRegion]
  })

  const [stagedSelected, setStagedSelected] = useState<
    Record<string, string[]>
  >(buildStagedFromApplied())

  // whenever panel opens, initialize staged from applied
  useEffect(() => {
    if (open) {
      setStagedSelected(buildStagedFromApplied())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // outside click / escape to close (Cancel behavior)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        open &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        // close and discard staged
        setOpen(false)
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const toggleStaged = (sectionKey: string, value: string) => {
    setStagedSelected((prev) => {
      const arr = prev[sectionKey] ?? []
      const exists = arr.includes(value)
      return {
        ...prev,
        [sectionKey]: exists ? arr.filter((v) => v !== value) : [...arr, value]
      }
    })
  }

  const clearStagedSection = (sectionKey: string) => {
    setStagedSelected((prev) => ({ ...prev, [sectionKey]: [] }))
  }

  // Reset: immediate clear applied + staged + notify parent + invalidate query
  const resetAllImmediate = async () => {
    setStagedSelected({
      partnershipType: [],
      useCase: [],
      sector: [],
      compliance: [],
      region: []
    })
    // call parent setters only if provided
    setPartnershipType?.('')
    setSubSectorsCommaSeparated?.('')
    setSectorsCommaSeparated?.('')
    setComplianceCommaSeparated?.('')
    setRegionCommaSeparated?.('')
    // notify parent with arrays too (optional)
    onFiltersApplied?.({
      partnershipType: [],
      useCase: [],
      sector: [],
      compliance: [],
      region: []
    })
    await queryClient.invalidateQueries({
      queryKey: ['discover-page', '', '', '', '', searchQuery ?? '']
    })
  }

  // Apply: commit staged selections to parent (comma-separated strings) + invalidate
  const handleApply = async () => {
    const p = (stagedSelected.partnershipType || []).join(',')
    const s = (stagedSelected.useCase || []).join(',')
    const sec = (stagedSelected.sector || []).join(',')
    const comp = (stagedSelected.compliance || []).join(',')
    const reg = (stagedSelected.region || []).join(',')

    // call parent setters if provided
    setPartnershipType?.(p)
    setSubSectorsCommaSeparated?.(s)
    setSectorsCommaSeparated?.(sec)
    setComplianceCommaSeparated?.(comp)
    setRegionCommaSeparated?.(reg)

    // additional callback with arrays (optional)
    onFiltersApplied?.({
      partnershipType: stagedSelected.partnershipType || [],
      useCase: stagedSelected.useCase || [],
      sector: stagedSelected.sector || [],
      compliance: stagedSelected.compliance || [],
      region: stagedSelected.region || []
    })

    await queryClient.invalidateQueries({
      queryKey: ['discover-page', '', p, s, sec, searchQuery ?? '']
    })

    setOpen(false)
  }

  // Cancel: close and discard staged changes
  const handleCancel = () => {
    setOpen(false)
  }

  // helper counts for display
  const countFor = (sectionKey: string) =>
    (stagedSelected[sectionKey] || []).length

  return (
    <div className='relative inline-block text-left'>
      {/* Filter button */}
      <button
        ref={buttonRef}
        type='button'
        aria-haspopup='true'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 rounded-lg border border-[#E6EAF0] bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#DDE8FF]'
      >
        <svg className='h-4 w-4 text-[#64748B]' viewBox='0 0 24 24' fill='none'>
          <path
            d='M10 18h4M6 6h12M8 12h8'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Filters
        <ChevronDown className='h-4 w-4 text-[#64748B]' />
      </button>

      {/* Panel */}
      <div
        ref={panelRef}
        role='dialog'
        aria-hidden={!open}
        className={`absolute right-0 z-50 mt-2 max-h-[70vh] w-[480px] min-w-[320px] overflow-auto rounded-lg border border-[#E6E9F0] bg-white p-4 transition-all duration-150
          ${open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-1 scale-95 opacity-0'}`}
        style={{ transformOrigin: 'top right' }}
      >
        <div className='flex items-center justify-between pb-3'>
          <h4 className='text-sm font-semibold'>Filters</h4>
          <div className='flex items-center gap-2'>
            <button
              onClick={resetAllImmediate}
              className='text-xs text-[#64748B] hover:underline'
              type='button'
            >
              Reset
            </button>
            <button
              onClick={() => setOpen(false)}
              className='text-xs text-[#64748B] hover:underline'
              type='button'
            >
              Done
            </button>
          </div>
        </div>

        <div className='mb-3 h-px bg-[#F1F4F7]' />

        {isLoading ? (
          <div className='py-6'>
            <div className='h-4 w-32 animate-pulse rounded bg-gray-100' />
            <div className='mt-3 h-4 w-48 animate-pulse rounded bg-gray-100' />
          </div>
        ) : isError ? (
          <div className='text-sm text-red-600'>Failed to load filters.</div>
        ) : (
          <>
            {/* Partnership Type */}
            <div className='border-t border-transparent first:border-t-0'>
              <button
                type='button'
                onClick={() =>
                  setOpenSection((prev) =>
                    prev === 'partnershipType' ? null : 'partnershipType'
                  )
                }
                className='flex w-full items-center justify-between py-3 text-left'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>
                      Partnership Type
                    </span>
                    {countFor('partnershipType') > 0 && (
                      <span className='ml-2 text-xs text-[#64748B]'>
                        {countFor('partnershipType')} selected
                      </span>
                    )}
                  </div>
                  <div className='text-xs text-[#94A3B8]'></div>
                </div>
                <div className='flex items-center gap-2'>
                  {open &&
                    stagedSelected['partnershipType'] &&
                    stagedSelected['partnershipType'].length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearStagedSection('partnershipType')
                        }}
                        className='text-xs text-[#64748B] hover:underline'
                        type='button'
                      >
                        Clear
                      </button>
                    )}
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openSection === 'partnershipType' ? 'rotate-180' : 'rotate-0'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M6 9l6 6 6-6'
                      stroke='#64748B'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-150 ${openSection === 'partnershipType' ? 'max-h-80 py-3' : 'max-h-0'}`}
              >
                <div className='flex flex-wrap gap-2'>
                  {partnershipOptions.map((opt: any) => {
                    const checked = (
                      stagedSelected['partnershipType'] || []
                    ).includes(opt.value)
                    return (
                      <label
                        key={opt.value}
                        className='flex cursor-pointer select-none items-center gap-2 rounded-md border border-[#E9EEF5] px-3 py-1 text-sm'
                      >
                        <Input
                          type='checkbox'
                          checked={checked}
                          onChange={() =>
                            toggleStaged('partnershipType', opt.value)
                          }
                          className='h-4 w-4 cursor-pointer rounded border-[#E6EAF0]'
                        />
                        <span className='text-sm'>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className='border-t border-transparent first:border-t-0'>
              <button
                type='button'
                onClick={() =>
                  setOpenSection((prev) =>
                    prev === 'useCase' ? null : 'useCase'
                  )
                }
                className='flex w-full items-center justify-between py-3 text-left'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Use Case</span>
                    {countFor('useCase') > 0 && (
                      <span className='ml-2 text-xs text-[#64748B]'>
                        {countFor('useCase')} selected
                      </span>
                    )}
                  </div>
                  <div className='text-xs text-[#94A3B8]'></div>
                </div>
                <div className='flex items-center gap-2'>
                  {open &&
                    stagedSelected['useCase'] &&
                    stagedSelected['useCase'].length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearStagedSection('useCase')
                        }}
                        className='text-xs text-[#64748B] hover:underline'
                        type='button'
                      >
                        Clear
                      </button>
                    )}
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openSection === 'useCase' ? 'rotate-180' : 'rotate-0'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M6 9l6 6 6-6'
                      stroke='#64748B'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-150 ${openSection === 'useCase' ? 'max-h-80 py-3' : 'max-h-0'}`}
              >
                <div className='flex flex-wrap gap-2'>
                  {useCaseOptions.map((opt: any) => {
                    const checked = (stagedSelected['useCase'] || []).includes(
                      opt.value
                    )
                    return (
                      <label
                        key={opt.value}
                        className='flex cursor-pointer select-none items-center gap-2 rounded-md border border-[#E9EEF5] px-3 py-1 text-sm'
                      >
                        <Input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleStaged('useCase', opt.value)}
                          className='h-4 w-4 cursor-pointer rounded border-[#E6EAF0]'
                        />
                        <span className='text-sm'>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sector */}
            <div className='border-t border-transparent first:border-t-0'>
              <button
                type='button'
                onClick={() =>
                  setOpenSection((prev) =>
                    prev === 'sector' ? null : 'sector'
                  )
                }
                className='flex w-full items-center justify-between py-3 text-left'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Service</span>
                    {countFor('sector') > 0 && (
                      <span className='ml-2 text-xs text-[#64748B]'>
                        {countFor('sector')} selected
                      </span>
                    )}
                  </div>
                  <div className='text-xs text-[#94A3B8]'></div>
                </div>
                <div className='flex items-center gap-2'>
                  {open &&
                    stagedSelected['sector'] &&
                    stagedSelected['sector'].length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearStagedSection('sector')
                        }}
                        className='text-xs text-[#64748B] hover:underline'
                        type='button'
                      >
                        Clear
                      </button>
                    )}
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openSection === 'sector' ? 'rotate-180' : 'rotate-0'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M6 9l6 6 6-6'
                      stroke='#64748B'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-150 ${openSection === 'sector' ? 'max-h-80 py-3' : 'max-h-0'}`}
              >
                <div className='flex flex-wrap gap-2'>
                  {sectorOptions.map((opt: any) => {
                    const checked = (stagedSelected['sector'] || []).includes(
                      opt.value
                    )
                    return (
                      <label
                        key={opt.value}
                        className='flex cursor-pointer select-none items-center gap-2 rounded-md border border-[#E9EEF5] px-3 py-1 text-sm'
                      >
                        <Input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleStaged('sector', opt.value)}
                          className='h-4 w-4 cursor-pointer rounded border-[#E6EAF0]'
                        />
                        <span className='text-sm'>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Compliance */}
            {/* <div className='border-t border-transparent first:border-t-0'>
              <button
                type='button'
                onClick={() =>
                  setOpenSection((prev) =>
                    prev === 'compliance' ? null : 'compliance'
                  )
                }
                className='flex w-full items-center justify-between py-3 text-left'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Compliance</span>
                    {countFor('compliance') > 0 && (
                      <span className='ml-2 text-xs text-[#64748B]'>
                        {countFor('compliance')} selected
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {open &&
                    stagedSelected['compliance'] &&
                    stagedSelected['compliance'].length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearStagedSection('compliance')
                        }}
                        className='text-xs text-[#64748B] hover:underline'
                        type='button'
                      >
                        Clear
                      </button>
                    )}
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openSection === 'compliance' ? 'rotate-180' : 'rotate-0'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M6 9l6 6 6-6'
                      stroke='#64748B'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-150 ${openSection === 'compliance' ? 'max-h-80 py-3' : 'max-h-0'}`}
              >
                <div className='flex flex-wrap gap-2'>
                  {complianceOptions.map((opt: any) => {
                    const checked = (
                      stagedSelected['compliance'] || []
                    ).includes(opt.value)
                    return (
                      <label
                        key={opt.value}
                        className='flex cursor-pointer select-none items-center gap-2 rounded-md border border-[#E9EEF5] px-3 py-1 text-sm'
                      >
                        <Input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleStaged('compliance', opt.value)}
                          className='h-4 w-4 cursor-pointer rounded border-[#E6EAF0]'
                        />
                        <span className='text-sm'>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div> */}

            {/* Region */}
            <div className='border-t border-transparent first:border-t-0'>
              <button
                type='button'
                onClick={() =>
                  setOpenSection((prev) =>
                    prev === 'region' ? null : 'region'
                  )
                }
                className='flex w-full items-center justify-between py-3 text-left'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>Region</span>
                    {countFor('region') > 0 && (
                      <span className='ml-2 text-xs text-[#64748B]'>
                        {countFor('region')} selected
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {open &&
                    stagedSelected['region'] &&
                    stagedSelected['region'].length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearStagedSection('region')
                        }}
                        className='text-xs text-[#64748B] hover:underline'
                        type='button'
                      >
                        Clear
                      </button>
                    )}
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openSection === 'region' ? 'rotate-180' : 'rotate-0'}`}
                    viewBox='0 0 24 24'
                    fill='none'
                  >
                    <path
                      d='M6 9l6 6 6-6'
                      stroke='#64748B'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-150 ${openSection === 'region' ? 'max-h-80 py-3' : 'max-h-0'}`}
              >
                <div className='flex flex-wrap gap-2'>
                  {regionOptions.map((opt: any) => {
                    const checked = (stagedSelected['region'] || []).includes(
                      opt.value
                    )
                    return (
                      <label
                        key={opt.value}
                        className='flex cursor-pointer select-none items-center gap-2 rounded-md border border-[#E9EEF5] px-3 py-1 text-sm'
                      >
                        <Input
                          type='checkbox'
                          checked={checked}
                          onChange={() => toggleStaged('region', opt.value)}
                          className='h-4 w-4 cursor-pointer rounded border-[#E6EAF0]'
                        />
                        <span className='text-sm'>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Apply area */}
            <div className='pt-3'>
              <div className='my-3 h-px bg-[#F1F4F7]' />
              <div className='flex items-center justify-between'>
                <Button
                  onClick={resetAllImmediate}
                  variant='outline'
                  className='rounded-md  border-red-400 px-4 py-2 text-sm font-semibold text-red-400'
                  type='button'
                >
                  Reset
                </Button>

                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleCancel}
                    variant='outline'
                    className='rounded-md  px-4 py-2 text-sm font-semibold'
                    type='button'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    className='rounded-md bg-[#3E50F7] px-4 py-2 text-sm font-semibold text-white'
                    type='button'
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FilterDropdownAdvance
