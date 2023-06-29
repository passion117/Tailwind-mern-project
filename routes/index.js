const express = require("express");
const router = express.Router();

const submitListingRouter = require("./SubmitListing");
const userRoutes = require("./userRoutes");
const messageRoutes = require("./messageRoutes");
const chatRoutes = require("./chatRoutes");
const adminUser = require("./adminUser");
const adminCategory = require("./adminCategory");
const adminProperty = require("./adminProperty");
const adminCurrency = require("./adminCurrency");
const adminFeature = require("./adminFeature");
const adminLocation = require("./adminLocation");
const adminNearbytype = require("./adminNearbytype");
const adminNear = require("./adminNear");
const adminFaq = require("./adminFaq");
const getListing = require("./getListing");

router.use("/submitlisting", submitListingRouter);
router.use("/", userRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/message", messageRoutes);
router.use("/admin", adminUser);
router.use("/admin", adminCategory);
router.use("/admin", adminProperty);
router.use("/admin", adminCurrency);
router.use("/admin", adminFeature);
router.use("/admin", adminLocation);
router.use("/admin", adminNearbytype);
router.use("/admin", adminNear);
router.use("/admin", adminFaq);
router.use("/", getListing);

module.exports = router;
