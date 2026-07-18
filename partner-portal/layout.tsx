import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Portal | Sharkdom',
  description:
    'Access your partner portal to manage partnerships and collaborations'
}

export default function PartnerPortalLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
