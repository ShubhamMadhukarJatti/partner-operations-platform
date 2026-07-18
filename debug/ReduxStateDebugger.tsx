'use client'

import React, { useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const ReduxStateDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const currentOrg = useSelector((state: RootState) => state.currentOrg)
  const organizationData = useSelector((state: RootState) => state.organization)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-20 right-4 z-50 rounded-lg bg-green-600 px-3 py-2 text-sm text-white shadow-lg hover:bg-green-700'
      >
        🔍 Redux State
      </button>
    )
  }

  return (
    <div className='fixed bottom-20 right-4 z-50 max-h-96 max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='font-semibold text-gray-800'>Redux State Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className='text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>

      <div className='space-y-4'>
        <div className='rounded bg-blue-50 p-3'>
          <h4 className='font-medium text-blue-800'>Current Org State:</h4>
          <pre className='mt-2 text-xs text-blue-700'>
            {JSON.stringify(currentOrg, null, 2) || 'No data'}
          </pre>
        </div>

        <div className='rounded bg-green-50 p-3'>
          <h4 className='font-medium text-green-800'>
            Organization Data State:
          </h4>
          <pre className='mt-2 text-xs text-green-700'>
            {JSON.stringify(organizationData, null, 2) || 'No data'}
          </pre>
        </div>

        <div className='rounded bg-yellow-50 p-3'>
          <h4 className='font-medium text-yellow-800'>
            Selected Organization:
          </h4>
          <pre className='mt-2 text-xs text-yellow-700'>
            {JSON.stringify(
              currentOrg.organization?.id
                ? currentOrg.organization
                : organizationData.organizationData,
              null,
              2
            ) || 'No data'}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ReduxStateDebugger
