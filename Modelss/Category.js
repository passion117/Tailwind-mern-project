const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: {
      type: String,
      default: "uploads/categoryIcons/default.ico",
    },
    img: {
      type: String,
      default: "uploads/categoryImages/default.png",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("categories", CategorySchema);

module.exports = Category;
