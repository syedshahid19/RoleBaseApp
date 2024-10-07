const express = require("express");
const app = express();
const { dbConnect } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/User");
const googleRoutes = require("./routes/googleUser");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const passport = require('passport');
var cors = require("cors");
const MongoStore = require('connect-mongo');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl: process.env.DATABASE_URL,
        collectionName: "sessions", // Optional: specify the collection name for sessions
      }),
      cookie: { secure: false }, // Set secure: true if using HTTPS
    })
);


// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/", googleRoutes);

app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
