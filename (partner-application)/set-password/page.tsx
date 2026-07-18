import type { Metadata } from 'next'

import { SetPasswordView } from './_components/SetPasswordView'

export const metadata: Metadata = {
  title: 'Set your password | Sharkdom',
  description:
    'Create a secure password to access your Partner Dashboard on Sharkdom.',
  robots: { index: false, follow: false }
}

export default function SetPasswordPage() {
  return <SetPasswordView />
}
