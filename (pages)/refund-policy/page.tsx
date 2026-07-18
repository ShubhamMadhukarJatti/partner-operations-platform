import Markdown from 'react-markdown'

const cancellationPolicy = `
Kalasa Agile Pvt Ltd believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:

- Cancellations will be considered only if the request is made within 15 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.

- Kalasa Agile Pvt Ltd does not accept cancellation requests for perishable items like flowers, eatables, etc. However, refund/replacement can be made if the customer establishes that the quality of the product delivered is not good.

- In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 15 days of receipt of the products.

- In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 15 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.

- In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.

- In case of any refunds approved by Kalasa Agile Pvt Ltd, it’ll take 1-2 days for the refund to be processed to the end customer.
`

const RefundsPage = () => {
  return (
    <div className='py-12'>
      <h1 className='text-2xl text-primary md:text-3xl'>
        Cancellation & Refund Policy
      </h1>
      <div className='-mt-2 h-[2px] w-20 bg-primary' />

      <div>
        <p className='text-lg font-semibold text-muted-foreground '>
          Last updated on Jul 13th 2024
        </p>

        <Markdown className='text-muted-foreground'>
          {cancellationPolicy}
        </Markdown>
      </div>
    </div>
  )
}

export default RefundsPage

// # Refund Policy

// Under the laws applicable in your jurisdiction, you may qualify for a refund. For example, if you’re using our services for yourself (instead of on behalf of a business):

// - If you comes under our college startup partnered e-cell program, we’ll cancel your subscription with a one-month notice and refund any part of your subscription period remaining.
// - Startups of the India that does not comes under our college program are entitled to a full refund during the 14 days after the subscription begins.

//   **Note**: This 14-day period begins when the subscription service starts. For example, if you signed up for a one-month free trial, the period begins on the first day of your free trial, so there will be no fees paid as a refund.

// - If you made a purchase using direct debit, you’re entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A direct debit refund must be claimed within eight weeks starting from the date on which your account was debited.
