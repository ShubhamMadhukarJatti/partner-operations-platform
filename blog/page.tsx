import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MoveRight } from 'lucide-react'

import { getAllBlogs } from '@/lib/db/sanity-cms'
import { urlFor } from '@/lib/sanity'
import BlogHeroSection from '@/app/(marketing)/_components/home/blog-hero-section'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Partner Strategy Blog | Insights for GTM Teams | Sharkdom',
  description:
    'Articles on partner-led growth, co-selling, deal registration and ecosystem strategy. Written for GTM leaders and partnership practitioners building real programs.',
  keywords: [
    'partner strategy blog',
    'partner-led growth content',
    'partnership GTM articles'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/blog'
  }
}

const BlogPage = async () => {
  const posts = await getAllBlogs()

  function getRandomElements(arr: any, count: number) {
    const shuffled = arr.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const randomThreePosts = getRandomElements(posts, 3)

  return (
    <div>
      <BlogHeroSection />
      <div className='bg-[#F9F6EF] py-10 lg:pb-10 lg:pt-20'>
        {/* <div className='container flex flex-col items-center pb-6'> */}
        <h2 className='fds-heading text-center'>Ecosystem Blogs</h2>
        {randomThreePosts && (
          <div className='mx-auto flex max-w-5xl flex-col justify-center gap-4 py-8'>
            <Link
              href={`/blog/${randomThreePosts[0]?.slug}`}
              key={randomThreePosts[0]?._id}
            >
              <div className='min-w-5xl mx-4 mb-5 flex flex-col justify-between gap-2 rounded-2xl border bg-white md:flex-row'>
                <div
                  className='relative h-60 rounded-t-2xl sm:h-[500px] md:basis-1/2 md:rounded-l-2xl md:rounded-tr-none'
                  style={{
                    backgroundColor: randomThreePosts[0].imageBackground
                  }}
                >
                  {randomThreePosts[0]?.slantImage && (
                    <Image
                      src={urlFor(randomThreePosts[0].slantImage).url()}
                      alt={randomThreePosts[0].title}
                      fill
                      sizes='(min-width: 300px) 33vw, 100vw'
                      className='aspect-video rounded-2xl object-contain'
                    />
                  )}
                </div>
                <div className='basis-1/2 flex-col p-4 lg:p-10'>
                  <h3 className='fds-heading mb-6 line-clamp-4 lg:text-3xl'>
                    {randomThreePosts[0]?.title}
                  </h3>
                  {randomThreePosts[0]?.description ? (
                    <p className='mb-5 line-clamp-3 text-lg text-[#38393E] md:text-[22px]'>
                      {randomThreePosts[0]?.description}
                    </p>
                  ) : null}
                  <Link
                    href={`/blog/${randomThreePosts[0]?.slug}`}
                    key={randomThreePosts[0]?._id}
                    className='flex w-max items-center justify-center gap-2 rounded-lg border-2 border-[#434EE1] px-8 py-2 text-[#434EE1] lg:mt-4'
                  >
                    Read more <MoveRight />
                  </Link>
                </div>
              </div>
            </Link>
            <section className='grid h-full gap-x-12 gap-y-5 px-4 md:grid-cols-2'>
              {randomThreePosts?.slice(1, 3).map((post: any, index: number) => {
                return (
                  <Link href={`/blog/${post.slug}`} key={post._id}>
                    <div
                      key={index}
                      className='flex h-full cursor-pointer flex-col gap-2 rounded-2xl border bg-white'
                    >
                      <div
                        className='relative h-60 rounded-t-2xl sm:h-[500px]'
                        style={{ backgroundColor: post.imageBackground }}
                      >
                        {post?.verticalImage && (
                          <Image
                            src={urlFor(post.verticalImage).url()}
                            alt={post.title}
                            fill
                            sizes='(min-width: 300px) 33vw, 100vw'
                            className='aspect-video rounded-2xl object-contain'
                          />
                        )}
                      </div>
                      <div className='flex flex-col p-4 lg:px-8 lg:pt-8'>
                        <h2 className='fds-heading mb-6 '>{post?.title}</h2>
                        {post?.description ? (
                          <p className='mb-5 line-clamp-3 text-lg text-[#38393E]'>
                            {post?.description}
                          </p>
                        ) : null}
                        <Link
                          href={`/blog/${post.slug}`}
                          key={post._id}
                          className='flex w-max items-center justify-center gap-2 rounded-lg border-2 border-[#434EE1] px-8 py-2 text-[#434EE1] lg:mt-4'
                        >
                          Get the guide <MoveRight />
                        </Link>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </section>
            <Link
              href={'#blog'}
              className='mx-auto mt-5 flex items-center gap-2 text-[#434DE1]'
            >
              <span className='underline'>View all articles</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Recent Articles */}
      <div
        id='blog'
        className='mx-auto flex max-w-5xl flex-col items-center px-6 py-10 lg:py-12'
      >
        <h2 className='fds-heading mb-6 lg:mb-8'>Recent Articles</h2>
        <div className='mx-auto flex max-w-5xl flex-col items-center justify-center gap-4'>
          <section className='grid gap-x-12 gap-y-6 md:grid-cols-2 lg:gap-y-12'>
            {posts.map((post: any, index: number) => {
              return (
                <Link href={`/blog/${post.slug}`} key={index}>
                  <div
                    key={index}
                    className='flex h-full max-w-lg flex-col gap-2 rounded-2xl border-b-2 p-2 pb-5 transition hover:bg-background-ghost-white hover:shadow-sm md:border-none'
                  >
                    <Image
                      src={urlFor(post.coverImage)?.url()}
                      alt={post.title}
                      width={400}
                      height={260}
                      className='w-full rounded-2xl object-cover lg:h-64 '
                    />

                    <div className='flex flex-col p-1 '>
                      <h2 className='mb-3 text-xl font-bold text-text-100 '>
                        {post.title}
                      </h2>
                      {post.description ? (
                        <p className='mb-3 line-clamp-3 text-sm font-medium text-[#38393E]  text-text-80'>
                          {post.description}
                        </p>
                      ) : null}
                    </div>
                    <div className='mt-auto flex flex-row items-center gap-2 p-2'>
                      <Image
                        src={urlFor(post.author.image).url()}
                        width={40}
                        height={40}
                        alt={'author'}
                        className='size-12  rounded-full   '
                      />
                      <div className='flex flex-col'>
                        <p className='text-sm font-bold'>{post.author.name}</p>
                        <p className='text-sm'>{post.author.designation}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </section>
          <Link
            href={'#blog'}
            className='mx-auto mt-5 flex items-center gap-2 text-[#434DE1]'
          >
            <span className='underline'>View all articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className='mx-4'>
        <div className='relative mx-auto flex max-w-5xl flex-col-reverse justify-between gap-5 overflow-hidden rounded-2xl bg-black md:flex-row lg:my-20'>
          <Image
            className='absolute z-20'
            src={'/assets/blog-container-bg.png'}
            width={1200}
            height={400}
            alt={'bg-img'}
          />
          <div className='z-30 w-full py-8 pl-6 text-white md:w-8/12 md:pl-10'>
            <p className='mb-6 text-sm'>For Companies</p>
            <p className='text-4xl font-bold sm:text-5xl'>
              Sharkdom by
              <br /> Success Stats
            </p>
            <p className='mt-3 text-lg font-light leading-8 sm:text-[22px]'>
              Sharkdom has been delivering on its promise of empowering
              companies with ease in partnership process and finding Ideal
              Partner with fully automated pipeline management.
            </p>
            <Link
              href={'/register'}
              className='mt-12 flex flex-row items-center gap-2 text-sm text-[#EEFF8B]'
            >
              SIGN UP NOW <ArrowRight size={16} />
            </Link>
          </div>
          <div className='relative flex w-full items-center justify-center bg-black pt-4 md:w-4/12 md:justify-start md:pt-0'>
            <Image
              className='z-30 translate-x-6 md:justify-self-start'
              src={'/assets/blog-container-img-1.png'}
              width={250}
              height={240}
              alt='container-ing'
            />
            <Image
              className='z-30 -translate-x-6 rotate-180 transform md:absolute md:left-1/4 md:translate-x-12'
              src={'/assets/blog-container-img-1.png'}
              width={250}
              height={240}
              alt='container-ing'
            />
            <Image
              className='absolute z-30 md:-right-8 lg:right-0'
              src={'/assets/blog-container-img-2.png'}
              width={300}
              height={170}
              alt='container-ing'
            />
          </div>
        </div>
      </div>

      {/* <SubscribeSection /> */}
      <div className='bg-[#F9F9FE] pb-16 lg:pb-28'>
        <div className='mx-auto flex max-w-4xl flex-col items-center justify-center px-2 pt-16 sm:px-4'>
          <p className='text-center text-sm font-medium text-[#7C808D] md:text-base'>
            GET STARTED WITH SHARKDOM
          </p>
          <p className='mt-3 text-center text-3xl font-bold leading-tight sm:text-5xl md:text-[64px]'>
            Partner with Speed.
            <br /> Grow with Ease
          </p>
          <p className='mt-5 text-center text-sm text-[#38393E] sm:text-lg md:text-2xl'>
            Build powerful B2B partnerships that fuel growth and drive revenue.
          </p>
          <div className='flex w-full flex-col justify-center gap-14 p-8 sm:mt-24 sm:flex-row sm:justify-between sm:gap-3 lg:mt-16'>
            <div className='flex w-fit flex-col items-start justify-between lg:mx-auto'>
              <div className='w-fit rounded-full bg-[#B6BCF7] px-5 py-2 text-[13px] font-semibold'>
                Founding Team Member
              </div>
              <p className='mt-6 text-xl font-bold md:mt-10 md:text-2xl'>
                Empower your partners.
                <br />
                Accelerate growth.
              </p>
              <p className='text-sm font-light text-[#38393E] md:mt-2 md:text-xl'>
                Manage relationships and grow your
                <br />
                ecosystem with top-notch partners.
              </p>
              <div className='mt-8 flex w-fit flex-row items-center justify-between gap-4 sm:w-full'>
                <Link
                  href={'book-demo'}
                  target={'_blank'}
                  className='flex flex-row items-center gap-2 rounded-md bg-[#434EE1] px-4 py-2 text-xs text-white md:text-base'
                >
                  Book a demo <ArrowRight className='ml-2' size={18} />
                </Link>
                <Link
                  href='#'
                  className='text-xs text-[#616467] underline md:text-base'
                >
                  See how it works
                </Link>
              </div>
            </div>
            <div className='flex w-fit flex-col items-start justify-between lg:mx-auto'>
              <div className='w-fit rounded-full bg-[#0A1567] px-5 py-2 text-[13px] font-semibold text-white'>
                Partnership Team & Sales Team
              </div>
              <p className='mt-6 text-xl font-bold md:mt-10 md:text-2xl'>
                Earn more with the best
                <br />
                B2B SaaS brands
              </p>
              <p className='text-sm font-light text-[#38393E] md:mt-2 md:text-xl'>
                Partner with top software brands
                <br />
                and start earning commissions.
              </p>
              <div className='mt-8 flex w-fit flex-row items-center justify-between gap-4 sm:w-full'>
                <Link
                  href={'register'}
                  target={'_blank'}
                  className='flex flex-row items-center gap-2 rounded-md bg-[#434EE1] px-4 py-2 text-xs text-white md:text-base'
                >
                  Join the network <ArrowRight className='ml-2' size={18} />
                </Link>
                <Link
                  href='#'
                  className='text-xs text-[#616467] underline md:text-base'
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<div className='bg-[#F9F9FE]'>*/}
      {/*  <div className='relative overflow-hidden'>*/}
      {/*    <div className='mx-auto flex max-w-5xl items-center justify-center pt-24'>*/}
      {/*      <Image*/}
      {/*        src={'/assets/blog-container-1.png'}*/}
      {/*        width={1100}*/}
      {/*        height={400}*/}
      {/*        alt={'blog-container-bg'}*/}
      {/*      />*/}
      {/*      <Image*/}
      {/*        className='absolute -bottom-16 right-3/4 hidden translate-x-24 sm:block'*/}
      {/*        src={'/assets/blog-container-2.png'}*/}
      {/*        width={200}*/}
      {/*        height={300}*/}
      {/*        alt={'blog-container-bg'}*/}
      {/*      />*/}
      {/*      <Image*/}
      {/*        className='absolute bottom-16 left-1/4 ml-12 hidden lg:block'*/}
      {/*        src={'/assets/blog-container-3.png'}*/}
      {/*        width={200}*/}
      {/*        height={300}*/}
      {/*        alt={'blog-container-bg'}*/}
      {/*      />*/}
      {/*      <Image*/}
      {/*        className='absolute bottom-16 left-2/4 hidden translate-x-20 sm:block lg:bottom-24 lg:translate-x-36'*/}
      {/*        src={'/assets/blog-container-4.png'}*/}
      {/*        width={200}*/}
      {/*        height={300}*/}
      {/*        alt={'blog-container-bg'}*/}
      {/*      />*/}
      {/*      <Image*/}
      {/*        className='absolute -bottom-16 left-3/4 hidden -translate-x-36 lg:block'*/}
      {/*        src={'/assets/blog-container-5.png'}*/}
      {/*        width={200}*/}
      {/*        height={300}*/}
      {/*        alt={'blog-container-bg'}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}

export default BlogPage
