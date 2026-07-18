import React from 'react'

import AdminHeader from '../_components/admin-header'
import SchedulerTable from '../_components/SchedulerTable'

const SchedulerPage = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <AdminHeader />
      <SchedulerTable />
    </div>
  )
}

export default SchedulerPage
