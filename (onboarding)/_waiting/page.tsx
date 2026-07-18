import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserCheck } from 'lucide-react'

import { getOrganizationMappingsByUserId } from '@/lib/db/organization'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export default async function WaitingPage() {
  const organizationMappings = await getOrganizationMappingsByUserId()

  const status = organizationMappings[0].organizationUserMapping.status
  const organization = organizationMappings[0].organization

  if (status === 'ACTIVE') {
    redirect('/explore')
  }

  if (status === 'REJECTED') {
    redirect('/onboarding/join')
  }

  if (status === 'DELETED') {
    redirect('/onboarding/create')
  }

  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      <Card className='shadow'>
        <CardContent className='flex flex-col items-center justify-center gap-4'>
          <UserCheck size={80} className='self-center opacity-70' />
          <h3 className='text-center text-2xl font-medium'>
            Waiting for approval
          </h3>
          <p className='text-muted-foreground'>
            Your request to join{' '}
            <strong className='text-foreground'>{organization.name}</strong> is
            pending for approval.
            <br /> please wait for the admin to approve your request.
          </p>
          <h2 className='max-w-sm text-center text-muted-foreground [text-wrap:balance]'>
            In the mean time you can check out our blog for some interesting
            articles on partnerships.
          </h2>
          <Button
            size='sm'
            asChild
            variant='secondary'
            className='self-center rounded-lg'
          >
            <Link href='/blog' className='no-underline'>
              Blog
            </Link>
          </Button>
        </CardContent>
        <CardFooter className='self-center'>
          <Button
            size='sm'
            asChild
            variant='ghost'
            className='self-center rounded-lg'
          >
            <a href='/onboarding/waiting' className='no-underline'>
              Got approved? Refresh
            </a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
