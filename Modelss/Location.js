const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema(
  {
    country: { type: String },
    city: { type: String },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("locations", LocationSchema);

module.exports = Location;
