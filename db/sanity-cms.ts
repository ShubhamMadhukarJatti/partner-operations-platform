'use server'

import { ResourcesResponse } from '@/types'

import { sanityClient } from '../sanity'

type CTAButton = {
  title: string
  link: string
}

type SanityImage = {
  asset?: {
    _ref?: string
  }
  alt?: string
}

type VideoBlock = {
  _type: 'video'
  _key?: string
  url: string
  caption?: string
  thumbnail?: SanityImage
}

export type BlogType = {
  relatedPosts: any
  map: any
  publishedAt: string
  _updatedAt: string
  coverImage: string
  author: any
  _id: string
  title: string
  body: any
  slug: string
  description: string
  categories: string
  headings?: Array<string | HTMLHeadElement>
  readTime?: string
  keyTakeaways?: any
  ctaButton?: CTAButton
  imageBackground?: any
  textColor?: any
}

export const getAllBlogs = async () => {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    "slantImage": slantImage.asset._ref,
    "verticalImage": verticalImage.asset._ref,
    "imageBackground": imageBackground.hex,
    author->{
      name,
      designation,
      "slug": slug.current,
      "image": image.asset._ref,
      bio
    },
    _id,
    title,
    "slug": slug.current,
    description,
    categories[]->{
      title,
      "slug": slug.current
    },
    relatedPosts[]->{
      title,
      "slug": slug.current
    }
  }`

  const data = await sanityClient.fetch(query)
  return data as BlogType[]
}

export const getBlogBySlug = async (slug: string) => {
  const query = `*[_type == "post" && slug.current == $slug] {
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author->{
      name,
      designation,
      "slug": slug.current,
      "image": image.asset._ref
    },
    readTime,
    keyTakeaways,
    ctaButton,
    imageBackground,
    textColor,
    _id,
    "headings": body[style in ["h2", "h3", "h4", "h5", "h6"]],
    title,
    body[]{
      ...,
      _type == "video" => {
        ...,
        thumbnail
      }
    },
    "slug": slug.current,
    description,
    categories[]->{
      title,
      _id
    },
    "relatedPosts": relatedPosts[]->{
      publishedAt,
      _id,
      title,
      "slug": slug.current,
      "coverImage": coverImage.asset._ref
    }
  }`

  const data = await sanityClient.fetch(query, { slug })
  return data[0] as BlogType
}

export const getLibraryBlogs = async () => {
  const query = `*[_type == "post" && references(*[ title == "Library"]._id)]{
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author,
    _id,
    title,
    "slug": slug.current,
    description,
  }`

  const data = await sanityClient.fetch(query)
  return data as BlogType[]
}

export const getPlaybookBlogs = async () => {
  const query = `*[_type == "post" && references(*[ title == "Startup's Playbook"]._id)]{
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author,
    _id,
    title,
    "slug": slug.current,
    description,
  }`

  const data = await sanityClient.fetch(query)
  return data as BlogType[]
}

export const getExpertArenaBlogs = async () => {
  const query = `*[_type == "post" && references(*[ title == "Expert Arena"]._id)]{
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author,
    _id,
    title,
    "slug": slug.current,
    description,
  }`

  const data = await sanityClient.fetch(query)
  return data as BlogType[]
}

export const getAllCaseStudies = async () => {
  const query = `*[_type == "caseStudy"] | order(publishedAt desc) {
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author,
    _id,
    title,
    "slug": slug.current,
    description,
  }`

  const data = await sanityClient.fetch(query)
  return data as BlogType[]
}

export const getCaseStudyBySlug = async (slug: string) => {
  const query = `*[_type == "caseStudy" && slug.current == $slug] {
    publishedAt,
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    author,
    _id,
    title,
    body,
    "slug": slug.current,
    description,
  }`

  const data = await sanityClient.fetch(query, { slug })
  return data[0] as BlogType
}

export const getAllPartnership = async () => {
  const query = `*[_type == "partnership"] {
    _updatedAt,
    "coverImage": coverImage.asset._ref,
    _id,
    title,
    "slug": slug.current,
    video,
    time
  }`

  const data = await sanityClient.fetch(query)
  return data as ResourcesResponse[]
}

export const getAllVideoData = async () => {
  const query = `*[_type == "mentorship"] {
    _id,
    videoId,
    description,
    publishedAt,
    reviews[]-> {
      _id,
      username,
      star,
      comment,
      publishedAt
    },
  }`

  const data = await sanityClient.fetch(query)
  return data as any
}
