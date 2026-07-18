'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PreviewTableProps = {
  activeTab?: 'contacts' | 'companies' | 'deals'
}

type PropertyDef = {
  key: string
  label: string
}

const PROPERTIES_BY_TAB: Record<
  'contacts' | 'companies' | 'deals',
  PropertyDef[]
> = {
  contacts: [
    { key: 'fullName', label: 'Person Name' },
    { key: 'contactEmail', label: 'Email' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'contactOwner', label: 'Person Owner' },
    { key: 'leadStatus', label: 'Lead Status' },
    { key: 'linkedInUrl', label: 'LinkedIn URL' },
    { key: 'phone', label: 'Phone' },
    { key: 'lastActivityDate', label: 'Last Activity Date' }
  ],
  companies: [
    { key: 'name', label: 'Company Name' },
    { key: 'domain', label: 'Website' },
    { key: 'industry', label: 'Industry' },
    { key: 'companySize', label: 'Company Size' },
    { key: 'countryGeography', label: 'Country Geography' },
    { key: 'linkedInUrl', label: 'LinkedIn URL' },
    { key: 'annualRevenue', label: 'Annual Revenue' },
    { key: 'description', label: 'Description' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' }
  ],
  deals: [
    { key: 'dealname', label: 'Deal Name' },
    { key: 'dealStage', label: 'Deal Stage' },
    { key: 'associatedCompanyId', label: 'Associated Company ID' },
    { key: 'dealOwner', label: 'Deal Owner' },
    { key: 'amountAcv', label: 'Amount / ACV' },
    { key: 'closeDate', label: 'Close Date' },
    { key: 'dealId', label: 'HubSpot Deal ID' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'lastActivityDate', label: 'Last Activity Date' },
    { key: 'dealType', label: 'Deal Type' },
    { key: 'associatedContactId', label: 'Associated Contact ID' }
  ]
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const pillStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  borderRadius: 17,
  paddingLeft: 12,
  paddingRight: 12,
  paddingTop: 3,
  paddingBottom: 3,
  color: 'rgba(49, 49, 49, 0.70)',
  fontSize: 14,
  fontFamily: 'Rubik, Inter, sans-serif',
  fontWeight: 400,
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap'
})

export default function PreviewTable({
  activeTab = 'contacts'
}: PreviewTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMapping, setSelectedMapping] = useState<
    Record<string, string>
  >({})
  const [realData, setRealData] = useState<{
    columns: PropertyDef[]
    rows: Record<string, string>[]
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Get field mapping data from sessionStorage or window fallback
    const storedMapping = sessionStorage.getItem('fieldMappingData')
    const inMemoryMapping = (window as any).__sharkdom_fieldMappingData
    const parsedMapping = storedMapping
      ? JSON.parse(storedMapping)
      : inMemoryMapping

    if (!parsedMapping) {
      setRealData(null)
      return
    }

    const activeTabCapitalized = (activeTab.charAt(0).toUpperCase() +
      activeTab.slice(1)) as 'Contacts' | 'Companies' | 'Deals'
    const selectedMapping =
      parsedMapping.selectedMappingByTab?.[activeTabCapitalized] ||
      parsedMapping.selectedMapping ||
      {}
    setSelectedMapping(selectedMapping)

    // 2. Get CSV/CRM data from sessionStorage or window fallback
    const tabCsvKey = `__sharkdom_temp_csvData_${activeTab}`

    let rawCsvData = (window as any)[tabCsvKey]

    if (!rawCsvData) {
      const storedTabCsv = sessionStorage.getItem(tabCsvKey)
      if (storedTabCsv) {
        try {
          rawCsvData = JSON.parse(storedTabCsv)
        } catch (e) {}
      }
    }

    if (!rawCsvData) {
      rawCsvData = (window as any).__sharkdom_temp_csvData
    }

    if (!rawCsvData) {
      const storedFallback =
        sessionStorage.getItem('__sharkdom_temp_csvData') ||
        sessionStorage.getItem('csvData')
      if (storedFallback) {
        try {
          rawCsvData = JSON.parse(storedFallback)
        } catch (e) {}
      }
    }

    if (!rawCsvData || !Array.isArray(rawCsvData) || rawCsvData.length === 0) {
      setRealData(null)
      return
    }

    const headers = rawCsvData[0]
    const dataRows = rawCsvData.slice(1)

    const HIDDEN_PREVIEW_KEYS = new Set([
      'dealId',
      'associatedCompanyId',
      'associatedContactId',
      'dealOwner',
      'contactOwner',
      'accountId',
      'ownerId',
      'contactId'
    ])

    // Filter PROPERTIES_BY_TAB[activeTab] to only include mapped ones
    const activeProps = PROPERTIES_BY_TAB[activeTab]
    const mappedCols: PropertyDef[] = activeProps.filter((prop) => {
      if (HIDDEN_PREVIEW_KEYS.has(prop.key)) return false
      const fileCol = selectedMapping[prop.key]
      return fileCol && fileCol !== 'dont_import' && headers.includes(fileCol)
    })

    // Dynamically append any other custom or extra columns that are mapped and present in headers
    Object.entries(selectedMapping).forEach(([sharkdomKey, fileCol]) => {
      if (HIDDEN_PREVIEW_KEYS.has(sharkdomKey)) return

      if (!fileCol || fileCol === 'dont_import' || !headers.includes(fileCol)) {
        return
      }

      // If already added as a standard field, skip
      if (mappedCols.some((col) => col.key === sharkdomKey)) return

      // Create a nice human-readable label
      let label = sharkdomKey
      if (sharkdomKey.startsWith('custom-')) {
        const cleanName = sharkdomKey.replace('custom-', '')
        label = cleanName
          .split(/[_-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      } else {
        label = sharkdomKey
          .split(/(?=[A-Z])|[_-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }

      mappedCols.push({
        key: sharkdomKey,
        label: label
      })
    })

    if (mappedCols.length === 0) {
      setRealData(null)
      return
    }

    // Build the mapped rows
    const rows = dataRows.map((row, idx) => {
      const rowObj: Record<string, string> = { id: `row-${idx}` }
      mappedCols.forEach((col) => {
        const fileCol = selectedMapping[col.key]
        const colIdx = headers.indexOf(fileCol)
        if (colIdx !== -1) {
          const val = row[colIdx]
          const isUnknown =
            val && String(val).toLowerCase().trim() === 'unknown'
          rowObj[col.key] = isUnknown ? '' : (val ?? '')
        }
      })
      return rowObj
    })

    setRealData({ columns: mappedCols, rows })
  }, [activeTab])

  // Reset page when tab or page size changes
  useEffect(() => {
    setPage(1)
  }, [activeTab, pageSize])

  const columns = useMemo(() => realData?.columns || [], [realData])
  const rows = useMemo(() => realData?.rows || [], [realData])

  const totalRows = rows.length
  const totalPages = Math.ceil(totalRows / pageSize)
  const startIdx = (page - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, totalRows)
  const paginatedRows = useMemo(
    () => rows.slice(startIdx, endIdx),
    [rows, startIdx, endIdx]
  )

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
  }

  return (
    <div
      className='overflow-hidden bg-white'
      style={{
        borderRadius: 12,
        outline: '1px #AAB7D2 solid',
        outlineOffset: '-1px'
      }}
    >
      <div className='overflow-x-auto'>
        {/* Header */}
        <div
          className='flex min-w-max'
          style={{
            background: '#D2E0FF',
            borderTop: '1px rgba(33, 35, 44, 0.12) solid',
            borderBottom: '1px rgba(33, 35, 44, 0.12) solid'
          }}
        >
          {columns.map((col) => {
            const fileCol = selectedMapping[col.key]
            return (
              <div
                key={col.key}
                className='flex w-[200px] shrink-0 flex-col justify-center px-6 py-2.5'
              >
                <span
                  style={{
                    color: '#2C3853',
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {col.label.toUpperCase()}
                </span>
                {fileCol && fileCol !== 'dont_import' && (
                  <span
                    className='truncate text-[10px] font-semibold uppercase tracking-wider text-[#5D20D6]'
                    title={String(fileCol)}
                    style={{ marginTop: 2 }}
                  >
                    {String(fileCol)}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Data rows */}
        {paginatedRows.length === 0 ? (
          <div className='flex h-[150px] items-center justify-center text-sm font-medium text-gray-400'>
            No preview rows to display for this category.
          </div>
        ) : (
          paginatedRows.map((row, idx) => (
            <div
              key={row.id}
              className='flex min-w-max'
              style={{
                background: idx % 2 === 1 ? '#F4F7FF' : '#ffffff',
                borderBottom: '1px #E4E7EE solid'
              }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className='flex w-[200px] shrink-0 items-center px-6 py-2.5'
                >
                  <span style={pillStyle('#E5EDFF')}>
                    {row[col.key] || '-'}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div
        className='flex items-center justify-between px-6 py-3'
        style={{ borderTop: '1px #E4E7EE solid' }}
      >
        <div className='flex items-center gap-2'>
          <span style={{ color: '#2C3853', fontSize: 13, fontWeight: 500 }}>
            Rows per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className='rounded-md px-2 py-1 text-sm outline-none'
            style={{
              border: '1px solid #AAB7D2',
              color: '#2C3853',
              fontFamily: 'Inter',
              background: 'white'
            }}
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-1'>
          <span style={{ color: '#2C3853', fontSize: 13, fontWeight: 500 }}>
            {totalRows > 0 ? startIdx + 1 : 0}–{endIdx} of {totalRows}
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className='flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[#E5EDFF] disabled:opacity-30'
            aria-label='Previous page'
          >
            <ChevronLeft className='h-4 w-4' style={{ color: '#2C3853' }} />
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className='flex items-center justify-center rounded-md p-1 transition-colors hover:bg-[#E5EDFF] disabled:opacity-30'
            aria-label='Next page'
          >
            <ChevronRight className='h-4 w-4' style={{ color: '#2C3853' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
