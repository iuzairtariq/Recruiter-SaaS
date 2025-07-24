'use client'
import MyJobsList from '@/components/MyJobsList'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="py-10 max-w-2xl mx-auto">
      <SignedIn>
        <h1 className="text-3xl mb-6 text-center">My Jobs</h1>
        <div className="flex justify-end mb-4">
          <Link href="/create-job">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Create a New Job
            </button>
          </Link>
        </div>
        {/* <MyJobsList /> */}
      </SignedIn>
      <SignedOut>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Welcome to the Uzair's world</h2>
          <p className=''>Sign/Log in to explore my app</p>
        </div>
      </SignedOut>
    </div>
  )
}
