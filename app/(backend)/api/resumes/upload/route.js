// app/api/resumes/upload/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Candidate from '@/models/Candidate';

export const config = {
  api: {
    bodyParser: false, // hum request.formData() use karenge
  },
};

export async function POST(request) {
  try {
    // 1) DB connect karwa lo
    await connectDB();

    // 2) FormData nikaalo
    const formData = await request.formData();
    const jobId = formData.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID missing hai' }, { status: 400 });
    }

    // 3) Uploaded resume files nikaalo
    const resumeFiles = formData.getAll('resume');
    if (!resumeFiles || resumeFiles.length === 0) {
      return NextResponse.json({ error: 'Koi resume file upload nahi ki gayi' }, { status: 400 });
    }
    if (resumeFiles.length > 100) {
      return NextResponse.json({ error: 'Zyada se zyada 100 resumes upload kar sakte hain' }, { status: 400 });
    }

    // 4) Pdf-parse ki internal file ko dynamic import kar rahe hain
    //      Takay test-data issue na aaye
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;

    const createdCandidates = [];

    for (let i = 0; i < resumeFiles.length; i++) {
      const fileBlob = resumeFiles[i];
      try {
        // 5a) Filename aur Buffer nikaalo
        const filename = fileBlob.name || `file_${i}`;
        const arrayBuffer = await fileBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 5b) Pdf-parse se text extract karo
        const parsed = await pdfParse(buffer);
        const resumeText = parsed.text;

        // 5c) Mongoose me document save karo
        const candidateDoc = new Candidate({
          jobId,
          filename,
          resumeText,
        });
        await candidateDoc.save();
        createdCandidates.push(candidateDoc._id);
      } catch (fileErr) {
        console.error('File processing error:', fileErr);
        // Agar parsing error aaye to error field ke saath document banao
        const errorDoc = new Candidate({
          jobId,
          filename: fileBlob.name || `file_${i}`,
          error: 'Parsing error: ' + fileErr.message,
        });
        await errorDoc.save();
      }
    }

    return NextResponse.json({
      message: 'Resumes successfully uploaded and parsed',
      candidateIds: createdCandidates,
    });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json(
      { error: 'Server error during resume upload', details: err.message },
      { status: 500 }
    );
  }
}
