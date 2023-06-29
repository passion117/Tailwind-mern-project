const mongoose = require("mongoose");

const CurrencySchema = mongoose.Schema(
  {
    name: { type: String },
    symbol: {
      type: String,
    },
    code: { type: String },
  },
  {
    timestamps: true,
  }
);

const Currency = mongoose.model("currencies", CurrencySchema);

module.exports = Currency;
