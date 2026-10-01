const express = require("express");
const WrapAsync = require("../utils/WrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares.js");
const reviewsController = require("../controllers/reviews.js");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  validateReview,
  WrapAsync(reviewsController.createReview),
);

// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(reviewsController.deleteReview),
);

module.exports = router;
