if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//console.log(process.env.SECRET);
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const listingsRouter = require("./routing/listing.js");
const reviewsRouter = require("./routing/review.js");
const UserRouter = require("./routing/user.js");
const bookingsRouter = require("./routing/booking.js");
const dashboardRouter = require("./routing/dashboard");

const passport = require("passport");
require("./config/passport");
const User = require("./models/user");

const app = express();
app.set("trust proxy", 1);// trust first proxy
//  Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
// Home
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  // for dynamic path hightlighting
  res.locals.currentPath = req.path;
  // res.locals.currentUser = req.user;
  if (req.user) {
    res.locals.currentUser = await User.findById(req.user._id);
  } else {
    res.locals.currentUser = null;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.successmesg = req.flash("success");
  res.locals.errormesg = req.flash("error");
  res.locals.search = req.query.search || "";
  next();
});

//  MongoDB
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
main()
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.log(" DB Error:", err));

app.get("/", (req, res) => {
  res.redirect("/listings");
});
// listings
app.use("/listings", listingsRouter);
// review
app.use("/listings/:id/reviews", reviewsRouter);
// user
app.use("/users", UserRouter);
// booking
app.use("/bookings", bookingsRouter);
// dashboard
app.use("/dashboard", dashboardRouter);

//  404
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//  error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { err });
});

//  Server
// Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
