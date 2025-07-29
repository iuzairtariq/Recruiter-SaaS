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
  // Now synced from Clerk, remove defaults so MongoDB won't auto-populate
  createdAt: { type: Date, required: true },
  lastSignedIn: { type: Date },
}, {
  // timestamps: false: Mongoose ki taraf se jo automatic createdAt/updatedAt fields lagti hain,
  // unko disable karta hai taake sirf aapke custom Clerk‑sync dates hi use hon.
  timestamps: false,
});

// Agar model already exist kare, to overwrite na karo
const Recruiter = mongoose.models.Recruiter
  ? mongoose.model('Recruiter')
  : mongoose.model('Recruiter', RecruiterSchema);

export default Recruiter;

