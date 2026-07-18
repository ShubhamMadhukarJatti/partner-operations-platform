import React from 'react'
import Image from 'next/image'

type TrustedCompany = {
  thumbnailUrl: string
  altText: string
}

interface ClientsCarouselProps {
  companies: TrustedCompany[]
}

const ClientsCarousel: React.FC<ClientsCarouselProps> = ({ companies }) => {
  return (
    <div className='overflow-hidden'>
      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-container {
          display: flex;
          animation: carousel-scroll 5s linear infinite;
          gap: 1rem;
        }
        .carousel-container:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className='carousel-container'>
        {/* First set */}
        {companies?.map((company) => (
          <div className='flex-shrink-0' key={`${company.altText}-1`}>
            <Image
              src={company.thumbnailUrl}
              alt={company.altText}
              width={80}
              height={40}
              className='h-auto w-full max-w-20 object-contain sm:max-w-28'
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {companies?.map((company) => (
          <div className='flex-shrink-0' key={`${company.altText}-2`}>
            <Image
              src={company.thumbnailUrl}
              alt={company.altText}
              width={80}
              height={40}
              className='h-auto w-full max-w-20 object-contain sm:max-w-28'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientsCarousel
