const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["weekly_winner", "10_challenges", "50_points"],
    required: true,
  },
  icon: {
    type: String,
    default: function () {
      const icons = {
        weekly_winner: "🏆", // Trophy emoji or a URL to an image
        "10_challenges": "🔥", // Fire emoji or a URL to an image
        "50_points": "🏅", // Star emoji or a URL to an image
      };
      return icons[this.type] || "❓"; // Default unknown badge icon
    },
  },
  earnedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Badge", badgeSchema);
