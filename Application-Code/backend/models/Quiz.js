const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: String,
    difficulty: String,
    questionCount: Number,
    questionType: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: [String],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
