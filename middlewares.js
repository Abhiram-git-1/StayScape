const Listing = require("./models/listings");
const Review = require("./models/Reviews.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // if the user is not logined then it always redirects to the login page after login it redirects to the listings page
    // so to avoid this we store redirecturl in session
    req.session.returnToUrl = req.originalUrl; // if user want to access some page like edit,newlisting, this needs login first so after login it should redirect to what the user want to access
    req.flash("error", "You must be signed in first!");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.saveReturnToUrl = (req, res, next) => {
  if (req.session.returnToUrl) {
    res.locals.returnToUrl = req.session.returnToUrl;
    delete req.session.returnToUrl; // prevents reuse bugs
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  }
  next();
};

/**
 * Validate Review
 * This middleware validates the review body against the review schema.
 * If the validation fails, it throws an ExpressError with a 400 status code and an error message containing the validation errors.
 * If the validation succeeds, it calls the next middleware.
 */

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isHost = (req, res, next) => {
  if (req.user.role !== "host") {
    req.flash("error", "Only hosts can access this page!");

    return res.redirect("/listings");
  }

  next();
};
