// const router = require("express").Router();
// const Auth = require("../models/Auth");
// var CryptoJS = require("crypto-js");

// router.post("/register", async (req, res) => {
//   const { name, email, password, user, admin } = req.body;

//   if (name == "" || email == "" || password == "") {
//     res.status(401).json({
//       Msg: "please Fill Out All Fields",
//     });
//   } else {
//     Auth.findOne({ email }).then((response) => {
//       if (response == null) {
//         const newAuth = new Auth({
//           name: name,
//           email: email,
//           user: user,
//           password: CryptoJS.AES.encrypt(password, "secret key 123").toString(),
//           isAdmin: admin,
//         });
//         newAuth.save().then((response) => {
//           res.status(200).json({
//             sucess: true,
//             Msg: "Signup Suscessfully",
//             data: response,
//           });
//         });
//       } else {
//         res.status(400).json({
//           Msg: "This user is already exists",
//         });
//       }
//     });
//   }
// });

// router.get("/get-users", async (req, res) => {
//   try {
//     Auth.find({}).then((response) => {
//       res.status(200).json({
//         success: true,
//         result: response,
//       });
//     });
//   } catch (error) {
//     res.status(500).json(error);
//     console.log(error);
//   }
// });

// router.delete("/(:id)", (req, res) => {
//   Auth.findByIdAndRemove(req.params.id, (err) => {
//     Auth.find({}).then((response) => {
//       res.status(200).json({
//         Msg: `${req.params.id} deleted Sucessfully`,
//         success: true,
//         result: response,
//       });
//     });
//   });
// });

// router.post("/login", (req, res) => {
//   const { password, email } = req.body;
//   if (email == undefined || password == undefined) {
//     res.status(401).json({
//       Msg: "please Fill Out All Fields",
//     });
//   } else {
//     Auth.findOne({ email }).then((response) => {
//       if (response !== null) {
//         if (response.isAdmin == true) {
//           var bytes = CryptoJS.AES.decrypt(response.password, "secret key 123");
//           var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

//           if (originalPassword == password) {
//             res.status(200).json({
//               Msg: "Admin OKay",
//             });
//           } else {
//             res.status(500).json({
//               Msg: "Wrong Passowrd",
//             });
//           }
//         } else {
//           var bytes = CryptoJS.AES.decrypt(response.password, "secret key 123");
//           var originalPassword = bytes.toString(CryptoJS.enc.Utf8);

//           if (originalPassword == password) {
//             res.status(200).json({
//               response,
//               Msg: "OKay",
//             });
//           } else {
//             res.status(500).json({
//               Msg: "Wrong Passowrd",
//             });
//           }
//         }
//       } else {
//         res.status(500).json({
//           Msg: "Email not Found",
//         });
//       }
//     });
//   }
// });

// module.exports = router;
