import { FullLogo } from '@/components/icons/logo'
import { LogoutButton } from '@/components/shared/logout'

export const FocusedHeader = () => {
  return (
    <header className='container flex items-center justify-between py-4'>
      <FullLogo className='h-6 lg:h-8' />
      <LogoutButton
        className='border border-primary bg-transparent text-primary'
        isAdmin={false}
      />
    </header>
  )
}
