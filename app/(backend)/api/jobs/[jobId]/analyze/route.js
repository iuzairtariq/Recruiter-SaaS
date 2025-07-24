// app/api/jobs/[jobId]/analyze/route.js
import { withAuth } from "@clerk/nextjs/api";
import connectDB from "@/lib/dbConnect";
import Job from "@/models/Job";
import Candidate from "@/models/Candidate";
import { analyzeResume } from "@/lib/ai/analyzeResume";

export default withAuth(async (req, res) => {
  // Sirf POST allow karenge
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  // DB connect
  await connectDB();

  // params.jobId se dynamic segment lo
  const { jobId } = req.params;

  // Job fetch karo
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Candidates fetch karo
  const cands = await Candidate.find({ job: jobId });

  // Har candidate ke resume analyze karo
  for (let cand of cands) {
    // tumor helper function
    const json = await analyzeResume(cand.resumeText, job);
    cand.scores = json;
    await cand.save();
  }

  // Dobara top 10 fetch + sort
  const sorted = (await Candidate.find({ job: jobId }))
    .sort((a, b) => b.scores.overallPercent - a.scores.overallPercent)
    .slice(0, 10);

  // Return karo
  return res.status(200).json(sorted);
});

// Ab jab front‑end se tum /api/jobs/1234/analyze pe POST bhejoge, Clerk auth check hoga,
// phir database logic fire karega aur sorted AI report wapas mil jayegi.