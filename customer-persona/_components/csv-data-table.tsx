'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export function CsvDataTable({
  selectedMapping,
  data,
  csvHeaders
}: {
  selectedMapping: Record<string, string>
  data: any[]
  csvHeaders: string[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'LEAD NAME',
      header: 'LEAD NAME',
      cell: ({ row }) => {
        const index = csvHeaders.indexOf(selectedMapping['Full Name'])
        const fullNameValue = row.original[index]

        return (
          <div className='capitalize'>
            {fullNameValue && fullNameValue !== 'other' ? fullNameValue : '--'}
          </div>
        )
      }
    },
    {
      accessorKey: 'Website',
      header: 'Website',
      cell: ({ row }) => {
        const index = csvHeaders.indexOf(selectedMapping['Website'])
        const websiteValue = row.original[index]

        return (
          <div className='capitalize'>
            {websiteValue && websiteValue !== 'other' ? websiteValue : '--'}
          </div>
        )
      }
    },
    {
      accessorKey: 'Phone Number',
      header: 'Phone Number',
      cell: ({ row }) => {
        const index = csvHeaders.indexOf(selectedMapping['Phone Number'])
        const phoneValue = row.original[index]

        return (
          <div className='capitalize'>
            {phoneValue && phoneValue !== 'other' ? phoneValue : '--'}
          </div>
        )
      }
    },
    {
      accessorKey: 'City',
      header: 'City',
      cell: ({ row }) => {
        const index = csvHeaders.indexOf(selectedMapping['City'])
        const cityValue = row.original[index]

        return (
          <div className='capitalize'>
            {cityValue && cityValue !== 'other' ? cityValue : '--'}
          </div>
        )
      }
    },
    {
      accessorKey: 'Country',
      header: 'Country',
      cell: ({ row }) => {
        const index = csvHeaders.indexOf(selectedMapping['Country'])
        const countryValue = row.original[index]

        return (
          <div className='capitalize'>
            {countryValue && countryValue !== 'other' ? countryValue : '--'}
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
