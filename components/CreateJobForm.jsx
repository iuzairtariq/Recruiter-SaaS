'use client'
import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

const CreateJobForm = () => {
    const [title, setTitle] = useState('')
    const [requirements, setRequirements] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [createdJob, setCreatedJob] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, requirements, description }),
            })

            const job = await res.json()
            setCreatedJob(job)
        } catch (error) {
            console.error('Job create karne mein error:', error)
            alert('Job create karne mein error aaya hai')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAnother = () => {
        setCreatedJob(null)
        setTitle('')
        setRequirements('')
        setDescription('')
    }

    const copyJobId = () => {
        navigator.clipboard.writeText(createdJob._id)
        alert('Job ID clipboard mein copy ho gaya!')
    }

    // Multiple root elements require a fragment
    return (
        <>
            <SignedIn>
                {createdJob ? (
                    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Job successfully created</h2>
                            <p className="text-gray-600 mb-6">Now you can upload resumes</p>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <h3 className="font-medium text-gray-700 mb-2">Next Steps:</h3>
                                <ol className="list-decimal list-inside text-left space-y-2 text-gray-600">
                                    <li>Neeche diya gaya Job ID copy karein</li>
                                    <li>Upload Resumes page par jayein</li>
                                    <li>Job ID field mein paste karein</li>
                                    <li>Resumes select karke upload karein</li>
                                </ol>
                            </div>

                            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-6">
                                <span className="font-medium">Job ID:</span>
                                <div className="flex items-center">
                                    <code className="bg-gray-200 p-1 rounded mr-2 font-mono">{createdJob._id}</code>
                                    <button
                                        onClick={copyJobId}
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleCreateAnother}
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Create a new Job
                                </button>
                                <a
                                    href="/upload"
                                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
                                >
                                    Resumes Upload Karein
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl">
                        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Create a New Job</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-green-500"
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Requirements</label>
                                <textarea
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-green-500"
                                    placeholder="e.g. Skills, Experience etc..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-green-500"
                                    placeholder="e.g. Overview, Responsibilities etc..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    } transition duration-300 flex items-center justify-center cursor-pointer`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : 'Create a Job'}
                            </button>
                        </form>
                    </div>
                )}
            </SignedIn>

            <SignedOut>
                <div className="max-w-md mx-auto p-8 bg-gray-100 rounded-lg text-center">
                    <p className="mb-4 text-gray-700">Please sign in first to create a job.</p>
                    <SignInButton>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>
        </>
    )
}

export default CreateJobForm
