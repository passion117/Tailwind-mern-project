const express = require("express");
const Category = require("../Modelss/Category");
const Property = require("../Modelss/SubmitListings");
const router = express.Router();

router.get("/get-propertycount-by-category", (req, res) => {
  try {
    Category.aggregate([
      {
        $lookup: {
          from: "submitlistings",
          localField: "name",
          foreignField: "category",
          as: "count",
        },
      },
      {
        $addFields: {
          count: { $size: "$count" },
        },
      },
    ]).then((response) => {
      res.status(200).json(response);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
