import React from 'react'

import { getCurrentOrganization } from '@/lib/db/organization'

import AllMesages from './_components/all-mesages'

const Inbox = async () => {
  const [currentOrganization] = await Promise.all([getCurrentOrganization()])

  return (
    <>
      <div className='p-4'>
        <AllMesages id={currentOrganization.id} />
      </div>
    </>
  )
}

export default Inbox
