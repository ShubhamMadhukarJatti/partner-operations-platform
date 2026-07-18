import Markdown from 'react-markdown'

const termsAndConditions = `
For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Kalasa Agile Pvt Ltd, whose registered/operational office is Muqbool Road, Amritsar, Amritsar, Punjab 143001. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.

Your use of the website and/or purchase from us are governed by the following Terms and Conditions:

- The content of the pages of this website is subject to change without notice.

- Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.

- Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.

- Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.

- All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.

- Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.

- From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.

- You may not create a link to our website from another website or document without Kalasa Agile Pvt Ltd’s prior written consent.

- Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.

- We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
`

const TermsPage = () => {
  return (
    <div className='py-12'>
      <h1 className='text-2xl text-primary md:text-3xl'>
        Terms and Conditions
      </h1>
      <div className='-mt-2 h-[2px] w-20 bg-primary' />

      <div>
        <p className='text-lg font-semibold text-muted-foreground '>
          Last updated on Jul 13th 2024
        </p>

        <Markdown className='text-muted-foreground'>
          {termsAndConditions}
        </Markdown>
      </div>
    </div>
  )
}

export default TermsPage

// # TERMS & CONDITIONS

// This document / agreement / understanding is a computer-generated electronic record published in terms of Rule 3 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 (amended from time to time) read with Information Technology Act, 2000 (amended from time to time) and does not require any physical or digital signatures.

// These terms, including the Razorpay Privacy Policy, (“Terms”) owned and operated by Kalasa Agile Private Limited (“Sharkdom”), a company incorporated under the provisions of the Companies Act, 1956 and having its registered office at Muqbool Road, Amritsar, Punjab, 143001. “We” or “Us” shall refer to Sharkdom. “You” or “Your” refers to any non-registered individual or corporate body, making or attempting to make a partnership transaction via our platform.

// ## 1. TERMS OF SERVICE

// In order to enable the Pay in Native Services, it shall be deemed that Your usual place of residence shall be as per the details available in the card used by You to complete the Transaction for the purposes of place of supply.

// The Transaction amount payable by You towards the purchase of goods or services from a merchant shall be inclusive of charges for such Pay In Native Services availed by You.

// You may reach out to support@sharkdom.com, by providing the payment ID and Your contact number, to get invoices for your Transactions.

// You shall comply with all applicable laws, including laws, statute, rule, regulation, order, circular, decree, directive, judgment, decision or other similar mandate of any applicable central, national, state or local governmental/regulatory authority having competent jurisdiction and force of law over, or applicable to You, Us or the subject matter in question, as may be amended from time to time.

// ## 2. GENERAL

// You acknowledge and agree that the Pay in Native Services are provided on an independent principal-to-principal basis by Razorpay to You.

// Any failure or delay by Razorpay to enforce or exercise any provision of these Terms, or any related right, shall not constitute a waiver by Razorpay of that provision or right. The exercise of one or more of Razorpay’s rights hereunder shall not be a waiver of, or preclude the exercise of, any rights or remedies available to Razorpay under these Terms or in law or at equity. Any waiver of any provision shall only be effective if made in writing and executed by a duly authorized officer of Razorpay.
