import Image from 'next/image'
import Link from 'next/link'
import BlogHero from '@/../public/assets/blog_hero.svg'
import { MoveDown, MoveRight } from 'lucide-react'

import { formatDate } from '@/lib/dates'
import { getExpertArenaBlogs } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'
import { Button } from '@/components/ui/button'

const colors = ['#D8CE90', '#F3BEE8', '#7A403E', '#FD8300']

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

export default async function ExpertArenaPage() {
  const posts = await getExpertArenaBlogs()
  return (
    <>
      <div className='relative flex h-[300px] flex-col justify-around bg-[#0062F1] text-center sm:h-[530px] sm:px-12 sm:pb-20'>
        <Image
          className='z-5 absolute bottom-0 self-center'
          src={BlogHero}
          alt=''
        />
        <p className='z-10 text-2xl font-semibold text-white'>
          Sharkdom Insights
        </p>
        <h1 className='z-10 text-balance text-3xl font-semibold text-white sm:text-5xl'>
          Understanding the power of
          <br /> Partnerships to scale exponentially
        </h1>
        <Link
          href='#expert-arena'
          className='z-10 flex w-max items-center gap-2 self-center rounded-lg bg-[#EED107] px-8 py-2 text-lg font-medium'
        >
          explore now
          <MoveDown size={18} />
        </Link>
      </div>
      <div
        id='expert-arena'
        className='container flex flex-col items-center py-12'
      >
        <h2 className='text-2xl font-bold sm:text-3xl'>Choosen for you</h2>
        <p className='text-md text-center font-light text-[#969AA8] sm:text-lg'>
          the most popular knowledge needed to establish and manage a
          successfull long time partnership
        </p>
      </div>
      <div className='container flex flex-col items-center justify-center gap-4 py-8'>
        <section className='grid gap-12 sm:grid-cols-2 sm:px-20'>
          {posts.map((post, index) => {
            const backgroundColor = getRandomColor()
            const postStyle = {
              backgroundColor: backgroundColor
            }
            return (
              <div
                key={index}
                className='flex max-w-lg flex-col gap-2 rounded-2xl border shadow-md'
              >
                <div
                  className='relative h-60 rounded-t-2xl sm:h-[500px]'
                  style={postStyle}
                >
                  <Image
                    src={urlFor(post.coverImage).url()}
                    alt={post.title}
                    fill
                    sizes='(min-width: 300px) 33vw, 100vw'
                    className='aspect-video rounded-2xl object-contain'
                  />
                </div>
                <div className='flex flex-col p-4'>
                  <h2 className='text-lg font-semibold'>{post.title}</h2>
                  <p className='line-clamp-3 text-muted-foreground'>
                    {post.description}
                  </p>
                  <span className='text-sm text-muted-foreground'>
                    {formatDate(post.publishedAt)}
                  </span>
                  <Button
                    className='mt-4 w-max justify-start rounded-lg border-2 border-[#0062F1] px-8 text-[#0062F1]'
                    variant='outline'
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post._id}
                      className='flex gap-2'
                    >
                      Read more <MoveRight />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </>
  )
}
