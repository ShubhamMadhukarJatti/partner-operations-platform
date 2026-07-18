import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/dates'
import { getAllCaseStudies } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'

export const revalidate = 60

export default async function CaseStudies() {
  const posts = await getAllCaseStudies()
  return (
    <main className='container flex flex-col items-center justify-center gap-4 py-8'>
      <h1 className='max-w-md text-center text-2xl font-bold tracking-tight md:text-4xl'>
        Case Studies
      </h1>
      <p className='max-w-lg text-center font-medium text-muted-foreground md:text-lg'>
        Learn how companies leverage partnerships to scale their business
        faster.
      </p>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Link
            href={`/case-studies/${post.slug}`}
            key={post._id}
            className='flex flex-col gap-2 rounded-xl p-4 transition duration-500 hover:bg-accent hover:shadow-md sm:hover:scale-105'
          >
            <div className='relative aspect-video w-full'>
              <Image
                src={urlFor(post.coverImage).url()}
                alt={post.title}
                fill
                sizes='(min-width: 350px) 33vw, 100vw'
                className='rounded-xl border object-cover'
              />
            </div>
            <h2 className='text-lg font-semibold'>{post.title}</h2>
            <p className='line-clamp-3 text-muted-foreground'>
              {post.description}
            </p>
            <span className='text-sm text-muted-foreground'>
              {formatDate(post.publishedAt)}
            </span>
          </Link>
        ))}
      </section>
      {/* <div className='prose'>
        <pre>
          <code>{JSON.stringify(blogs, null, 2)}</code>
        </pre>
      </div> */}
    </main>
  )
}
