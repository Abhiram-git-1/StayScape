const express = require("express");
const WrapAsync = require("../utils/WrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  isHost,
} = require("../middlewares.js");
const listingsController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const router = express.Router();

// Joi Validation -> validateListing

router
  .route("/") // for common path we use router.route
  .get(WrapAsync(listingsController.index)) //index
  .post(
    isLoggedIn,
    isHost,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingsController.createListing),
  ); //create
// .post(upload.single("listing[image]"),(req,res)=>{
//     console.log(req.body);
//     res.send(req.file);
// })

//  NEW
router.get("/new", isLoggedIn, isHost, listingsController.renderNewForm);

router.post(
  "/:id/favorite",
  isLoggedIn,
  WrapAsync(listingsController.toggleFavorite),
);

router.get(
  "/favorites",
  isLoggedIn,
  WrapAsync(listingsController.renderFavorites),
);

router
  .route("/:id")
  .get(WrapAsync(listingsController.showListing)) //show
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingsController.updateListing),
  ) //update
  .delete(isLoggedIn, isOwner, WrapAsync(listingsController.deleteListing)); //delete

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingsController.editListing),
);

module.exports = router;
