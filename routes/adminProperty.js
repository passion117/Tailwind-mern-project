const express = require("express");
const Property = require("../Modelss/SubmitListings");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const SubmitListings = require("../Modelss/SubmitListings");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      const dir = "./uploads/thumbnail";
      fs.access(dir, (error) => {
        if (error) {
          fs.mkdir(dir, (error) => cb(error, dir));
        } else {
          cb(null, dir);
        }
      });
    } else if (file.fieldname === "picture") {
      const dir = "./uploads/picture";
      fs.exists(dir, (exist) =>
        !exist ? fs.mkdir(dir, (error) => cb(error, dir)) : cb(null, dir)
      );
    }
  },
  filename: (req, file, callBack) => {
    if (!req.body.picture) req.body.picture = [];
    const fileName = Date.now() + file.originalname;
    if (file.fieldname === "thumbnail") {
      req.body.thumbnail = "uploads/thumbnail/" + fileName;
    } else {
      req.body.picture.push("uploads/picture/" + fileName);
    }
    callBack(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/get-properties", (req, res) => {
  try {
    Property.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.post("/category/create", async (req, res) => {
//   const category = await new Category(req.body);
//   try {
//     category.save().then((response) => {
//       res.json({
//         Msg: `Category Saved Sucessfully`,
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.get("/property/:id", (req, res) => {
  try {
    Property.findById(req.params.id)
      .populate(["Author", "Features", "Details.near"])
      .then((response) => {
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
  "/property/:id/update",
  upload.fields([{ name: "thumbnail" }, { name: "picture" }]),
  async (req, res) => {
    const {
      description,
      name,
      status,
      price,
      period,
      type,
      currency,
      space,
      land,
      video,
      thumbnail,
      picture,
      lat,
      long,
      address,
      country,
      city,
      provice,
      zipcode,
      features,
      id,
      beds,
      bathrooms,
      condition,
      built,
      neighbor,
      living,
      dining,
      story,
      parking,
      lotsize,
      view,
      near,
      category,
      author,
    } = req.body;

    const property = await SubmitListings.findOne({_id: req.params.id}).lean();
    console.log(property);

    const listing = {
      BasicInformation: {
        description: description,
        name: name,
        status: status,
        price: price,
        currency: currency,
        period: period,
        type: type,
        space: space,
        land: land,
        video: video,
      },
      Gallery: {
        file: thumbnail !== 'undefined' ? thumbnail : property.Gallery.file,
        picture: picture,
      },
      Location: {
        latitude: lat,
        longitude: long,
        address: address,
        county: country,
        city: city,
        provice: provice,
        zipcode: zipcode,
      },
      Features: features ? features.split(",") : [],
      Details: {
        id: id,
        beds: beds,
        bathrooms: bathrooms,
        condition: condition,
        built: built,
        neighbor: neighbor,
        living: living,
        dining: dining,
        story: story,
        parking: parking,
        lotsize: lotsize,
        view: view,
        near: near ? near : [],
      },
      category: category,
      Author: author,
    };
    
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
    console.log(listing);
    try {
      Property.findByIdAndUpdate(req.params.id, listing).then((response) => {
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

router.delete("/delete/property/:id", (req, res) => {
  Property.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Property.find({}).then((response) => {
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
