const express = require("express");
const Near = require("../Modelss/Near");
const router = express.Router();

// router.get("/get-currencies", (req, res) => {
//   try {
//     Currency.find({}).then((response) => {
//       res.status(200).json({
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.post("/near/create", async (req, res) => {
  const near = await new Near(req.body);
  try {
    near.save().then((response) => {
      res.json({
        Msg: `Near Saved Sucessfully`,
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.get("/currency/:id", (req, res) => {
//   try {
//     Currency.findById(req.params.id).then((response) => {
//       res.status(200).json({
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// router.put("/currency/:id/update", (req, res) => {
//   try {
//     Currency.findByIdAndUpdate(req.params.id, req.body).then((response) => {
//       res.status(200).json({
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.delete("/delete/near/:id", (req, res) => {
  Near.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Near.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Sucessfully`,
          success: true,
          result: req.params.id,
        });
      });
    } else {
      res.status(500).json(err);
    }
  });
});

module.exports = router;
