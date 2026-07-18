'use client'

import React from 'react'

import AdminHeader from '../_components/admin-header'
import AdminSearch from '../_components/admin-search'

type Props = {}

const AdminSearchPage = (props: Props) => {
  return (
    <main className='h-screen bg-[#f4f4f4]'>
      <AdminHeader />
      <AdminSearch />
    </main>
  )
}

export default AdminSearchPage
