import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { OFFLINE_STATUS_BADGE_COMMON_CLASSNAME } from '@/app/(app)/(dashboard-pages)/offline-partners/constants'

type RowDetailsType = {
  type: string
  value: string
  className?: string
  variant?: string
  href?: string
  customComponent?: React.ReactNode
}

type TableRow = {
  href: string
  rowDetails: RowDetailsType[]
}

type PageTableTypes = {
  headers: string[]
  rows: TableRow[]
  selectedRows: string[]
  onRowSelect: (href: string) => void
  onSelectAll: () => void
  isAllSelected?: boolean
  tableActionParentClass?: string
}

const PageTable = ({
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
          <div className={cn('text-sm text-[#1E1E1E] ', cell.className)}>
            {cell.value}
          </div>
        )
      case 'badge':
        return (
          <Badge
            variant={'outline'}
            className={cn(
              'rounded-[5px] border-none !p-1 text-sm font-medium first-letter:uppercase',
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
        return cell.customComponent
      default:
        return null
    }
  }

  const renderRowDetails = (rowDetails: RowDetailsType[], href: string) => {
    return rowDetails.map((cell: RowDetailsType, cellIndex: number) => (
      <>
        {cellIndex === 0 && (
          <TableCell key={cellIndex} className='border-x-[0.5px] py-0'>
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
            </div>
          </TableCell>
        )}
        <TableCell key={cellIndex} className='border-x-[0.5px] py-0'>
          <div className='flex items-center gap-1'>
            <Link href={href} className='flex-1 py-3'>
              {renderTableCell(cell)}
            </Link>
          </div>
        </TableCell>
      </>
    ))
  }

  return (
    <div className='flex flex-col gap-6'>
      <Table>
        <TableHeader className='bg-[#F4F4F4]'>
          <TableRow>
            {headers.map((header, index) => (
              <>
                {index === 0 && (
                  <TableHead
                    className='text-xs font-medium text-text-70'
                    key={index}
                  >
                    <Checkbox
                      className='h-4 w-4 rounded-[4px]'
                      checked={isAllSelected}
                      onCheckedChange={() => onSelectAll()}
                    />
                  </TableHead>
                )}
                <TableHead
                  className='border-x-[0.5px] border-[#DBDBDF] text-sm font-medium text-[#1E1E1E]'
                  key={index}
                >
                  <div className='flex items-center gap-4 py-2 font-medium'>
                    {header}
                  </div>
                </TableHead>
              </>
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
