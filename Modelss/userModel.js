const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default: "uploads/profiles/profile.png",
    },
    user: { type: String },
    isAdmin: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Auth", userSchema);

module.exports = User;
