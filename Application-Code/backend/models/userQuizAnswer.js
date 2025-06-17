const mongoose = require("mongoose");

const quizAnswerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        question: String,
        selectedOption: [],
        isCorrect: Boolean,
      },
    ],
    score: Number, // Calculate the score based on correct answers
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAnswer", quizAnswerSchema);
