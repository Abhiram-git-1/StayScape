const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // username and password are provided by passport-local-mongoose plugin with hash and salt
  email: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest",
  },

  favorites: [
    // one user --> many favourites listings
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],

  googleId: String,

  profilePicture: String,

  isVerified: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken: String,

  resetPasswordExpires: Date,

  verificationToken: String,
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

//pbkdf2 is the default hashing algorithm
