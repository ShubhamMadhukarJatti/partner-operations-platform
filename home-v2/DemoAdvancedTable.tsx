'use client'

import React from 'react'

import { AdvancedTable } from '@/components/ui/advanced-table'
import type { Column } from '@/components/ui/table/types'

const DemoAdvancedTable = () => {
  const columns: Column[] = [
    { id: 'col-1', title: 'Name', type: 'text', accessorKey: 'name' },
    {
      id: 'col-2',
      title: 'Status',
      type: 'status',
      accessorKey: 'status',
      options: [
        { id: '1', label: 'Active', color: '#10B981' }, // Green
        { id: '2', label: 'Completed', color: '#3B82F6' }, // Blue
        { id: '3', label: 'Pending', color: '#F59E0B' } // Yellow/Orange
      ]
    },
    { id: 'col-3', title: 'Date', type: 'calendar', accessorKey: 'date' }
  ]

  const initialData = [
    { id: '1', name: 'Project A', status: 'Active', date: '2024-01-01' },
    {
      id: '3',
      name: 'Project C',
      status: 'Completed',
      date: '2024-03-30'
    },
    { id: '2', name: 'Project B', status: 'Pending', date: '2024-02-15' }
  ]

  return (
    <div className='container mx-auto px-4 py-20'>
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>
        Advanced Table Demo
      </h2>
      <AdvancedTable initialColumns={columns} initialData={initialData} />
    </div>
  )
}

export default DemoAdvancedTable
