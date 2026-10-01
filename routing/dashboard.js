const express = require("express");

const router = express.Router();

const WrapAsync = require("../utils/WrapAsync");

const { isLoggedIn, isHost } = require("../middlewares");

const dashboardController = require("../controllers/dashboard");

router.get(
  "/",
  isLoggedIn,
  isHost,
  WrapAsync(dashboardController.renderDashboard),
);

module.exports = router;
