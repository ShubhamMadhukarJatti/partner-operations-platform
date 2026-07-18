import Image from 'next/image'
import { PortableText } from '@portabletext/react'

import { getCaseStudyBySlug } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'

export const revalidate = 60

export default async function CaseStudiesPage({
  params
}: {
  params: { slug: string }
}) {
  const { slug } = params

  const post = await getCaseStudyBySlug(slug)
  const myPortableTextComponents = {
    types: {
      image: ({ value }: { value: string }) => (
        <Image
          src={urlFor(value).url()}
          alt={post.title}
          height={400}
          width={800}
          priority
          className='mx-auto aspect-video rounded-xl border object-cover'
        />
      )
    }
  }
  return (
    <main className='container flex flex-col items-center justify-center gap-4 py-8'>
      <h1 className='max-w-xl text-center text-2xl font-semibold'>
        {post.title}
      </h1>
      <p className='max-w-2xl text-center text-muted-foreground'>
        {post.description}
      </p>
      <Image
        src={urlFor(post.coverImage).url()}
        alt={post.title}
        height={800}
        width={800}
        priority
        className='mx-auto aspect-video rounded-xl border object-cover'
      />
      <div className='prose prose-lg'>
        <PortableText value={post.body} components={myPortableTextComponents} />
      </div>
    </main>
  )
}
