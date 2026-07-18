// components/shared/PageTable.tsx
import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { cn } from '@/lib/utils'
import {
  OFFLINE_STATUS_BADGE_COMMON_CLASSNAME,
  OFFLINE_STATUS_BADGE_COMMON_CLASSNAME_BLUE
} from '@/app/(app)/(dashboard-pages)/offline-partners/constants'

import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'

type RowDetailsType = {
  type: string
  value?: string
  className?: string
  variant?: string
  href?: string
  // Support both old format (for backward compatibility) and new format
  customComponent?: React.ReactNode
  customComponentType?: string
  customComponentProps?: Record<string, any>
}

type TableRow = {
  href: string
  rowDetails: RowDetailsType[]
}

type PageTableTypes = {
  tableActions: React.ReactNode
  headers: string[]
  rows: TableRow[]
  selectedRows: string[]
  onRowSelect: (href: string) => void
  onSelectAll: () => void
  isAllSelected?: boolean
  tableActionParentClass?: string
}

const PageTable = ({
  tableActions,
  headers,
  rows,
  selectedRows,
  onRowSelect,
  onSelectAll,
  isAllSelected = false,
  tableActionParentClass = ''
}: PageTableTypes) => {
  const renderTableCell = (cell: RowDetailsType) => {
    switch (cell.type) {
      case 'heading':
        return (
          <div
            className={cn('text-sm font-medium text-text-100', cell.className)}
          >
            {cell.value}
          </div>
        )
      case 'text':
        return (
          <div className={cn('text-sm text-text-70', cell.className)}>
            {cell.value}
          </div>
        )
      case 'badge':
        return (
          <Badge
            variant={'outline'}
            className={cn(
              cell.value == 'INVITE_NOT_SENT'
                ? OFFLINE_STATUS_BADGE_COMMON_CLASSNAME_BLUE
                : OFFLINE_STATUS_BADGE_COMMON_CLASSNAME,
              cell.className
            )}
          >
            {cell.value}
          </Badge>
        )
      case 'link':
        return (
          <Link
            href={cell.href || '#'}
            className={cn('text-sm text-primary', cell.className)}
          >
            {cell.value}
          </Link>
        )
      case 'custom':
        return cell.customComponent ?? null
      default:
        return null
    }
  }

  const renderRowDetails = (rowDetails: RowDetailsType[], href: string) => {
    return rowDetails.map((cell: RowDetailsType, cellIndex: number) => (
      <TableCell key={cellIndex} className='py-0'>
        <div className='flex items-center gap-1'>
          {cellIndex === 0 && (
            <Checkbox
              className='ml-3 h-4 w-4 rounded-[4px]'
              checked={selectedRows.includes(href)}
              onClick={(e) => {
                e.stopPropagation()
                onRowSelect(href)
              }}
            />
          )}

          {/* Only wrap with Link for non-custom cells so custom components remain interactive */}
          {cell.type === 'custom' ? (
            <div className='flex-1 px-3 py-4'>{renderTableCell(cell)}</div>
          ) : (
            <Link href={href} className='flex-1 px-3 py-4'>
              {renderTableCell(cell)}
            </Link>
          )}
        </div>
      </TableCell>
    ))
  }

  return (
    <div className='flex flex-col'>
      <div className={clsx('flex justify-end', tableActionParentClass)}>
        {tableActions}
      </div>
      <Table>
        <TableHeader className='bg-[#fbfbfb]'>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                className='text-xs font-medium text-text-70'
                key={index}
              >
                <div className='flex items-center gap-4 px-3 text-sm font-medium text-[#ADB7CB]'>
                  {index === 0 && (
                    <Checkbox
                      className='h-4 w-4 rounded-[4px]'
                      checked={isAllSelected}
                      onCheckedChange={() => onSelectAll()}
                    />
                  )}
                  {header}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {renderRowDetails(row.rowDetails, row.href)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PageTable
