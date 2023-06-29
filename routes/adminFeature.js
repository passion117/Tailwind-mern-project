const express = require("express");
const Feature = require("../Modelss/Feature");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

let iconstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/features";
    fs.access(dir, (error) => {
      if (error) {
        fs.mkdir(dir, (error) => cb(error, dir));
      } else {
        cb(null, dir);
      }
    });
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + file.originalname;
    req.body.icon = "uploads/features/" + fileName;

    cb(null, fileName);
  },
});

const uploadIcon = multer({ storage: iconstorage });

router.get("/get-features", (req, res) => {
  try {
    Feature.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/feature/create", uploadIcon.single("icon"), async (req, res) => {
  let icon = req.body.icon;
  if (icon === "undefined" || icon === "" || icon === {}) {
    icon = "uploads/features/default.ico";
  }
  const feature = await new Feature({
    name: req.body.name,
    icon: icon,
  });
  try {
    feature.save().then((response) => {
      res.json({
        Msg: `Feature Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/feature/:id", (req, res) => {
  try {
    Feature.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/feature/:id/update", uploadIcon.single("icon"), (req, res) => {
  try {
    var feature = {
      name: req.body.name,
    };
    if (req.body.icon && req.body.icon !== "undefined") {
      feature.icon = req.body.icon;
    }
    Feature.findByIdAndUpdate(req.params.id, feature).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/feature/:id", (req, res) => {
  Feature.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Feature.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Sucessfully`,
          success: true,
          result: response,
        });
      });
    } else {
      res.status(500).json(err);
    }
  });
});

module.exports = router;
