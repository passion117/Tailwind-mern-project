const mongoose = require("mongoose");

const FaqSchema = mongoose.Schema(
  {
    title: { type: String },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model("faqs", FaqSchema);

module.exports = Faq;
