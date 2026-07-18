'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import AdminHeader from '../_components/admin-header'

type RefreshTokenRow = {
  expiryDate: string | null
  userId: string
  userEmail: string
  generatedAt: string | null
}

type ApiResponse = {
  success: boolean
  message: string
  data: Array<{
    id: number
    token: string
    expiryDate: string | null
    userId: string
    userEmail: string
    generatedAt: string | null
  }>
}

const AdminRefreshTokensPage = () => {
  const [rows, setRows] = useState<RefreshTokenRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/refresh-token/data', {
          method: 'GET',
          credentials: 'include'
        })
        const json: ApiResponse = await res.json()

        if (!res.ok) {
          setError(json?.message ?? 'Failed to load refresh token data')
          setRows([])
          return
        }

        if (json.success && Array.isArray(json.data)) {
          const mapped: RefreshTokenRow[] = json.data.map((item) => ({
            expiryDate: item.expiryDate ?? null,
            userId: item.userId ?? '',
            userEmail: item.userEmail ?? '',
            generatedAt: item.generatedAt ?? null
          }))
          setRows(mapped)
        } else {
          setRows([])
        }
      } catch (e) {
        setError('Failed to fetch refresh token data')
        setRows([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (iso: string | null | undefined) => {
    if (iso == null || iso === '') return '—'
    try {
      // API may send microseconds (e.g. 2025-03-26T08:23:55.868979); JS Date expects at most milliseconds
      const normalized = iso.replace(/\.(\d{3})\d*/, '.$1')
      const date = new Date(normalized)
      if (Number.isNaN(date.getTime())) return iso
      return format(date, 'PPpp')
    } catch {
      return iso
    }
  }

  return (
    <main className='min-h-screen bg-[#f4f4f4]'>
      <AdminHeader />
      <div className='m-8'>
        <h1 className='mb-6 text-xl font-semibold'>Refresh Tokens</h1>
        {isLoading ? (
          <p className='text-muted-foreground'>Loading...</p>
        ) : error ? (
          <p className='text-destructive'>{error}</p>
        ) : rows.length === 0 ? (
          <p className='text-muted-foreground'>No refresh token data.</p>
        ) : (
          <div className='rounded-md border bg-card'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Generated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={`${row.userId}-${row.generatedAt}-${index}`}>
                    <TableCell>{row.userId}</TableCell>
                    <TableCell>{row.userEmail}</TableCell>
                    <TableCell>{formatDate(row.expiryDate)}</TableCell>
                    <TableCell>{formatDate(row.generatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminRefreshTokensPage
