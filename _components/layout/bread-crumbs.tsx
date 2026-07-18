import React from 'react'

type Props = {
  pageName: string
}

const BreadCrumbs = ({ pageName }: Props) => {
  return (
    <div className='w-full border-b border-[#CCCCCC]  py-4 pl-4'>
      <h3 className='text-base font-semibold leading-5'>{pageName}</h3>
    </div>
  )
}

export default BreadCrumbs
