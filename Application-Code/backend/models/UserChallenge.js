const mongoose = require("mongoose");

const userChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  answer: { type: String, required: true },
  solution: { type: String, required: true },
  score: { type: String, required: true },
  feedback: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserChallenge", userChallengeSchema);
