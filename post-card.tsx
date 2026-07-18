import Image from 'next/image'
import Link from 'next/link'
import { Clock4 } from 'lucide-react'

import { formatDate } from '@/lib/dates'
import { type BlogType } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'

export const PostCard = ({ post }: { post: BlogType }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      key={post._id}
      className='flex flex-col gap-2 rounded-xl p-4  transition duration-500 hover:bg-accent hover:shadow-md sm:hover:scale-105'
    >
      <div className='relative aspect-video w-full'>
        <Image
          src={urlFor(post.coverImage).url()}
          alt={post.title}
          fill
          sizes='(min-width: 350px) 33vw, 100vw'
          className='rounded-lg border object-cover'
        />
      </div>
      <h2 className='text-base font-medium text-[#475467]'>{post.title}</h2>
      <p className='line-clamp-3 text-muted-foreground'>{post.description}</p>
      <span className='text-sm text-muted-foreground'>
        <Clock4 className='mr-1 inline-block w-4' />
        {formatDate(post.publishedAt)}
      </span>
    </Link>
  )
}
