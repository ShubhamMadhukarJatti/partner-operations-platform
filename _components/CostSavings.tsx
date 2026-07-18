import React, { ReactNode } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

interface CostSavingsProps {
  tableHeaders: Array<string | ReactNode>
  tableRows: Array<Array<string | ReactNode>>
}

function CostSavings({ tableHeaders, tableRows }: CostSavingsProps) {
  return (
    <section className='mx-auto max-w-7xl'>
      <div className='flex flex-col bg-white p-4 py-16 text-center'>
        <p className='mb-2 text-lg uppercase text-gray-500'>SAVE UP TO 27%</p>
        <h2 className='mb-6 text-3xl font-bold'>
          Compare and calculate your cost saving
        </h2>
        <p className='mb-8 text-center text-gray-600'>
          Get <b>50</b> free credits refreshed every month with lower rates per
          partnership, proactive support, and more customization options. <br />
          <span className='font-bold'>
            Sharkdom Enterprise users are also eligible to receive credits up to
            $2000
          </span>
        </p>

        <div className='overflow-x-auto lg:mx-auto lg:max-w-3xl'>
          <table className='min-w-full table-auto border-collapse overflow-auto text-center'>
            {/* Table Header */}
            <thead className='rounded-t-lg bg-[#F5F5F7]'>
              <tr>
                <th className='w-1/4 border border-[#DDDDDD] px-6 py-4'></th>
                {tableHeaders &&
                  tableHeaders.map((th, idx) => (
                    <th
                      key={idx}
                      className='w-1/4 border border-[#DDDDDD] px-6 py-4'
                    >
                      {th}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {tableRows &&
                tableRows.map((row, idx) => (
                  <tr key={idx} className='border border-[#DDDDDD]'>
                    {row &&
                      row.map((d, idx) => (
                        <td
                          key={`${idx}-${d}`}
                          className={cn(
                            'border-r border-[#DDDDDD] px-6 py-4 ',
                            {
                              'font-bold': idx === 0,
                              'bg-[#F5F5F7]': idx === 0
                            }
                          )}
                        >
                          {d}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='mt-8 text-center'>
          <Link
            href={'/register'}
            className='mx-auto flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700'
          >
            Sign up Now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CostSavings
