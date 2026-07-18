import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react'

const SocialLinks = () => {
  return (
    <div className='inline-flex select-none flex-col items-center gap-4 md:flex-row'>
      <div className='flex w-full flex-row items-center justify-around gap-4 text-muted-foreground'>
        <a
          rel='noopener noreferrer'
          href='https://twitter.com/SharkdomIndia'
          target='_blank'
          className='rounded-full p-3 ring-ring ring-offset-2 ring-offset-background transition-transform duration-300 ease-in-out hover:scale-105 hover:text-[#1D9BF0] focus:ring-2 focus-visible:outline-none'
        >
          <span className='sr-only'>Twitter</span>
          <Twitter size={24} />
        </a>
        <a
          rel='noopener noreferrer'
          href='https://www.youtube.com/@sharkdomIndia'
          target='_blank'
          className='rounded-full p-2 ring-ring ring-offset-2 ring-offset-background transition-transform duration-300 ease-in-out hover:scale-105 hover:text-[#ff0000] focus:ring-2 focus-visible:outline-none'
        >
          <span className='sr-only'>Youtube</span>
          <Youtube size={28} />
        </a>
        <a
          rel='noopener noreferrer'
          href='https://www.linkedin.com/company/sharkdomer/'
          target='_blank'
          className='rounded-full p-3 ring-ring ring-offset-2 ring-offset-background transition-transform duration-300 ease-in-out hover:scale-105 hover:text-[#0077B5] focus:ring-2 focus-visible:outline-none'
        >
          <span className='sr-only'>LinkedIn</span>
          <Linkedin size={24} />
        </a>
      </div>
    </div>
  )
}
export default SocialLinks
