interface HeadingProps {
  icon?: React.ReactNode
  title?: string
  description?: string
}

export const Heading: React.FC<HeadingProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className='space-y-2 px-4'>
      <div className='flex items-center gap-2 '>
        {icon}
        <h1 className='fds-heading tracking-tight text-text-100'>{title}</h1>
      </div>
      <p className='fds-text text-text-80'>{description}</p>
    </div>
  )
}
