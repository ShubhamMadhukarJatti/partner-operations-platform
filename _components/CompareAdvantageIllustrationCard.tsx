import Image from 'next/image'

/** @3x PNG (1293×1119); served from `public` */
export const COMPARE_ADVANTAGE_CARD_SRC =
  '/assets/compare/compare-advantage-card-3x.png'

/** Figma Card 01 (947:35913) plate — matches Dev Mode gradient */
const CARD_01_PLATE =
  'linear-gradient(159.28356608722362deg, rgb(239, 239, 255) 15.205%, rgba(255, 255, 255, 0) 114.99%)'

/** Natural frame for the asset (431×373 @1×). */
export const COMPARE_ADVANTAGE_CARD_ASPECT = 'aspect-[431/373]' as const

type CompareAdvantageIllustrationCardProps = {
  /** Extra classes on the outer width-constraining wrapper */
  wrapperClassName?: string
}

export default function CompareAdvantageIllustrationCard({
  wrapperClassName = ''
}: CompareAdvantageIllustrationCardProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[431px] shrink-0 lg:mx-0 ${wrapperClassName}`}
    >
      <div
        className={`compare-page-card-pop relative w-full ${COMPARE_ADVANTAGE_CARD_ASPECT} cursor-default overflow-hidden rounded-[18px] border border-transparent shadow-[0px_12px_40px_-16px_rgba(104,99,251,0.25)] hover:border-[#6863fb]/25 hover:shadow-[0px_16px_48px_-14px_rgba(104,99,251,0.4)]`}
      >
        <div
          className='pointer-events-none absolute inset-0 z-0 rounded-[inherit]'
          style={{ backgroundImage: CARD_01_PLATE }}
          aria-hidden
        />
        <div
          className='pointer-events-none absolute inset-0 z-[1] rounded-[inherit] border border-white/40'
          aria-hidden
        />
        <div className='absolute inset-0 z-[2] min-w-0'>
          <Image
            src={COMPARE_ADVANTAGE_CARD_SRC}
            alt='Partner integrations above a task workflow panel with generate action'
            fill
            priority
            sizes='(max-width: 1024px) 100vw, 431px'
            className='object-contain object-center'
          />
        </div>
      </div>
    </div>
  )
}
