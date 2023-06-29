const express = require("express");
const Faq = require("../Modelss/Faq");
const router = express.Router();

router.get("/get-faqs", (req, res) => {
  try {
    Faq.find({}).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/faq/create", async (req, res) => {
  const faq = await new Faq(req.body);
  try {
    faq.save().then((response) => {
      res.json({
        Msg: `faq Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/faq/:id", (req, res) => {
  try {
    Faq.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/faq/:id/update", (req, res) => {
  try {
    Faq.findByIdAndUpdate(req.params.id, req.body).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/faq/:id", (req, res) => {
  Faq.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Faq.find({}).then((response) => {
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
