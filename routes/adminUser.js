const express = require("express");
const User = require("../Modelss/userModel");
const UserVerify = require("../Modelss/UserVerify");
var CryptoJS = require("crypto-js");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const otpGenerator = require("otp-generator");

router.get("/get-users", (req, res) => {
  try {
    User.aggregate([
      {
        $lookup: {
          from: "userverifies",
          localField: "_id",
          foreignField: "owner",
          as: "opt",
        },
      },
      {
        $set: {
          opt: { $arrayElemAt: ["$opt.code", 0] },
        },
      },
    ]).then((response) => {
      res.status(200).json(response);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/user/:id", (req, res) => {
  try {
    User.findById(req.params.id).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/user/:id/update", (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      "secret key 123"
    ).toString();
  }

  try {
    User.findByIdAndUpdate(req.params.id, req.body).then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/user/create", async (req, res) => {
  const { name, email, user, isAdmin } = req.body;

  if (!name || !email) {
    res.status(400).json({
      Msg: "Please Fil Out All Fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({
      Msg: "This User Is Already Exits",
    });
  }

  req.body.password = req.body.password
    ? CryptoJS.AES.encrypt(req.body.password, "secret key 123").toString()
    : CryptoJS.AES.encrypt("000000", "secret key 123").toString();

  const newUser = new User({
    name: name,
    password: req.body.password,
    email: email,
    user: user,
    isAdmin: isAdmin,
    verified: true,
  });

  let OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const userVerify = new UserVerify({
    owner: newUser._id,
    code: OTP,
  });

  try {
    await userVerify.save();
    await newUser.save().then((response) => {
      res.status(200).json({
        success: true,
        result: response,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/search=(:search)", async (req, res) => {
  const name = req.params.search;
  try {
    const user = await User.find({ name });
    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});
router.delete("/delete/user/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      User.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Sucessfully`,
          success: true,
          result: response,
        });
      });
    } else {
      console.log("Failed to Delete user Details: " + err);
    }
  });
});

module.exports = router;
