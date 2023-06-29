const express = require("express");
const Category = require("../Modelss/Category");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const categorystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "icon") {
      const dir = "./uploads/categoryIcons";
      fs.access(dir, (error) => {
        if (error) {
          fs.mkdir(dir, (error) => cb(error, dir));
        } else {
          cb(null, dir);
        }
      });
    } else if (file.fieldname === "img") {
      const dir = "./uploads/categoryImages";
      fs.access(dir, (error) => {
        if (error) {
          fs.mkdir(dir, (error) => cb(error, dir));
        } else {
          cb(null, dir);
        }
      });
    }
  },
  filename: (req, file, callBack) => {
    if (!req.body.picture) req.body.picture = [];
    const fileName = Date.now() + file.originalname;
    if (file.fieldname === "icon") {
      req.body.icon = "uploads/categoryIcons/" + fileName;
    } else {
      req.body.img = "uploads/categoryImages/" + fileName;
    }
    callBack(null, fileName);
  },
});

const uploadCategory = multer({ storage: categorystorage });

router.get("/get-categories", (req, res) => {
  try {
    Category.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});

router.post(
  "/category/create",
  uploadCategory.fields([{ name: "icon" }, { name: "img" }]),
  async (req, res) => {
    console.log(req.body, req.files);
    const { name, description, icon, img } = req.body;
    const category = await new Category({
      name: name ? name : "default",
      description: req.body.description,
      icon:
        req.body.icon === "undefined"
          ? "uploads/categoryIcons/default.ico"
          : req.body.icon,
      img:
        req.body.icon === "undefined"
          ? "uploads/categoryImages/default.png"
          : req.body.img,
    });
    try {
      category.save().then((response) => {
        res.json({
          Msg: `Category Saved Sucessfully`,
          success: true,
          result: response,
        });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/category/:id", (req, res) => {
  try {
    Category.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put(
  "/category/:id/update",
  uploadCategory.fields([{ name: "icon" }, { name: "img" }]),
  (req, res) => {
    try {
      var category = {
        name: req.body.name,
        description: req.body.description,
      };
      if (req.body.icon && req.body.icon !== "undefined") {
        category.icon = req.body.icon;
      }
      if (req.body.img && req.body.img !== "undefined") {
        category.img = req.body.img;
      }
      Category.findByIdAndUpdate(req.params.id, category).then((response) => {
        res.status(200).json({
          success: true,
          result: response,
        });
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.delete("/delete/category/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Category.find({}).then((response) => {
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
