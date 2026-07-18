'use client'

import { useEffect, useState } from 'react'

import { getServerUser } from '@/lib/server'

import AdminHeader from '../_components/admin-header'
import PartnerAlertTable from '../_components/partner-alert-table'

type Props = {}

const AdminPartnerAlertPage = (props: Props) => {
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
      {token && <PartnerAlertTable token={token} />}
    </main>
  )
}

export default AdminPartnerAlertPage
