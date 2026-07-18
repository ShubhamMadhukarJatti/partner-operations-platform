import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface TableRowDetail {
  id: string
  type: 'heading' | 'badge' | 'text' | 'custom'
  value: string
  className?: string
  // CRITICAL FIX: Don't store React components in Redux (non-serializable)
  // Store component identifier and props instead
  customComponentType?: string // e.g., 'AssignDropdown', 'LogoImage'
  customComponentProps?: Record<string, any> // Props to pass to the component
}

export interface TableRow {
  href: string
  rowDetails: TableRowDetail[]
  orgId: number
}

interface TableState {
  selectedRows: string[]
  rows: TableRow[]
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  filters: Record<string, any>
  loading: boolean
  error: string | null
}

const initialState: TableState = {
  selectedRows: [],
  rows: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  filters: {},
  loading: false,
  error: null
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    // Row Selection
    selectRow: (state, action: PayloadAction<string>) => {
      state.selectedRows.push(action.payload)
    },
    unselectRow: (state, action: PayloadAction<string>) => {
      state.selectedRows = state.selectedRows.filter(
        (href) => href !== action.payload
      )
    },
    selectAllRows: (state) => {
      state.selectedRows = state.rows.map((row) => row.href)
    },
    unselectAllRows: (state) => {
      state.selectedRows = []
    },

    // Data Management
    setRows: (state, action: PayloadAction<TableRow[]>) => {
      state.rows = action.payload
      state.pagination.total = action.payload.length
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Sorting
    setSort: (
      state,
      action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>
    ) => {
      state.sortColumn = action.payload.column
      state.sortDirection = action.payload.direction
    },

    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload
      state.pagination.page = 1 // Reset to first page when changing page size
    },

    // Filtering
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value
    },
    clearFilters: (state) => {
      state.filters = {}
    },

    // Reset
    resetTable: (state) => {
      return initialState
    }
  }
})

export const {
  selectRow,
  unselectRow,
  selectAllRows,
  unselectAllRows,
  setRows,
  setLoading,
  setError,
  setSort,
  setPage,
  setPageSize,
  setFilter,
  clearFilters,
  resetTable
} = tableSlice.actions

export const tableReducer = tableSlice.reducer
