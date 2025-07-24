// app/api/recruiters/route.js
import connectDB from '@/lib/dbConnect';
import Recruiter from '@/models/Recruiter';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectDB();
  const all = await Recruiter.find({});
  return NextResponse.json(all);
}

export async function POST(request) {
  await connectDB();
  const data = await request.json();
  try {
    const newRec = await Recruiter.create(data);
    return NextResponse.json(newRec, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
