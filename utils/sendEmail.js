const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // transport is used to connect smtp server and node js to send email with the given credentials
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

//WELCOME EMAIL
module.exports.sendWelcomeEmail = async (
  userEmail,

  username,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: userEmail,

    subject: "Welcome to StayScape! ",

    html: `

            <h2>
                Welcome ${username} to StayScape!
            </h2>

            <p>
                Thank you for joining StayScape.
            </p>

            <p>
                Explore stays, book trips,
                and create unforgettable memories.
            </p>

        `,
  });
};

// BOOKING CONFIRMATION
module.exports.sendBookingEmail = async (
  userEmail,

  listingTitle,

  checkIn,

  checkOut,

  totalPrice,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: userEmail,

    subject: "Booking Confirmed ",

    html: `

            <h2>
                Booking Confirmed
            </h2>

            <p>
                Your booking for
                <b>${listingTitle}</b>
                is confirmed.
            </p>

            <p>
                Check-in:
                ${checkIn}
            </p>

            <p>
                Check-out:
                ${checkOut}
            </p>

            <p>
                Total:
                ₹${totalPrice}
            </p>

        `,
  });
};

// BOOKING CANCELLATION
module.exports.sendCancellationEmail = async (
  userEmail,

  listingTitle,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: userEmail,

    subject: "Booking Cancelled",

    html: `

            <h2>
                Booking Cancelled
            </h2>

            <p>
                Your booking for
                <b>${listingTitle}</b>
                has been cancelled.
            </p>

        `,
  });
};

// HOST BOOKING ALERT
module.exports.sendHostBookingAlert = async (
  hostEmail,

  guestName,

  listingTitle,

  checkIn,

  checkOut,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: hostEmail,

    subject: "New Booking Received ",

    html: `

            <h2>
                New Reservation
            </h2>

            <p>
                <b>${guestName}</b>
                booked your listing:
                <b>${listingTitle}</b>
            </p>

            <p>
                ${checkIn} → ${checkOut}
            </p>

        `,
  });
};

//RESET PASSWORD EMAIL
module.exports.sendResetPasswordEmail = async (userEmail, resetURL) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: userEmail,

    subject: "Reset Your StayScape Password",

    html: `

            <h2>
                Password Reset Request
            </h2>

            <p>
                You requested a password reset.
            </p>

            <p>
                Click below to reset your password:
            </p>

            <a href="${resetURL}">
                Reset Password
            </a>

            <p>
                This link expires in 10 minutes.
            </p>

            <p>
                If you did not request this,
                please ignore this email.
            </p>

        `,
  });
};

//EMAIL VERIFICATION
module.exports.sendVerificationEmail = async (
  userEmail,

  verificationURL,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: userEmail,

    subject: "Verify Your StayScape Account",

    html: `

            <h2>
                Verify Your Email
            </h2>

            <p>
                Thank you for signing up on StayScape.
            </p>

            <p>
                Please verify your email by clicking below:
            </p>

            <a href="${verificationURL}">
                Verify Email
            </a>

            <p>
                This link is required to activate your account.
            </p>

        `,
  });
};
