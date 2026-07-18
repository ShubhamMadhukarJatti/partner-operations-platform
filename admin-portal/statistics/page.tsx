'use client'

import React, { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'

import AdminHeader from '../_components/admin-header'
import StatisticsTable from '../_components/statistics-table'

type Props = {}

const AdminStatisticsPage = (props: Props) => {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      const { token, user } = await getServerUser()
      setToken(token || '')
    })()
  }, [])

  return (
    <main className='h-screen bg-[#f4f4f4]'>
      <AdminHeader />
      {token && <StatisticsTable token={token} />}
    </main>
  )
}

export default AdminStatisticsPage
