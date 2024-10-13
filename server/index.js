const express = require("express");
const app = express();
const { dbConnect } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/User");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const BulkUploadRoutes = require("./routes/bulkUpload");
var cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// https://role-base-app.vercel.app
// "http://localhost:3000"
// ["https://role-base-app.vercel.app", "https://transaction-app-ochre.vercel.app"]

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);



dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1", BulkUploadRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
