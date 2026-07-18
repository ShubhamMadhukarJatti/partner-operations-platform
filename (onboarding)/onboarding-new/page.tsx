'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { Metadata } from 'next'
import { UserType } from '@/types'
import { signOut } from 'firebase/auth'

import { getCurrentUser } from '@/lib/db/user'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import DashboardItemWrapper from '@/app/(app)/(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'
import AuthScreenSlider from '@/app/(auth)/_components/auth-screen-slider'

import { CreateOrganizationForm } from '../_components/create-organization-form'

export default function OnboardingJoinPage() {
  const [currentUser, setCurrentUser] = useState<UserType>()
  const [configuration, setConfiguration] = useState<{
    sectors: {
      value: string
      label: string
    }[]
  }>({ sectors: [] })

  useEffect(() => {
    ;(async () => {
      const currentUser = await getCurrentUser()
      setCurrentUser(currentUser)
    })()
  }, [])

  const router = useRouter()

  useEffect(() => {
    const fetchConfiguration = async () => {
      const types = ['PREFERRED_SECTORS']

      try {
        const fetchPromises = types.map((type) =>
          fetch(`/api/configuration-by-type?type=${type}`).then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch configuration for type ${type}: ${response.statusText}`
              )
            }
            return response.json().then((data) => ({ type, data }))
          })
        )

        const results = await Promise.all(fetchPromises)
        const configData = results.reduce((acc: any, { type, data }) => {
          // const key = type === 'PREFERRED_SECTORS' ? 'sectors'
          acc['sectors'] = data.map((item: any) => ({
            value: item.value,
            label: item.key
          }))
          return acc
        }, {})

        setConfiguration(configData)
      } catch (error) {
        console.error('Error fetching configurations:', error)
      }
    }

    fetchConfiguration()
  }, [])

  const handleLogout = async () => {
    // const auth = getFirebaseAuth()
    // await signOut(auth)
    await fetch('/api/logout', {
      method: 'GET'
    })

    router.push('/login')
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
  }

  return (
    <main className=' flex min-h-screen justify-center bg-background-ghost-white   '>
      <div className=' hidden flex-1 flex-col lg:flex'>
        <AuthScreenSlider isSignUp={false} />
        <div className='my-3 mb-6 flex items-center gap-2 text-center lg:ml-12'>
          <p className='fds-text text-text-80'>Already have an account?</p>
          <p
            onClick={() => handleLogout()}
            className='fds-text-semibold text-primary-light-blue'
          >
            Log In
          </p>
        </div>
      </div>

      <DashboardItemWrapper className='relative flex flex-1 flex-col  bg-white p-8 lg:m-10   lg:ml-0 lg:max-w-[572px]'>
        <CreateOrganizationForm
          demo={false}
          isPaid={true}
          // sectors={configuration?.sectors}
        />

        <div className='mt-10 flex items-center justify-center gap-2 text-center lg:ml-12 lg:hidden'>
          <p className='fds-text text-text-80'>Already have an account?</p>
          <p
            onClick={() => handleLogout()}
            className='fds-text-semibold text-primary-light-blue'
          >
            Log In
          </p>
        </div>
      </DashboardItemWrapper>
    </main>
  )
}
