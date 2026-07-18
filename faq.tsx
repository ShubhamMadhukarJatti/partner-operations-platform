import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { Separator } from '@/components/ui/separator'

const faqData = [
  {
    question: 'Is Sharkdom only for early-stage startups?',
    answer: 'No, startups irrespective of their stage are welcome at Sharkdom.'
  },
  {
    question: 'How does Sharkdom avoid bad actors on the platform?',
    answer:
      'Using Smart Partnership Assumptionless Algorithms (SPAA) developed at Sharkdom Labs, we ensure the integrity of the platform by making sure that proposals are based on facts.'
  },
  {
    question: 'Is Sharkdom only for founders or co-founders?',
    answer:
      'Sharkdom is for all startup members who are decision-makers and have the authority to make decisions during partnership talks.'
  },
  {
    question:
      'Do I have to purchase a subscription to partner on the platform?',
    answer:
      'No, a subscription is not mandatory to expand your partner network on Sharkdom. However, premium features that can accelerate the process are not available on the free plan.'
  },
  {
    question: 'What kinds of partnerships does Sharkdom support?',
    answer:
      'Sharkdom currently supports seven types of partnerships, which are commonly used by tech startups.'
  },
  {
    question: 'Can Sharkdom generate proposals that benefit my startup?',
    answer:
      'Yes, our SPAA algorithms generate proposals that consider the benefits for both parties moving forward.'
  },
  {
    question: 'As a founder, how does Sharkdom maintain my startup’s privacy?',
    answer:
      'Sharkdom uses advanced encryption and privacy measures to protect sensitive information, ensuring that your data stays secure.'
  }
]

export const FAQ = () => {
  return (
    <section id='faq' className=' bg-[#F7F9FC] py-16'>
      <MaxWidthWrapper className=' flex   flex-col  px-6 xl:px-0 '>
        <h2 className='text-3xl font-bold text-text-100 lg:text-5xl'>
          <span className='text-semantic-danger'>Got questions?</span> No
          worries,
          <br /> we’ve got answers.
        </h2>
        <Accordion
          type='single'
          collapsible
          className='mt-12 w-full  space-y-2'
        >
          {faqData.map(({ question, answer }, index) => (
            <>
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className='text-shark-lg font-bold text-text-100 no-underline'>
                  {question}
                </AccordionTrigger>
                <AccordionContent className='max-w-4xl text-shark-base font-medium text-text-80'>
                  {answer}
                </AccordionContent>
              </AccordionItem>
              <Separator className=' bg-text-20  ' />
            </>
          ))}
        </Accordion>
      </MaxWidthWrapper>
    </section>
  )
}
