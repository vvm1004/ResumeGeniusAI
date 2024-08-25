import mongoose from 'mongoose';

const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  resumeId: {
    type: String
  },
  userEmail: {
    type: String
  },
  userName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  themeColor: {
    type: String,
  },
  summery: {
    type: String,
  },
  experience: [
    {
      title: String,
      companyName: String,
      city: String,
      state: String,
      startDate: String,
      endDate: String,
      currentlyWorking: Boolean,
      workSummery: String
    }
  ],
  education: [
    {
      universityName: String,
      startDate: String,
      endDate: String,
      degree: String,
      major: String,
      description: String
    }
  ],
  skills: [
    {
      name: String,
      rating: Number
    }
  ]
});

export default mongoose.model('User', UserSchema);
