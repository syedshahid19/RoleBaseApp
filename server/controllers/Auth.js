const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup Controller for Registering Users
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // validating that all details present or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !accountType
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    // Checking of password and confim password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // check the user is already exits
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Check if user with the provided phone number already exists
    const existPhoneNumber = await User.findOne({ phoneNumber });
    if (existPhoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number is already registered. Please use a different phone number.",
      });
    }

    // Secure Password
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }

    // Create entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashPassword,
      accountType,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// login Controller for login Users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }

    // Finding the user with provided email
    let user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered with Us Please SignUp to Continue",
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
          firstName: user.firstName,
          phoneNumber: user.phoneNumber,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      // Save token to user document in database// Save the token
      user = user.toObject();
      user.token = token;
      user.password = undefined;

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Login Success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log("Internal Server Error", error);
    return res.status(500).json({
      success: false,
      message: "Login Failure Please Try Again",
    });
  }
};
