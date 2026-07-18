import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface TableColumn {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
  showPagination?: boolean
  paginationInfo?: {
    current: number
    total: number
    onPrevious?: () => void
    onNext?: () => void
  }
}

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  showPagination = true,
  paginationInfo
}: DataTableProps) => {
  if (loading) {
    return (
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border dark:bg-card'>
        <div className='flex items-center justify-center py-12'>
          <p className='text-sm text-gray-500 dark:text-white'>Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border dark:bg-card'>
        <div className='flex items-center justify-center py-12'>
          <p className='text-sm text-gray-500 dark:text-white'>
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-border dark:bg-card'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-white'>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className='px-6 py-3 font-medium'>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className='dark:bg-white/5/50 hover:bg-gray-50'
              >
                {columns.map((column) => (
                  <td key={column.key} className='px-6 py-4'>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <div className='flex items-center justify-between border-t border-gray-100 px-6 py-3 text-xs text-gray-500 dark:text-white'>
          <span>
            Showing {paginationInfo?.current || 1}-{data.length} of{' '}
            {paginationInfo?.total || data.length}
          </span>
          <div className='flex gap-1'>
            <button
              onClick={paginationInfo?.onPrevious}
              disabled={!paginationInfo?.onPrevious}
              className='flex h-6 w-6 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-white/5'
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={paginationInfo?.onNext}
              disabled={!paginationInfo?.onNext}
              className='flex h-6 w-6 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-white/5'
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
