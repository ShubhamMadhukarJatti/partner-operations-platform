import Link from 'next/link'

import { FullLogo } from '@/components/icons/logo'

type Props = {}

const MeetingHeader = (props: Props) => {
  return (
    <header className='container w-full  -translate-y-4 animate-fade-in bg-white py-4 opacity-0'>
      <div className='flex items-center justify-between'>
        <Link href='/' className='flex items-center text-xl font-semibold'>
          <FullLogo className='h-6 w-full sm:h-8' />
        </Link>
      </div>
    </header>
  )
}

export default MeetingHeader
