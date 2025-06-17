const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    question: { type: String, required: true },

    correctAns: { type: String, required: true },
    userAns: String,
    feedback: String,
    rating: String,
    userEmail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
