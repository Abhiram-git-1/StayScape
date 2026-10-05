const Booking = require("../models/booking");
const Listing = require("../models/listings");
const {
  sendBookingEmail,
  sendHostBookingAlert,
  sendCancellationEmail,
} = require("../utils/sendEmail");
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const { checkIn, checkOut } = req.body;

  // Convert into Date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Prevent invalid dates
  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out must be after check-in!");
    return res.redirect(`/listings/${id}`);
  }

  // Calculate nights
  const diffTime = checkOutDate - checkInDate;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate total price
  const totalPrice = nights * listing.price;

  const existingBooking = await Booking.findOne({
    listing: listing._id,
    status: "confirmed",
    checkIn: {
      $lt: checkOutDate,
    },
    checkOut: {
      $gt: checkInDate,
    },
  });

  if (existingBooking) {
    req.flash(
      "error",
      "This listing is already booked for the selected dates!",
    );

    return res.redirect(`/listings/${id}`);
  }

  // Create booking
  const newBooking = new Booking({
    listing: listing._id,
    guest: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    totalPrice,
  });

  await newBooking.save();

  // Send confirmation email to guest
  let guestEmailSent = true;

  try {
    await sendBookingEmail(
      req.user.email,
      listing.title,
      checkInDate.toDateString(),
      checkOutDate.toDateString(),
      totalPrice,
    );
  } catch (emailError) {
    guestEmailSent = false;
    console.error("Booking confirmation email failed:", emailError);
  }

  // Send booking alert to host
  try {
    await sendHostBookingAlert(
      listing.owner.email,
      req.user.username,
      listing.title,
      checkInDate.toDateString(),
      checkOutDate.toDateString(),
    );
  } catch (emailError) {
    console.error("Host booking alert email failed:", emailError);
  }

  // Flash message
  if (guestEmailSent) {
    req.flash(
      "success",
      "Booking confirmed! A confirmation email has been sent. If you don't see it in your inbox, please check your Spam or Junk folder.",
    );
  } else {
    req.flash(
      "success",
      "Booking confirmed! We couldn't send the confirmation email, but your booking was saved successfully.",
    );
  }

  // Final response — ONLY ONCE
  return res.redirect("/bookings/trips");
};
module.exports.renderTrips = async (req, res) => {
  const bookings = await Booking.find({
    guest: req.user._id,
  })
    .populate("listing")
    .sort({ createdAt: -1 });

  const today = new Date();

  bookings.forEach((booking) => {
    if (booking.status === "cancelled") {
      booking.displayStatus = "Cancelled";
    } else if (today >= booking.checkOut) {
      booking.displayStatus = "Completed";
    } else if (today >= booking.checkIn && today < booking.checkOut) {
      booking.displayStatus = "Active";
    } else {
      booking.displayStatus = "Upcoming";
    }
  });

  res.render("bookings/trips", { bookings });
};
module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId).populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/trips");
  }

  // Security check
  if (!booking.guest.equals(req.user._id)) {
    req.flash("error", "Unauthorized action!");
    return res.redirect("/bookings/trips");
  }

  booking.status = "cancelled";

  await booking.save();

  // Send cancellation email
  let emailSent = true;

  try {
    await sendCancellationEmail(
      req.user.email,
      booking.listing.title,
    );
  } catch (emailError) {
    emailSent = false;
    console.error("Cancellation email failed:", emailError);
  }

  if (emailSent) {
    req.flash(
      "success",
      "Booking cancelled successfully! A cancellation email has been sent. If you don't see it in your inbox, please check your Spam or Junk folder.",
    );
  } else {
    req.flash(
      "success",
      "Booking cancelled successfully! However, we couldn't send the cancellation email.",
    );
  }

  res.redirect("/bookings/trips");
};
