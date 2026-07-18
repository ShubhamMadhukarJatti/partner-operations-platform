'use client'

import React from 'react'

import IPPDetailsCard from './IPPDetailsCard'
import ProductMarketCard from './ProductMarketCard'

interface PartnerDetailsPageProps {
  className?: string
}

const PartnerDetailsPage: React.FC<PartnerDetailsPageProps> = ({
  className = ''
}) => {
  return (
    <div className={`flex gap-6 ${className}`}>
      <ProductMarketCard />
      <IPPDetailsCard />
    </div>
  )
}

export default PartnerDetailsPage
