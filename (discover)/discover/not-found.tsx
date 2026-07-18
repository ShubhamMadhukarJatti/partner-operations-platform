import Link from 'next/link'

import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

export default function DiscoverNotFound() {
  return (
    <MaxWidthWrapper className='max-w-6xl'>
      <div className='my-8 flex min-h-[400px] flex-col items-center justify-center'>
        <div className='space-y-4 text-center'>
          <h2 className='text-2xl font-bold text-text-100'>Page not found</h2>
          <p className='max-w-md text-text-80'>
            The discover page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <div className='flex justify-center gap-4'>
            <Button asChild>
              <Link href='/discover'>Go to Discover</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/'>Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
