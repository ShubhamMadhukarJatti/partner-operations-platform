'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import {
  ArrowLeft,
  Building2,
  CreditCard,
  SquarePen,
  Trash2
} from 'lucide-react'

import {
  createSetupIntent,
  deleteBillingPaymentMethod,
  fetchBillingCustomer,
  fetchBillingOrgProfile,
  fetchFreeTrialSubscriptionPlanByEmail,
  saveFreeTrialSubscriptionPlanByEmail,
  saveOrgProfile,
  updateCardDetail,
  updateFreeTrialSubscriptionPlanByEmail,
  updateOrgProfile
} from '@/lib/db/payment'
import { getUserGeo } from '@/lib/geo'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import {
  SubscriptionSummaryBox,
  type SubscriptionLineItem
} from './SubscriptionSummaryBox'

const COUNTRY_OPTIONS = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' }
]

function countryLabelFromCode(code: string) {
  return COUNTRY_OPTIONS.find((o) => o.value === code)?.label ?? code
}

type BillingOrgProfileData = {
  id?: number
  orgId?: number | null
  numberOfSeats?: number
  price?: number
  organizationName?: string
  country?: string
  address?: string
  gstInId?: string
}

/**
 * Normalize GET /api/v1/billing response (and HAL-style wrappers) into org form fields.
 */
function extractOrgProfileFromBillingGetApi(res: unknown): {
  organizationName: string
  country: string
  address: string
  gstInId: string
} | null {
  if (res == null || typeof res !== 'object') return null
  const root = res as Record<string, unknown>
  if (root.success === false) return null

  const dataNodeFromBillingGet = (
    r: Record<string, unknown>
  ): Record<string, unknown> => {
    const d = r.data
    if (d && typeof d === 'object' && !Array.isArray(d)) {
      const dto = d as Record<string, unknown>
      const inner = dto.data
      if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
        return inner as Record<string, unknown>
      }
      return dto
    }
    const emb = r._embedded
    if (emb && typeof emb === 'object') {
      for (const val of Object.values(emb as Record<string, unknown>)) {
        if (Array.isArray(val) && val[0] && typeof val[0] === 'object') {
          return val[0] as Record<string, unknown>
        }
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          return val as Record<string, unknown>
        }
      }
    }
    return r
  }

  const node = dataNodeFromBillingGet(root)

  const pickStr = (o: Record<string, unknown>, keys: string[]) => {
    for (const k of keys) {
      const v = o[k]
      if (v == null) continue
      if (typeof v === 'string' && v.trim()) return v.trim()
      if (typeof v === 'number' && Number.isFinite(v)) return String(v)
    }
    return ''
  }

  const organizationName = pickStr(node, [
    'organizationName',
    'organization_name',
    'orgName',
    'name'
  ])
  const country = pickStr(node, [
    'country',
    'countryCode',
    'country_code',
    'region'
  ])
  const address = pickStr(node, [
    'address',
    'billingAddress',
    'billing_address',
    'street',
    'fullAddress'
  ])
  const gstInId = pickStr(node, ['gstInId', 'gst_in_id', 'gstin', 'gstIN'])

  if (!organizationName && !address && !country && !gstInId) return null

  return { organizationName, country, address, gstInId }
}

type OrgFieldsExtract = NonNullable<
  ReturnType<typeof extractOrgProfileFromBillingGetApi>
>

/**
 * Organization fields from GET /api/v1/billing only (DB — single source of truth).
 */
function extractOrgFieldsFromBillingGetPayload(
  payload: unknown
): OrgFieldsExtract | null {
  if (payload == null) return null
  const fromExtract = extractOrgProfileFromBillingGetApi(payload)
  if (fromExtract) return fromExtract
  const env = payload as Record<string, unknown>
  const data = env?.data as BillingOrgProfileData | undefined
  if (data && typeof data === 'object') {
    const organizationName =
      typeof data.organizationName === 'string'
        ? data.organizationName.trim()
        : ''
    const country = typeof data.country === 'string' ? data.country.trim() : ''
    const address = typeof data.address === 'string' ? data.address.trim() : ''
    const gstInId =
      data.gstInId !== undefined && data.gstInId !== null
        ? String(data.gstInId).trim()
        : ''
    if (!organizationName && !country && !address && !gstInId) return null
    return { organizationName, country, address, gstInId }
  }
  return null
}

function formatMaskedPan(last4: string) {
  return `XXXX-XXXX-XXXX-${last4}`
}

export type SavedCardDisplay = {
  /** Stable list key (payment method id from API when present) */
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  cardholderName: string
  isDefault: boolean
}

function mapCardDetailsToSavedCards(
  cardDetails: unknown,
  fallbackCustomerName: string
): SavedCardDisplay[] {
  if (cardDetails == null) return []
  const raw = Array.isArray(cardDetails) ? cardDetails : [cardDetails]
  const list: SavedCardDisplay[] = []

  raw.forEach((item, index) => {
    if (!item || typeof item !== 'object') return
    const c = item as Record<string, unknown>
    const last4 = String(c.last4 ?? c.lastFour ?? '').trim()
    if (!last4) return

    const pmId =
      (typeof c.paymentMethodId === 'string' && c.paymentMethodId) ||
      (typeof c.payment_method_id === 'string' && c.payment_method_id) ||
      (typeof c.stripePaymentMethodId === 'string' &&
        c.stripePaymentMethodId) ||
      (typeof c.id === 'string' && String(c.id).startsWith('pm_')
        ? c.id
        : '') ||
      `card-${index}-${last4}`

    const holder =
      (typeof c.cardholderName === 'string' && c.cardholderName.trim()) ||
      (typeof c.name === 'string' && c.name.trim()) ||
      (typeof c.billingName === 'string' && c.billingName.trim()) ||
      fallbackCustomerName

    const isDefault =
      c.default === true ||
      c.isDefault === true ||
      c.defaultPaymentMethod === true ||
      c.is_default === true

    list.push({
      id: pmId,
      brand: String(c.brand ?? 'card'),
      last4,
      expMonth: Number(c.expMonth ?? c.exp_month ?? 0),
      expYear: Number(c.expYear ?? c.exp_year ?? 0),
      cardholderName: holder,
      isDefault: Boolean(isDefault)
    })
  })

  if (list.length === 0) return list

  const defaultIdx = list.findIndex((x) => x.isDefault)
  const badgeIdx = defaultIdx >= 0 ? defaultIdx : 0
  return list.map((c, idx) => ({
    ...c,
    isDefault: idx === badgeIdx
  }))
}

/** Synthetic ids from `mapCardDetailsToSavedCards` when API omits a Stripe payment method id */
function isRemovableSavedCardId(id: string): boolean {
  return Boolean(id && !/^card-\d+-/.test(id))
}

function CardBrandMark({ brand }: { brand: string }) {
  const b = brand.toLowerCase()
  if (b === 'visa') {
    return (
      <div
        className='flex h-[30px] w-11 shrink-0 items-center justify-center rounded bg-[#21246E] text-[10px] font-bold tracking-tight text-white'
        aria-hidden
      >
        VISA
      </div>
    )
  }
  if (b === 'mastercard' || b === 'mc') {
    return (
      <div
        className='relative h-[30px] w-11 shrink-0 overflow-hidden rounded bg-gradient-to-b from-[#1D4C80] to-[#173A63]'
        aria-hidden
      >
        <span className='absolute left-1 top-1.5 h-3 w-3 rounded-full bg-[#E41D2C]' />
        <span className='absolute left-3 top-1.5 h-3 w-3 rounded-full bg-[#F8B02B] opacity-95' />
      </div>
    )
  }
  return (
    <div
      className='flex h-[30px] w-11 shrink-0 items-center justify-center rounded border border-[#E4E7EE] bg-white dark:bg-white/5'
      aria-hidden
    >
      <CreditCard className='h-5 w-5 text-[#6F7E9E]' strokeWidth={2} />
    </div>
  )
}

function SavedPaymentCardRow({
  brand,
  last4,
  cardholderName,
  showDefaultBadge,
  onRemove,
  removeDisabled
}: {
  brand: string
  last4: string
  cardholderName: string
  showDefaultBadge: boolean
  onRemove: () => void
  removeDisabled?: boolean
}) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col gap-2 rounded-[10px] border border-[#98B8FF] px-5 py-[18px]',
        'bg-[linear-gradient(90deg,#F6F9FF_0%,#F8F8FF_100%)]'
      )}
    >
      <div className='absolute right-5 top-[18px] z-10 flex items-center'>
        <button
          type='button'
          onClick={onRemove}
          disabled={removeDisabled}
          className='rounded p-0.5 text-[#DD5E68] transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD5E68] disabled:cursor-not-allowed disabled:opacity-40'
          aria-label='Remove card'
        >
          <Trash2 className='h-[18px] w-[18px]' strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <CardBrandMark brand={brand} />

      <div className='flex max-w-[calc(100%-6rem)] flex-wrap items-center gap-2'>
        <span className='text-base font-medium leading-[19px] text-[#919EAB]'>
          {formatMaskedPan(last4)}
        </span>
        {showDefaultBadge && (
          <span className='inline-flex items-center rounded-full border border-[#2563EB] bg-white px-2 py-0.5 pl-1.5 text-xs font-semibold leading-[15px] text-[#2563EB] dark:bg-white/5'>
            Default payment method
          </span>
        )}
      </div>

      <p className='text-sm font-medium leading-5 text-[#556B91]'>
        {cardholderName.trim() ? cardholderName : '—'}
      </p>
    </div>
  )
}

function OrgDetailsReadOnlyRow({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className='flex flex-col gap-2 px-5 py-2'>
      <span className='text-sm font-medium leading-[17px] text-[#637293]'>
        {label}
      </span>
      <span className='text-base font-medium leading-6 text-[#212B36]'>
        {value.trim() ? value : '—'}
      </span>
    </div>
  )
}

export type ConfirmPlanFormValues = {
  organizationName: string
  country: string
  address: string
  gstin: string
  cardNumber: string
  expiry: string
  cvc: string
  nameOnCard: string
}

export type ConfirmPlanLineItem = SubscriptionLineItem

interface ConfirmPlanViewProps {
  selectedPlanTitle?: string
  seatCount?: number
  pricePerSeat?: number
  selectedFeatures?: ConfirmPlanLineItem[]
  currencyCode?: 'INR' | 'USD'
  onCurrencyChange?: (currency: 'INR' | 'USD') => void
  trialDays?: number
  /** Module names (e.g. ['PARTNER_ONBOARDING_MONTHLY']) used for org profile save */
  moduleNames?: string[]
  /**
   * When set (free-trial payment), org load/save uses
   * GET/POST `/api/v1/free-trial-subscription-plans/email/{email}` instead of `/api/v1/billing`.
   */
  freeTrialSubscriptionEmail?: string
  onBack: () => void
  onCardAdded: (customerId: string) => void
  /** When the last saved card is removed — use to clear subscribe-ready state in parent */
  onNoSavedCards?: () => void
  onSubscribe: () => void
  isSubmitting?: boolean
  isSubscribeReady?: boolean
}

// Shared Stripe element styling
const ELEMENT_STYLE = {
  base: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#323232',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '::placeholder': {
      color: '#9ca3af'
    }
  },
  invalid: {
    color: '#ef4444'
  }
}

/** Block container only — never `display:flex` on Stripe mounts (iframe sizes to 0). */
function StripeFieldShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='box-border min-h-[44px] w-full rounded-md border border-[#E4E7EE] bg-white px-3 py-2.5 dark:bg-white/5'>
      {children}
    </div>
  )
}

export function ConfirmPlanView({
  selectedPlanTitle = '',
  seatCount = 1,
  pricePerSeat = 0,
  selectedFeatures,
  currencyCode = 'INR',
  onCurrencyChange,
  trialDays = 0,
  moduleNames = [],
  freeTrialSubscriptionEmail,
  onBack,
  onCardAdded,
  onNoSavedCards,
  onSubscribe,
  isSubmitting = false,
  isSubscribeReady = false
}: ConfirmPlanViewProps) {
  // ─── Organization info state ───
  const [orgName, setOrgName] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [gstin, setGstin] = useState('')
  const [isSavingOrg, setIsSavingOrg] = useState(false)
  const [orgSaved, setOrgSaved] = useState(false)
  /** Until first GET /api/v1/billing completes — avoids flashing empty org form when profile exists */
  const [isLoadingOrgBootstrap, setIsLoadingOrgBootstrap] = useState(true)
  /** True after user clicks "Edit Info" on saved org — next save uses PUT /api/v1/billing */
  const isOrgEditAfterSaveRef = useRef(false)

  // ─── Payment method state ───
  const [nameOnCard, setNameOnCard] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  // Track completion of each Stripe sub-element
  const [cardNumberComplete, setCardNumberComplete] = useState(false)
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false)
  const [cardCvcComplete, setCardCvcComplete] = useState(false)

  // ─── Saved cards (from billing API cardDetails array) ───
  const [savedCards, setSavedCards] = useState<SavedCardDisplay[]>([])
  const [isLoadingCard, setIsLoadingCard] = useState(true)
  const [showCardForm, setShowCardForm] = useState(false)
  const [removingCardId, setRemovingCardId] = useState<string | null>(null)

  // ─── Geo: currency hint only — org/country come from GET /api/v1/billing ───
  useEffect(() => {
    getUserGeo().then((geo) => {
      if (geo && onCurrencyChange) onCurrencyChange(geo.currency)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Org: GET billing or free-trial-by-email; billing customer for saved cards ───
  useEffect(() => {
    const loadBillingContext = async () => {
      try {
        const { user } = await getServerUser()
        if (!user?.uid) {
          return
        }

        const ftEmail = freeTrialSubscriptionEmail?.trim()

        const [billingProfile, customerData] = await Promise.all([
          ftEmail
            ? fetchFreeTrialSubscriptionPlanByEmail(ftEmail)
            : fetchBillingOrgProfile(),
          fetchBillingCustomer(user.uid).catch((err) => {
            console.error('fetchBillingCustomer failed:', err)
            return null
          })
        ])

        const orgFields = extractOrgFieldsFromBillingGetPayload(billingProfile)
        if (orgFields) {
          setOrgName(orgFields.organizationName)
          setCountry(orgFields.country)
          setAddress(orgFields.address)
          setGstin(orgFields.gstInId)
          setOrgSaved(orgFields.organizationName.trim().length > 0)
        } else {
          setOrgName('')
          setCountry('')
          setAddress('')
          setGstin('')
          setOrgSaved(false)
        }

        if (customerData?.customerId) {
          const fallbackName = customerData.customerName || ''
          const cards = mapCardDetailsToSavedCards(
            customerData.cardDetails,
            fallbackName
          )
          setSavedCards(cards)
          if (cards.length > 0) {
            onCardAdded(customerData.customerId)
          }
        }
      } catch (error) {
        console.error('Error loading billing context:', error)
      } finally {
        setIsLoadingCard(false)
        setIsLoadingOrgBootstrap(false)
      }
    }

    loadBillingContext()
  }, [freeTrialSubscriptionEmail]) // eslint-disable-line react-hooks/exhaustive-deps

  const stripe = useStripe()
  const elements = useElements()

  // ─── Derived state ───
  const isOrgFormComplete =
    orgName.trim().length > 0 &&
    country.trim().length > 0 &&
    address.trim().length > 0

  const isCardComplete =
    cardNumberComplete &&
    cardExpiryComplete &&
    cardCvcComplete &&
    postalCode.trim().length > 0

  const useMulti =
    Array.isArray(selectedFeatures) && selectedFeatures.length > 0
  const subtotal = useMulti
    ? selectedFeatures!.reduce((s, f) => s + f.pricePerSeat * f.seats, 0)
    : pricePerSeat * seatCount
  const discount = 0
  const tax = Math.round(subtotal * 0.18)
  const totalMonthly = subtotal - discount + tax

  // Total seats across all modules
  const totalSeats = useMulti
    ? selectedFeatures!.reduce((s, f) => s + f.seats, 0)
    : seatCount

  // Determine postal code label based on selected country
  const postalLabel = country === 'IN' ? 'PIN' : 'ZIP'
  const postalPlaceholder = country === 'IN' ? 'eg. 110001' : 'eg. 10001'

  /**
   * Billing: POST/PUT `/api/v1/billing` then confirm via GET billing.
   * Free trial: POST first save; PUT after "Edit Info" (same body as POST); then GET — display only after GET succeeds.
   */
  const handleSaveOrg = async () => {
    setIsSavingOrg(true)
    const ftEmail = freeTrialSubscriptionEmail?.trim()

    if (ftEmail) {
      try {
        const ftPayload = {
          numberOfSeats: totalSeats,
          price: totalMonthly,
          organizationName: orgName,
          country,
          address,
          gstInId: gstin
        }
        const isUpdateAfterEdit = isOrgEditAfterSaveRef.current
        if (isUpdateAfterEdit) {
          try {
            await updateFreeTrialSubscriptionPlanByEmail(ftEmail, ftPayload)
          } catch (putErr) {
            const msg =
              putErr instanceof Error ? putErr.message : String(putErr)
            if (/does not exist|not found/i.test(msg)) {
              await saveFreeTrialSubscriptionPlanByEmail(ftEmail, ftPayload)
            } else {
              throw putErr
            }
          }
        } else {
          await saveFreeTrialSubscriptionPlanByEmail(ftEmail, ftPayload)
        }
        const refreshed = await fetchFreeTrialSubscriptionPlanByEmail(ftEmail)
        const orgFromGet = extractOrgFieldsFromBillingGetPayload(refreshed)
        if (orgFromGet && orgFromGet.organizationName.trim().length > 0) {
          setOrgName(orgFromGet.organizationName)
          setCountry(orgFromGet.country)
          setAddress(orgFromGet.address)
          setGstin(orgFromGet.gstInId)
          setOrgSaved(true)
          isOrgEditAfterSaveRef.current = false
          showCustomToast(
            'Success',
            'Organization details saved!',
            'success',
            3000
          )
        } else {
          setOrgName('')
          setCountry('')
          setAddress('')
          setGstin('')
          setOrgSaved(false)
          isOrgEditAfterSaveRef.current = false
          showCustomToast(
            'Error',
            'Organization may have been saved, but we could not load it from the server. Check GET /api/v1/free-trial-subscription-plans/email or try again.',
            'error',
            6000
          )
        }
      } catch (error) {
        showCustomToast(
          'Error',
          error instanceof Error
            ? error.message
            : 'Failed to save organization details',
          'error',
          5000
        )
      } finally {
        setIsSavingOrg(false)
      }
      return
    }

    const isUpdateAfterEdit = isOrgEditAfterSaveRef.current
    try {
      if (isUpdateAfterEdit) {
        try {
          await updateOrgProfile({
            organizationName: orgName,
            country,
            address,
            gstInId: gstin
          })
        } catch (putErr) {
          const msg = putErr instanceof Error ? putErr.message : String(putErr)
          if (/does not exist|not found/i.test(msg)) {
            await saveOrgProfile({
              modules: moduleNames,
              numberOfSeats: totalSeats,
              price: totalMonthly,
              organizationName: orgName,
              country,
              address,
              gstInId: gstin
            })
          } else {
            throw putErr
          }
        }
      } else {
        await saveOrgProfile({
          modules: moduleNames,
          numberOfSeats: totalSeats,
          price: totalMonthly,
          organizationName: orgName,
          country,
          address,
          gstInId: gstin
        })
      }

      const refreshed = await fetchBillingOrgProfile()
      const orgFromGet = extractOrgFieldsFromBillingGetPayload(refreshed)
      if (orgFromGet && orgFromGet.organizationName.trim().length > 0) {
        setOrgName(orgFromGet.organizationName)
        setCountry(orgFromGet.country)
        setAddress(orgFromGet.address)
        setGstin(orgFromGet.gstInId)
        setOrgSaved(true)
        isOrgEditAfterSaveRef.current = false
        showCustomToast(
          'Success',
          'Organization details saved!',
          'success',
          3000
        )
      } else {
        setOrgName('')
        setCountry('')
        setAddress('')
        setGstin('')
        setOrgSaved(false)
        isOrgEditAfterSaveRef.current = false
        showCustomToast(
          'Error',
          'Organization may have been saved, but we could not load it from the server. Check GET /api/v1/billing or try again.',
          'error',
          6000
        )
      }
    } catch (error) {
      showCustomToast(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to save organization details',
        'error',
        5000
      )
    } finally {
      setIsSavingOrg(false)
    }
  }

  /**
   * Full "Add Card" flow:
   * 1. Phase 1:  getServerUser() → uid → POST /api/v1/billing/customer → customerId
   * 2. Phase 1B: POST /api/v1/billing/setup-intents { customerId } → clientSecret
   * 3. Phase 2:  stripe.confirmCardSetup(clientSecret) → card saved on Stripe → paymentMethodId
   * 4. Phase 3:  PUT /api/stripe-setup/set-default → set as default on Stripe
   * 5. Phase 4:  PUT /api/v1/billing/customers/{customerId}/payment-methods/{paymentMethodId} → save in DB
   * 6. Return customerId to parent
   */
  const handleAddCard = async () => {
    if (!stripe || !elements) return

    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) return

    setIsAddingCard(true)
    setCardError(null)

    try {
      // ─── Phase 1: Get uid → fetch existing Stripe customerId from backend ───
      const { user } = await getServerUser()
      if (!user?.uid) {
        throw new Error('User not found. Please log in again.')
      }

      const customerData = await fetchBillingCustomer(user.uid)
      const customerId = customerData?.customerId
      if (!customerId) {
        throw new Error('Stripe customer not found for this account.')
      }

      const userName = nameOnCard || customerData?.customerName || undefined
      const email = customerData?.customerEmail || undefined

      // ─── Phase 1B: Create SetupIntent for this customer ───
      const setupRes = await createSetupIntent({ customerId })
      const clientSecret = setupRes?.data?.clientSecret
      if (!clientSecret) {
        throw new Error('Failed to create setup intent')
      }

      // ─── Phase 2: Confirm Card Setup with Stripe ───
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: userName,
            email: email,
            address: {
              postal_code: postalCode || undefined,
              country: country || undefined
            }
          }
        }
      })

      if (result.error) {
        throw new Error(result.error.message || 'Card setup failed')
      }

      const paymentMethodId = result.setupIntent.payment_method as string
      if (!paymentMethodId) {
        throw new Error('Failed to get payment method from Stripe')
      }

      // ─── Phase 3: Set as default payment method on Stripe ───
      const updateRes = await fetch('/api/stripe-setup/set-default', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, paymentMethodId })
      })
      const updateData = await updateRes.json()

      if (!updateData.success) {
        throw new Error(
          updateData.message || 'Failed to set default card on Stripe'
        )
      }

      // ─── Phase 4: Save card in Sharkdom backend DB ───
      await updateCardDetail(customerId, paymentMethodId)

      const refreshed = await fetchBillingCustomer(user.uid)
      const displayName =
        (nameOnCard.trim() && nameOnCard) ||
        refreshed?.customerName ||
        customerData.customerName ||
        ''
      setSavedCards(
        mapCardDetailsToSavedCards(refreshed?.cardDetails, displayName)
      )
      setShowCardForm(false)
      setCardNumberComplete(false)
      setCardExpiryComplete(false)
      setCardCvcComplete(false)
      setPostalCode('')
      elements.getElement(CardNumberElement)?.clear()
      elements.getElement(CardExpiryElement)?.clear()
      elements.getElement(CardCvcElement)?.clear()

      onCardAdded(customerId)
      showCustomToast('Success', 'Card saved successfully.', 'success', 3000)
    } catch (error) {
      console.error('handleAddCard error:', error)
      setCardError(
        error instanceof Error ? error.message : 'Failed to add card'
      )
    } finally {
      setIsAddingCard(false)
    }
  }

  const handleRemoveCard = async (card: SavedCardDisplay) => {
    if (!isRemovableSavedCardId(card.id)) {
      showCustomToast(
        'Cannot remove card',
        'This saved card is missing a payment method id. Try refreshing the page.',
        'error',
        5000
      )
      return
    }

    setRemovingCardId(card.id)
    try {
      const { user } = await getServerUser()
      if (!user?.uid) {
        throw new Error('User not found. Please log in again.')
      }

      const customerData = await fetchBillingCustomer(user.uid)
      const customerId = customerData?.customerId
      if (!customerId) {
        throw new Error('Stripe customer not found for this account.')
      }

      await deleteBillingPaymentMethod(customerId, card.id)

      const refreshed = await fetchBillingCustomer(user.uid)
      const displayName = refreshed?.customerName || ''
      const cards = mapCardDetailsToSavedCards(
        refreshed?.cardDetails,
        displayName
      )
      setSavedCards(cards)

      if (cards.length === 0) {
        onNoSavedCards?.()
        setShowCardForm(false)
      }

      showCustomToast('Success', 'Card removed.', 'success', 3000)
    } catch (error) {
      console.error('handleRemoveCard error:', error)
      const message =
        error instanceof Error ? error.message : 'Failed to remove card'
      showCustomToast('Error', message, 'error', 5000)
    } finally {
      setRemovingCardId(null)
    }
  }

  return (
    <div className='mx-auto max-w-6xl space-y-8 pb-8'>
      {/* Header */}
      <div>
        <button
          type='button'
          onClick={onBack}
          className='mb-4 flex items-center gap-2 text-sm text-[#3E50F7] hover:underline'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </button>
        <h1 className='text-2 dark:text-whitexl md:text-3 dark:text-whitexl font-bold text-[#323232]'>
          Confirm your Plan
        </h1>
        <p className='mt-2 text-sm text-[#717182]'>
          Once you pay, you can start using your new plan&apos;s features
          straight away
        </p>
      </div>

      {/* Two columns */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[1fr,380px]'>
        {/* Left: Form */}
        <div className='space-y-6'>
          {isLoadingOrgBootstrap ? (
            <Card className='overflow-hidden rounded-xl border-[#E4E7EE] shadow-sm'>
              <CardContent className='flex items-center justify-center py-14'>
                <div className='h-6 w-6 animate-spin rounded-full border-2 border-[#6863FB] border-t-transparent' />
                <span className='ml-3 text-sm text-[#717182]'>
                  Loading organization details...
                </span>
              </CardContent>
            </Card>
          ) : !orgSaved ? (
            <Card className='overflow-hidden rounded-xl border-[#E4E7EE] shadow-sm'>
              <CardHeader className='space-y-1 pb-4'>
                <h2 className='text-lg font-semibold text-[#323232]'>
                  Organization info
                </h2>
                <p className='text-sm text-[#717182]'>
                  This information will be included on billing invoices on your
                  account.
                </p>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='org-name' className='text-[#323232]'>
                    Organization name
                  </Label>
                  <Input
                    id='org-name'
                    placeholder='eg. Acme corp'
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value)
                      setOrgSaved(false)
                    }}
                    className='border-[#E4E7EE] bg-white dark:bg-white/5'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='country' className='text-[#323232]'>
                    Country or region
                  </Label>
                  <Select
                    value={country}
                    onValueChange={(v) => {
                      setCountry(v)
                      setOrgSaved(false)
                    }}
                  >
                    <SelectTrigger
                      id='country'
                      className='border-[#E4E7EE] bg-white dark:bg-white/5'
                    >
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address' className='text-[#323232]'>
                    Address
                  </Label>
                  <Input
                    id='address'
                    placeholder='add address'
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      setOrgSaved(false)
                    }}
                    className='border-[#E4E7EE] bg-white dark:bg-white/5'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='gstin' className='text-[#323232]'>
                    GSTIN ID (optional)
                  </Label>
                  <Input
                    id='gstin'
                    placeholder='12ABCDE3456F7Z8'
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value)
                      setOrgSaved(false)
                    }}
                    className='border-[#E4E7EE] bg-white dark:bg-white/5'
                  />
                </div>
                <div className='flex justify-end pt-2'>
                  <Button
                    type='button'
                    className='bg-[#6863FB] text-white hover:bg-[#5b57e6]'
                    onClick={handleSaveOrg}
                    disabled={!isOrgFormComplete || isSavingOrg}
                  >
                    {isSavingOrg ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              className={cn(
                'flex w-full flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-white pb-5 dark:bg-white/5',
                'shadow-[4px_4px_4px_rgba(0,0,0,0.05)]'
              )}
            >
              <div className='flex items-start gap-2 p-5'>
                <Building2
                  className='h-6 w-6 shrink-0 text-[#6F7E9E]'
                  strokeWidth={2}
                  aria-hidden
                />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <h2 className='text-xl font-bold leading-6 text-[#364256]'>
                    Organisation Info
                  </h2>
                  <p className='text-sm font-normal leading-[17px] text-[#666666]'>
                    This information will be included on billing invoices on
                    your account.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => {
                    isOrgEditAfterSaveRef.current = true
                    setOrgSaved(false)
                  }}
                  className='flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#2563EB] transition hover:opacity-90'
                >
                  <SquarePen className='h-5 w-5 shrink-0' aria-hidden />
                  Edit Info
                </button>
              </div>
              <div className='flex flex-col gap-2'>
                <OrgDetailsReadOnlyRow
                  label='Organization name'
                  value={orgName}
                />
                <OrgDetailsReadOnlyRow
                  label='Country or region'
                  value={countryLabelFromCode(country)}
                />
                <OrgDetailsReadOnlyRow label='Address' value={address} />
                <OrgDetailsReadOnlyRow label='GSTIN ID' value={gstin} />
              </div>
            </div>
          )}

          <div className='flex w-full flex-col gap-3'>
            <div
              className={cn(
                'flex w-full flex-col rounded-xl border border-[#E2E8F0] bg-white pb-2.5 dark:bg-white/5',
                'shadow-[4px_4px_4px_rgba(0,0,0,0.05)]'
              )}
            >
              <div className='flex items-start gap-2 p-5'>
                <CreditCard
                  className='h-6 w-6 shrink-0 text-[#6F7E9E]'
                  strokeWidth={2}
                  aria-hidden
                />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <h2 className='text-xl font-bold leading-6 text-[#364256]'>
                    Payment method
                  </h2>
                  <p className='text-sm font-normal leading-[17px] text-[#666666]'>
                    Your payment details are encrypted for security
                  </p>
                </div>
              </div>

              <div className='flex flex-col gap-3 px-5'>
                {isLoadingCard ? (
                  <div className='flex items-center justify-center py-8'>
                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-[#6863FB] border-t-transparent' />
                    <span className='ml-3 text-sm text-[#717182]'>
                      Checking saved cards...
                    </span>
                  </div>
                ) : (
                  <>
                    {savedCards.length > 0 && (
                      <div className='flex w-full flex-col gap-3'>
                        {savedCards.map((card) => (
                          <SavedPaymentCardRow
                            key={card.id}
                            brand={card.brand}
                            last4={card.last4}
                            cardholderName={card.cardholderName}
                            showDefaultBadge={card.isDefault}
                            onRemove={() => void handleRemoveCard(card)}
                            removeDisabled={removingCardId === card.id}
                          />
                        ))}
                      </div>
                    )}

                    {savedCards.length > 0 && showCardForm && (
                      <div
                        className='w-full border-t border-dashed border-[#8998BD]'
                        aria-hidden
                      />
                    )}

                    {(savedCards.length === 0 || showCardForm) && (
                      <div className='flex flex-col gap-[11px]'>
                        {showCardForm && savedCards.length > 0 && (
                          <p className='text-xs leading-relaxed text-[#556B91]'>
                            Add another payment method. Existing cards stay on
                            your account unless removed.
                          </p>
                        )}
                        <div className='space-y-2'>
                          <Label className='text-sm font-medium text-[#666666]'>
                            Card number
                          </Label>
                          <StripeFieldShell>
                            <CardNumberElement
                              options={{ style: ELEMENT_STYLE, showIcon: true }}
                              onChange={(e) => {
                                setCardNumberComplete(e.complete)
                                if (e.error) setCardError(e.error.message)
                                else setCardError(null)
                              }}
                            />
                          </StripeFieldShell>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                          <div className='min-w-0 space-y-2'>
                            <Label className='text-sm font-medium text-[#666666]'>
                              Expiration date
                            </Label>
                            <StripeFieldShell>
                              <CardExpiryElement
                                options={{ style: ELEMENT_STYLE }}
                                onChange={(e) => {
                                  setCardExpiryComplete(e.complete)
                                  if (e.error) setCardError(e.error.message)
                                  else setCardError(null)
                                }}
                              />
                            </StripeFieldShell>
                          </div>
                          <div className='min-w-0 space-y-2'>
                            <Label className='text-sm font-medium text-[#666666]'>
                              Security code
                            </Label>
                            <StripeFieldShell>
                              <CardCvcElement
                                options={{ style: ELEMENT_STYLE }}
                                onChange={(e) => {
                                  setCardCvcComplete(e.complete)
                                  if (e.error) setCardError(e.error.message)
                                  else setCardError(null)
                                }}
                              />
                            </StripeFieldShell>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label
                            htmlFor='name-on-card'
                            className='text-sm font-medium text-[#666666]'
                          >
                            Name on card
                          </Label>
                          <Input
                            id='name-on-card'
                            placeholder='John Doe'
                            value={nameOnCard}
                            onChange={(e) => setNameOnCard(e.target.value)}
                            className='h-10 rounded-md border-[#E4E7EE] bg-white dark:bg-white/5'
                          />
                        </div>

                        <div className='space-y-2'>
                          <Label
                            htmlFor='postal-code'
                            className='text-sm font-medium text-[#666666]'
                          >
                            {postalLabel}
                          </Label>
                          <Input
                            id='postal-code'
                            placeholder={postalPlaceholder}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className='h-10 rounded-md border-[#E4E7EE] bg-white dark:bg-white/5'
                          />
                        </div>

                        {cardError && (
                          <p className='text-sm text-red-500'>{cardError}</p>
                        )}
                        {!orgSaved && (
                          <p className='text-xs text-[#717182]'>
                            Save your organization details above before adding a
                            card.
                          </p>
                        )}

                        <div className='flex flex-wrap items-center justify-end gap-6 pt-1'>
                          {savedCards.length > 0 && showCardForm && (
                            <button
                              type='button'
                              onClick={() => {
                                setShowCardForm(false)
                                setCardError(null)
                              }}
                              className='text-base font-medium text-[#2A3241] transition hover:opacity-80 dark:text-white'
                            >
                              Cancel
                            </button>
                          )}
                          <Button
                            type='button'
                            variant='outline'
                            onClick={handleAddCard}
                            disabled={
                              !stripe ||
                              isAddingCard ||
                              !isCardComplete ||
                              !orgSaved
                            }
                            title={
                              !orgSaved
                                ? 'Please save your organization details first'
                                : undefined
                            }
                            className={cn(
                              'h-12 rounded-lg border-2 border-[#155DFC] bg-white px-4 dark:bg-white/5',
                              'text-base font-semibold text-[#2563EB] shadow-none',
                              'hover:bg-[#F6F9FF] hover:text-[#2563EB]',
                              'disabled:border-[#D1D3D5] disabled:text-[#9ca3af]'
                            )}
                          >
                            {isAddingCard ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {savedCards.length > 0 && !showCardForm && (
                      <button
                        type='button'
                        onClick={() => {
                          setShowCardForm(true)
                          setCardError(null)
                        }}
                        className='w-fit text-left text-base font-semibold leading-6 text-[#3E50F7] transition hover:underline'
                      >
                        + Add card
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            {!isLoadingCard && (
              <div
                className={cn(
                  'flex w-full flex-row items-center justify-center gap-[5px]',
                  'rounded-[10px] border border-[#2C9BE0] bg-[#F3F7FF] px-5 py-3'
                )}
              >
                <div className='flex min-w-0 flex-1 flex-col items-start gap-[5px]'>
                  <p className='text-base font-bold leading-[19px] text-[#25224A]'>
                    Your payment info is safe & secure with us.
                  </p>
                  <p className='max-w-[394px] text-xs font-normal leading-[15px] text-[#666666]'>
                    By providing your card information, you allow Sharkdom to
                    charge your card for future payments in accordance with
                    their terms.
                  </p>
                </div>
                <Image
                  src='/images/shield-vector.png'
                  alt='Security shield'
                  width={70}
                  height={70}
                  className='h-[70px] w-[70px] shrink-0 object-contain'
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Subscription summary */}
        <div className='space-y-6'>
          <SubscriptionSummaryBox
            useMulti={useMulti}
            selectedFeatures={selectedFeatures}
            selectedPlanTitle={selectedPlanTitle}
            seatCount={seatCount}
            pricePerSeat={pricePerSeat}
            currencyCode={currencyCode}
            onCurrencyChange={onCurrencyChange}
            trialDays={trialDays}
            showCurrencySelector={false}
            className='h-fit'
          />

          {/* Footer: legal + Subscribe right column */}
          <div className='space-y-4'>
            <p className='max-w-xs text-xs text-[#717182] xl:max-w-sm'>
              By providing your card information, you allow Sharkdom to charge
              your card for future payments in accordance with their terms.
            </p>
            <Button
              type='button'
              onClick={onSubscribe}
              disabled={isSubmitting || !isSubscribeReady}
              className={cn(
                'w-full rounded-lg bg-[#6863FB] py-3 text-base font-medium text-white hover:bg-[#5b57e6]',
                'disabled:bg-[#B6B4F7] disabled:text-white/90'
              )}
            >
              {isSubmitting ? 'Processing...' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
