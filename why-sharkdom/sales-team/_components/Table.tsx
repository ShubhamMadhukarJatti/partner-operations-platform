import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, CircleX } from 'lucide-react'

const featureRows = [
  {
    feature: 'Enquiring for Partnership',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    )
  },
  {
    feature: 'Offline Partners',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    )
  },
  {
    feature: 'Partner Verification(OP)',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    )
  },
  {
    feature: 'Account Maapping',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    )
  },
  {
    feature: 'Patner Registration',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    )
  },
  {
    feature: 'Integrations',
    founderCofounder: '24',
    salesTeam: '20',
    partnership: '29'
  },
  {
    feature: 'Customers',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: 'Mid-Stage, Large Companies',
    partnership: 'All Types'
  },
  {
    feature: 'Affilaite Program',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: '',
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Partner Enablement',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: '',
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Pricing Comparision',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: 'starting @150$',
    partnership: 'starting @9$'
  },
  {
    feature: 'Max Seats',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: '3',
    partnership: '10'
  },
  {
    feature: 'API',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        In-built
      </div>
    )
  },
  {
    feature: 'Target Audience',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: 'Sales & partnership Team',
    partnership:
      'Founding Members(co-founders, CXo’s), Partnership Team, Sales team, Growth team'
  },
  {
    feature: 'Customer Support',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: 'email',
    partnership: '24x7'
  },
  {
    feature: 'Partner Recognition Kit',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: (
      <div className='flex items-center justify-center gap-2'>
        <CircleX color='#FA1624' size={16} />
        Not available
      </div>
    ),
    partnership: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Available
      </div>
    )
  },
  {
    feature: 'Partner Recruitment',
    founderCofounder: (
      <div className='flex items-center justify-center gap-2'>
        <CheckCircle2 color='#0DA057' size={16} />
        Can Manage
      </div>
    ),
    salesTeam: 'Upto some extenet',
    partnership: '100% Customizable based on the requirement'
  }
]

const Table = () => {
  return (
    <section className='bg-white py-16' id='feature-comparison'>
      <div className='mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8'>
        <p className='pb-3 text-center uppercase tracking-[2.5px] text-[#474747]'>
          NEVER TO MISS A PARNTNERSHIP OPPORTUNITY
        </p>
        <h2 className='mb-4 text-center text-3xl font-bold text-[#0B0B0B] sm:text-4xl'>
          GTM for building Strong Partnerships
        </h2>
        <p className='mb-12 max-w-[700px] text-center text-[#474747]'>
          Checkout this feature-to-feature comparison chart and you will
          understand why Impartner, Crossbeam is NOT the Right Partner
          Onboarding replacement.
        </p>

        <div className='overflow-x-auto'>
          <table className='overflow-hiden min-w-full table-auto border-collapse text-center'>
            {/* Table Header */}
            <thead className='overflow-hidden rounded-t-3xl bg-[#F5F5F7]'>
              <tr>
                <th className='w-1/4 overflow-hidden rounded-tl-3xl border border-[#2748B7] px-6 py-4'></th>

                <th className='w-1/4 border border-[#2748B7] px-6 py-4'>
                  Founder / co-founder
                </th>
                <th className='w-1/4 border border-[#2748B7] px-6 py-4'>
                  Sales Team
                </th>
                <th className='w-1/4 rounded-tr-3xl border border-[#2748B7] px-6  py-4'>
                  Partnership Team
                </th>
              </tr>
            </thead>
            <tbody>
              {featureRows.slice(0, 6).map((row, index) => (
                <tr key={index} className='border border-[#DDDDDD]'>
                  <td className='border border-[#2748B7] bg-[#F5F5F7] px-6 py-4 font-bold'>
                    {row.feature}
                  </td>
                  <td className='border-r border-[#DDDDDD] bg-[#F8FAFF] px-6 py-4 text-base text-[#2748B7]'>
                    {row.founderCofounder}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.salesTeam}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.partnership}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='overflow-hiden min-w-full table-auto border-collapse text-center'>
            {/* Table Header */}
            <thead className='invisible overflow-hidden rounded-t-3xl bg-[#F5F5F7]'>
              <tr>
                <th className='w-1/4 overflow-hidden rounded-tl-3xl px-6 py-4'></th>

                <th className='w-1/4 px-6 py-4'>Founder / co-founder</th>
                <th className='w-1/4 px-6 py-4'>Sales Team</th>
                <th className='w-1/4 rounded-tr-3xl px-6  py-4'>
                  Partnership Team
                </th>
              </tr>
            </thead>
            <tbody>
              {featureRows.slice(6, 11).map((row, index) => (
                <tr key={index} className='border border-[#DDDDDD] font-normal'>
                  <td className='border border-[#2748B7] bg-[#F5F5F7] px-6 py-4 font-bold'>
                    {row.feature}
                  </td>
                  <td className='border-r border-[#DDDDDD] bg-[#F8FAFF] px-6 py-4 text-base text-[#2748B7]'>
                    {row.founderCofounder}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.salesTeam}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.partnership}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='overflow-hiden min-w-full table-auto border-collapse overflow-hidden rounded-b-3xl text-center '>
            {/* Table Header */}
            <thead className='invisible overflow-hidden rounded-t-3xl bg-[#F5F5F7]'>
              <tr>
                <th className='w-1/4 overflow-hidden rounded-tl-3xl px-6 py-4'></th>

                <th className='w-1/4 px-6 py-4'>Founder / co-founder</th>
                <th className='w-1/4 px-6 py-4'>Sales Team</th>
                <th className='w-1/4 rounded-tr-3xl px-6  py-4'>
                  Partnership Team
                </th>
              </tr>
            </thead>
            <tbody>
              {featureRows.slice(11, 16).map((row, index) => (
                <tr key={index} className='border border-[#DDDDDD]'>
                  <td className='border border-[#2748B7] bg-[#F5F5F7] px-6 py-4 font-bold'>
                    {row.feature}
                  </td>
                  <td className='border-r border-[#DDDDDD] bg-[#F8FAFF] px-6 py-4 text-base text-[#2748B7]'>
                    {row.founderCofounder}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.salesTeam}
                  </td>
                  <td className='border-r border-[#DDDDDD] px-6 py-4'>
                    {row.partnership}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='mt-10 flex flex-col items-center justify-center gap-4 md:flex-row'>
          <Link
            href={'/book-demo'}
            className='relative flex w-[230px] items-center justify-center gap-2.5 rounded-[32px] border-4 border-b-[14px] border-[#221E15] bg-[#FFB804] px-[20px] py-[14px] text-[16px]/[24px] font-bold shadow-lg'
          >
            Talk to Team
            {/* <div className='absolute top-0 bottom-0 -left-2 -right-4 -z-10 translate-y-3 rounded-[30px] bg-[#221E15]'></div> */}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Table
