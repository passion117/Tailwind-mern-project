const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
var CryptoJS = require("crypto-js");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const Auth = require("../Modelss/userModel");
const UserVerify = require("../Modelss/UserVerify");
const { fast2sms } = require("./../utils/otp.util");

var mailTransport = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
      user: "50edd658715806",
      pass: "1a254a5bf1934b",
    },
  });

const generateEmailTemplate = (code) => {
  return `
   <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
      @media only screen and (max-width: 620px) {
        h1 {
          font-size: 20px;
          padding: 5px;
        }
      }
      </style>
  </head>
  <body>
  <div>
  <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
  <h1 style="background: #f6f6f6; padding: 10px; text-align: center; color: #272727">We are delighted to welcome you to our team!</h1>
  <p>Please Verify Your Email To Continue Your Verification code is:</p>
  <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px;
  font-size: 25px;">${code}</p>
  </div>
  </div>
  </body>
  </html>
  `;
};

const registerUser = asyncHandler(async (req, res) => {
  try {    
    const { name, email, password, user } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({
      Msg: "Please Fil Out All Fields",
    });
  }
  
  const userExists = await Auth.findOne({ email });
  
  if (userExists) {
    throw new TypeError("User already exists");
    // res.status(400).json({
    //   Msg: "User already exists",
    // });

  }
  
  let pic = req.body.pic;
  if (pic === "undefined" || pic === "") {
    pic = "uploads/profiles/profile.png";
  }
  
  const newAuth = new Auth({
    name,
    email,
    password: CryptoJS.AES.encrypt(password, "secret key 123").toString(),
    pic,
    user,
  });
  
  let OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  
  const userVerify = new UserVerify({
    owner: newAuth._id,
    code: OTP,
  });
    await userVerify.save();
    await newAuth.save();
    
    
    if (email.indexOf("@") === -1) {
      await fast2sms({
        message: `Your OTP is ${OTP}`,
        contactNumber: user.email,
      });
    } else {
      console.log('======> newAuth', newAuth.email);
      mailTransport().sendMail({
        from: "29b74381ea-28e27b@inbox.mailtrap.io",
        to: newAuth.email,
        subject: "Verify you remail account",
        html: generateEmailTemplate(OTP),
      });
    }

    res.json({
      success: true,
      user: {
        name: newAuth.name,
        email: newAuth.email,
        id: newAuth._id,
        verified: newAuth.verified,
      },
    });
  } catch (err) {
    // console.log(err.message);
    res.status(404).json(err?.message);
  }
});

const registerVerify = asyncHandler(async (req, res) => {
  const { code } = req.body;
// console.log("code ------------>", code)
  if (!code) {
    res.status(400).json({
      Msg: "Please Fil Out Code Field",
    });
  }

  const verify = await UserVerify.findOne({ owner: req.params.id, code: code });

  if (verify) {
    await Auth.findByIdAndUpdate(req.params.id, { verified: true });
    await Auth.findById(req.params.id).then((user) => {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
        email: user.email,
        pic: user.pic,
        user: user.user,
        isAdmin: user.isAdmin,
        verified: user.verified,
        token: generateToken(res._id),
        Msg: "register",
      });
    });
  } else {
    res.status(400).json({ Msg: "Wrong Verification Code" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;
  
  // console.log(email, password, isAdmin);
  console.log('=============> authUser', req, res);


  const user = await Auth.findOne({ email, isAdmin });

  // console.log(user);
  if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, "secret key 123");
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    if (originalPassword == password && isAdmin == user.isAdmin) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        user: user.user,
        Msg: "login",
      });
    } else {
      res.status(400).json({
        Msg: "Wrong Password",
      });
    }
  } else {
    res.status(401).json({
      Msg: "Email not found",
    });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await await Auth.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  registerVerify,
};
