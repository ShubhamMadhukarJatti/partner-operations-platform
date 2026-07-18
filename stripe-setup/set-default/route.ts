import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  return new Stripe(secretKey)
}

export async function PUT(request: Request) {
  try {
    const stripe = getStripeClient()
    const body = await request.json()
    const { customerId, paymentMethodId } = body

    if (!customerId || !paymentMethodId) {
      return NextResponse.json(
        {
          success: false,
          message: 'customerId and paymentMethodId are required'
        },
        { status: 400 }
      )
    }

    // 1. Attach Payment Method to Customer (safety net)
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    })

    // 2. Set this card as the Default for future invoices/subscriptions
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment method set as default',
      data: { customerId, paymentMethodId }
    })
  } catch (error: any) {
    console.error('Stripe set-default error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
