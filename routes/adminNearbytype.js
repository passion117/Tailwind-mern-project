const express = require("express");
const NearType = require("../Modelss/NearType");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/nearbytypes";
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
    req.body.icon = "uploads/nearbytypes/" + fileName;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/get-nearbytypes", (req, res) => {
  try {
    NearType.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/nearbytype/create", upload.single("icon"), async (req, res) => {
  let icon = req.body.icon;
  if (icon === "undefined" || icon === "" || icon === {}) {
    icon = "uploads/features/default.ico";
  }
  const nearbytype = await new NearType({
    name: req.body.name,
    icon: icon,
    color: req.body.color,
  });
  try {
    nearbytype.save().then((response) => {
      res.json({
        Msg: `Nearbytype Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/nearbytype/:id", (req, res) => {
  try {
    NearType.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/nearbytype/:id/update", upload.single("icon"), (req, res) => {
  try {
    var nearbytype = {
      name: req.body.name,
      color: req.body.color,
    };
    if (req.body.icon && req.body.icon !== "undefined") {
      nearbytype.icon = req.body.icon;
    }
    NearType.findByIdAndUpdate(req.params.id, nearbytype).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/nearbytype/:id", (req, res) => {
  NearType.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      NearType.find({}).then((response) => {
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
