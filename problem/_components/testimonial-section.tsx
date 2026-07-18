import React from 'react'

const testimonials = [
  {
    quote:
      'The platform is very intuitive, and I can see in one place my stats, activity, and partnership activity. Sometimes I want my other co-founder to take care of partnership talks and without any communication the platform sync us both on same page with progress',
    author: 'Vijay M RajShekhar',
    role: 'Senior Director and Co-founder',
    color: 'bg-pink-400'
  },
  {
    quote:
      "They really make sure that you get reliable partners according to your company's needs which are not bot generated or just to scam you. I am proud to be using this platform.",
    author: 'Jeminy Roberts',
    role: 'Partnership Specialist',
    color: 'bg-teal-400'
  },
  {
    quote:
      "Sharkdom consistently delivers on a top draw selection of leading companies. You would be sure of connecting with many of the best providers from solely within the Sharkdom's Marketplace. The interface is clean, easy to navigate, and very much in keeping with the UX/UI simplicity of the best SaaS.",
    author: 'Dinjun Watanabe',
    role: 'Founder & Alliance Manager',
    color: 'bg-purple-400'
  }
]

const TestimonialCard = ({ quote, author, role, color }: any) => (
  <div className='overflow-hidden rounded-lg bg-[#F6F6FF] bg-white shadow-md'>
    <div className={`h-2 ${color}`}></div>
    <div className='p-6'>
      <p className='mb-4 text-sm text-gray-600'>{quote}</p>
      <div>
        <p className='text-sm font-semibold'>{author}</p>
        <p className='text-xs text-gray-500'>{role}</p>
      </div>
    </div>
  </div>
)

const TestimonialSection = () => (
  <section className='bg-gray-100 py-12'>
    <div className='mx-auto max-w-6xl px-4'>
      <h2 className='mb-2 text-center text-3xl font-bold'>
        Some Testimonials on changes brought by Sharkdom
      </h2>
      <p className='mb-8 text-center'>
        <a href='#' className='text-sm text-blue-600 hover:underline'>
          More on Stack of Love →
        </a>
      </p>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  </section>
)

export default TestimonialSection
