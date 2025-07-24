// models/Job.js
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const JobSchema = new Schema({
  recruiter: { type: Types.ObjectId, ref: 'Recruiter', required: true },
  title: { type: String, required: true },
  requirements: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default model('Job', JobSchema);
