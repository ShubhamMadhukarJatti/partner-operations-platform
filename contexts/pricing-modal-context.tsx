'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

import PricingModal from '@/components/ui/pricing-modal'

interface PricingModalContextType {
  openPricingModal: (cancelUrl?: string) => void
  closePricingModal: () => void
  isOpen: boolean
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(
  undefined
)

export const usePricingModal = () => {
  const context = useContext(PricingModalContext)
  if (!context) {
    throw new Error(
      'usePricingModal must be used within a PricingModalProvider'
    )
  }
  return context
}

interface PricingModalProviderProps {
  children: ReactNode
}

export const PricingModalProvider = ({
  children
}: PricingModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cancelUrl, setCancelUrl] = useState<string | undefined>(undefined)

  const openPricingModal = useCallback((url?: string) => {
    setCancelUrl(url)
    setIsOpen(true)
  }, [])

  const closePricingModal = useCallback(() => {
    setIsOpen(false)
    setCancelUrl(undefined)
  }, [])

  return (
    <PricingModalContext.Provider
      value={{
        openPricingModal,
        closePricingModal,
        isOpen
      }}
    >
      {children}
      <PricingModal
        isOpen={isOpen}
        onClose={closePricingModal}
        cancelUrl={cancelUrl}
      />
    </PricingModalContext.Provider>
  )
}
