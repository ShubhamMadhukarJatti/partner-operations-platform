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

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient()
    const body = await request.json()
    const { email, name, country, customerId: existingCustomerId } = body

    let stripeCustomerId: string

    if (existingCustomerId) {
      // ─── Use existing customer (already created in Stripe via backend) ───
      stripeCustomerId = existingCustomerId
    } else {
      // ─── Legacy: create/find customer by email ───
      let customer: Stripe.Customer

      if (email) {
        const existing = await stripe.customers.list({ email, limit: 1 })
        if (existing.data.length > 0) {
          customer = existing.data[0]
          customer = await stripe.customers.update(customer.id, {
            name: name || customer.name,
            address: { country: country || customer.address?.country }
          })
        } else {
          customer = await stripe.customers.create({
            email,
            name,
            address: country ? { country } : undefined
          })
        }
      } else {
        customer = await stripe.customers.create({
          email,
          name,
          address: country ? { country } : undefined
        })
      }

      stripeCustomerId = customer.id
    }

    // 2. Create a SetupIntent linked to this Customer
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card']
    })

    // 3. Return the keys to the frontend
    return NextResponse.json({
      success: true,
      data: {
        customerId: stripeCustomerId,
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      }
    })
  } catch (error: any) {
    console.error('Stripe setup-intents error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
