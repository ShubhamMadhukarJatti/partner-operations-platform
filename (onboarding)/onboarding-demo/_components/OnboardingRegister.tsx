import Image from 'next/image'
import Link from 'next/link'
import RegisterDemo from '@/../public/icons/demo_register.svg'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { FullLogo } from '@/components/icons/logo'
import RegistrationForm from '@/app/(auth)/_components/registration-form'

export const OnboardingRegister = () => {
  return (
    <div className='relative flex min-h-screen flex-col bg-accent md:flex-row'>
      <div className='flex flex-col gap-4 p-6 md:w-1/2'>
        <Link href='/'>
          <FullLogo className='h-7' />
        </Link>
        <div className='mt-5 hidden flex-1 flex-col items-center justify-center md:flex'>
          <h2 className='text-3xl font-semibold'>
            Start your partnership journey
          </h2>
          <Image
            src={RegisterDemo}
            alt='partnership journey'
            className='h-[450px] w-[600px]'
          />
          <p className='text-center text-2xl font-extrabold text-[#000000] text-muted-foreground'>
            Startup Hypergrowth using the Power of Partnerships
          </p>
        </div>
      </div>
      <main className='flex flex-1 items-center justify-center rounded-t-3xl bg-card p-4 md:rounded-t-none'>
        <Card className='w-full max-w-lg space-y-4 border-0 shadow-none'>
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
            <CardDescription>
              Join sharkdom, One stop solution for all your partnership needs.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <RegistrationForm />
          </CardContent>
          {/* <CardFooter className='space-y-2'>
        <span className='w-full text-center'>
          Already have an account?{' '}
          <Link
            href={`${passRedirectParam('/login')}`}
            className='text-primary underline'
          >
            Login
          </Link>
        </span>
      </CardFooter> */}
        </Card>
      </main>
    </div>
  )
}
