// app/api/resumes/analyze/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Candidate from '@/models/Candidate';
import Job from '@/models/Job';
import { analyzeResume } from '@/lib/analyzeResume';

export const config = {
  api: {
    bodyParser: false, // hum request.json() use karenge
  },
};

export async function POST(request) {
  try {
    // 1) MongoDB se connect karo
    await connectDB();

    // 2) Request body se JSON parse karo
    const body = await request.json();
    const jobId = body.jobId;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID missing hai' }, { status: 400 });
    }

    // 3) Job details fetch karo
    const job = await Job.findById(jobId).lean();
    if (!job) {
      return NextResponse.json({ error: 'Job nahi mila is ID se' }, { status: 404 });
    }

    // 4) Un candidates ko find karo jinke paas abhi AI fields nahi hain
    const candidates = await Candidate.find({
      jobId,
      resumeText: { $exists: true },
      'skills.score': { $exists: false },
    });

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({
        message: 'Is job ke liye koi naye candidates nahi milay ya already analyze ho chuke hain.',
      });
    }

    const analyzedCandidates = [];
    const errors = [];
    const results = [];

    // 5) Har candidate pe AI analysis karo
    for (const cand of candidates) {
      try {
        // 5a) AI ko resumeText aur job details bhejo
        const aiResult = await analyzeResume(cand.resumeText, {
          title: job.title,
          requirements: job.requirements,
        });

        // 5b) Agar AI ne error return kiya
        if (aiResult.error) {
          cand.error = 'AI Analysis Error: ' + aiResult.error;
          try {
            await cand.save();
          } catch (saveErr1) {
            console.error('Error saving candidate error field:', saveErr1);
          }
          errors.push({ id: cand._id, message: aiResult.error });
          continue; // is candidate ko skip karke next candidate pe chale jao
        }

        // 5c) AI se jo JSON mila, usme check karo types
        // Ensure karo ke overall.score number hi ho
        if (
          !aiResult.overall ||
          typeof aiResult.overall.score !== 'number' ||
          typeof aiResult.overall.recommendation !== 'string'
        ) {
          const msg = 'Invalid overall data from AI';
          cand.error = msg;
          try {
            await cand.save();
          } catch (saveErr2) {
            console.error('Error saving candidate invalid-overall field:', saveErr2);
          }
          errors.push({ id: cand._id, message: msg });
          continue;
        }

        // 5d) Agar types theek hain, to fields assign karo
        cand.skills = aiResult.skills;
        cand.experience = aiResult.experience;
        cand.projects = aiResult.projects;
        cand.education = aiResult.education;
        cand.overall = aiResult.overall;

        // 5e) Ab candidate document save karo
        try {
          await cand.save();
          analyzedCandidates.push(cand._id);
          results.push({ id: cand._id, ai: aiResult });
        } catch (saveErr3) {
          console.error('Error saving candidate after AI analysis:', saveErr3);
          cand.error = 'Save error after AI analysis: ' + saveErr3.message;
          try {
            await cand.save();
          } catch (finalSaveErr) {
            console.error('Error saving candidate error field:', finalSaveErr);
          }
          errors.push({ id: cand._id, message: saveErr3.message });
        }
      } catch (innerErr) {
        // 5f) Agar analyzeResume() call ya koi aur unexpected error ho jaye
        console.error('Error analyzing candidate:', innerErr);
        cand.error = 'Server-side analysis error: ' + innerErr.message;
        try {
          await cand.save();
        } catch (saveErr4) {
          console.error('Error saving candidate error field:', saveErr4);
        }
        errors.push({ id: cand._id, message: innerErr.message });
        continue;
      }
    }

    // 6) Final response bhejo (AI results bhi include hain)
    return NextResponse.json({
      message: 'AI analysis complete hogayi hai',
      analyzedCandidateIds: analyzedCandidates,
      results, // har element: { id: <candidateId>, ai: <AI JSON> }
      errors,
    });
  } catch (err) {
    console.error('Analyze route error:', err);
    return NextResponse.json(
      {
        error: 'Server error during AI analysis',
        details: err.message,
      },
      { status: 500 }
    );
  }
}
