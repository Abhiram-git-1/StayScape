const mongoose = require("mongoose");
const Review = require("./Reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    min: 0,
  },

  location: {
    type: String,
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  // NEW: Geometry field for map coordinates
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      // default: [78.4867, 17.385] // default (Hyderabad for now)
      required: true,
    },
  },
  reviews: [
    // one to many relationship array of reviews in form of object_id
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    // many listings --> one user
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Virtual for safer image rendering
listingSchema.virtual("imageUrl").get(function () {
  return (
    this.image?.url ||
    "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  );
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
