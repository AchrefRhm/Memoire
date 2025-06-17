// server/models/CV.js
const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  titleColor: { type: String, default: "#000000" },
  name: {
    type: String,
    required: true,
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    title: String,
    website: String,
    linkedin: String,
  },
  summary: {
    content: String,
    color: {
      type: String,
      default: "#000000",
    },
  },
  experience: [
    {
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String,
      color: {
        type: String,
        default: "#000000",
      },
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      description: String,
      color: {
        type: String,
        default: "#000000",
      },
    },
  ],
  skills: [
    {
      name: String,
      level: String,
      color: {
        type: String,
        default: "#000000",
      },
    },
  ],
  aiGeneratedSummary: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CV", CVSchema);
