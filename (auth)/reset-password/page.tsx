import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ResetPasswordForm } from '@/app/(auth)/_components/reset-password-form'

const ResetPassword = ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const redirect = searchParams?.redirect
  function passRedirectParam(url: string) {
    if (redirect) {
      return `${url}?redirect=${redirect}`
    }

    return url
  }
  return (
    <div className='flex h-screen items-center justify-center bg-background-ghost-white'>
      <Card className='w-full max-w-lg space-y-2 border-0 shadow-none sm:space-y-4'>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <ResetPasswordForm />
        </CardContent>
        <CardFooter className='space-y-2'>
          <span className='w-full text-center'>
            Login instead?{' '}
            <Link
              href={`${passRedirectParam('/login')}`}
              className='text-primary underline'
            >
              Login
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ResetPassword
