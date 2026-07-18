'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useOverlapRecordVersions,
  useVersionedOverlapRecords
} from '@/http-hooks/persona-versions'
import { RootState } from '@/redux/store'
import { ArrowLeft } from 'lucide-react'
import { CSVLink } from 'react-csv'
import { useSelector } from 'react-redux'

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThreeDotsIcon } from '@/components/icons/icons'

import PreviewTable from './PreviewTable'
import { recordType } from './Segment'

const RECORD_TYPE_LABEL: Record<string, string> = {
  CUSTOMER: 'Customer Data Preview',
  PROSPECT: 'Prospects Data Preview',
  OPPORTUNITY: 'Opportunity Data Preview'
}

const ActionPopover: React.FC<{ recordType: recordType; data: any }> = ({
  recordType,
  data
}) => {
  const [openPreview, setOpenPreview] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [csvData, setCsvData] = useState<any>([])

  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  // Fetch versions for all record types to ensure we find sync versions for Contacts and Deals
  const { data: prospectVersionsRes, isLoading: isLoadingProspectVersions } =
    useOverlapRecordVersions(
      organization?.id,
      openPreview && !!organization?.id,
      'PROSPECT'
    )
  const { data: customerVersionsRes, isLoading: isLoadingCustomerVersions } =
    useOverlapRecordVersions(
      organization?.id,
      openPreview && !!organization?.id,
      'CUSTOMER'
    )
  const {
    data: opportunityVersionsRes,
    isLoading: isLoadingOpportunityVersions
  } = useOverlapRecordVersions(
    organization?.id,
    openPreview && !!organization?.id,
    'OPPORTUNITY'
  )

  const isLoadingVersions =
    isLoadingProspectVersions ||
    isLoadingCustomerVersions ||
    isLoadingOpportunityVersions

  const normalizedVersions = useMemo(() => {
    const pList = (prospectVersionsRes as any)?.data ?? []
    const cList = (customerVersionsRes as any)?.data ?? []
    const oList = (opportunityVersionsRes as any)?.data ?? []
    const raw = [...pList, ...cList, ...oList]

    return Array.from(new Map(raw.map((v) => [v.versionId, v])).values()).sort(
      (a, b) => b.versionId - a.versionId
    )
  }, [prospectVersionsRes, customerVersionsRes, opportunityVersionsRes])

  // Auto-select newest version whenever the dialog opens or the version list changes.
  useEffect(() => {
    if (!openPreview || !normalizedVersions.length) return

    const hasSelectedVersion = normalizedVersions.some(
      (version) => version.versionId === selectedVersion
    )

    if (!hasSelectedVersion) {
      setSelectedVersion(normalizedVersions[0].versionId)
    }
  }, [normalizedVersions, openPreview, selectedVersion])

  // Reset selected version when dialog closes
  useEffect(() => {
    if (!openPreview) {
      setSelectedVersion(null)
    }
  }, [openPreview])

  const versionsData = useMemo(() => {
    return {
      success: true,
      data: normalizedVersions
    }
  }, [normalizedVersions])

  // Fetch records for the selected version
  const { data: versionedRecordsData, isLoading: isLoadingVersionData } =
    useVersionedOverlapRecords(
      recordType,
      selectedVersion,
      openPreview && selectedVersion != null
    )

  const normalizedVersionedRecords = useMemo(() => {
    const raw = versionedRecordsData as any

    if (Array.isArray(raw)) return raw
    if (Array.isArray(raw?.data)) return raw.data

    return []
  }, [versionedRecordsData])

  const handleExport = () => {
    const headers = [
      'Name',
      'Company Name',
      'Website',
      'Email',
      'Deal Stage',
      'Creation Date',
      'Close Date',
      'Subscribed',
      'Ticket Size'
    ]

    const rows =
      data?.[0]?.fields?.map((item: any) => [
        item.name || '',
        item.companyName || '',
        item.domain || '',
        item.contactEmail || '',
        item.dealStage || '',
        item.creationDate || '',
        item.closeDate || '',
        item.subscribed ?? '',
        item.ticketSize ?? ''
      ]) ?? []

    return [headers, ...rows]
  }

  useEffect(() => {
    if (data) {
      setCsvData(handleExport())
    }
  }, [data])

  // Build a legacy-compatible data shape from the versioned records response
  const legacyData = useMemo(() => {
    if (!selectedVersion) return data
    if (!normalizedVersionedRecords.length) return []

    const firstRecord = normalizedVersionedRecords[0]

    if (Array.isArray(firstRecord?.fields)) {
      return normalizedVersionedRecords
    }

    return [{ fields: normalizedVersionedRecords }]
  }, [data, normalizedVersionedRecords, selectedVersion])

  return (
    <>
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className='w-screen max-w-none items-start px-0'>
          <div className=''>
            <ScrollArea className='h-screen p-6'>
              <DialogClose className='flex items-center gap-1.5 text-sm font-semibold text-[#3E50F7]'>
                <ArrowLeft size={20} /> Back to home
              </DialogClose>

              <PreviewTable
                data={legacyData}
                isLoadingVersionData={isLoadingVersionData}
                title={
                  RECORD_TYPE_LABEL[recordType] ?? `${recordType} Data Preview`
                }
                showVersionDropdown
                versionsData={versionsData}
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
                isLoadingVersions={isLoadingVersions}
              />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger className='rotate-90 items-start'>
          <ThreeDotsIcon />
        </PopoverTrigger>
        <PopoverContent className='flex w-[200px] flex-col p-1'>
          <CSVLink data={csvData} filename={`${recordType}_data`}>
            <button className='flex w-full items-start rounded-lg px-4 py-2 hover:bg-gray-100'>
              Export data
            </button>
          </CSVLink>
          <button
            onClick={() => setOpenPreview(true)}
            className='flex w-full items-start rounded-lg px-4 py-2 hover:bg-gray-100'
          >
            Preview data
          </button>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default ActionPopover
