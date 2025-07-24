'use client'
import CreateJobForm from '@/components/CreateJobForm'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

export default function CreateJobPage() {
    return (
        <div>
            <SignedIn>
                <div className="max-w-lg mx-auto py-10">
                    <h1 className="text-2xl font-semibold mb-6">Create a New Job</h1>
                    <CreateJobForm />
                </div>
            </SignedIn>
            <SignedOut>
                <div className="text-center py-20">
                    <p className="mb-4">Pehle sign in karein</p>
                    <SignInButton>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
                    </SignInButton>
                </div>
            </SignedOut>
        </div>
    )
}
