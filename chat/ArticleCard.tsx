import React from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface ArticleCardProps {
  image?: string
  title: string
  description: string
  link?: string
}

const ArticleCard = ({
  image,
  title,
  description,
  link = '#'
}: ArticleCardProps) => {
  return (
    <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md'>
      <div className='relative h-32 w-full bg-gray-200'>
        {image ? (
          <Image src={image} alt={title} fill className='object-cover' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-300'>
            <span className='text-gray-400'>Image</span>
          </div>
        )}
      </div>
      <div className='p-4'>
        <h3 className='mb-2 text-sm font-semibold text-gray-900'>{title}</h3>
        <p className='mb-4 line-clamp-3 text-xs leading-relaxed text-gray-500'>
          {description}
        </p>
        <a
          href={link}
          className='flex items-center gap-1 text-xs font-medium text-[#6863FB] hover:underline'
        >
          <ExternalLink size={12} /> Learn more
        </a>
      </div>
    </div>
  )
}

export default ArticleCard
