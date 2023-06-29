const express = require("express");
const Location = require("../Modelss/Location");
const router = express.Router();

router.get("/get-locations", (req, res) => {
  try {
    Location.find({})
      .sort({ country: 1 })
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

router.post("/location/create", async (req, res) => {
  const { country, city } = req.body;

  if (!country || !city) {
    return res.status(400).json({
      Msg: "Please Fil Out All Fields",
    });
  }

  const cityExists = await Location.findOne({ country: country, city: city });
  if (cityExists) {
    return res.status(400).json({
      Msg: "This City Is Already Exits",
    });
  }

  const newLocation = new Location({
    country: country,
    city: city,
  });

  try {
    await newLocation.save().then((response) => {
      res.json({
        Msg: `Location Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/location/:id", (req, res) => {
  try {
    Location.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json({
      Msg: "This City Is Deleted",
    });
  }
});

router.put("/location/:id/update", (req, res) => {
  try {
    Location.findByIdAndUpdate(req.params.id, req.body).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/location/:id", (req, res) => {
  Location.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Location.find({}).then((response) => {
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
