import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/providers/theme-provider'

import 'regenerator-runtime/runtime'

import { ReduxProviders } from '@/app/providers'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProviders>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </ThemeProvider>
    </ReduxProviders>
  )
}
