import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Valve Rooms',
  description: 'Add subtext about partner valve rooms',
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partner-space'
  }
}

const PartnerSpaceLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className='h-full'>{children}</main>
}

export default PartnerSpaceLayout
