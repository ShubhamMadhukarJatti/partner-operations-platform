import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export type SubscriptionLineItem = {
  title: string
  seats: number
  pricePerSeat: number
}

interface SubscriptionSummaryBoxProps {
  useMulti?: boolean
  selectedFeatures?: SubscriptionLineItem[]
  selectedPlanTitle?: string
  seatCount?: number
  pricePerSeat?: number
  currencyCode?: 'INR' | 'USD'
  onCurrencyChange?: (currency: 'INR' | 'USD') => void
  trialDays?: number
  className?: string
  showTaxDisclaimer?: boolean
  showCurrencySelector?: boolean
}

export function SubscriptionSummaryBox({
  useMulti = false,
  selectedFeatures = [],
  selectedPlanTitle = '',
  seatCount = 1,
  pricePerSeat = 0,
  currencyCode = 'INR',
  onCurrencyChange,
  trialDays = 0,
  className,
  showTaxDisclaimer = false,
  showCurrencySelector = true
}: SubscriptionSummaryBoxProps) {
  const currencySymbol = currencyCode === 'USD' ? '$' : '₹'
  const subtotal = useMulti
    ? selectedFeatures.reduce(
        (sum, item) => sum + item.pricePerSeat * item.seats,
        0
      )
    : pricePerSeat * seatCount

  const discount = 0
  const tax = Math.round(subtotal * 0.18)
  const totalMonthly = subtotal - discount + tax

  return (
    <Card
      className={cn(
        'gap-0 overflow-hidden rounded-xl border-[#E4E7EE] p-0 shadow-sm',
        className
      )}
    >
      <CardHeader className='bg-[#6863FB] px-5 py-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-[15px] font-semibold text-white'>
            Subscription details
          </h2>
          {showCurrencySelector && (
            <Select
              value={currencyCode}
              onValueChange={(val) =>
                onCurrencyChange && onCurrencyChange(val as 'INR' | 'USD')
              }
            >
              <SelectTrigger className='h-7 w-auto border border-white/30 bg-transparent px-2.5 text-xs text-white shadow-none focus:ring-0 [&>span]:text-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='INR'>INR</SelectItem>
                <SelectItem value='USD'>USD</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent className='bg-white px-5 pb-5 pt-4 dark:bg-white/5'>
        <div className='mb-4'>
          <p className='text-xs font-medium text-[#A0A0A0]'>
            Selected features
          </p>
          <div className='mt-3 space-y-4'>
            {useMulti ? (
              selectedFeatures.map((item, i) => (
                <div
                  key={i}
                  className='flex items-start justify-between text-sm'
                >
                  <div className='flex flex-col'>
                    <span className='font-medium text-[#323232]'>
                      {item.title}
                    </span>
                    <span className='mt-0.5 text-[11px] text-[#A0A0A0]'>
                      {item.seats} seat{item.seats !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className='font-medium text-[#323232]'>
                    {currencySymbol}
                    {(item.pricePerSeat * item.seats).toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <div className='flex items-start justify-between text-sm'>
                <div className='flex flex-col'>
                  <span className='font-medium text-[#323232]'>
                    {selectedPlanTitle}
                  </span>
                  <span className='mt-0.5 text-[11px] text-[#A0A0A0]'>
                    {seatCount} seat{seatCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className='font-medium text-[#323232]'>
                  {currencySymbol}
                  {(pricePerSeat * seatCount).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator className='mb-4 bg-[#E4E7EE]' />

        <div className='mb-4 flex flex-col'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-[#323232]'>Subtotal</span>
            <span className='text-[#323232]'>
              {currencySymbol}
              {subtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className='my-3 border-t border-dashed border-[#E4E7EE]' />

          <div className='flex items-center justify-between text-sm'>
            <span className='text-[#323232]'>Discount</span>
            <span className='text-[#323232]'>
              -{currencySymbol}
              {discount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className='my-3 border-t border-dashed border-[#E4E7EE]' />

          <div className='flex items-center justify-between text-sm'>
            <span className='text-[#323232]'>Tax</span>
            <span className='text-[#323232]'>
              {currencySymbol}
              {tax.toLocaleString('en-IN')}
            </span>
          </div>
          <div className='mt-3 border-t border-dashed border-[#E4E7EE]' />
        </div>

        <div className='mb-4 flex items-center justify-between rounded-xl bg-[#F8F9FA] px-4 py-3.5'>
          <span className='text-xs font-medium text-[#717182]'>
            Total Monthly
          </span>
          <span className='text-[22px] font-bold text-black dark:text-white'>
            {currencySymbol}
            {totalMonthly.toLocaleString('en-IN')}
          </span>
        </div>

        <p className='text-center text-[11px] text-[#A0A0A0]'>
          {showTaxDisclaimer
            ? 'Prices exclude applicable taxes'
            : trialDays > 0
              ? `No charge during the ${trialDays}-day trial. Cancel anytime`
              : 'You will be charged immediately upon subscribing'}
        </p>
      </CardContent>
    </Card>
  )
}
