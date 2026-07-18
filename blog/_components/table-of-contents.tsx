'use client'

import React, { useEffect, useState } from 'react'

import { slugify } from '@/lib/stringUtils'
import { cn } from '@/lib/utils'

type Props = {
  headings: any
}

const TableOfContents = ({ headings }: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            const id = entry.target.getAttribute('id')
            if (id) {
              setActiveSection(id)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    headings.forEach((heading: any) => {
      const text = heading.children.map((child: any) => child.text).join(' ')
      const slug = slugify(text)
      const section = document.getElementById(slug)
      if (section) {
        observer.observe(section)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  return (
    <div className='sticky top-24 h-fit max-w-sm rounded-2xl border border-text-20 bg-white p-5'>
      <h2 className='mb-4 text-3xl font-bold text-text-100'>
        Table of Contents
      </h2>

      <div className='nav'>
        <ul className='list-none'>
          {headings.map((item: any) => {
            const text = item.children.map((child: any) => child.text).join(' ')
            if (text.trim() !== '') {
              return (
                <li key={item._key} className={`mb-2`}>
                  <a
                    href={`#${slugify(text)}`}
                    className={cn(
                      'text-base font-normal text-text-60 opacity-55 hover:text-text-80',
                      {
                        'text-primary-light-blue opacity-100':
                          activeSection === slugify(text)
                      }
                    )}
                  >
                    {text}
                  </a>
                </li>
              )
            }
            return null
          })}
        </ul>
      </div>
    </div>
  )
}

export default TableOfContents
