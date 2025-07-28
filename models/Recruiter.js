// models/Recruiter.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RecruiterSchema = new Schema({
  clerkRecruiterId: { type: String, required: true, unique: true, index: true },
  email: { type: String },
  fullName: { type: String },
  recruiterPreferences: {
    keywords: { type: [String], default: [] },
    experienceMin: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    locationPref: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  lastSignedIn: { type: Date, default: null },
});

export default model('Recruiter', RecruiterSchema);
