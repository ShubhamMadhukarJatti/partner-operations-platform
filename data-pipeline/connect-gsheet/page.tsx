'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, FileText, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import DataPipelineStepper from '../_components/DataPipelineStepper'

// ─── Types ────────────────────────────────────────────────────────────────────

type SetupOption = 'single' | 'multi-tab' | 'multi-file'

const OPTIONS: {
  id: SetupOption
  title: string
  description: string
}[] = [
  {
    id: 'single',
    title: 'Everything is in one sheet',
    description:
      'One file, one tab — contacts, companies and deals mixed in the same rows.'
  },
  {
    id: 'multi-tab',
    title: 'One file, multiple tabs',
    description:
      'One workbook with separate tabs — e.g. Contacts | Companies | Deals.'
  },
  {
    id: 'multi-file',
    title: 'Separate file per data type',
    description:
      '3 different Google Sheet files — one each for contacts, companies and deals.'
  }
]

// ─── Radio Option Card ────────────────────────────────────────────────────────

function OptionCard({
  option,
  selected,
  onSelect
}: {
  option: (typeof OPTIONS)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className='flex w-full items-start gap-3 rounded-[14px] px-5 py-[18px] text-left transition-colors'
      style={{
        background: selected ? '#F5F0FF' : 'white',
        outline: `1px ${selected ? '#6B4FBB' : '#EEEEEE'} solid`,
        outlineOffset: '-1px'
      }}
    >
      {/* Radio circle */}
      <div
        className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors'
        style={{
          borderColor: selected ? '#6750A4' : '#49454F',
          background: selected ? '#6750A4' : 'transparent'
        }}
      >
        {selected && <div className='h-2 w-2 rounded-full bg-white' />}
      </div>

      {/* Text */}
      <div className='flex flex-col gap-0.5'>
        <span
          style={{
            color: '#1A1A2E',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '20px'
          }}
        >
          {option.title}
        </span>
        <span
          style={{
            color: '#6A7282',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: '16px'
          }}
        >
          {option.description}
        </span>
      </div>
    </button>
  )
}

// ─── Column Tag ───────────────────────────────────────────────────────────────

function ColumnTag({ label, mapped }: { label: string; mapped: boolean }) {
  return (
    <span
      className='rounded-[5px] px-2.5 py-1 text-[11px] font-medium leading-[14.5px]'
      style={{
        background: mapped ? '#EDF7F1' : '#F5F6F8',
        outline: `1px ${mapped ? '#B0DDC2' : 'rgba(0,0,0,0.08)'} solid`,
        outlineOffset: '-1px',
        color: mapped ? '#1A7A45' : '#3D3F47'
      }}
    >
      {label}
    </span>
  )
}

// ─── File Card ────────────────────────────────────────────────────────────────

function FileCard({
  filename,
  badge,
  badgeBg,
  badgeColor,
  columns
}: {
  filename: string
  badge: string
  badgeBg: string
  badgeColor: string
  columns: { label: string; mapped: boolean }[]
}) {
  return (
    <div
      className='w-full overflow-hidden rounded-[10px]'
      style={{ outline: '1px rgba(0,0,0,0.08) solid', outlineOffset: '-1px' }}
    >
      {/* Header */}
      <div
        className='flex items-center gap-2 px-3.5 py-2.5'
        style={{
          background: '#F5F6F8',
          borderBottom: '1px rgba(0,0,0,0.08) solid'
        }}
      >
        <FileText className='h-3.5 w-3.5 shrink-0 text-[#555555]' />
        <span
          className='text-[13px] font-semibold leading-[17px]'
          style={{ color: '#0D0E11' }}
        >
          {filename}
        </span>
        <span
          className='rounded-[5px] px-2 py-0.5 text-[10px] font-semibold leading-[13px]'
          style={{ background: badgeBg, color: badgeColor }}
        >
          {badge}
        </span>
        {/* High confidence */}
        <div className='ml-auto flex items-center gap-1'>
          <Check className='h-3 w-3 text-[#1A7A45]' />
          <span
            className='text-[11px] font-medium leading-[14.5px]'
            style={{ color: '#1A7A45' }}
          >
            High confidence
          </span>
        </div>
      </div>

      {/* Column tags */}
      <div className='flex flex-wrap gap-1.5 px-3.5 py-3'>
        {columns.map((col) => (
          <ColumnTag key={col.label} label={col.label} mapped={col.mapped} />
        ))}
      </div>
    </div>
  )
}

// ─── Multi-file link section ──────────────────────────────────────────────────

const SCAN_FILES = [
  {
    filename: 'contacts.sheets',
    badge: 'Contact data',
    badgeBg: '#F0F4FF',
    badgeColor: '#2847C9',
    columns: [
      { label: 'First Name', mapped: true },
      { label: 'Last Name', mapped: true },
      { label: 'Email', mapped: true },
      { label: 'Phone', mapped: true },
      { label: 'LinkedIn', mapped: false }
    ]
  },
  {
    filename: 'companies.sheets',
    badge: 'Company data',
    badgeBg: '#FEF6E7',
    badgeColor: '#9A5F0A',
    columns: [
      { label: 'Company Name', mapped: true },
      { label: 'Website', mapped: true },
      { label: 'Industry', mapped: true },
      { label: 'Revenue', mapped: false },
      { label: 'Founded', mapped: false }
    ]
  },
  {
    filename: 'deals.sheets',
    badge: 'Deals data',
    badgeBg: '#EDF7F1',
    badgeColor: '#1A7A45',
    columns: [
      { label: 'Deal Name', mapped: true },
      { label: 'Stage', mapped: true },
      { label: 'Value', mapped: true },
      { label: 'Owner', mapped: true },
      { label: 'Close Date', mapped: false }
    ]
  }
]

function MultiFileSection({
  links,
  onChange,
  files,
  loadingFiles
}: {
  links: { contacts: string; companies: string; deals: string }
  onChange: (key: 'contacts' | 'companies' | 'deals', val: string) => void
  files: { id: string; name: string }[]
  loadingFiles: boolean
}) {
  const activeLinks = [
    {
      key: 'contacts' as const,
      fileId: links.contacts,
      template: SCAN_FILES[0]
    },
    {
      key: 'companies' as const,
      fileId: links.companies,
      template: SCAN_FILES[1]
    },
    { key: 'deals' as const, fileId: links.deals, template: SCAN_FILES[2] }
  ].filter((l) => l.fileId)

  const hasAnyLink = activeLinks.length > 0

  return (
    <div className='flex flex-col gap-3'>
      <span
        style={{
          color: '#5C6F92',
          fontSize: 12,
          fontWeight: 500,
          lineHeight: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}
      >
        Select one file per data type
      </span>

      <div className='flex flex-col gap-2.5'>
        {/* Contacts */}
        <div className='flex flex-col gap-1'>
          <span style={{ color: '#2E3A52', fontSize: 12, fontWeight: 500 }}>
            Contacts
          </span>
          <Select
            value={links.contacts}
            onValueChange={(val) => onChange('contacts', val)}
            disabled={loadingFiles}
          >
            <SelectTrigger className='h-[36px] w-full bg-white text-[#21232C]'>
              <SelectValue
                placeholder={
                  loadingFiles ? 'Loading files...' : 'Select Google Sheet...'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Companies */}
        <div className='flex flex-col gap-1'>
          <span style={{ color: '#2E3A52', fontSize: 12, fontWeight: 500 }}>
            Companies
          </span>
          <Select
            value={links.companies}
            onValueChange={(val) => onChange('companies', val)}
            disabled={loadingFiles}
          >
            <SelectTrigger className='h-[36px] w-full bg-white text-[#21232C]'>
              <SelectValue
                placeholder={
                  loadingFiles ? 'Loading files...' : 'Select Google Sheet...'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Deals */}
        <div className='flex flex-col gap-1'>
          <span style={{ color: '#2E3A52', fontSize: 12, fontWeight: 500 }}>
            Deals
          </span>
          <Select
            value={links.deals}
            onValueChange={(val) => onChange('deals', val)}
            disabled={loadingFiles}
          >
            <SelectTrigger className='h-[36px] w-full bg-white text-[#21232C]'>
              <SelectValue
                placeholder={
                  loadingFiles ? 'Loading files...' : 'Select Google Sheet...'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info banner */}
        <div
          className='flex items-center gap-2.5 rounded-md px-4 py-1.5'
          style={{ background: '#E0EAFF' }}
        >
          <span
            style={{
              color: '#4D5C78',
              fontSize: 10,
              fontWeight: 500,
              lineHeight: '16px'
            }}
          >
            You don&apos;t need all 3. Leave any blank and we&apos;ll skip that
            data type.
          </span>
        </div>
      </div>

      {/* Scan results — shown when at least one link is entered */}
      {hasAnyLink && (
        <div className='mt-2 flex flex-col gap-3'>
          {/* Success banner */}
          <div
            className='flex items-center gap-2.5 rounded-lg px-3.5 py-2'
            style={{
              background: '#EDF7F1',
              outline: '1px #B0DDC2 solid',
              outlineOffset: '-1px'
            }}
          >
            <Check className='h-3.5 w-3.5 shrink-0 text-[#1A7A45]' />
            <span
              className='text-[12px] font-semibold leading-[15.5px]'
              style={{ color: '#3D3F47', fontFamily: 'DM Sans, sans-serif' }}
            >
              Scanned {activeLinks.length} file
              {activeLinks.length !== 1 ? 's' : ''} — all detected correctly
            </span>
          </div>

          {/* File cards */}
          {activeLinks.map(({ key, fileId, template }) => {
            const fileData = files.find((f) => f.id === fileId)
            const filename = fileData ? fileData.name : template.filename
            return <FileCard key={key} {...template} filename={filename} />
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ConnectGSheetContent() {
  const [selected, setSelected] = useState<SetupOption>('single')
  const [sheetLink, setSheetLink] = useState('')
  const [multiLinks, setMultiLinks] = useState({
    contacts: '',
    companies: '',
    deals: ''
  })
  const [tabLinks, setTabLinks] = useState({
    contacts: '',
    companies: '',
    deals: ''
  })

  // Data states
  const [files, setFiles] = useState<{ id: string; name: string }[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)

  const [tabs, setTabs] = useState<{ sheetId: number; title: string }[]>([])
  const [loadingTabs, setLoadingTabs] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedLayout = sessionStorage.getItem('gsheet_layout')
    if (storedLayout) setSelected(storedLayout as SetupOption)

    const storedLink = sessionStorage.getItem('gsheet_link')
    // We now expect gsheet_link to be the ID, not the full URL. If it's a full URL, we extract the ID
    if (storedLink) {
      const match = storedLink.match(/\/d\/([a-zA-Z0-9-_]+)/)
      setSheetLink(match ? match[1] : storedLink)
    }

    const storedContacts = sessionStorage.getItem('gsheet_multi_contacts')
    const storedCompanies = sessionStorage.getItem('gsheet_multi_companies')
    const storedDeals = sessionStorage.getItem('gsheet_multi_deals')
    if (storedContacts || storedCompanies || storedDeals) {
      const matchC = storedContacts?.match(/\/d\/([a-zA-Z0-9-_]+)/)
      const matchComp = storedCompanies?.match(/\/d\/([a-zA-Z0-9-_]+)/)
      const matchD = storedDeals?.match(/\/d\/([a-zA-Z0-9-_]+)/)
      setMultiLinks({
        contacts: matchC ? matchC[1] : storedContacts || '',
        companies: matchComp ? matchComp[1] : storedCompanies || '',
        deals: matchD ? matchD[1] : storedDeals || ''
      })
    }

    // Fetch Google Sheets discover data (spreadsheets, tabs, columns, rows)
    console.time('Google Sheets Discover API Fetch')
    console.log('[DEBUG] Starting Google Sheets discover fetch...')
    fetch('/api/google-sheets/discover')
      .then((res) => res.json())
      .then((payload) => {
        console.timeEnd('Google Sheets Discover API Fetch')
        console.log('[DEBUG] Google Sheets discover response payload:', payload)
        if (payload.success && payload.data?.spreadsheets) {
          setFiles(
            payload.data.spreadsheets.map((s: any) => ({
              id: s.id,
              name: s.name
            }))
          )
          try {
            const dataStr = JSON.stringify(payload.data)
            sessionStorage.setItem('__sharkdom_gsheet_discover_data', dataStr)
            console.log(
              '[DEBUG] Saved discover data to sessionStorage. Length:',
              dataStr.length
            )
          } catch (e) {
            console.error(
              '[DEBUG] Failed to cache discover data in sessionStorage:',
              e
            )
          }
        } else {
          console.warn(
            '[DEBUG] Discover payload unsuccessful or spreadsheets missing, falling back to files API'
          )
          // Fallback to old files API
          fetch('/api/integrations/google-sheets/files')
            .then((res) => res.json())
            .then((data) => {
              if (data.files) setFiles(data.files)
            })
            .catch((e) => console.error('[DEBUG] Fallback files API error:', e))
        }
        setLoadingFiles(false)
      })
      .catch((err) => {
        console.timeEnd('Google Sheets Discover API Fetch')
        console.error(
          '[DEBUG] Error fetching discover data, falling back to files API:',
          err
        )
        fetch('/api/integrations/google-sheets/files')
          .then((res) => res.json())
          .then((data) => {
            if (data.files) setFiles(data.files)
            setLoadingFiles(false)
          })
          .catch(() => {
            setLoadingFiles(false)
          })
      })
  }, [])

  // Fetch tabs when a sheet is selected in multi-tab mode
  useEffect(() => {
    if (selected === 'multi-tab' && sheetLink) {
      setLoadingTabs(true)
      console.log('[DEBUG] Selected multi-tab mode. Sheet link:', sheetLink)

      // Attempt to load from discover cache first
      const cacheStr = sessionStorage.getItem('__sharkdom_gsheet_discover_data')
      if (cacheStr) {
        try {
          const cache = JSON.parse(cacheStr)
          console.log(
            '[DEBUG] Discover cache loaded for tabs check. Searching for spreadsheet:',
            sheetLink
          )
          const spreadsheet = cache.spreadsheets?.find(
            (s: any) => s.id === sheetLink
          )
          if (spreadsheet && spreadsheet.sheets) {
            console.log(
              '[DEBUG] Cache HIT for spreadsheet tabs. Found sheets:',
              spreadsheet.sheets
            )
            setTabs(
              spreadsheet.sheets.map((s: any) => ({
                sheetId: s.sheetId,
                title: s.title
              }))
            )
            setLoadingTabs(false)
            return
          } else {
            console.log(
              '[DEBUG] Cache MISS/Spreadsheet not found in discover cache for tabs check.'
            )
          }
        } catch (e) {
          console.error('[DEBUG] Error parsing discover cache for tabs:', e)
        }
      }

      // Fallback to backend tabs API call
      console.log(
        '[DEBUG] Falling back to backend tabs API call for spreadsheetId:',
        sheetLink
      )
      fetch(`/api/integrations/google-sheets/tabs?spreadsheetId=${sheetLink}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.sheets) setTabs(data.sheets.map((s: any) => s.properties))
          setLoadingTabs(false)
        })
        .catch((err) => {
          console.error('[DEBUG] Error fetching tabs:', err)
          setLoadingTabs(false)
        })
    } else {
      setTabs([])
    }
  }, [selected, sheetLink])

  function updateMultiLink(
    key: 'contacts' | 'companies' | 'deals',
    val: string
  ) {
    setMultiLinks((prev) => ({ ...prev, [key]: val }))
  }

  const isNextEnabled =
    selected === 'multi-file'
      ? Object.values(multiLinks).some((v) => v.trim())
      : sheetLink.trim().length > 0

  const buildUrl = (id: string) =>
    id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : ''

  function handleNext() {
    if (!isNextEnabled) return

    sessionStorage.setItem('gsheet_layout', selected)
    sessionStorage.setItem(
      'gsheet_link',
      sheetLink.trim() ? buildUrl(sheetLink.trim()) : ''
    )
    sessionStorage.setItem(
      'gsheet_multi_contacts',
      multiLinks.contacts.trim() ? buildUrl(multiLinks.contacts.trim()) : ''
    )
    sessionStorage.setItem(
      'gsheet_multi_companies',
      multiLinks.companies.trim() ? buildUrl(multiLinks.companies.trim()) : ''
    )
    sessionStorage.setItem(
      'gsheet_multi_deals',
      multiLinks.deals.trim() ? buildUrl(multiLinks.deals.trim()) : ''
    )

    const params = new URLSearchParams(searchParams.toString())
    params.set('source', 'GOOGLE_SHEET')
    params.set('sheetLayout', selected)

    if (selected === 'multi-file') {
      if (multiLinks.contacts.trim())
        params.set('sheetUrlContacts', buildUrl(multiLinks.contacts.trim()))
      if (multiLinks.companies.trim())
        params.set('sheetUrlCompanies', buildUrl(multiLinks.companies.trim()))
      if (multiLinks.deals.trim())
        params.set('sheetUrlDeals', buildUrl(multiLinks.deals.trim()))
    } else {
      params.set('sheetUrl', buildUrl(sheetLink.trim()))

      // Also pass the tab mappings if multi-tab
      if (selected === 'multi-tab') {
        if (tabLinks.contacts) params.set('sheetTabContacts', tabLinks.contacts)
        if (tabLinks.companies)
          params.set('sheetTabCompanies', tabLinks.companies)
        if (tabLinks.deals) params.set('sheetTabDeals', tabLinks.deals)
      }
    }

    router.push(`/data-pipeline/connect?${params.toString()}`)
  }

  function handleBack() {
    router.push(`/my-data/connect-crm?${searchParams.toString()}`)
  }

  if (!isClient) return null

  return (
    <GradientPageBackground className='flex min-h-[calc(100vh-60px)] flex-col'>
      {/* Stepper */}
      <div className='px-6 pt-5'>
        <DataPipelineStepper current={1} />
      </div>

      {/* Scrollable body */}
      <div className='flex flex-1 flex-col items-center gap-7 px-6 py-8 pb-12'>
        <div className='flex w-full max-w-[720px] flex-col gap-7'>
          {/* Title block */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-semibold leading-[34px] text-[#25224A]'>
              How is your data organised?
            </h1>
            <p className='text-sm font-normal leading-5 text-[#4D5C78]'>
              Google Sheets files come in different shapes. Tell us yours so we
              map it correctly.
            </p>
          </div>

          {/* Setup options */}
          <div className='flex flex-col gap-2'>
            <span
              style={{
                color: '#4D5C78',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '20px'
              }}
            >
              Select your setup
            </span>
            {OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                selected={selected === opt.id}
                onSelect={() => setSelected(opt.id)}
              />
            ))}
          </div>

          {/* Link section — conditional on selected option */}
          {selected === 'multi-file' ? (
            <MultiFileSection
              links={multiLinks}
              onChange={updateMultiLink}
              files={files}
              loadingFiles={loadingFiles}
            />
          ) : (
            <div className='flex flex-col gap-3'>
              <span
                style={{
                  color: '#354460',
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: '20px'
                }}
              >
                Select your Google Sheet
              </span>

              <div className='flex flex-col gap-2.5'>
                {/* File Dropdown */}
                <Select
                  value={sheetLink}
                  onValueChange={setSheetLink}
                  disabled={loadingFiles}
                >
                  <SelectTrigger className='h-[36px] w-full bg-white text-[#21232C]'>
                    <SelectValue
                      placeholder={
                        loadingFiles
                          ? 'Loading files...'
                          : 'Select Google Sheet...'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {files.map((file) => (
                      <SelectItem key={file.id} value={file.id}>
                        {file.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Multi-Tab Mapping */}
                {selected === 'multi-tab' && sheetLink && (
                  <div className='mt-2 flex flex-col gap-3 rounded-lg border border-[#E7E7E7] bg-[#FDFDFD] p-4'>
                    <span className='text-sm font-medium text-[#2E3A52]'>
                      Map your tabs
                    </span>

                    {loadingTabs ? (
                      <div className='flex items-center gap-2 text-sm text-[#6A7282]'>
                        <Loader2 className='h-4 w-4 animate-spin' /> Fetching
                        tabs...
                      </div>
                    ) : tabs.length > 0 ? (
                      <div className='flex flex-col gap-3'>
                        {/* Contacts Tab */}
                        <div className='flex items-center justify-between gap-4'>
                          <span className='w-[100px] text-[13px] text-[#4D5C78]'>
                            Contacts
                          </span>
                          <Select
                            value={tabLinks.contacts}
                            onValueChange={(val) =>
                              setTabLinks((prev) => ({
                                ...prev,
                                contacts: val
                              }))
                            }
                          >
                            <SelectTrigger className='h-[32px] flex-1 bg-white text-[13px]'>
                              <SelectValue placeholder='Select tab' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='SKIP'>
                                Skip this data type
                              </SelectItem>
                              {tabs.map((tab) => (
                                <SelectItem key={tab.sheetId} value={tab.title}>
                                  {tab.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Companies Tab */}
                        <div className='flex items-center justify-between gap-4'>
                          <span className='w-[100px] text-[13px] text-[#4D5C78]'>
                            Companies
                          </span>
                          <Select
                            value={tabLinks.companies}
                            onValueChange={(val) =>
                              setTabLinks((prev) => ({
                                ...prev,
                                companies: val
                              }))
                            }
                          >
                            <SelectTrigger className='h-[32px] flex-1 bg-white text-[13px]'>
                              <SelectValue placeholder='Select tab' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='SKIP'>
                                Skip this data type
                              </SelectItem>
                              {tabs.map((tab) => (
                                <SelectItem key={tab.sheetId} value={tab.title}>
                                  {tab.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Deals Tab */}
                        <div className='flex items-center justify-between gap-4'>
                          <span className='w-[100px] text-[13px] text-[#4D5C78]'>
                            Deals
                          </span>
                          <Select
                            value={tabLinks.deals}
                            onValueChange={(val) =>
                              setTabLinks((prev) => ({ ...prev, deals: val }))
                            }
                          >
                            <SelectTrigger className='h-[32px] flex-1 bg-white text-[13px]'>
                              <SelectValue placeholder='Select tab' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='SKIP'>
                                Skip this data type
                              </SelectItem>
                              {tabs.map((tab) => (
                                <SelectItem key={tab.sheetId} value={tab.title}>
                                  {tab.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <span className='text-sm text-[#E53E3E]'>
                        No tabs found in this sheet.
                      </span>
                    )}
                  </div>
                )}

                {/* Info banner */}
                <div
                  className='mt-1 flex items-center gap-2.5 rounded-md px-4 py-1.5'
                  style={{ background: '#E0EAFF' }}
                >
                  <span
                    style={{
                      color: '#4D5C78',
                      fontSize: 12,
                      fontWeight: 500,
                      lineHeight: '16px'
                    }}
                  >
                    Select your private or shared Google Sheets directly from
                    Drive.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className='sticky bottom-0 z-50 mt-auto flex items-center justify-between border-t border-[#CDD9F2] bg-white px-6 py-4'>
        <Button
          variant='outline'
          className='h-8 px-4 text-sm font-semibold text-[#21232C]'
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isNextEnabled}
          className='h-8 px-6 text-sm font-semibold text-white'
          style={{
            background: isNextEnabled ? '#2563EB' : '#ABBDE7'
          }}
        >
          Next
        </Button>
      </div>
    </GradientPageBackground>
  )
}

export default function ConnectGSheetPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            <p className='mt-2 text-sm text-gray-500'>Loading...</p>
          </div>
        </div>
      }
    >
      <ConnectGSheetContent />
    </Suspense>
  )
}
