'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function JobDetailPage({ params }) {
    const { userId } = useAuth();
    const { jobId } = params;            // Next.js provides dynamic param
    const [job, setJob] = useState(null);

    useEffect(() => {
        fetch(`/api/jobs/${jobId}`)
            .then(r => r.json())
            .then(setJob);
    }, [jobId]);

    if (!job) return <p>Loading…</p>;

    const isMine = job.userId === userId;
    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
            <p className="mb-4">{job.description}</p>
            <p className="text-gray-600">Requirements: {job.requirements}</p>
            <p className="mt-6">
                {isMine
                    ? <span className="text-green-600">Yeh apki banai hui job hai ✅</span>
                    : <span className="text-red-600">Yeh job aapne nahi banai.</span>
                }
            </p>
        </div>
    );
}
