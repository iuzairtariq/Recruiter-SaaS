import { withAuth } from '@clerk/nextjs/api';
import connectDB from '@/lib/dbConnect';
import Job from '@/models/Job';

export default withAuth(async (req, res) => {
    await connectDB();
    const { jobId } = req.params;
    
    if (req.method === 'GET') {
        const job = await Job.findById(jobId);
        return res.status(200).json(job);
    }
    
    // PUT/DELETE etc. agar chahiye to handle karo
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
});
