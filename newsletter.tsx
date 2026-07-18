import { Button } from '@/components/ui/button'

export const Newsletter = () => {
  return (
    <section className='container py-12'>
      <div className=' flex flex-col-reverse items-center justify-center gap-4 rounded-2xl border bg-primary p-4 text-white shadow md:flex-row lg:p-10'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <h2 className='text-2xl font-bold '>
            Subscribe to Sharkdomer&apos;s Conclave newsletter
          </h2>
          <p className='text-lg'>
            Get latest insights in startup world and learn to build great
            partnerships
          </p>
          <Button
            className='max-w-fit rounded-full bg-white text-primary hover:bg-white hover:text-primary'
            asChild
            size='lg'
          >
            <a
              href='https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7073001080858492928'
              target='_blank'
              rel='noopener noreferrer'
            >
              Linkedin Newsletter
            </a>
          </Button>
        </div>
        {/* <Image
          src={NewsletterLogo}
          alt='newsletter'
          width={400}
          height={400}
        /> */}
      </div>
    </section>
  )
}
