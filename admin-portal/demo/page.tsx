'use client'

import { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'

import AdminHeader from '../_components/admin-header'
import DemoDetails from '../_components/demo-details-table'

type Props = {}

const AdminDemoPage = (props: Props) => {
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
      {token && <DemoDetails token={token} />}
    </main>
  )
}

export default AdminDemoPage
