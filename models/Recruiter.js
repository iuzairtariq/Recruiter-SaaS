// models/Recruiter.js
import mongoose from 'mongoose';

const RecruiterSchema = new mongoose.Schema({
  clerkRecruiterId: { type: String, required: true, unique: true, index: true },
  email: { type: String },
  fullName: { type: String },
  recruiterPreferences: {
    keywords: { type: [String], default: [] },
    experienceMin: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
    locationPref: { type: String, default: '' },
  },
  createdAt: { type: Date, required: true },
  lastSignedIn: { type: Date },
}, {
  timestamps: false,
});

// If model already exists, reuse it
const Recruiter = mongoose.models.Recruiter || mongoose.model('Recruiter', RecruiterSchema);

export default Recruiter;
