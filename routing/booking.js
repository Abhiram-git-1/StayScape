const express = require("express");

const router = express.Router();

const WrapAsync = require("../utils/WrapAsync");

const { isLoggedIn } = require("../middlewares");

const bookingController = require("../controllers/bookings");

router.post("/:id", isLoggedIn, WrapAsync(bookingController.createBooking));

router.get("/trips", isLoggedIn, WrapAsync(bookingController.renderTrips));

router.put(
  "/:bookingId/cancel",
  isLoggedIn,
  WrapAsync(bookingController.cancelBooking),
);

module.exports = router;
