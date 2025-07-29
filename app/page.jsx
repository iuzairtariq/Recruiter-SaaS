'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard')  // redirect kar de dashboard pe
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) return null  // loading state

  return (
    <div className="py-10 max-w-2xl mx-auto">
      {isSignedIn ? (
        <div className="text-center py-20">
          <p>Redirecting to your dashboard…</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Welcome to the Uzair's world</h2>
          <p>Register yourself to explore my app.</p>
        </div>
      )}
    </div>
  )
}
