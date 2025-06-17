const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: String,
  job: String, // Room identifier
  text: String,
  senderAvatar: String,
  senderName: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
