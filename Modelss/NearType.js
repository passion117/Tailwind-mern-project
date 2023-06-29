const mongoose = require("mongoose");

const NearTypeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: {
      type: String,
      default: "uploads/nearbytypes/default.ico",
    },
    color: { type: String },
  },
  {
    timestamps: true,
  }
);

const NearType = mongoose.model("neartypes", NearTypeSchema);

module.exports = NearType;
