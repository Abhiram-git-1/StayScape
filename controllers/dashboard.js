const Listing = require("../models/listings");

const Booking = require("../models/booking");

module.exports.renderDashboard = async (req, res) => {
  // Get all listings created by current host
  const listings = await Listing.find({
    owner: req.user._id,
  });

  // Extract listing IDs
  const listingIds = listings.map((listing) => listing._id);

  // Find bookings for host listings
  const bookings = await Booking.find({
    listing: {
      $in: listingIds,
    },
  })
    .populate("listing")
    .populate("guest")
    .sort({ createdAt: -1 });

  // Active bookings
  const activeBookings = bookings.filter(
    (booking) => booking.status === "confirmed",
  );

  // Cancelled bookings
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled",
  );

  // Revenue
  const totalRevenue = activeBookings.reduce(
    (sum, booking) => sum + booking.totalPrice,
    0,
  );

  res.render("dashboard/index", {
    listings,

    bookings,

    activeBookings,

    cancelledBookings,

    totalRevenue,
  });
};
