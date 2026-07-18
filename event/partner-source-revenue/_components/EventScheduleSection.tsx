import { Calendar, Sparkles } from 'lucide-react'

import EventCard from '@/app/(marketing)/events/EventCard'

const events = [
  {
    id: 1,
    header: {
      date: 'Friday, July 2025',
      category: 'Partner Identification & Onboarding'
    },
    card: {
      imageSrc: '/event-new-slide-1.svg',
      title: 'how to build high performing partner ecosystem in 2025!',
      description:
        'You would found why Alex Richards highlights partnerships to be more than just LinkedIn announcements, it\'s a go-to-market motion, essentially "a company within a company" and what\'s the importance of understanding internal teams and driving influence to achieve bigger impact.',
      time: '11:30 AM - 12:00 PM EST',
      backgroundColor: '#F3E8FF', // Light purple
      href: '/high-performing-partner-ecosystem'
    }
  }
]

const EventScheduleSection = () => {
  return (
    <section className='bg-[#F9FAFB] py-20'>
      <div className='mx-auto max-w-6xl px-4 md:px-8'>
        {/* Section Header */}
        <div className='relative mx-auto mb-16 max-w-3xl text-center'>
          {/* Decorative Sparkles */}
          <div className='absolute -left-12 top-0 hidden text-orange-400 md:block'>
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
          <div className='absolute -right-4 top-12 hidden text-purple-500 md:block'>
            <Sparkles size={40} strokeWidth={1.5} />
          </div>

          <h2 className='mb-4 text-4xl font-bold tracking-tight text-[#101828] md:text-5xl'>
            Browse other events schedule
          </h2>
          <p className='mx-auto max-w-xl text-lg text-[#4A5565]'>
            Explore the complete event schedule to find sessions, speakers, and
            activities that match your interests and needs.
          </p>
        </div>

        {/* Events List */}
        <div className='flex flex-col gap-16'>
          {events.map((event) => (
            <div key={event.id} className='flex flex-col gap-6'>
              {/* Event Date Header */}
              <div className='flex w-full flex-col justify-between gap-4 rounded-[16px] bg-[#0F0B0C] px-8 py-8 text-white md:flex-row md:items-center'>
                <div className='flex items-center gap-6'>
                  <div className='flex items-center gap-2 text-lg font-medium'>
                    <Calendar className='h-5 w-5' />
                    <span>Event {event.id}</span>
                  </div>
                  <span className='text-lg text-white'>
                    {event.header.date}
                  </span>
                </div>
                <span className='text-base font-medium text-white md:text-lg'>
                  {event.header.category}
                </span>
              </div>

              {/* Event Card */}
              <EventCard
                imageSrc={event.card.imageSrc}
                title={event.card.title}
                description={event.card.description}
                time={event.card.time}
                backgroundColor={event.card.backgroundColor}
                href={event.card.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventScheduleSection
