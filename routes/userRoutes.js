const express = require("express");
const Auth = require("../Modelss/userModel");
const {
  registerUser,
  registerVerify,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/profiles";
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
    req.body.pic = "uploads/profiles/" + fileName;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// router.route("/").post(registerUser);
router
  .route("/register")
  .post(upload.single("pic"), registerUser)
  .get(protect, allUsers);

router.post("/register-verify/(:id)", registerVerify);

router.post("/login", authUser);
router.route;

router.get("/get-users", (req, res) => {
  try {
    Auth.find({}).then((response) => {
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

router.post("/search=(:search)", async (req, res) => {
  const name = req.params.search;
  try {
    const user = await Auth.find({ name });
    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});
router.delete("/delete/user/(:id)", (req, res) => {
  Auth.findByIdAndDelete(req.params.id, (err) => {
    if (!err) {
      Auth.find({}).then((response) => {
        res.status(200).json({
          Msg: `${req.params.id} deleted Sucessfully`,
          success: true,
          result: response,
        });
      });
    } else {
      // console.log("Failed to Delete user Details: " + err);
    }
  });
});

module.exports = router;
