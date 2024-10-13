const express = require("express");
const app = express();
const { dbConnect } = require("./config/database");
const cookieParser = require("cookie-parser");
var cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/User");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const BulkUploadRoutes = require("./routes/bulkUpload");

// Use environment variables for configuration
const PORT = process.env.PORT || 3000;

// https://role-base-app.vercel.app
// "http://localhost:3000"
// ["https://role-base-app.vercel.app", "https://transaction-app-ochre.vercel.app"]

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect to the database
dbConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Route grouping for /api/v1 to avoid route duplication
app.use("/api/v1", authRoutes);
app.use("/api/v1", BulkUploadRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/user", userRoutes);

// Start the server and listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
