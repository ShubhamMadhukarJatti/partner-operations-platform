'use client'

// import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LoginRedirect = () => {
  // const router = useRouter()
  useEffect(() => {
    // router.push('/login')
    window.location.href = '/login'
  }, [])
  return
}

export default LoginRedirect
