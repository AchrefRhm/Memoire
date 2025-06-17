const mongoose = require("mongoose");

const subscriptionHistorySchema = new mongoose.Schema({
  fromPlan: { type: String, required: true },
  toPlan: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  amount: { type: Number, required: true }, // in millimes
});

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  history: [subscriptionHistorySchema],
});

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

module.exports = Payment;
