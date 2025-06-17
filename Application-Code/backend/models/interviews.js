const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    job: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    questions: [
      {
        question: String,
        answer: String,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
