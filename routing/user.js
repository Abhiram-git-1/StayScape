const express = require("express");
const router = express.Router();
const passport = require("passport");

const WrapAsync = require("../utils/WrapAsync");
const { saveReturnToUrl, isLoggedIn } = require("../middlewares");

const usersController = require("../controllers/users");

router
  .route("/signup")
  .get(usersController.renderSignup)
  .post(WrapAsync(usersController.signup));

router
  .route("/login")
  .get(usersController.renderLogin)
  .post(
    saveReturnToUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    WrapAsync(usersController.login),
  );

router.get("/logout", usersController.logout);

router
  .route("/forgot-password")
  .get(usersController.renderForgotPassword)
  .post(WrapAsync(usersController.forgotPassword));

router
  .route("/reset-password/:token")
  .get(WrapAsync(usersController.renderResetPassword))
  .post(WrapAsync(usersController.resetPassword));

router.put("/become-host", isLoggedIn, WrapAsync(usersController.becomeHost));

// GOOGLE AUTH
router.get(
  "/google",

  passport.authenticate(
    "google",

    {
      scope: ["profile", "email"],
    },
  ),
);

router.get(
  "/google/callback",

  passport.authenticate(
    "google",

    {
      failureRedirect: "/users/login",

      failureFlash: true,
    },
  ),

  (req, res) => {
    req.flash(
      "success",

      "Logged in with Google!",
    );

    res.redirect("/listings");
  },
);

//EMAIL VERIFICATION
router.get(
  "/verify/:token",

  WrapAsync(usersController.verifyEmail),
);

module.exports = router;

router.post(
  "/resend-verification",
  WrapAsync(usersController.resendVerificationEmail),
);
