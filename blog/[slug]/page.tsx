import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { ArrowRight, ChevronRight, Clock } from 'lucide-react'

import { formatDate } from '@/lib/dates'
import { getBlogBySlug } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'
import { slugify } from '@/lib/stringUtils'
import { InsiderForm } from '@/app/(app)/(dashboard-pages)/_components/insider-form'

// import { BlogSubscribe } from '../_components/blog-subscribe'
import TableOfContents from '../_components/table-of-contents'
import FreeGuide from '../../compare/_components/FreeGuide'

export const revalidate = 60

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug(params?.slug)

  if (!post) {
    return {
      title: 'Blog not found | Sharkdom',
      description: 'The requested blog post could not be found.',
      robots: {
        index: false,
        follow: false
      }
    }
  }

  const defaultDescription =
    post.description || 'Check out this insightful blog post on Sharkdom.'
  const postUrl = `https://www.sharkdom.com/blog/${post.slug}`

  return {
    title: post.title,
    description: defaultDescription,
    openGraph: {
      type: 'article',
      title: post.title,
      description: defaultDescription,
      url: postUrl,
      locale: 'en_US',
      images: post.coverImage
        ? [
            {
              url: urlFor(post.coverImage).url(),
              width: 800,
              height: 600,
              alt: post.title
            },
            {
              url: urlFor(post.coverImage).url(),
              width: 1800,
              height: 1600,
              alt: post.title
            }
          ]
        : []
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: defaultDescription,
      images: post.coverImage ? [urlFor(post.coverImage).url()] : [],
      site: '@Sharkdom'
    },
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: postUrl
    }
  }
}

export default async function ArticlePage({
  params
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const post = await getBlogBySlug(slug)

  if (!post) {
    notFound()
  }

  const myPortableTextComponents = {
    types: {
      image: ({ value }: { value: string }) => (
        <Image
          src={urlFor(value).url()}
          alt={post.title}
          height={400}
          width={800}
          priority
          className='mx-auto rounded-xl object-cover'
        />
      ),

      video: ({
        value
      }: {
        value: {
          _type?: string
          url: string
          caption?: string
          thumbnail?: {
            _type?: string
            asset?: {
              _ref?: string
              _type?: string
            }
            alt?: string
          }
        }
      }) => {
        let thumbnailUrl: string | undefined = undefined

        try {
          thumbnailUrl = value?.thumbnail
            ? urlFor(value.thumbnail).url()
            : undefined
          console.log('thumbnail url from urlFor:', thumbnailUrl)
        } catch (error) {
          console.log('error while building thumbnail url:', error)
        }

        return (
          <div className='p-4'>
            <video
              controls
              src={value.url}
              poster={thumbnailUrl}
              className='mx-auto aspect-video rounded-xl border'
            >
              Your browser does not support the video tag.
            </video>

            {value.caption && (
              <p className='mt-2 text-center text-shark-sm font-bold text-text-100'>
                {value.caption}
              </p>
            )}
          </div>
        )
      }
    },

    block: {
      h2: ({ value }: any) => (
        <h2
          id={slugify(value.children.map((child: any) => child.text).join(' '))}
          className='mb-3 text-3xl font-bold'
        >
          {value.children.map((child: any) => child.text).join(' ')}
        </h2>
      ),
      h3: ({ value }: any) => (
        <h3
          id={slugify(value.children.map((child: any) => child.text).join(' '))}
          className='mb-3 text-2xl font-bold'
        >
          {value.children.map((child: any) => child.text).join(' ')}
        </h3>
      ),
      h4: ({ value }: any) => (
        <h4
          id={slugify(value.children.map((child: any) => child.text).join(' '))}
          className=''
        >
          {value.children.map((child: any) => child.text).join(' ')}
        </h4>
      ),
      h5: ({ value }: any) => (
        <h5
          id={slugify(value.children.map((child: any) => child.text).join(' '))}
          className='mb-3 text-2xl font-bold'
        >
          {value.children.map((child: any) => child.text).join(' ')}
        </h5>
      ),
      h6: ({ value }: any) => (
        <h6
          id={slugify(value.children.map((child: any) => child.text).join(' '))}
          className='mb-3 text-xl font-bold'
        >
          {value.children.map((child: any) => child.text).join(' ')}
        </h6>
      )
    }
  }

  const textColorStyle = post?.textColor?.hex
    ? { color: post.textColor.hex }
    : {}
  const sectionBackgroundStyle = post?.imageBackground?.hex
    ? { background: post.imageBackground.hex }
    : {}

  return (
    <>
      <InsiderForm />

      <section
        className='bg-gradient-to-r from-[#00398B] to-[#0062F1] p-8 lg:p-20'
        style={sectionBackgroundStyle}
      >
        <div className='m-auto max-w-7xl'>
          <div className='mb-3 flex gap-2'>
            <Link
              className='text-xs text-white'
              style={textColorStyle}
              href='/blog'
            >
              Blog
            </Link>
            <ChevronRight size={15} color={post?.textColor?.hex || '#fff'} />
            <p className='text-xs text-white' style={textColorStyle}>
              {post.title}
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='col-span-1 flex flex-col justify-center gap-6'>
              <h1
                className='text-4xl font-bold leading-none text-white lg:text-shark-5xl'
                style={textColorStyle}
              >
                {post.title}
              </h1>

              {post.description && (
                <p
                  className='text-sm text-text-80 text-white'
                  style={textColorStyle}
                >
                  {post.description}
                </p>
              )}

              {post.ctaButton?.title && post.ctaButton?.link && (
                <Link
                  href={post.ctaButton.link}
                  className='flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm text-black'
                >
                  {post.ctaButton.title}
                  <ArrowRight size={14} />
                </Link>
              )}

              <div className='flex gap-8 lg:gap-12'>
                {post?.author && (
                  <div className='flex items-center gap-2'>
                    {post?.author?.image && (
                      <Image
                        src={urlFor(post.author.image).url()}
                        alt={post?.author?.name || post.title}
                        width={40}
                        height={40}
                        className='size-16 rounded-full'
                      />
                    )}

                    <div className='flex flex-col'>
                      {post?.author?.name && (
                        <p
                          className='text-sm text-white'
                          style={textColorStyle}
                        >
                          {post.author.name}
                        </p>
                      )}
                      <p className='text-sm text-white' style={textColorStyle}>
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {post.readTime && (
                  <div className='flex items-center gap-2'>
                    <Clock color={post?.textColor?.hex || '#fff'} size={20} />
                    <p className='text-sm text-white' style={textColorStyle}>
                      {post.readTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='col-span-1'>
              {post.coverImage && (
                <Image
                  src={urlFor(post.coverImage).url()}
                  alt={post.title}
                  height={100}
                  width={1180}
                  priority
                  className='mx-auto rounded-2xl border object-cover lg:max-h-[24rem]'
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='container mt-4 flex flex-col-reverse justify-center gap-8 py-8 lg:mt-12 lg:flex-row lg:gap-16'>
        <div>
          {post.keyTakeaways && (
            <div className='mb-4 rounded-3xl bg-[#DFEFFF] p-6'>
              <h3 className='mb-3 text-2xl font-semibold text-black'>
                Key Takeaways
              </h3>
              <PortableText
                value={post.keyTakeaways}
                components={myPortableTextComponents}
              />
            </div>
          )}

          <div className='prose prose-lg'>
            <PortableText
              value={post.body}
              components={myPortableTextComponents}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {post.headings && post.headings.length > 0 && (
            <TableOfContents headings={post.headings} />
          )}
        </div>
      </section>

      {post.relatedPosts?.length > 0 && (
        <section className='bg-[#F8F7F4] p-8 lg:p-12'>
          <h2 className='mb-4 text-center text-3xl font-bold'>
            Some more resources
          </h2>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {post.relatedPosts.map((relatedPost: any) => (
              <Link
                href={`/blog/${relatedPost.slug}`}
                key={relatedPost._id}
                className='flex flex-col gap-2 rounded-xl p-4 transition duration-500 hover:bg-accent hover:shadow-md sm:hover:scale-105'
              >
                <div className='relative aspect-video w-full'>
                  {relatedPost.coverImage && (
                    <Image
                      src={urlFor(relatedPost.coverImage).url()}
                      alt={relatedPost.title}
                      fill
                      sizes='(min-width: 350px) 33vw, 100vw'
                      className='rounded-xl border object-cover'
                    />
                  )}
                </div>

                <h3 className='text-lg font-medium'>{relatedPost.title}</h3>
                <span className='text-sm text-muted-foreground'>
                  {formatDate(relatedPost.publishedAt)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FreeGuide />
      {/* <div className='w-full pt-12'>
        <BlogSubscribe />
      </div> */}
    </>
  )
}
