import { Logo } from '@/components/icons/logo'

export default function Loading() {
  return (
    <div className='flex min-h-[calc(100vh-80px)] w-full items-center justify-center bg-white'>
      <Logo className='h-12 w-auto animate-pulse text-[#3C3CD4]' />
    </div>
  )
}
