const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  job: { type: String, required: true },
  question: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Fin du défi
});

module.exports = mongoose.model("Challenge", challengeSchema);
