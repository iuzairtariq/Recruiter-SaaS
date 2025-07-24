// models/Candidate.js
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const CandidateSchema = new Schema({
  recruiter: { type: Types.ObjectId, ref: 'Recruiter', required: true },
  job: { type: Types.ObjectId, ref: 'Job', required: true },
  resumeUrl: { type: String, required: true },
  parsedText: { type: String, default: '' },
  score: { type: Number, default: 0, min: 0, max: 100 },   // AI analysis score
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export default model('Candidate', CandidateSchema);
