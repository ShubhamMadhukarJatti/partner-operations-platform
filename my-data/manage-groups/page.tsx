'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  useCollaborationsData,
  useCollaborationsDetails
} from '@/http-hooks/collaborations'
import { useOfflinePartnersTable } from '@/http-hooks/offline-partners'
import {
  selectAllRows,
  selectRow,
  setRows,
  TableRow,
  TableRowDetail,
  unselectAllRows,
  unselectRow
} from '@/redux/features/tableSlice'
import { RootState } from '@/redux/store'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { COLORS } from '@/lib/colors'
import { PLACEHOLDER_LOGO_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import GroupActions from '../_components/GroupActions'
import PageTable from '../_components/Table'
import CollaborationsEmptyState from '../../dashboard/_components/collaborations-empty-state'
import { CollaborationDetails } from '../../dashboard/_components/collaborations-table'

enum CollaborationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED'
}
enum CollaborationGroup {
  RELIABLE_PARTNER = 'RELIABLE_PARTNER',
  STEADY_PARTNER = 'STEADY_PARTNER',
  LOW_IMPACT_PARTNER = 'LOW_IMPACT_PARTNER',
  INACTIVE_PARTNER = 'INACTIVE_PARTNER'
}

const ManageGroups = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [page, setPage] = useState<number>(0)
  const { data, isLoading } = useCollaborationsData(
    selectedTab.toUpperCase(),
    page
  )
  const proposals = data?.content ?? []

  const dispatch = useDispatch()
  const { selectedRows, rows, isAllSelected } = useSelector(
    (state: RootState) => ({
      selectedRows: state.table.selectedRows,
      rows: state.table.rows,
      isAllSelected:
        state.table.rows.length > 0 &&
        state.table.selectedRows.length === state.table.rows.length
    })
  )

  const getClassNameForStatus = useCallback((status: string | null): string => {
    if (!status) return 'bg-default'

    switch (status.toUpperCase()) {
      case CollaborationStatus.PENDING:
        return COLORS.WARNING
      case CollaborationStatus.ACTIVE:
        return COLORS.SUCCESS
      case CollaborationStatus.REJECTED:
        return COLORS.ERROR
      default:
        return 'bg-default'
    }
  }, [])

  const getClassNameForGroup = useCallback((group: string): string => {
    switch (group) {
      case CollaborationGroup.RELIABLE_PARTNER:
        return 'bg-[#E4E9FF] text-[#202A89] lowercase first-letter:uppercase'
      case CollaborationGroup.STEADY_PARTNER:
        return 'bg-[#E4E9FF] text-[#202A89]'
      case CollaborationGroup.LOW_IMPACT_PARTNER:
        return 'bg-[#E4E9FF] text-[#202A89]'
      case CollaborationGroup.INACTIVE_PARTNER:
        return 'bg-[#E4E9FF] text-[#202A89]'
      default:
        return 'bg-default'
    }
  }, [])

  useEffect(() => {
    try {
      if (proposals?.length > 0) {
        const tableRows: TableRow[] = proposals.map(
          (proposal: CollaborationDetails, index: number) => {
            // Add null safety checks for all required fields
            const safeProposal = {
              organizationCollaborationId:
                proposal?.organizationCollaborationId ?? 0,
              organizationName:
                proposal?.organizationName ?? 'Unknown Organization',
              logoUrl: proposal?.logoUrl ?? PLACEHOLDER_LOGO_URL,
              collaborationCategory: proposal?.collaborationCategory ?? null,
              creationTimestamp:
                proposal?.creationTimestamp ?? new Date().toISOString(),
              status: proposal?.status ?? null,
              partnerOrganizationId: proposal?.partnerOrganizationId ?? 0
            }

            return {
              href: `/dashboard/${safeProposal.organizationCollaborationId}`,
              orgId: safeProposal.organizationCollaborationId,
              rowDetails: [
                {
                  type: 'custom',
                  value: safeProposal.organizationName,
                  className: 'text-sm font-medium',
                  customComponent: (
                    <div className='flex items-center gap-2  text-sm font-medium'>
                      <Image
                        src={safeProposal.logoUrl}
                        alt={safeProposal.organizationName}
                        width={25}
                        height={25}
                        className='rounded-full'
                      />
                      <span>{safeProposal.organizationName}</span>
                    </div>
                  ),
                  id: 'partnerName'
                } as TableRowDetail,
                {
                  type: 'badge',
                  value: safeProposal.status || 'Unknown',
                  className: getClassNameForStatus(safeProposal.status),
                  id: 'status'
                } as TableRowDetail,
                {
                  type: 'text',
                  value: safeProposal.collaborationCategory ?? 'N/A',
                  id: 'collaborationCategory'
                } as TableRowDetail,
                {
                  type: 'text',
                  value: new Date(
                    safeProposal.creationTimestamp
                  ).toLocaleDateString(),
                  id: 'date'
                } as TableRowDetail,
                {
                  type: 'badge',
                  value:
                    safeProposal.collaborationCategory?.replace(/_/g, ' ') ||
                    'Unassigned',
                  className: getClassNameForGroup(
                    safeProposal.collaborationCategory || ''
                  ),
                  id: 'group'
                } as TableRowDetail
              ]
            }
          }
        )

        dispatch(setRows(tableRows))
      }
    } catch (error) {
      console.error('Error processing proposals data:', error)
      // Clear rows on error to prevent stale data
      dispatch(setRows([]))
    }
  }, [proposals, dispatch, getClassNameForStatus])

  const handleRowSelect = (href: string) => {
    dispatch(selectedRows.includes(href) ? unselectRow(href) : selectRow(href))
  }

  const handleSelectAll = () => {
    dispatch(isAllSelected ? unselectAllRows() : selectAllRows())
  }

  const selectedTableRows = rows.filter((row) =>
    selectedRows.includes(row.href)
  )

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 p-8 py-24'>
        <Skeleton className='h-16 w-full ' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
        <Skeleton className='h-16 w-full' />
      </div>
    )
  }

  if (proposals?.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center py-48'>
        <CollaborationsEmptyState />
      </div>
    )
  }

  const getPagination = (totalPages: number) => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i)

    const range: (number | string)[] = []

    if (page > 2) range.push(0, '...') // Show first page & '...'

    for (
      let i = Math.max(0, page - 2);
      i <= Math.min(totalPages - 1, page + 2);
      i++
    ) {
      range.push(i)
    }

    if (page < totalPages - 3) range.push('...', totalPages - 1) // Show last page & '...'

    return range
  }

  return (
    <div className='px-6 py-6'>
      <div>
        <div className='mb-4 flex justify-between'>
          <h2 className='text-xl font-bold'>My Partners</h2>
          <GroupActions selectedRows={selectedTableRows} />
        </div>
        <PageTable
          headers={[
            'Partner Name',
            'Status',
            // 'Category',
            'Date',
            'Group'
          ]}
          rows={rows}
          // tableActions={<GroupActions selectedRows={selectedTableRows} />}
          tableActionParentClass='!justify-start'
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
        />
      </div>
      <div className='flex items-center justify-center space-x-2 px-8 py-4'>
        <div className='flex w-full justify-between space-x-2'>
          <Button
            className='flex items-center gap-1'
            variant='outline'
            size='sm'
            onClick={() => setPage((page) => page - 1)}
            disabled={data?.first}
          >
            <ArrowLeft /> Previous
          </Button>

          <div>
            {getPagination(data?.totalPages).map((p, index) =>
              typeof p === 'number' ? (
                <Button
                  variant={'ghost'}
                  key={index}
                  className={cn('px-4', page === p && 'bg-blue-500 text-white')}
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </Button>
              ) : (
                <span key={index} className='px-2'>
                  {p}
                </span>
              )
            )}
          </div>

          <Button
            className='flex items-center gap-1'
            variant='outline'
            size='sm'
            onClick={() => setPage((page) => page + 1)}
            disabled={data?.last}
          >
            Next
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManageGroups
