import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useChangeLeadStatus } from '@/http-hooks/partner-programs'
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
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'
import Email from 'next-auth/providers/email'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { showCustomToast } from '@/components/custom-toast'

import { formatDate } from '../../direct-deals/_components/myDeals/MainContent'

// const data: Payment[] = [
//   {
//     id: 'm5gr84i9',
//     amount: 316,
//     status: 'success',
//     email: 'ken99@example.com'
//   },
//   {
//     id: '3u1reuv4',
//     amount: 242,
//     status: 'success',
//     email: 'Abe45@example.com'
//   },
//   {
//     id: 'derv1ws0',
//     amount: 837,
//     status: 'processing',
//     email: 'Monserrat44@example.com'
//   },
//   {
//     id: '5kma53ae',
//     amount: 874,
//     status: 'success',
//     email: 'Silas22@example.com'
//   },
//   {
//     id: 'bhqecj4p',
//     amount: 721,
//     status: 'failed',
//     email: 'carmella@example.com'
//   }
// ]

export const notSetStyle = {
  borderColor: '#F9DBAF',
  color: '#B93815',
  dotColor: '#EF6820',
  backgroundColor: '#FEF6EE'
}

export const qualifiedLeadStyle = {
  borderColor: '#F9DBAF',
  color: '#B93815',
  dotColor: '#EF6820',
  backgroundColor: '#FEF6EE'
}

export const prospectsStyle = {
  borderColor: '#B2DDFF',
  color: '#175CD3',
  dotColor: '#2E90FA',
  backgroundColor: '#EFF8FF'
}

export const openOpportunityStyle = {
  borderColor: '#ABEFC6',
  color: '#067647',
  dotColor: '#17B26A',
  backgroundColor: '#ECFDF3'
}

const status = [
  {
    value: 'NEW',
    label: 'New'
  },
  {
    value: 'OPEN',
    label: 'Open'
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress'
  },
  {
    value: 'OPEN_DEAL',
    label: 'Open Deal'
  },
  {
    value: 'UNQUALIFIED',
    label: 'Unqualified'
  },
  {
    value: 'ATTEMPTED_TO_CONTACT',
    label: 'Attempted to Contact'
  },
  {
    value: 'CONNECTED',
    label: 'Connected'
  }
]

const ActionCell: React.FC<{ row: any; refetch: () => void }> = ({
  row,
  refetch
}) => {
  // const { mutate: changeStatus } = useChangeLeadStatus();
  const mutate = useChangeLeadStatus()

  const params: { code: string } = useParams()

  function handleLeadStatusChange(email: string, status: string) {
    mutate.mutate(
      {
        referralCode: params.code,
        email: email,
        leadsStatus: status
      },
      {
        onSuccess: () => {
          refetch()
        }
      }
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='rotate-90' stroke='#A4A7AE' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='max-w-[282px] rounded-lg border border-[#E9EAEB] p-0 shadow-sm'
        align='end'
      >
        <DropdownMenuLabel className='px-4 py-2.5 text-sm font-semibold text-[#ADB7CB]'>
          Change Status to
        </DropdownMenuLabel>

        {/* onValueChange={(val) => changeStatus({ email: row.getValue('email'), referralCode: code, leadStatus: val})}  */}
        <RadioGroup
          onValueChange={(val) =>
            handleLeadStatusChange(row.getValue('email'), val)
          }
          className='gap-0 p-0'
          defaultValue={row.getValue('leadsStatus')}
        >
          {status.map((status) => (
            <>
              <DropdownMenuItem className='flex flex-col items-start justify-start px-4 py-2.5'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={status.value} id={status.value} />
                  <Label htmlFor={status.value}>
                    <p className='text-left text-sm font-semibold text-[#181D27]'>
                      {status.label}
                    </p>
                    {/* <p className='text-left text-xs font-normal  text-[#4D5C78]'>
                        Leads that require more nurturing
                      </p> */}
                  </Label>
                </div>

                {/* <div></div> */}
              </DropdownMenuItem>
              <DropdownMenuSeparator className='my-0' />
            </>
          ))}
          {/* <DropdownMenuItem className='flex flex-col items-start justify-start px-4 py-2.5'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='OPEN_OPPORTUNITY' id='r2' />
              <Label htmlFor='r2'>
                <p className='text-left text-sm font-semibold text-[#181D27]'>
                  Open Opportunity
                </p>
                <p className='text-left text-xs font-normal  text-[#4D5C78]'>
                  Showing clear buying intent
                </p>
              </Label>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='my-0' />
          <DropdownMenuItem className=' items-start px-4 py-2.5'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='QUALIFIED_LEADS' id='r3' />
              <Label htmlFor='r3'>
                <p className='text-left text-sm font-semibold text-[#181D27]'>
                  Qualified lead
                </p>
                <p className='text-left text-xs font-normal  text-[#4D5C78]'>
                  lead meets certain characteristics (industry, company size,
                  engagement level)
                </p>
              </Label>
            </div>

          </DropdownMenuItem> */}
        </RadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const createColumns = (fetchAnalyticsData: () => void) => [
  {
    id: 'select',
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Lead Name',
    cell: ({ row }: { row: any }) => (
      <div className='flex flex-col text-sm font-semibold capitalize text-[#181D27]'>
        {row.getValue('name')}{' '}
        <span className='text-sm text-[#535862] '>{row.getValue('email')}</span>
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant='ghost'
          className='text-sm font-semibold text-[#535862]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown size={20} />
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => (
      <div className='lowercase'>{formatDate(row.getValue('date'))}</div>
    )
  },
  {
    accessorKey: 'email',
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant='ghost'
          className='hidden w-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => (
      <div className='hidden lowercase'>
        {formatDate(row.getValue('email'))}
      </div>
    )
  },
  {
    accessorKey: 'leadsStatus',
    header: () => <div className=''>Status</div>,
    cell: ({ row }: { row: any }) => {
      const amount = parseFloat(row.getValue('leadsStatus'))

      // Format the amount as a dollar amount
      const currentStatus = row.getValue('leadsStatus')
      const currentStyle =
        currentStatus === 'QUALIFIED_LEADS'
          ? qualifiedLeadStyle
          : currentStatus === 'NOT_SET'
            ? notSetStyle
            : currentStatus === 'PROSPECTS'
              ? prospectsStyle
              : currentStatus === 'OPEN_OPPORTUNITY'
                ? openOpportunityStyle
                : notSetStyle

      return (
        <div
          className='flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-right text-xs/5 font-medium lowercase  first-letter:uppercase'
          style={currentStyle}
        >
          <span
            className='h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: currentStyle.dotColor }}
          />{' '}
          {row
            .getValue('leadsStatus')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase())}
        </div>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,

    cell: ({ row }: { row: any }) => {
      return <ActionCell row={row} refetch={fetchAnalyticsData} />
    }
  }
]

const LeadsTable: React.FC<{
  setAnalyticsData: React.Dispatch<React.SetStateAction<any>>
}> = ({ setAnalyticsData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const params: { code: string } = useParams()
  const [page, setPage] = useState(0)
  const [data, setData] = useState<any>()
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/get-referral-analytics-data?referralCode=${params?.code}&page=${page}&size=7`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Error fetching Referral Campaign Details`)
      }

      const data = await response.json()
      setData(data)
      setAnalyticsData(data)
      console.log('REFERRAL ANALYTICS DATA:::', { data })
    } catch (error: any) {
      console.log(`ERROR fetchAnalyticsData`, error)
      showCustomToast(
        'Error',
        'Error fetching Referral Analytics Details',
        'error',
        5000
      )
    }
  }, [page])

  const columns = createColumns(fetchAnalyticsData)

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // handleLeadStatusChange: handleLeadStatusChange(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

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

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData, page])

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

export default LeadsTable
