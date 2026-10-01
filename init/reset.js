const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");

const User = require("../models/user");
const Listing = require("../models/listings");
const Review = require("../models/review");
const Booking = require("../models/booking");

const MONGO_URL = process.env.MONGO_URL;

async function resetDB() {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");
    console.log("Starting database reset...");

    await Booking.deleteMany({});
    console.log("Bookings deleted");

    await Review.deleteMany({});
    console.log("Reviews deleted");

    await Listing.deleteMany({});
    console.log("Listings deleted");

    await User.deleteMany({});
    console.log("Users deleted");

    // Delete sessions directly from MongoDB
    if (mongoose.connection.db) {
      await mongoose.connection.db.collection("sessions").deleteMany({});
      console.log("Sessions deleted");
    }

    console.log("=================================");
    console.log("Database reset completed");
    console.log("Users:     0");
    console.log("Listings:  0");
    console.log("Bookings:  0");
    console.log("Reviews:   0");
    console.log("Sessions:  0");
    console.log("=================================");
  } catch (err) {
    console.error("Error resetting database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
  }
}

resetDB();
