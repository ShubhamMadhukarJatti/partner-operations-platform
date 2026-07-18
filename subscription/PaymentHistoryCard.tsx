import React from 'react'
import { toast } from 'sonner'

import { icons } from '@/lib/constants/subscription-constants'

interface PaymentHistoryCardProps {
  className?: string
  invoices?: any[]
  cardDetails?: any[]
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
  className = '',
  invoices = [],
  cardDetails = []
}) => {
  const latestInvoice = invoices?.[0]
  const primaryCard =
    cardDetails.find((c) => c.status === 'primary') || cardDetails[0]

  const amountValue = (latestInvoice?.amount || 0) / 100
  const currencyCode = latestInvoice?.currency || '$'

  const formatCurrency = (value: number | string, currency = 'USD') => {
    const amount = Number(value)
    const rawCurrency = currency?.toString?.().toUpperCase().trim() || 'USD'

    // Normalize currency code for Intl.NumberFormat
    const currencyCode =
      rawCurrency === '$' ? 'USD' : rawCurrency === '₹' ? 'INR' : rawCurrency

    if (Number.isNaN(amount)) return `${currencyCode}${value}`

    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(amount)
    } catch (e) {
      const symbol =
        currencyCode === 'INR'
          ? '₹'
          : currencyCode === 'USD'
            ? '$'
            : currencyCode
      return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
    }
  }

  const lastPaymentAmount =
    amountValue > 0
      ? formatCurrency(amountValue, currencyCode)
      : 'No payment history available'

  const parseDate = (value: string | number | undefined) => {
    if (!value) return null
    const date =
      typeof value === 'number'
        ? new Date(value > 9999999999 ? value : value * 1000)
        : new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const lastPaymentDate =
    parseDate(latestInvoice?.createdAt) || 'No payment history available'

  const handleDownloadInvoice = (invoice: any) => {
    const invoiceUrl = invoice?.invoicePdf || invoice?.hostedInvoiceUrl
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank')
    } else {
      toast.error('Invoice unavailable', {
        description: 'No downloadable invoice URL was provided by the server.'
      })
    }
  }

  return (
    <div
      className={`rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-[#252666] dark:bg-[#130F55] ${className}`}
    >
      {/* Payment History Header */}
      <div className='mb-5 flex items-center gap-2'>
        <img
          src='/icons/payment_history.svg'
          alt='Payment History'
          width={20}
          height={20}
        />
        <h4 className='text-lg font-bold text-[#2A3241] dark:text-white'>
          Payment History
        </h4>
      </div>

      {/* Last Payment Details */}
      <div className='mb-6 flex items-start justify-between border-b border-gray-100 pb-6'>
        <div>
          <div className='mb-1'>
            <span className='text-xs text-[#6B7280] dark:text-white'>
              Last Payment
            </span>
          </div>
          <div className='mb-1'>
            <span className='text-base font-semibold text-[#2A3241] dark:text-white'>
              {lastPaymentAmount}
            </span>
          </div>
          <div>
            <span className='text-xs text-[#6B7280] dark:text-white'>
              {lastPaymentDate}
            </span>
          </div>
        </div>
        {latestInvoice && (
          <button
            onClick={() => handleDownloadInvoice(latestInvoice)}
            className='rounded-md border border-[#6863FB] px-4 py-1.5 text-sm font-medium text-[#6863FB] transition-colors hover:bg-purple-50'
          >
            Download Invoice
          </button>
        )}
      </div>

      {/* Invoices List */}
      {invoices.length > 1 && (
        <div className='mt-4 space-y-3'>
          <p className='text-xs font-medium text-[#6B7280] dark:text-white'>
            Previous Invoices
          </p>
          {invoices.slice(1, 5).map((invoice: any, idx: number) => (
            <div
              key={invoice.invoiceId || idx}
              className='flex items-center justify-between py-2 text-sm'
            >
              <div className='flex flex-col'>
                <span className='font-medium text-[#2A3241] dark:text-white'>
                  {formatCurrency(invoice.amount / 100, invoice.currency)}
                </span>
                <span className='text-xs text-[#6B7280] dark:text-white'>
                  {parseDate(invoice.createdAt)}
                </span>
              </div>
              <button
                onClick={() => handleDownloadInvoice(invoice)}
                className='text-[#6863FB] hover:underline'
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Card Details (Dynamically populated from API) */}
      {cardDetails.length > 0 && (
        <div className='mt-6 border-t border-gray-100 pt-6'>
          <div className='mb-1'>
            <span className='text-xs text-[#6B7280] dark:text-white'>
              Card Details
            </span>
          </div>
          <div className='mb-1'>
            <span className='text-base font-semibold capitalize text-[#2A3241] dark:text-white'>
              {primaryCard?.brand} **** {primaryCard?.last4}
            </span>
          </div>
          <div className='mb-6'>
            <span className='text-xs text-[#6B7280] dark:text-white'>
              Expires {primaryCard?.expMonth}/{primaryCard?.expYear}
            </span>
          </div>

          {/* Use different card dropdown */}
          <div className='flex cursor-pointer items-center justify-between border-t border-gray-100 pt-4'>
            <span className='text-sm text-gray-500 dark:text-white'>
              use different card
            </span>
            <icons.ChevronDownIcon
              size={16}
              className='text-gray-400 dark:text-white'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentHistoryCard
