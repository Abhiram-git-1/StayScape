const Listing = require("../models/listings");
const Booking = require("../models/booking");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");
const mapboxClient = require("@mapbox/mapbox-sdk");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const client = mapboxClient({
  accessToken: process.env.MAP_TOKEN,
});

const geocodingClient = mbxGeocoding(client);
module.exports.index = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // Category filter
    if (category) {
      filter.category = category.toLowerCase();
    }

    // Search filter (title + location)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // const listings = await Listing.find(filter);

    const page = parseInt(req.query.page) || 1;

    const limit = 8;

    const listings = await Listing.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalListings = await Listing.countDocuments(filter);

    const hasMore = page * limit < totalListings;
    // Get unique categories for filters UI
    const categories = await Listing.distinct("category");

    res.render("listings/index", {
      listings,
      categories,
      category,
      search,
      page,
      hasMore,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  // normalize category
  newListing.category = newListing.category.trim().toLowerCase();

  newListing.image = { url, filename };
  newListing.owner = req.user._id;

  newListing.geometry = response.body.features[0].geometry;
  console.log(response.body.features[0].geometry);
  await newListing.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid Listing ID!");

    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Cannot find listing!");
    return res.redirect("/listings");
  }

  // Find confirmed bookings
  const bookings = await Booking.find({
    listing: listing._id,

    status: "confirmed",
  });

  // Store booked dates
  const bookedDates = [];

  bookings.forEach((booking) => {
    let current = new Date(booking.checkIn);

    while (current < booking.checkOut) {
      bookedDates.push(current.toISOString().split("T")[0]);

      current.setDate(current.getDate() + 1);
    }
  });

  res.render("listings/show", {
    listing,

    bookedDates,

    mapToken: process.env.MAP_TOKEN,
  });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid Listing ID!");
    return res.redirect("/listings");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find listing!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/c_fill,w_250,e_blur:100",
  );

  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid Listing ID!");
    return res.redirect("/listings");
  }

  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.listing.location}, ${req.body.listing.country}`,
      limit: 1,
    })
    .send();

  let listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true },
  );

  if (!listing) {
    req.flash("error", "Cannot find listing!");
    return res.redirect("/listings");
  }

  // update geometry
  if (response.body.features.length) {
    listing.geometry = response.body.features[0].geometry;
  }

  // update image if uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
  }

  // IMPORTANT
  await listing.save();

  req.flash("success", "Successfully updated listing!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    req.flash("error", "Invalid Listing ID!");
    return res.redirect("/listings");
  }

  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash("error", "Cannot find listing!");
    return res.redirect("/listings");
  }
  req.flash("success", "Successfully deleted listing!");
  res.redirect("/listings");
};

module.exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;

  // current logged in user
  const user = await User.findById(req.user._id);

  // check if listing already exists in favorites
  const isFavorite = user.favorites.includes(id);

  if (isFavorite) {
    // REMOVE from favorites
    user.favorites.pull(id);

    req.flash("success", "Removed from favorites!");
  } else {
    // ADD to favorites
    user.favorites.push(id);

    req.flash("success", "Added to favorites!");
  }

  await user.save();

  // res.redirect("back");
  res.redirect(req.get("referer") || "/listings");
};

module.exports.renderFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");

  res.render("listings/favorites", {
    favorites: user.favorites,
  });
};
