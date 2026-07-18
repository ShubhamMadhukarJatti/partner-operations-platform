'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import MailboxImg from '@/../public/assets/Mail.svg'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

type CardProps = React.ComponentProps<typeof Card>

export function VerifyStartup({ className, ...props }: CardProps) {
  const router = useRouter()
  // const [organization, setOrganization] = useState<OrganizationType | null>(
  //   null
  // )
  // const [emailVerificationLoading, setEmailVerificationLoading] =
  //   useState(false)

  // useEffect(() => {
  //   ;(async () => {
  //     const organization = await getCurrentOrganization()
  //     console.log('VERIFY-STARTUP:::::', organization)
  //     setOrganization(organization && organization?.id ? organization : null)
  //   })()
  // }, [])
  // const { nextStep } = useFormStore()

  return (
    <div className='flex h-full items-center justify-center rounded-xl bg-white text-center'>
      <Card className={cn('w-[380px]', className, 'gap-y-6 p-8 shadow')}>
        <CardHeader className='flex items-center gap-8'>
          <CardTitle>Email verification</CardTitle>
          <Image src={MailboxImg} alt='KYB' className='w-[94px]' />
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div>
            <h1 className='text-base font-semibold text-[#475467]'>
              Check you inbox and click on the link to start email verification
              and become a member of Sharkdom community.
            </h1>
            {/* <ul className='space-y-2 py-1 text-base font-normal text-[#475467]'>
              {[
                '6x more proposals accepted',
                'Mandatory to sign MOUs',
                'Access to partner valve room'
              ].map((feature, index) => (
                <li key={index} className='flex items-center'>
                  <CheckCircle2 className='mr-2 text-[#039855]' />
                  {feature}
                </li>
              ))}
            </ul> */}
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          {/* <Button
            variant={'secondary'}
            className='w-full'
            onClick={() => nextStep()}
          >
            Skip verification
          </Button> */}
          {/* {orgId !== null && ( */}
          {/* <KYB className='w-full bg-[#0062F1]' organizationId={orgId!} /> */}
          <Button
            onClick={() => router.push('/explore')}
            className={cn('', className)}
            variant='default'
            loadingText=''
          >
            {'Proceed to dashboard'}
          </Button>
          {/* // )} */}
        </CardFooter>
      </Card>
    </div>
  )
}
