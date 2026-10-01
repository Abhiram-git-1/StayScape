const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const initData = require("./data");

const Listing = require("../models/listings");
const User = require("../models/user");

const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");

    await initDB();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();

    console.log("Connection closed");
  }
}

const initDB = async () => {
  try {
    // Delete old listings
    await Listing.deleteMany({});

    console.log("Old listings deleted");

    // Find host user
    const owner = await User.findOne({
      email: process.env.SEED_OWNER_EMAIL,
    });

    if (!owner) {
      throw new Error("Host user not found. Please create your account first.");
    }

    // Add owner to every listing
    const updatedData = initData.data.map((item) => ({
      ...item,

      category: item.category.trim().toLowerCase(),

      owner: owner._id,
    }));

    await Listing.insertMany(updatedData);

    console.log(`Inserted ${updatedData.length} listings`);
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

main();
