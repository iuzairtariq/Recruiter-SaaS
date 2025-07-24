'use client'
import { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";

export default function MyJobsList() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isSignedIn } = useAuth()

    useEffect(() => {
        if (!isSignedIn) {
            setLoading(false)
            return
        }

        fetch('/api/jobs', {
            method: 'GET',
            credentials: 'include', // include cookies
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                if (res.status === 401) throw new Error('Unauthorized');
                if (!res.ok) throw new Error(`Error ${res.status}`)
                return res.json()
            })

            .then(data => {
                console.log('Fetched jobs: ', data);
                if (!Array.isArray(data)) {
                    throw new Error('Invalid response')
                }
                setJobs(data)
            })
            .catch(err => {
                console.error("Fetch jobs error:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [isSignedIn]);

    if (!isSignedIn) {
        return (
            <div className="text-center p-8">
                <p className="mb-4">Jobs dekhne ke liye sign in karein</p>
                <SignInButton>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
                </SignInButton>
            </div>
        )
    }

    if (loading) return <p className="text-center py-4">Loading Jobs…</p>
    if (error) return <p className="text-center py-4 text-red-500">Error: {error}</p>

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Job history</h2>
            {jobs.length === 0
                ? <p>No jobs found.</p>
                : jobs.map(job => (
                    <div key={job._id} className="border p-4 rounded mb-3">
                        <h3 className="font-medium">{job.title}</h3>
                        <a href={`/jobs/${job._id}`} className="text-blue-600">View Details</a>
                    </div>
                ))
            }
        </div>
    );
}
