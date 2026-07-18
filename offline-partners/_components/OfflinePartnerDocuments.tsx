'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import {
  useAddOfflinePartnerDocumentColumn,
  useDeleteOfflinePartnerDocumentColumn,
  useFetchDocuments,
  useFetchOfflinePartnerDocumentTable,
  useRenameOfflinePartnerDocumentColumn
} from '@/http-hooks/offline-partners'
import { OfflinePartnerTableColumnPayload } from '@/services/offline-partners'
import { useQueryClient } from '@tanstack/react-query'
import { Add, DocumentDownload } from 'iconsax-react'
import {
  Check,
  ChevronDown,
  Download,
  Edit2,
  ExternalLink,
  Loader2,
  MoreVertical,
  Plus,
  Tag,
  Trash2,
  Upload,
  X
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { AdvancedTable } from '@/components/ui/advanced-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { showCustomToast } from '@/components/custom-toast'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'
import { formatDate } from '../../direct-deals/_components/myDeals/MainContent'
import ContractUpload from './AddContract'
import SearchInput from './search'
import UploadContract from './UploadContract'
import UploadSidebar from './UploadSidebar'

type Props = {
  currentEmail: string
  otherEmail: string
  organizationId: number
  currentOrgName: string
  orgName: string
  inDummyFlow?: boolean
}

// Customizable Table Types
type ColumnType =
  | 'text'
  | 'number'
  | 'tags'
  | 'status-pills'
  | 'calendar'
  | 'user'

interface CustomColumn {
  id: string
  label: string
  type: ColumnType
  accessorKey?: string
  tagOptions?: string[] // For tags and status-pills columns
}

interface CellValue {
  [columnId: string]: any
}

// const Container: React.FC<{
//   children: React.ReactNode
//   className?: string
// }> = ({ children, className }) => (
//   <div
//     className={cn(
//       'rounded-lg border border-[#E9E0FF] bg-[#FBF9FF] p-4',
//       className
//     )}
//   >
//     {children}
//   </div>
//   )

const Container: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('rounded-lg border border-[#DEE2E6] p-4', className)}>
    {children}
  </div>
)

// Customizable Table Component
const CustomizableTable: React.FC<{
  data: any[] | undefined
  isLoading: boolean
  isFetched: boolean
  isQueryEnabled: boolean
  initialColumns?: CustomColumn[]
  onAddColumn?: (col: CustomColumn) => Promise<CustomColumn | void> | void
  onRenameColumn?: (columnId: string, newName: string) => Promise<void>
  onDeleteColumn?: (columnId: string) => Promise<void>
  disableLocalAdd?: boolean
  isSavingColumn?: boolean
  tableId?: number
  email?: string
  inDummyFlow?: boolean
}> = ({
  data,
  isLoading,
  isFetched,
  isQueryEnabled,
  initialColumns,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  disableLocalAdd = false,
  isSavingColumn = false,
  tableId,
  email,
  inDummyFlow = false
}) => {
  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }

  const tableData = Array.isArray(data) ? data : []
  const fallbackColumns: CustomColumn[] = [
    {
      id: 'contractType',
      label: 'Contract Type',
      type: 'text',
      accessorKey: 'contractType'
    },
    {
      id: 'docId',
      label: 'Doc ID',
      type: 'text',
      accessorKey: 'docId'
    },
    {
      id: 'counts',
      label: 'Counts',
      type: 'number',
      accessorKey: 'count'
    },
    {
      id: 'effectiveDate',
      label: 'Effective Date',
      type: 'calendar',
      accessorKey: 'effectiveDate'
    },
    {
      id: 'expireDate',
      label: 'Expire Date',
      type: 'calendar',
      accessorKey: 'expiringDate'
    }
  ]

  const initialColumnsState = React.useMemo(
    () =>
      initialColumns && initialColumns.length > 0
        ? initialColumns
        : fallbackColumns,
    [initialColumns]
  )

  // Initialize default columns based on existing structure
  const [columns, setColumns] = useState<CustomColumn[]>(initialColumnsState)

  const [cellValues, setCellValues] = useState<Record<string, CellValue>>({})
  const [editingCell, setEditingCell] = useState<{
    rowId: string
    columnId: string
  } | null>(null)
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [newColumnName, setNewColumnName] = useState('')
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text')
  const [managingTagOptions, setManagingTagOptions] = useState<string | null>(
    null
  )
  const [newTagOption, setNewTagOption] = useState('')
  const [editingColumnValue, setEditingColumnValue] = useState<string>('')
  const [isRenamingColumn, setIsRenamingColumn] = useState(false)
  const renameInProgressRef = React.useRef(false)
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null)

  // Ensure column name is prefilled when editing starts
  useEffect(() => {
    if (editingColumn) {
      const column = columns.find((col) => col.id === editingColumn)
      if (column) {
        setEditingColumnValue(column.label)
      }
    } else {
      // Clear value when not editing
      setEditingColumnValue('')
    }
  }, [editingColumn])

  useEffect(() => {
    setColumns(initialColumnsState)
  }, [initialColumnsState])

  // Initialize cell values from data
  useEffect(() => {
    if (tableData && Array.isArray(tableData) && tableData.length > 0) {
      const initialValues: Record<string, CellValue> = {}
      tableData.forEach((item, index) => {
        const rowId = item?.id || item?.docId || `row-${index}`
        initialValues[rowId] = {}
        columns.forEach((col) => {
          if (col.id === 'contractType') {
            initialValues[rowId][col.id] = 'MoU'
          } else if (col.accessorKey) {
            const value = item[col.accessorKey]
            initialValues[rowId][col.id] =
              value === '' || value === null || value === undefined ? '' : value
          } else {
            initialValues[rowId][col.id] = ''
          }
        })
      })
      setCellValues(initialValues)
    }
  }, [tableData, columns.length])

  const handleRenameColumn = async (columnId: string, newLabel: string) => {
    // Prevent double calls
    if (renameInProgressRef.current) {
      return
    }

    if (!newLabel.trim()) {
      setEditingColumn(null)
      setEditingColumnValue('')
      return
    }

    const trimmedLabel = newLabel.trim()

    // If onRenameColumn callback is provided, use it (for API calls)
    if (onRenameColumn) {
      renameInProgressRef.current = true
      setIsRenamingColumn(true)
      try {
        await onRenameColumn(columnId, trimmedLabel)
        // Update local state after successful API call
        setColumns((prev) =>
          prev.map((col) =>
            col.id === columnId ? { ...col, label: trimmedLabel } : col
          )
        )
        setEditingColumn(null)
        setEditingColumnValue('')
      } catch (error) {
        console.error('Failed to rename column:', error)
        // Don't update local state if API call fails
        // Keep editing state so user can retry
      } finally {
        setIsRenamingColumn(false)
        renameInProgressRef.current = false
      }
    } else {
      // Local-only rename (fallback)
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, label: trimmedLabel } : col
        )
      )
      setEditingColumn(null)
      setEditingColumnValue('')
    }
  }

  const handleDeleteColumn = async (columnId: string) => {
    if (onDeleteColumn) {
      try {
        await onDeleteColumn(columnId)
        // Remove column from local state after successful API call
        setColumns((prev) => prev.filter((col) => col.id !== columnId))
        setColumnToDelete(null)
      } catch (error) {
        console.error('Failed to delete column:', error)
        // Keep dialog open on error so user can retry
      }
    } else {
      // Local-only delete (fallback)
      setColumns((prev) => prev.filter((col) => col.id !== columnId))
      setColumnToDelete(null)
    }
  }

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return

    const localColumn: CustomColumn = {
      id: `col-${Date.now()}`,
      label: newColumnName.trim(),
      type: newColumnType,
      tagOptions:
        newColumnType === 'tags' || newColumnType === 'status-pills'
          ? []
          : undefined
    }

    try {
      if (onAddColumn) {
        const saved = await onAddColumn(localColumn)
        if (saved) {
          setColumns((prev) => [...prev, saved])
        }
      }
      if (!onAddColumn || disableLocalAdd) {
        setColumns((prev) => [...prev, localColumn])
      }
    } finally {
      setNewColumnName('')
      setIsAddColumnOpen(false)
      setNewColumnType('text')
    }
  }

  const handleAddTagOption = (columnId: string, tagValue: string) => {
    if (tagValue.trim()) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === columnId) {
            const options = col.tagOptions || []
            if (!options.includes(tagValue.trim())) {
              return { ...col, tagOptions: [...options, tagValue.trim()] }
            }
          }
          return col
        })
      )
    }
  }

  const handleUpdateCellValue = (
    rowId: string,
    columnId: string,
    value: any
  ) => {
    setCellValues((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [columnId]: value
      }
    }))
    setEditingCell(null)
  }

  const getCellValue = (row: any, column: CustomColumn, rowId: string) => {
    if (cellValues[rowId]?.[column.id] !== undefined) {
      return cellValues[rowId][column.id]
    }
    if (column.accessorKey) {
      return row[column.accessorKey] ?? ''
    }
    return ''
  }

  // Utility function to check if a value is a URL
  const isUrl = (value: any): boolean => {
    if (typeof value !== 'string' || !value.trim()) return false
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      // Check if it looks like a URL even if URL constructor fails
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      return urlPattern.test(value.trim())
    }
  }

  const renderCell = (row: any, column: CustomColumn, rowId: string) => {
    const value = getCellValue(row, column, rowId)
    const stringValue = String(value || '')
    const isValueUrl = isUrl(stringValue)

    // Render URL with icon
    const renderUrlCell = (url: string) => (
      <div className='flex items-center gap-2 overflow-hidden'>
        <span className='truncate'>{url}</span>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex-shrink-0 text-blue-600 transition-colors hover:text-blue-800'
          onClick={(e) => e.stopPropagation()}
          title={url}
        >
          <ExternalLink className='h-4 w-4' />
        </a>
      </div>
    )

    switch (column.type) {
      case 'text':
        if (isValueUrl) {
          return renderUrlCell(stringValue)
        }
        return (
          <span className='block truncate px-2 py-1' title={stringValue}>
            {value || '-'}
          </span>
        )
      case 'number':
        return (
          <span className='block truncate px-2 py-1' title={stringValue}>
            {value || '-'}
          </span>
        )
      case 'tags':
        return (
          <div className='flex flex-wrap gap-1 overflow-hidden rounded p-1'>
            {Array.isArray(value) && value.length > 0 ? (
              value.map((tag: string, idx: number) => (
                <Badge
                  key={idx}
                  variant='outline'
                  className='border-blue-200 bg-blue-50 text-blue-700'
                >
                  {tag}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-400'>-</span>
            )}
          </div>
        )
      case 'status-pills':
        return (
          <div className='flex flex-wrap gap-1 overflow-hidden rounded p-1'>
            {Array.isArray(value) && value.length > 0 ? (
              value.map((pill: string, idx: number) => (
                <Badge
                  key={idx}
                  variant='outline'
                  className='rounded-full border-red-200 bg-red-50 px-2 py-0.5 text-red-700'
                >
                  {pill}
                </Badge>
              ))
            ) : (
              <span className='text-sm text-gray-400'>-</span>
            )}
          </div>
        )
      case 'calendar':
        if (isValueUrl) {
          return renderUrlCell(stringValue)
        }
        return (
          <span className='block truncate px-2 py-1' title={stringValue}>
            {value || '-'}
          </span>
        )
      default:
        if (isValueUrl) {
          return renderUrlCell(stringValue)
        }
        return (
          <span className='block truncate px-2 py-1' title={stringValue}>
            {value || '-'}
          </span>
        )
    }
  }

  return (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow className='bg-[#FBFBFB]'>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className='max-w-[300px] px-4 py-4'
                style={{ maxWidth: '300px' }}
              >
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex flex-1 items-center gap-2'>
                    {editingColumn === column.id ? (
                      <div className='flex flex-1 items-center gap-2'>
                        <Input
                          value={editingColumnValue}
                          onChange={(e) =>
                            setEditingColumnValue(e.target.value)
                          }
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' && !isRenamingColumn) {
                              e.preventDefault()
                              if (editingColumnValue.trim()) {
                                await handleRenameColumn(
                                  column.id,
                                  editingColumnValue.trim()
                                )
                              } else {
                                setEditingColumn(null)
                                setEditingColumnValue('')
                              }
                            } else if (
                              e.key === 'Escape' &&
                              !isRenamingColumn
                            ) {
                              setEditingColumn(null)
                              setEditingColumnValue('')
                            }
                          }}
                          disabled={isRenamingColumn}
                          autoFocus
                          className='h-8 border-primary text-sm font-medium focus:ring-2 focus:ring-primary disabled:opacity-70'
                          style={{ minWidth: '120px' }}
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0'
                          disabled={isRenamingColumn}
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (
                              editingColumnValue.trim() &&
                              !isRenamingColumn
                            ) {
                              await handleRenameColumn(
                                column.id,
                                editingColumnValue.trim()
                              )
                            }
                          }}
                        >
                          {isRenamingColumn ? (
                            <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                          ) : (
                            <Check className='h-4 w-4 text-green-600' />
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0'
                          disabled={isRenamingColumn}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (!isRenamingColumn) {
                              setEditingColumn(null)
                              setEditingColumnValue('')
                            }
                          }}
                        >
                          <X className='h-4 w-4 text-gray-500' />
                        </Button>
                      </div>
                    ) : (
                      <span
                        className='cursor-pointer font-medium transition-colors hover:text-primary'
                        onClick={() => {
                          setEditingColumn(column.id)
                          setEditingColumnValue(column.label)
                        }}
                      >
                        {column.label}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-1'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-6 w-6 p-0'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => setEditingColumn(column.id)}
                        >
                          <Edit2 className='mr-2 h-4 w-4' />
                          Rename
                        </DropdownMenuItem>
                        {(column.type === 'tags' ||
                          column.type === 'status-pills') && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setManagingTagOptions(column.id)}
                            >
                              <Tag className='mr-2 h-4 w-4' />
                              Manage Options
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setColumnToDelete(column.id)}
                          className='text-red-600 focus:text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete Column
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableHead>
            ))}
            <TableHead className='w-12 px-4 py-4'>
              <Dialog
                open={isAddColumnOpen}
                onOpenChange={(open) => {
                  if (open && !tableId) {
                    if (!inDummyFlow) {
                      showCustomToast(
                        'Info',
                        'Please add a contract first to create a table',
                        'info',
                        5000
                      )
                    }
                    return
                  }
                  setIsAddColumnOpen(open)
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={(e) => {
                      if (inDummyFlow) {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDummyAction()
                        return
                      }
                    }}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                    <DialogDescription>
                      Add a new column to your table
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Column Name
                      </label>
                      <Input
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder='Enter column name'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Column Type
                      </label>
                      <Select
                        value={newColumnType}
                        onValueChange={(value) =>
                          setNewColumnType(value as ColumnType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='text'>Text</SelectItem>
                          <SelectItem value='number'>Numbers</SelectItem>
                          <SelectItem value='tags'>Tags</SelectItem>
                          <SelectItem value='status-pills'>
                            Status pills
                          </SelectItem>
                          <SelectItem value='calendar'>Calendar</SelectItem>
                          <SelectItem value='user'>User persona</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='primary'
                      onClick={() => setIsAddColumnOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='primary'
                      onClick={handleAddColumn}
                      disabled={isSavingColumn}
                      className={isSavingColumn ? 'cursor-not-allowed' : ''}
                    >
                      {isSavingColumn ? 'Saving...' : 'Add Column'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className='h-20'>
                <Skeleton className='h-full w-full' />
              </TableCell>
            </TableRow>
          ) : Array.isArray(tableData) && tableData.length > 0 ? (
            tableData.map((invoice: any, index: number) => {
              const rowId = invoice?.id || invoice?.docId || `contract-${index}`
              return (
                <TableRow key={rowId}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className='max-w-[300px] px-4 py-4'
                      style={{ maxWidth: '300px' }}
                    >
                      {renderCell(invoice, column, rowId)}
                    </TableCell>
                  ))}
                  <TableCell className='px-4 py-4'></TableCell>
                </TableRow>
              )
            })
          ) : isFetched && isQueryEnabled ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className='h-24 text-center'
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className='h-20'>
                <Skeleton className='h-full w-full' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Manage Tag Options Dialog */}
      {managingTagOptions && (
        <Dialog
          open={!!managingTagOptions}
          onOpenChange={(open) => !open && setManagingTagOptions(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Tag Options</DialogTitle>
              <DialogDescription>
                Add or remove tag options for this column
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='flex gap-2'>
                <Input
                  value={newTagOption}
                  onChange={(e) => setNewTagOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const column = columns.find(
                        (c) => c.id === managingTagOptions
                      )
                      if (column) {
                        handleAddTagOption(column.id, newTagOption)
                        setNewTagOption('')
                      }
                    }
                  }}
                  placeholder='Enter new tag option'
                />
                <Button
                  onClick={() => {
                    const column = columns.find(
                      (c) => c.id === managingTagOptions
                    )
                    if (column) {
                      handleAddTagOption(column.id, newTagOption)
                      setNewTagOption('')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className='max-h-60 space-y-2 overflow-y-auto'>
                {columns
                  .find((c) => c.id === managingTagOptions)
                  ?.tagOptions?.map((option, idx) => (
                    <div
                      key={idx}
                      className='flex items-center justify-between rounded border p-2'
                    >
                      <span>{option}</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setColumns((prev) =>
                            prev.map((col) => {
                              if (col.id === managingTagOptions) {
                                return {
                                  ...col,
                                  tagOptions:
                                    col.tagOptions?.filter(
                                      (opt) => opt !== option
                                    ) || []
                                }
                              }
                              return col
                            })
                          )
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setManagingTagOptions(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Column Confirmation Dialog */}
      {columnToDelete && (
        <Dialog
          open={!!columnToDelete}
          onOpenChange={(open) => !open && setColumnToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Column</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the column &quot;
                {columns.find((c) => c.id === columnToDelete)?.label}&quot;?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='primary' onClick={() => setColumnToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant='destructiveSolid'
                onClick={() => handleDeleteColumn(columnToDelete)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Cell Editor Components
const TextCellEditor: React.FC<{
  value: any
  type: ColumnType
  onSave: (value: any) => void
  onCancel: () => void
}> = ({ value, type, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(String(value || ''))

  return (
    <div className='flex items-center gap-2'>
      <Input
        type={type === 'number' ? 'number' : 'text'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSave(type === 'number' ? Number(inputValue) : inputValue)
          } else if (e.key === 'Escape') {
            onCancel()
          }
        }}
        onBlur={() =>
          onSave(type === 'number' ? Number(inputValue) : inputValue)
        }
        autoFocus
        className='h-8'
      />
      <Button
        variant='ghost'
        size='sm'
        onClick={() =>
          onSave(type === 'number' ? Number(inputValue) : inputValue)
        }
      >
        Save
      </Button>
      <Button variant='ghost' size='sm' onClick={onCancel}>
        <X className='h-4 w-4' />
      </Button>
    </div>
  )
}

const TagCellEditor: React.FC<{
  value: string[]
  options: string[]
  onSave: (value: string[]) => void
  onCancel: () => void
  onAddOption: (tag: string) => void
  isStatusPill?: boolean
}> = ({
  value,
  options,
  onSave,
  onCancel,
  onAddOption,
  isStatusPill = false
}) => {
  const [tags, setTags] = useState<string[]>(value || [])
  const [newTag, setNewTag] = useState('')
  const [showAddOption, setShowAddOption] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSelectOption = (option: string) => {
    if (!tags.includes(option)) {
      setTags([...tags, option])
    }
  }

  return (
    <div className='min-w-[300px] space-y-2 rounded border bg-white p-2 shadow-lg'>
      <div className='mb-2 flex flex-wrap gap-1'>
        {tags.map((tag, idx) => (
          <Badge
            key={idx}
            variant='outline'
            className={cn(
              'flex items-center gap-1',
              isStatusPill
                ? 'rounded-full border-red-200 bg-red-50 text-red-700'
                : 'border-blue-200 bg-blue-50 text-blue-700'
            )}
          >
            {tag}
            <X
              className='h-3 w-3 cursor-pointer'
              onClick={() => handleRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddTag()
            }
          }}
          placeholder='Add new tag'
          className='h-8 flex-1'
        />
        <Button size='sm' onClick={handleAddTag} className='h-8'>
          Add
        </Button>
      </div>
      {options.length > 0 && (
        <div className='mt-2'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => setShowAddOption(!showAddOption)}
            className='w-full'
          >
            {showAddOption ? 'Hide' : 'Show'} Options
          </Button>
          {showAddOption && (
            <div className='mt-2 max-h-32 space-y-1 overflow-y-auto'>
              {options.map((option, idx) => (
                <div
                  key={idx}
                  className='flex cursor-pointer items-center justify-between rounded p-1 hover:bg-gray-50'
                  onClick={() => handleSelectOption(option)}
                >
                  <span className='text-sm'>{option}</span>
                  {tags.includes(option) && (
                    <Check className='h-4 w-4 text-green-600' />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className='flex gap-2 border-t pt-2'>
        <Button size='sm' onClick={() => onSave(tags)} className='flex-1'>
          Save
        </Button>
        <Button
          variant='primary'
          size='sm'
          onClick={onCancel}
          className='flex-1'
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export const SigningTable: React.FC<{ data: any }> = ({ data = [] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-[#FBFBFB]'>
          {/* <TableHead className="px-4 py-4">Entities</TableHead> */}
          <TableHead className='px-4 py-4'>Type</TableHead>
          <TableHead className='px-4 py-4'>Sent on</TableHead>
          <TableHead className='px-4 py-4'>Email used for signing</TableHead>
          <TableHead className='px-4 py-4'>Signed On</TableHead>
          <TableHead className='px-4 py-4'>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length ? (
          data.map((invoice: any, index: number) => (
            <TableRow key={invoice?.id || `signing-${index}`}>
              {/* <TableCell className="font-medium">NDA</TableCell> */}
              <TableCell className='font-semibold'>NDA</TableCell>
              <TableCell className='p-6 text-xs text-[#908B93]'>
                {formatDate(invoice?.creationTimestamp)}
              </TableCell>
              <TableCell className='p-6 text-xs text-[#908B93]'>
                {invoice?.recipientEmail ?? '-'}
              </TableCell>
              <TableCell className='p-6 text-xs text-[#908B93]'>
                {formatDate(invoice?.recipientSignedAt ?? '-')}
              </TableCell>
              <TableCell className='p-6 text-xs text-[#908B93]'>
                {invoice?.status}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className='h-24 text-center'>
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

const OfflinePartnerDocuments = ({
  currentEmail,
  otherEmail,
  organizationId,
  currentOrgName,
  orgName,
  inDummyFlow = false
}: Props) => {
  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }
  const [open, setOpen] = React.useState(false)
  const [showTable, setShowTable] = useState(false)
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
  }

  const {
    data: documentTable,
    isLoading: isDocTableLoading,
    isFetched: isDocTableFetched
  } = useFetchOfflinePartnerDocumentTable(otherEmail)

  const addColumnMutation = useAddOfflinePartnerDocumentColumn()
  const renameColumnMutation = useRenameOfflinePartnerDocumentColumn()
  const deleteColumnMutation = useDeleteOfflinePartnerDocumentColumn()

  // Check if query should be enabled (has valid params)
  const isQueryEnabled =
    typeof organizationId === 'number' &&
    organizationId > 0 &&
    !!otherEmail &&
    otherEmail.trim() !== ''

  // Alert when fetching API and no tableId in response
  useEffect(() => {
    if (
      isDocTableFetched &&
      !isDocTableLoading &&
      isQueryEnabled &&
      !inDummyFlow
    ) {
      const tableId = (documentTable as any)?.tableId
      if (!tableId) {
        // Only show alert if we actually tried to fetch and got no tableId
        showCustomToast(
          'Info',
          'Please add a contract first to create a table',
          'info',
          5000
        )
      }
    }
  }, [
    isDocTableFetched,
    isDocTableLoading,
    isQueryEnabled,
    documentTable,
    inDummyFlow
  ])

  // Determine if we should show loading state for the customizable table
  const tableLoadingState =
    isDocTableLoading || (isQueryEnabled && documentTable === undefined)
  const [searchInput, setSearchInput] = React.useState<string>('')

  const { data: signedDoc, isLoading: docLoading } = useFetchDocuments()

  const tableColumnsFromApi = React.useMemo<CustomColumn[]>(() => {
    const apiColumns = (documentTable as any)?.columns ?? []
    if (!Array.isArray(apiColumns) || apiColumns.length === 0) return []

    const mapType = (name: string): ColumnType => {
      const lower = name.toLowerCase()
      if (lower.includes('date')) return 'calendar'
      if (lower.includes('count') || lower.includes('number')) return 'number'
      return 'text'
    }

    return apiColumns
      .filter((col: any) => col?.visible !== false)
      .map((col: any) => ({
        id: String(col.id ?? col.name),
        label: col.name ?? 'Column',
        type: mapType(col.name ?? ''),
        accessorKey: col.name
      }))
  }, [documentTable])

  const tableRowsFromApi = React.useMemo(() => {
    const rows = (documentTable as any)?.rows ?? []
    if (!Array.isArray(rows)) return []
    return rows.map((row: any, index: number) => ({
      id: row?.rowId ?? `row-${index}`,
      ...row?.cells
    }))
  }, [documentTable])

  const handleAddColumnToApi = async (col: CustomColumn) => {
    const tableId = (documentTable as any)?.tableId
    if (!tableId || !otherEmail) {
      if (!inDummyFlow) {
        showCustomToast(
          'Info',
          'Please add a contract first to create a table',
          'info',
          5000
        )
      }
      return col
    }

    const apiType: OfflinePartnerTableColumnPayload['type'] = (() => {
      switch (col.type) {
        case 'number':
          return 'NUMBER'
        case 'tags':
          return 'TAG'
        case 'status-pills':
          return 'STATUS'
        case 'calendar':
          return 'DATE'
        default:
          return 'TEXT'
      }
    })()

    const payload: OfflinePartnerTableColumnPayload = {
      name: col.label,
      type: apiType,
      displayOrder: tableColumnsFromApi.length + 1,
      visible: true
    }

    const saved = await addColumnMutation.mutateAsync({
      tableId,
      email: otherEmail,
      payload
    })

    if (saved?.id) {
      return {
        ...col,
        id: String(saved.id),
        accessorKey: saved.name ?? col.accessorKey ?? col.label
      }
    }

    return col
  }

  const handleRenameColumnToApi = async (
    columnId: string,
    newName: string
  ): Promise<void> => {
    const tableId = (documentTable as any)?.tableId
    if (!tableId || !otherEmail) return

    const columnIdNum = Number(columnId)
    if (isNaN(columnIdNum)) {
      console.error('Invalid column ID:', columnId)
      return
    }

    await renameColumnMutation.mutateAsync({
      tableId,
      columnId: columnIdNum,
      email: otherEmail,
      payload: {
        name: newName
      }
    })
  }

  const handleDeleteColumnToApi = async (columnId: string): Promise<void> => {
    const tableId = (documentTable as any)?.tableId
    if (!tableId || !otherEmail) return

    const columnIdNum = Number(columnId)
    if (isNaN(columnIdNum)) {
      console.error('Invalid column ID:', columnId)
      return
    }

    await deleteColumnMutation.mutateAsync({
      tableId,
      columnId: columnIdNum,
      email: otherEmail
    })
  }

  const observerRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const queryClient = useQueryClient()

  // Debounced search logic
  const debouncedSearch = useCallback(
    (value: string) => {
      queryClient.invalidateQueries({
        queryKey: [
          'discover-page',
          // sectorsCommaSeparated,
          // partnershipType,
          // subSectorsCommaSeparated,
          value
        ]
      })
    },
    [
      queryClient
      // sectorsCommaSeparated,
      // partnershipType,
      // subSectorsCommaSeparated
    ]
  )

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSearch(searchInput)
      // setSearchQuery(searchInput)
    }, 400)
  }, [searchInput, debouncedSearch])

  // if (!data)
  //   return (
  //     <div className='mt-8 flex flex-grow  flex-col items-center justify-center '>
  //       <Image
  //         src={'/no-partner.svg'}
  //         alt='no-deals'
  //         height={150}
  //         width={150}
  //       />
  //       <h2 className='mt-4 fds-text-lead-semibold text-text-100'>
  //         No Contracts added yet
  //       </h2>
  //       <p className='mt-4 text-shark-sm font-medium text-text-100 '>
  //         Verify your offline partners by adding contracts
  //       </p>

  //       <Button
  //         className='mt-4 h-[37px] w-[157px] rounded-lg border border-primary-light-blue bg-white text-shark-base font-bold text-primary-light-blue hover:bg-background-ghost-white'
  //         onClick={() => setOpen(true)}
  //       >
  //         <Add size={16} className='mr-2' /> Add Contracts
  //       </Button>

  //       <ContractUpload
  //         open={open}
  //         onOpenChange={handleOpenChange}
  //         email1={currentEmail}
  //         email2={otherEmail}
  //       />
  //     </div>
  //   )

  return (
    <div>
      <Container className='mb-4 w-full'>
        {/* Use flex-row and allow wrapping so items stay inline on mobile but wrap when needed */}
        <div className='flex w-full flex-row flex-wrap items-center justify-between gap-2'>
          {/* Search: takes remaining space, but can shrink when buttons need space */}
          <div className='min-w-0 flex-1 md:w-1/3'>
            {' '}
            <SearchInput
              searchQuery={searchInput}
              handleInput={(e: any) => setSearchInput(e.target.value)}
            />{' '}
          </div>

          {/* Buttons group: keep them together on the right; shrink/stack on very small screens */}
          <div className='flex w-auto shrink-0 items-center justify-end gap-2 md:w-2/3'>
            <UploadSidebar
              organizationId={organizationId}
              receipientEmail={otherEmail}
              currentOrgName={currentOrgName}
              orgName={orgName}
              inDummyFlow={inDummyFlow}
            />

            <UploadContract
              onOpenChange={handleOpenChange}
              email1={currentEmail}
              email2={otherEmail}
              inDummyFlow={inDummyFlow}
            />
          </div>

          {/* Hidden (modal) upload component stays outside flow */}
          <ContractUpload
            open={open}
            onOpenChange={handleOpenChange}
            email1={currentEmail}
            email2={otherEmail}
            inDummyFlow={inDummyFlow}
          />
        </div>
      </Container>

      <div>
        {/* <Container className={'flex w-full items-center justify-between'}>
          <p className='text-base font-bold text-[#403A44]'>Send for Signing</p>
          <div className='flex gap-6'>
            <UploadSidebar
              organizationId={organizationId}
              receipientEmail={otherEmail}
              currentOrgName={currentOrgName}
              orgName={orgName}
            />
            <button
              onClick={() => setShowTable((show) => !show)}
              className='flex items-center gap-2 text-sm font-bold text-[#3E50F7]'
            >
              {' '}
              Check status <ChevronDown size={16} />
            </button>
          </div>
        </Container> */}
        {showTable && <SigningTable data={signedDoc ?? []} />}
      </div>

      <div className='mt-8 '>
        <h2 className='mb-4 text-base font-bold text-[#403A44]'>
          Existing contracts
        </h2>
        {/* AdvancedTable wrapper: adapt API column format to AdvancedTable props */}
        {(() => {
          const advancedColumns =
            tableColumnsFromApi && tableColumnsFromApi.length
              ? tableColumnsFromApi.map((c) => ({
                  id: `col-${c.id}`,
                  title: c.label,
                  accessorKey: c.accessorKey || c.label,
                  type: 'text' as const
                }))
              : [
                  {
                    id: 'col-contractType',
                    title: 'Contract Type',
                    accessorKey: 'contractType',
                    type: 'text' as const
                  },
                  {
                    id: 'col-docId',
                    title: 'Doc ID',
                    accessorKey: 'docId',
                    type: 'text' as const
                  },
                  {
                    id: 'col-counts',
                    title: 'Counts',
                    accessorKey: 'count',
                    type: 'text' as const
                  },
                  {
                    id: 'col-effectiveDate',
                    title: 'Effective Date',
                    accessorKey: 'effectiveDate',
                    type: 'text' as const
                  },
                  {
                    id: 'col-expireDate',
                    title: 'Expire Date',
                    accessorKey: 'expiringDate',
                    type: 'text' as const
                  }
                ]

          const advancedData = (tableRowsFromApi || []).map((r: any) => ({
            ...(r || {}),
            id: r.id
          }))

          const handleAddAdapter = async (params: {
            name: string
            type: any
          }) => {
            // construct CustomColumn-like object and call existing API helper
            const col = {
              id: `col-${Date.now()}`,
              label: params.name,
              type: (params.type as any) || 'text',
              accessorKey: params.name
            }
            await handleAddColumnToApi(col)
          }

          const handleRenameAdapter = async (params: {
            columnId: number
            newName: string
          }) => {
            // AdvancedTable will pass numeric columnId (from id `col-<id>`)
            await handleRenameColumnToApi(
              String(params.columnId),
              params.newName
            )
          }

          const handleDeleteAdapter = async (columnId: number) => {
            // Directly call API delete adapter
            await handleDeleteColumnToApi(String(columnId))
          }

          return (
            <AdvancedTable
              readOnly={false}
              syncFromProps
              enableColumnControls
              enableDragAndDrop={false}
              enableAddColumn
              initialColumns={advancedColumns as any}
              initialData={advancedData}
              getRowId={(row) => String(row.id)}
              onAddColumnRequest={handleAddAdapter}
              onRenameColumnRequest={handleRenameAdapter}
              onDeleteColumnRequest={handleDeleteAdapter}
            />
          )
        })()}
      </div>
    </div>
  )

  // return <>{data && <DocumentCard file={data[0]?.docLink} />}</>
}

export default OfflinePartnerDocuments

const DocumentCard = ({ file }: { file: string }) => {
  const handleDownload = () => {
    const link: any = document.createElement('a')
    link.href = file
    link.target = '_blank'
    link.download = file.split('/').pop() // Use file name as download name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardItemWrapper className='p-4'>
      <h3 className='fds-text-lead-semibold text-text-100'>Contracts</h3>

      <div className='mt-6 flex items-center justify-between '>
        <div className='flex flex-col gap-1'>
          <p className='fds-text text-text-60'>Contract Type</p>
          <p className='fds-text text-text-100'>
            Memorandum of Understanding (MoU)
          </p>
        </div>

        {/* <div className='flex flex-col gap-1'>
          <p className='fds-text text-text-60'>
            Effective Date
          </p>
          <p className='fds-text text-text-100'>
            September 24, 2024
          </p>
        </div>

        <div className='flex flex-col gap-1'>
          <p className='fds-text text-text-60'>
            Expire Date
          </p>
          <p className='fds-text text-text-100'>
            September 24, 2024
          </p>
        </div> */}

        <div className='flex flex-col gap-1'>
          <p className='fds-text text-text-60'>Contract Signed</p>
          <p
            className='fds-text flex items-center text-primary-light-blue'
            onClick={handleDownload}
          >
            <DocumentDownload className='mr-2 h-6 w-6' /> Download
          </p>
        </div>
      </div>
    </DashboardItemWrapper>
  )
}
