import type { ReactNode } from 'react'

export type ColumnType = 'text' | 'number' | 'calendar' | 'status' | 'tags'

export interface ColumnOption {
  id: string
  label: string
  color?: string
}

export interface Column {
  id: string
  title: string
  type: ColumnType
  accessorKey: string // for data binding
  options?: ColumnOption[] // for status/tags columns
  renderHeader?: ReactNode | ((column: Column) => ReactNode)
  renderCell?: (args: {
    value: any
    row: Record<string, any>
    rowId: string
    column: Column
  }) => ReactNode
  disableHeaderMenu?: boolean
  disableDrag?: boolean
  pinned?: 'left' | 'right'
  headerClassName?: string
  minWidth?: string | number
}
