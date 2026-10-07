# StayScape

> Find a place. Book a stay. Make it yours.

**StayScape** is a full-stack vacation rental platform where users can discover stays, search and filter listings, explore properties on an interactive map, save favorites, leave reviews, and manage bookings.

The project originally started as **Basic CRUD App**, an Airbnb-inspired application. As the project grew into a more complete real-world web application, it was renamed to **StayScape**.

The purpose of this project was not just to build another CRUD application. I wanted to understand how the pieces of a real web application fit together — authentication, authorization, databases, file uploads, maps, bookings, email notifications, validation, security, and production deployment.

🌐 **Live Demo:** https://stayscape-dqmb.onrender.com/

---

## Features

### Listings

- Create, view, edit, and delete listings
- Upload multiple listing images
- Store images using Cloudinary
- View listing locations on an interactive map
- Dynamically generated listing categories
- Listing ownership authorization

### Search & Filters

- Search listings by text
- Filter listings by category
- Dynamic category navigation
- Combined search and filtering
- Infinite scrolling
- Map-based listing exploration

### Favorites

Users can save listings they are interested in.

- Add listings to favorites
- Remove listings from favorites
- View all saved listings
- Favorites persist in MongoDB

### Booking System

Users can select check-in and check-out dates and book a listing.

The booking system handles:

- Check-in and check-out date selection
- Date validation
- Number of nights calculation
- Booking price calculation
- Already-booked date detection
- Overlapping booking prevention
- Booking creation
- Booking cancellation
- My Trips
- Booking confirmation emails
- Host booking notifications
- Cancellation emails

A listing cannot be booked by multiple users for overlapping confirmed dates.

### Reviews & Ratings

Users can leave reviews and ratings for listings.

- Create reviews
- Add ratings
- View reviews
- Delete own reviews
- Ownership authorization

### Authentication

StayScape includes both local and Google authentication.

#### Local Authentication

- Sign up
- Login
- Logout
- Password hashing
- Email verification
- Resend verification email
- Forgot password
- Reset password
- Password strength validation
- Password confirmation

#### Google OAuth

Users can also sign in using **Google OAuth 2.0**.

Authentication and sessions are handled using Passport.js and Express Session.

###  Authorization & Roles

StayScape uses role-based access control with:

- `guest`
- `host`
- `admin`

Authentication determines who the user is, while authorization determines what the user is allowed to do.

Protected actions include:

- Listing management
- Listing ownership
- Review deletion
- Booking management
- Host functionality

Users can also use the **Become Host** functionality.

###  Image Uploads

Listing images are stored using **Cloudinary**.

The application supports:

- Multiple image uploads
- Image updates
- Image deletion
- Persistent Cloudinary image URLs

### Maps & Location

StayScape uses **Mapbox** for location and geocoding.

Listing addresses are converted into geographic coordinates and stored using GeoJSON `Point` data.

The map supports:

- Listing markers
- Popups
- Navigation
- Fly-to interactions
- Listing location visualization

### Email Notifications

StayScape sends email notifications for important actions:

- Welcome emails
- Email verification
- Booking confirmation
- Booking cancellation
- Host booking alerts
- Password reset

Email delivery is handled through the **Mailjet API**.

> Depending on the recipient's email provider, messages may sometimes appear in Spam or Junk.

---

# Tech Stack

StayScape uses a server-rendered architecture built around Node.js, Express, EJS, and MongoDB.

### Frontend

- HTML
- CSS
- JavaScript
- Bootstrap
- EJS
- EJS-Mate
- Flatpickr

### Backend

- Node.js
- Express.js
- Passport.js
- Passport Local
- Passport Local Mongoose
- Passport Google OAuth 2.0
- Express Session
- Connect-Mongo

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### External Services

- Cloudinary — image storage
- Mapbox — geocoding and maps
- Mailjet — email delivery
- Google OAuth — authentication
- Render — deployment

### Security & Validation

- Helmet
- CORS
- Joi
- Secure cookies
- Session-based authentication
- Password hashing
- Role-based authorization
- Input validation

---

#  Architecture

StayScape follows a server-rendered MVC-style architecture.

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │   HTML / CSS / JS    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Express        │
                         │       Routes         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Controllers      │
                         │    Business Logic    │
                         └───────┬───────┬──────┘
                                 │       │
                       ┌─────────┘       └─────────┐
                       ▼                           ▼
              ┌──────────────────┐       ┌──────────────────┐
              │     MongoDB      │       │  External APIs   │
              │     Mongoose     │       │                  │
              └──────────────────┘       │ Cloudinary       │
                                         │ Mapbox           │
                                         │ Mailjet          │
                                         │ Google OAuth     │
                                         └──────────────────┘
```

### Request Flow

```text
Browser
   ↓
Express Route
   ↓
Middleware
   ↓
Controller
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Controller
   ↓
EJS View
   ↓
Browser
```

---

# 📁 Project Structure

```text
StayScape/
│
├── controllers/
│   ├── bookingsController.js
│   ├── listingsController.js
│   └── usersController.js
│
├── models/
│   ├── booking.js
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
│
├── routes/
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── bookings/
│   ├── users/
│   └── includes/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│   ├── sendEmail.js
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── middleware.js
├── schema.js
├── cloudConfig.js
├── mapConfig.js
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

### Main Responsibilities

| Directory / File | Responsibility |
|---|---|
| `controllers/` | Application and business logic |
| `models/` | MongoDB / Mongoose schemas |
| `routes/` | Express route definitions |
| `views/` | Server-rendered EJS pages |
| `public/` | CSS and client-side JavaScript |
| `utils/` | Reusable utilities such as email and error helpers |
| `middleware.js` | Authentication, authorization, and request middleware |
| `schema.js` | Joi validation schemas |
| `cloudConfig.js` | Cloudinary configuration |
| `mapConfig.js` | Mapbox configuration |
| `app.js` | Main Express application |

---

# 🔐 Environment Variables

StayScape uses environment variables for credentials, secrets, and external services.

Create a `.env` file in the project root.

```env
MONGO_URL=

SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

MAP_TOKEN=

MAILJET_API_KEY=
MAILJET_SECRET_KEY=
EMAIL_FROM=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

BASE_URL=

SEED_OWNER_EMAIL=
```

For local development:

```env
BASE_URL=http://localhost:8080
```

For production, `BASE_URL` should point to the deployed StayScape URL.

**Never commit `.env` to GitHub.**

The repository includes `.env.example` so the required variable names are visible without exposing credentials.

---

# Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Abhiram-git-1/StayScape.git
```

### 2. Enter the project directory

```bash
cd StayScape
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the environment file

Create a `.env` file in the project root and add the required environment variables.

Example:

```env
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

MAP_TOKEN=your_mapbox_token

MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
EMAIL_FROM=your_verified_sender_email

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

BASE_URL=http://localhost:8080

SEED_OWNER_EMAIL=your_email
```

### 5. Start the development server

```bash
npm run dev
```

Or:

```bash
npm start
```

The application will be available at:

```text
http://localhost:8080
```

---

# Deployment

StayScape is deployed using **Render**.

### Production Services

| Service | Purpose |
|---|---|
| Render | Application hosting |
| MongoDB Atlas | Database |
| Cloudinary | Image storage |
| Mapbox | Maps and geocoding |
| Mailjet | Email delivery |
| Google OAuth | Authentication |

### Live Application

🌐 https://stayscape-dqmb.onrender.com/

The production server uses Render's dynamically assigned `PORT`.

The application also uses production-specific settings such as secure cookies and proxy support.

---

# Security

Security was treated as part of the application rather than something added only at the end.

StayScape includes:

- Password hashing
- Secure session management
- MongoDB-backed sessions
- Secure cookies in production
- Helmet security headers
- CORS configuration
- Joi input validation
- Authentication middleware
- Authorization middleware
- Role-based access control
- Listing ownership checks
- Review ownership checks
- Protected booking actions
- Password reset tokens
- Email verification
- Google OAuth
- Environment-based secret management

---

#  Application Checklist

### Authentication

- [x] User registration
- [x] Login
- [x] Logout
- [x] Password hashing
- [x] Email verification
- [x] Resend verification
- [x] Google OAuth
- [x] Forgot password
- [x] Reset password
- [x] Password validation

### Listings

- [x] Create listing
- [x] View listing
- [x] Edit listing
- [x] Delete listing
- [x] Multiple image uploads
- [x] Cloudinary integration
- [x] Mapbox integration
- [x] Search
- [x] Category filtering
- [x] Dynamic categories
- [x] Infinite scrolling
- [x] Interactive map

### Favorites

- [x] Add favorite
- [x] Remove favorite
- [x] Persistent favorites
- [x] Favorites page

### Reviews

- [x] Create review
- [x] Ratings
- [x] Delete own review
- [x] Review authorization

### Bookings

- [x] Check-in / check-out
- [x] Date validation
- [x] Night calculation
- [x] Price calculation
- [x] Booking conflict detection
- [x] Booked-date disabling
- [x] Booking creation
- [x] My Trips
- [x] Booking cancellation
- [x] Booking confirmation email
- [x] Host booking notification
- [x] Cancellation email

### Production

- [x] MongoDB Atlas
- [x] Cloudinary
- [x] Mapbox
- [x] Google OAuth
- [x] Mailjet
- [x] Environment variables
- [x] Render deployment
- [x] Production sessions
- [x] Secure cookies

---

#  What I Learned

StayScape started as a project to learn Node.js and Express.

It eventually became a much bigger learning experience.

While building it, I got hands-on experience with:

- MVC architecture
- Express routing
- Middleware
- MongoDB data modeling
- Mongoose relationships
- Authentication
- Authorization
- OAuth
- Session management
- MongoDB-backed sessions
- Password reset flows
- Email verification
- Role-based access control
- File uploads
- Cloudinary
- Mapbox geocoding
- GeoJSON
- Search and filtering
- Booking conflict detection
- Date calculations
- Client-side date pickers
- Input validation
- Error handling
- Security middleware
- Environment variables
- Production deployment
- Debugging production issues

One of the biggest lessons from this project was that getting an application to work locally is only part of the job.

Moving StayScape to production introduced a completely different set of challenges, including:

- Production environment variables
- MongoDB Atlas network access
- OAuth callback URLs
- Secure cookies behind a proxy
- Email provider restrictions
- Production email delivery
- Linux filename case sensitivity
- Render's dynamic port
- Production-only errors

Those issues ended up being some of the most valuable parts of the project because they forced me to understand what actually changes when an application moves from a local development environment to production.

---

#  Current Status

StayScape is currently a **deployed full-stack application**.

The core application includes:

- Authentication
- Google OAuth
- Role-based authorization
- Listing management
- Cloudinary image uploads
- Search
- Filters
- Favorites
- Reviews
- Ratings
- Mapbox maps
- Booking management
- Email notifications
- Production deployment

The project can continue to evolve with additional features and improvements as I learn more about building production-ready applications.

---

#  About

Built by **Abhiram Kasthuri**.

I'm a B.Tech student specializing in **AI & Data Science**, with a strong interest in software development, problem solving, full-stack development, and building practical applications.

StayScape started as an Airbnb-inspired learning project.

As the application grew, it became a much more complete project involving authentication, databases, authorization, cloud services, maps, bookings, email systems, security, and deployment.

The project represents my learning journey from building individual features to understanding how those features come together to form a complete web application.

---

# Final Note

StayScape started as **BASIC CRUD APPLICATION**.

As the application evolved, and the project became much more than the original idea.

I didn't want the end result to simply be:

> "I built an Airbnb clone."

I wanted to understand:

- How authentication works
- How users and roles are managed
- How data is modeled
- How bookings avoid conflicts
- How files are stored
- How maps are integrated
- How emails are delivered
- How security is handled
- How an application behaves in production

That's what StayScape represents.

**Find a place. Book a stay. Make it yours.**

---

# 📄 License

This project is licensed under the **MIT License**.
