import imageUrlBuilder from '@sanity/image-url'
import { createClient, type ClientConfig } from 'next-sanity'

const config: ClientConfig = {
  projectId: '0g4a0cl0',
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: false
}

export const sanityClient = createClient(config)

const builder = imageUrlBuilder(sanityClient)

export const urlFor = (source: any) => {
  return builder.image(source)
}
