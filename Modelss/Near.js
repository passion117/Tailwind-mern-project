const mongoose = require("mongoose");

const NearSchema = mongoose.Schema(
  {
    neartype: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "neartypes",
    },
    name: {
      type: String,
    },
    distance: {
      type: String,
    },
    isEdit: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Near = mongoose.model("nears", NearSchema);

module.exports = Near;
