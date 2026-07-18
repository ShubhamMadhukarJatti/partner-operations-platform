// import React, { useEffect } from 'react'
// import {
//   selectAllRows,
//   selectRow,
//   setRows,
//   TableRow,
//   TableRowDetail,
//   unselectAllRows,
//   unselectRow
// } from '@/redux/features/tableSlice'
// import { RootState } from '@/redux/store'
// import { CollaborationTypeUpdated } from '@/types'
// import { useDispatch, useSelector } from 'react-redux'

// import { StatusIndication } from '@/app/(app)/(dashboard-pages)/_components/status-indicator'

// interface TableState {
//   selectedRows: string[]
//   rows: TableRow[]
//   isAllSelected: boolean
// }

// export const useCollaborationsTable = (
//   tabValue: string,
//   proposals: CollaborationTypeUpdated[]
// ) => {
//   const dispatch = useDispatch()

//   const { selectedRows, rows, isAllSelected } = useSelector<
//     RootState,
//     TableState
//   >((state: RootState) => ({
//     selectedRows: state.table.selectedRows,
//     rows: state.table.rows,
//     isAllSelected:
//       state.table.rows.length > 0 &&
//       state.table.selectedRows.length === state.table.rows.length
//   }))

//   useEffect(() => {
//     if (proposals?.length > 0) {
//       const filteredProposals =
//         tabValue === 'all'
//           ? proposals
//           : tabValue === 'sent'
//             ? proposals.filter((p) => p.type === 'SENDER')
//             : tabValue === 'received'
//               ? proposals.filter((p) => p.type === 'RECEIVER')
//               : tabValue === 'rejected'
//                 ? proposals.filter((p) => p.status === 'REJECTED')
//                 : tabValue === 'active'
//                   ? proposals.filter((p) => p.status === 'ACTIVE')
//                   : []

//       const tableRows: TableRow[] = filteredProposals.map((proposal) => ({
//         href: `/dashboard/${proposal.id}`,
//         orgId: proposal.organizationId,
//         rowDetails: [
//           {
//             type: 'heading',
//             value: proposal.name,
//             className: 'text-sm font-medium',
//             id: 'partnerName'
//           } as TableRowDetail,
//           {
//             type: 'custom',
//             value: proposal.status,
//             customComponent: React.createElement(StatusIndication, {
//               status: proposal.status
//             }),
//             id: 'status'
//           } as TableRowDetail,
//           {
//             type: 'text',
//             value: proposal.description || 'N/A',
//             id: 'description'
//           } as TableRowDetail,
//           {
//             type: 'text',
//             value: new Date(proposal.creationTimestamp).toLocaleDateString(),
//             id: 'date'
//           } as TableRowDetail
//         ]
//       }))

//       dispatch(setRows(tableRows))
//     }
//   }, [proposals, tabValue, dispatch])

//   const handleRowSelect = (href: string): void => {
//     dispatch(selectedRows.includes(href) ? unselectRow(href) : selectRow(href))
//   }

//   const handleSelectAll = (): void => {
//     dispatch(isAllSelected ? unselectAllRows() : selectAllRows())
//   }

//   // const getSelectedRowsData = (): TableRow[] => {
//   //   return rows.filter((row: TableRow) => selectedRows.includes(row.href))
//   // }
//   const getSelectedRowsData = React.useCallback((): TableRow[] => {
//     return rows.filter((row) => selectedRows.includes(row.href))
//   }, [rows, selectedRows])

//   const getSelectedRowsEmails = React.useCallback((): string[] => {
//     return rows
//       .filter((row) => selectedRows.includes(row.href))
//       .map(
//         (row) =>
//           row.rowDetails.find((detail) => detail.id === 'partnerEmail')?.value
//       )
//       .filter((email): email is string => email !== undefined)
//   }, [rows, selectedRows])
//   return {
//     selectedRows,
//     isAllSelected,
//     rows,
//     handleRowSelect,
//     handleSelectAll,
//     getSelectedRowsData,
//     getSelectedRowsEmails
//   }
// }

import React from 'react'
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
import { CollaborationTypeUpdated } from '@/types'
import { useDispatch, useSelector } from 'react-redux'

import { StatusIndication } from '@/app/(app)/(dashboard-pages)/_components/status-indicator'

interface TableState {
  selectedRows: string[]
  rows: TableRow[]
  isAllSelected: boolean
}

export const useCollaborationsTable = (
  tableKey: string,
  tabValue: string,
  proposals?: CollaborationTypeUpdated[]
) => {
  const dispatch = useDispatch()

  // Memoize selector to prevent unnecessary re-renders
  // Use useMemo to create stable selector function
  const tableSelector = React.useMemo(
    () =>
      (state: RootState): TableState => {
        const selectedRows = state.table.selectedRows || []
        const rows = state.table.rows || []
        return {
          selectedRows: Array.isArray(selectedRows) ? selectedRows : [],
          rows: Array.isArray(rows) ? rows : [],
          isAllSelected:
            Array.isArray(rows) &&
            rows.length > 0 &&
            Array.isArray(selectedRows) &&
            selectedRows.length === rows.length
        }
      },
    []
  )

  const { selectedRows, rows, isAllSelected } = useSelector<
    RootState,
    TableState
  >(tableSelector, (left, right) => {
    // Custom equality function to prevent unnecessary re-renders
    return (
      left.selectedRows.length === right.selectedRows.length &&
      left.selectedRows.every((val, idx) => val === right.selectedRows[idx]) &&
      left.rows.length === right.rows.length &&
      left.isAllSelected === right.isAllSelected
    )
  })

  // memoize filtered proposals
  const filteredProposals = React.useMemo(() => {
    if (!proposals || proposals.length === 0) return []

    switch (tabValue) {
      case 'all':
        return proposals
      case 'sent':
        return proposals.filter((p) => p.type === 'SENDER')
      case 'received':
        return proposals.filter((p) => p.type === 'RECEIVER')
      case 'rejected':
        return proposals.filter((p) => p.status === 'REJECTED')
      case 'active':
        return proposals.filter((p) => p.status === 'ACTIVE')
      default:
        return []
    }
  }, [proposals, tabValue])

  React.useEffect(() => {
    if (!filteredProposals || filteredProposals.length === 0) {
      dispatch(setRows([]))
      return
    }

    const tableRows: TableRow[] = filteredProposals.map((proposal) => ({
      href: `/dashboard/${proposal.id}`,
      orgId: proposal.organizationId,
      rowDetails: [
        {
          type: 'heading',
          value: proposal.name,
          className: 'text-sm font-medium',
          id: 'partnerName'
        } as TableRowDetail,
        {
          type: 'custom',
          value: proposal.status,
          customComponent: React.createElement(StatusIndication, {
            status: proposal.status
          }),
          id: 'status'
        } as TableRowDetail,
        {
          type: 'text',
          value: proposal.description || 'N/A',
          id: 'description'
        } as TableRowDetail,
        {
          type: 'text',
          value: new Date(proposal.creationTimestamp).toLocaleDateString(),
          id: 'date'
        } as TableRowDetail
      ]
    }))

    dispatch(setRows(tableRows))
  }, [filteredProposals, dispatch])

  const handleRowSelect = React.useCallback(
    (href: string): void => {
      dispatch(
        selectedRows.includes(href) ? unselectRow(href) : selectRow(href)
      )
    },
    [dispatch, selectedRows]
  )

  const handleSelectAll = React.useCallback((): void => {
    dispatch(isAllSelected ? unselectAllRows() : selectAllRows())
  }, [dispatch, isAllSelected])

  const getSelectedRowsData = React.useCallback((): TableRow[] => {
    return rows.filter((row) => selectedRows.includes(row.href))
  }, [rows, selectedRows])

  const getSelectedRowsEmails = React.useCallback((): string[] => {
    return rows
      .filter((row) => selectedRows.includes(row.href))
      .map(
        (row) =>
          row.rowDetails.find((detail) => detail.id === 'partnerEmail')?.value
      )
      .filter((email): email is string => email !== undefined)
  }, [rows, selectedRows])

  return {
    selectedRows,
    isAllSelected,
    rows,
    handleRowSelect,
    handleSelectAll,
    getSelectedRowsData,
    getSelectedRowsEmails
  }
}
