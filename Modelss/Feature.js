const mongoose = require("mongoose");

const FeatureSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: {
      type: String,
      default: "uploads/features/default.ico",
    },
  },
  {
    timestamps: true,
  }
);

const Feature = mongoose.model("features", FeatureSchema);

module.exports = Feature;
