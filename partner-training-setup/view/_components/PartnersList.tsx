import React from 'react'

export interface Partner {
  id?: string | number
  name: string
  icon?: string
}

interface PartnersListProps {
  partners: Partner[]
  loading?: boolean
  emptyMessage?: string
}

const PartnersList = ({
  partners,
  loading = false,
  emptyMessage = 'No partners found'
}: PartnersListProps) => {
  // Get first letter or emoji for icon
  const getPartnerIcon = (partner: Partner) => {
    if (partner.icon) {
      return partner.icon
    }
    // Return first letter if no icon provided
    return partner.name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <div className='min-h-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
        <div className='flex items-center justify-center py-12'>
          <p className='text-sm text-gray-500 dark:text-white'>
            Loading partners...
          </p>
        </div>
      </div>
    )
  }

  if (partners.length === 0) {
    return (
      <div className='min-h-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
        <div className='flex items-center justify-center py-12'>
          <p className='text-sm text-gray-500 dark:text-white'>
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
      <div className='flex flex-col gap-6'>
        {partners.map((partner, index) => (
          <div key={partner.id || index} className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-xl dark:bg-white/5'>
              {getPartnerIcon(partner)}
            </div>
            <span className='text-sm font-medium text-gray-900 dark:text-white'>
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnersList
