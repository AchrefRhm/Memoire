const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    subs: {
      type: String,
      required: true,
      default: "free",
    },

    subscriptionStart: Date,
    subscriptionEnd: Date,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      default: "https://i.ibb.co/KtWg0g8/user.png",
    },
    password: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
