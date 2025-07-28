import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
    return (
        <div className='px-6'>
            <h1 className="text-3xl mb-6 text-center">My Jobs</h1>
            <div className="flex justify-end mb-4">
                <Link href="/create-job">
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Create a New Job
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard