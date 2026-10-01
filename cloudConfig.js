const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => ({
    folder: "wanderlust_DEV",

    allowedFormats: ["jpeg", "png", "jpg", "webp"],

    transformation: [
      {
        width: 1200,

        height: 800,

        crop: "fill",

        quality: "auto",

        fetch_format: "auto",
      },
    ],
  }),
});

module.exports = {
  cloudinary,
  storage,
};

// this file is for access the cloudinary
// for that we stored the cloudinary credintials and used here
// before uploading the file our code should have the access of cloud so we store there and it returns url
