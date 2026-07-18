/* eslint-disable react/no-unescaped-entities */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const pricingFaqData = [
  {
    num: '01',
    question: 'Can all users under a Startup can purchase subscriptions?',
    answer: 'Yes, any of the admin can purchase the subscription'
  },
  {
    num: '02',
    question: 'How does Sharkdom avoid bad actors in the platform?',
    answer:
      'Using Smart Partnership Assumptionless Algorithms(SPAA) crafted here at Sharkdom Labs, We maintains the integrity of the platform by making sure that proposals are based on facts'
  },
  {
    num: '03',
    question: 'Is Sharkdom only for founder’s or co-founder’s?',
    answer:
      'Sharkdom is for all the startup members who are decision makers and have decisive pawer to take decision on terms during partnership talks.'
  },
  {
    num: '04',
    question:
      'Do I have to purchase subscription to proceed with partnering in the platform?',
    answer:
      'No, subscription is not mandatory to start expanding your partner network in sharkdom, however premium features that might pace the process is not available at FREE plan.'
  },
  {
    num: '05',
    question: 'What kind of partnerships does sharkdom supports?',
    answer:
      'Currently Sharkdom supports 7 types of partnerships which are what tech startups mostly used.'
  },
  {
    num: '06',
    question:
      'Can Sharkdom provide any solutions to generate proposals that would benefit my startups?',
    answer:
      'Yes our SPAA algorithms generate proposal which keeps in mind, the benefits to both the parties moving forward.'
  },
  {
    num: '07',
    question: 'As a founder, how does Sharkdom maintain my startup’s privacy?',
    answer: ''
  }
]

export const PricingFAQ = () => {
  return (
    <section id='faq' className=''>
      <div className='container flex flex-col items-center gap-8 py-10 md:py-14'>
        <h2 className='text-3xl font-bold'>FAQ's</h2>
        <Accordion
          type='single'
          collapsible
          defaultValue='item-0'
          className='w-full space-y-4 divide-y rounded-lg sm:p-4'
        >
          {pricingFaqData.map(({ question, answer, num }, index) => (
            <AccordionItem
              className='rounded-2xl bg-white p-4'
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger className='flex text-xl font-semibold text-[#0062F1]'>
                <span className='font-bold sm:text-3xl'>{num}</span>
                {question}
              </AccordionTrigger>
              <AccordionContent className='text-lg font-medium'>
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
