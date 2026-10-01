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
      // Existing booking starts before new checkout
      $lt: checkOutDate,
    },

    checkOut: {
      // Existing booking ends after new checkin
      $gt: checkInDate,
    },

    //Booking overlaps if:newCheckIn < existingCheckOut AND newCheckOut > existingCheckIn
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
  // Send confirmation email
  await sendBookingEmail(
    req.user.email,

    listing.title,

    checkInDate.toDateString(),

    checkOutDate.toDateString(),

    totalPrice,
  );

  // Send host booking alert
  await sendHostBookingAlert(
    listing.owner.email,

    req.user.username,

    listing.title,

    checkInDate.toDateString(),

    checkOutDate.toDateString(),
  );

  req.flash("success", "Booking confirmed!");

  res.redirect("/bookings/trips");
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
  const { bookingId } = req.params; // bookingID refers to the id of the booking we want to cancel

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

  await sendCancellationEmail(
    req.user.email,

    booking.listing.title,
  );

  req.flash("success", "Booking cancelled!");

  res.redirect("/bookings/trips");
};
