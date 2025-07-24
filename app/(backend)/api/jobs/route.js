// app/api/jobs/route.js
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/dbConnect";
import Job from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const jobs = await Job.find({ userId }).sort({ createdAt: -1 });

  return NextResponse.json(jobs);
}

export async function POST(request) {
  const { userId } = auth();
  console.log('user id: ', userId);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, requirements, description } = await request.json();
  await connectDB();
  const job = await Job.create({ userId, title, requirements, description });

  return NextResponse.json(job, { status: 201 });
}
