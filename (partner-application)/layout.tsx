import { GradientPageBackground } from '@/components/shared/gradient-page-background'

export default function PartnerApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <GradientPageBackground>{children}</GradientPageBackground>
}
