'use client'

import { useEffect, useState } from 'react'
import { Loader, UserPlus, UserRoundCheck } from 'lucide-react'

import { followOrganization } from '@/lib/actions/organization'
import { checkIfAFollowsB } from '@/lib/db/organization'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

const FollowButton = ({
  organizationId,
  currentOrganizationId,
  size = 'xs',
  className = ''
}: {
  organizationId: number
  currentOrganizationId: number
  size?: 'xs' | 'sm' | 'default' | 'lg'
  className?: string
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    ;(async () => {
      let res = await checkIfAFollowsB(currentOrganizationId, organizationId)

      setIsFollowing(res)
      setIsLoading(false)
    })()
  }, [])

  if (isLoading) {
    return (
      <Button variant='secondary' disabled size={size}>
        <Loader size={14} className='' />
      </Button>
    )
  }

  const follow = async () => {
    try {
      await followOrganization(organizationId)
      showCustomToast('Success', 'Request Sent', 'success', 5000)
      setIsFollowing(true)
    } catch (e) {}
  }

  return (
    <>
      {isFollowing ? (
        <Button className={className} disabled size={size}>
          <UserRoundCheck size={14} className='' />
          <span className='sr-only'>following</span>
        </Button>
      ) : (
        <Button
          size={size}
          className={cn('shrink-0 gap-1 rounded-full text-sm', className)}
          aria-label='Add to my network'
          onClick={follow}
        >
          <UserPlus size={14} className='' /> Subscribe
        </Button>
      )}
    </>
  )
}

export default FollowButton
