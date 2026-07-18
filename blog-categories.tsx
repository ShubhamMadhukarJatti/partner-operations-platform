import Image from 'next/image'
import Link from 'next/link'

import { formatDate } from '@/lib/dates'
import {
  getAllBlogs,
  getExpertArenaBlogs,
  getLibraryBlogs,
  getPlaybookBlogs
} from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PostCard } from '../_components/post-card'
import CaseStudies from '../case-studies/page'

export async function AllBlogs() {
  const posts = await getAllBlogs()
  return (
    <main className='container flex min-h-screen flex-col items-center justify-center gap-4 py-8'>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </section>
    </main>
  )
}

export async function LibraryBlogs() {
  const posts = await getLibraryBlogs()
  return (
    <main className='container flex flex-col items-center justify-center gap-4 py-8'>
      <h1 className='text-center text-2xl font-bold tracking-tight md:text-4xl'>
        Unlocking success through strategic collaborations.
      </h1>
      <p className='max-w-lg text-center font-medium text-muted-foreground md:text-lg'></p>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post._id}
            className='flex flex-col gap-2 rounded-xl p-4 transition duration-300 hover:bg-accent hover:shadow-md sm:hover:scale-105'
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
    </main>
  )
}

export async function PlaybookBlogs() {
  const posts = await getPlaybookBlogs()
  return (
    <main className='container flex flex-col items-center justify-center gap-4 py-8'>
      <h1 className='text-center text-2xl font-bold tracking-tight md:text-4xl'>
        Navigate the Startup Landscape: Insights from the Playbook.
      </h1>
      <p className='max-w-lg text-center font-medium text-muted-foreground md:text-lg'></p>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
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
    </main>
  )
}

export async function ExpertArenaBlogs() {
  const posts = await getExpertArenaBlogs()
  return (
    <main className='container flex flex-col items-center justify-center gap-4 py-8'>
      <h1 className='text-center text-2xl font-bold tracking-tight md:text-4xl'>
        Masters at Work: Wisdom from the Expert Arena.
      </h1>
      <p className='max-w-lg text-center font-medium text-muted-foreground md:text-lg'></p>
      <section className='grid sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
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
    </main>
  )
}

export default function BlogCategoriesTabs() {
  return (
    <Tabs defaultValue='all' className=''>
      <div className='flex justify-center'>
        <TabsList className='bg-0 my-16 flex-col md:my-6 md:flex-row md:bg-[#EBEBEB]'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='library'>Library</TabsTrigger>
          <TabsTrigger value="startup's playbook">
            {`Startup's Playbook`}
          </TabsTrigger>
          <TabsTrigger value='expert arena'>Expert Arena</TabsTrigger>
          <TabsTrigger value='case study'>Case Study</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value='all'>
        <AllBlogs />
      </TabsContent>
      <TabsContent value='library'>
        <LibraryBlogs />
      </TabsContent>
      <TabsContent value="startup's playbook">
        <PlaybookBlogs />
      </TabsContent>
      <TabsContent value='expert arena'>
        <ExpertArenaBlogs />
      </TabsContent>
      <TabsContent value='case study'>
        <CaseStudies />
      </TabsContent>
    </Tabs>
  )
}
