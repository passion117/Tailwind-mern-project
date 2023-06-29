const express = require("express");
const Currency = require("../Modelss/Currency");
const router = express.Router();

router.get("/get-currencies", (req, res) => {
  try {
    Currency.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/currency/create", async (req, res) => {
  const currency = await new Currency(req.body);
  try {
    currency.save().then((response) => {
      res.json({
        Msg: `Currency Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/currency/:id", (req, res) => {
  try {
    Currency.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/currency/:id/update", (req, res) => {
  try {
    Currency.findByIdAndUpdate(req.params.id, req.body).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/currency/:id", (req, res) => {
  Currency.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Currency.find({}).then((response) => {
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
