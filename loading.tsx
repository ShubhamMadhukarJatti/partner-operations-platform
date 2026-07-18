import { Logo } from '@/components/icons/logo'

const AppLoader = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <Logo className='h-10 w-auto animate-pulse' />
    </div>
  )
}

export default AppLoader
