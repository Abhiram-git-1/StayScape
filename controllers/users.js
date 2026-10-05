const User = require("../models/user");
const {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("../utils/sendEmail");
const crypto = require("crypto");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const newuser = new User({ username, email, verificationToken });
    let registereduser = await User.register(newuser, password);

    const verificationURL = `${process.env.BASE_URL}/users/verify/${verificationToken}`;
    await sendVerificationEmail(registereduser.email, verificationURL);
    // console.log(registereduser);
    req.flash(
      "success",
      "Account created! A verification email has been sent. If you don't see it in your inbox, please check your Spam or Junk folder.",
    );
    res.redirect("/users/login");
  } catch (e) {
    console.log(e);
    req.flash(
      "error",
      "A user with that username or email already exists. Please try again.",
    );
    res.redirect("/users/signup");
  }
};

module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgotPassword");
};
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (user && !user.isVerified) {
    req.flash(
      "error",
      "Please verify your email before resetting your password.",
    );

    return res.redirect("/users/login");
  }

  if (!user) {
    req.flash("error", "No account found with that email.");

    return res.redirect("/users/forgot-password");
  }
  if (!user.isVerified) {
    req.flash(
      "error",
      "Please verify your email before resetting your password.",
    );

    return res.redirect("/users/login");
  }
  // Generate secure token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save token + expiry
  user.resetPasswordToken = resetToken;

  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Create reset URL
  const resetURL = `${process.env.BASE_URL}/users/reset-password/${resetToken}`;

  // Send email
  await sendResetPasswordEmail(user.email, resetURL);

  req.flash(
    "success",
    "If the email address is registered, a password reset email has been sent. Please check your Spam or Junk folder if you don't see it.",
  );
  res.redirect("/users/login");
};

module.exports.renderResetPassword = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,

    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    req.flash("error", "Password reset token is invalid or expired.");

    return res.redirect("/users/forgot-password");
  }

  res.render("users/resetPassword", { token });
};

module.exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;

  const { password, confirmPassword } = req.body;

  // Password match check
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");

    return res.redirect(`/users/reset-password/${token}`);
  }

  // Find valid token
  const user = await User.findOne({
    resetPasswordToken: token,

    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    req.flash("error", "Token invalid or expired.");

    return res.redirect("/users/forgot-password");
  }

  // Change password
  await user.setPassword(password);

  // Remove token
  user.resetPasswordToken = undefined;

  user.resetPasswordExpires = undefined;

  await user.save();

  // Auto login
  req.login(user, (err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Password reset successful!");

    res.redirect("/listings");
  });
};
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = async (req, res, next) => {
  if (!req.user.isVerified) {
    req.logout((err) => {
      if (err) return next(err);
    });

    req.flash("error", "Please verify your email before logging in.");

    return res.redirect("/users/login");
  }

  req.flash("success", "Welcome Back!");

  let redirectUrl = res.locals.returnToUrl || "/listings";

  res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "loggedOut!");
    res.redirect("/listings");
  });
};

module.exports.becomeHost = async (req, res) => {
  const user = req.user;

  // Already host
  if (user.role === "host") {
    req.flash("success", "You are already a host!");

    return res.redirect("/dashboard");
  }

  // Upgrade role
  user.role = "host";

  await user.save();

  req.flash("success", "Welcome! You are now a host.");

  res.redirect("/dashboard");
};

module.exports.verifyEmail = async (
  req,

  res,
) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
  });

  if (!user) {
    req.flash(
      "error",

      "Verification token is invalid or expired.",
    );

    return res.redirect("/users/login");
  }

  user.isVerified = true;

  user.verificationToken = undefined;

  await user.save();

  await sendWelcomeEmail(user.email, user.username);

  req.flash(
    "success",

    "Email verified successfully!",
  );

  res.redirect("/users/login");
};

module.exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No account found with that email.");

    return res.redirect("/users/login");
  }

  if (user.isVerified) {
    req.flash("success", "Your account is already verified.");

    return res.redirect("/users/login");
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  user.verificationToken = verificationToken;

  await user.save();

  const verificationURL = `${process.env.BASE_URL}/users/verify/${verificationToken}`;

  await sendVerificationEmail(user.email, verificationURL);

  req.flash(
    "success",
    "Verification email sent! If you don't see it in your inbox, please check your Spam or Junk folder.",
  );
  res.redirect("/users/login");
};
