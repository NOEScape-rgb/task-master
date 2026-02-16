const userServices = require("../services/userServices");
const User = require("../models/Users");
const cloudinary = require('cloudinary').v2;
// controller for signUp a user
const createUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({
        isStatus: false,
        msg: "Please provide all required fields",
        data: null,
      });

    await User.deleteMany({
      $or: [{ email }, { username }],
      isVerified: false,
      verificationTokenExpires: { $lt: Date.now() }, // Expired tokens ONLY
    });
    const result = await userServices.createUser({ username, email, password });

    res.status(201).json({
      isStatus: true,
      msg: "User created successfully",
      data: result.user,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res
        .status(409)
        .json({ isStatus: false, msg: error.message, data: null });
    }
    res.status(500).json({
      isStatus: false,
      msg: error.message || "Internal Server Error",
      data: null,
    });
  }
};

//controller for updating user info

const updateUserController = async (req, res) => {
  try {
    const { username } = req.params; // The "current" username from the URL
    const { newEmail } = req.body; // The "new" data

    const user = await userServices.updateUser(username, newEmail);
    res
      .status(200)
      .json({ isStatus: true, msg: "Updated successfully", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ isStatus: false, msg: error.message || "Internal Server Error" });
  }
};

// controller for resetting password
const jwt = require("jsonwebtoken");

const resetPasswordUserController = async (req, res) => {
  try {
    const { password } = req.body;

    const token = req.body.token || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        isStatus: false,
        msg: "Unauthorized: No token provided.",
        data: null,
      });
    }

    if (!password) {
      return res.status(400).json({
        isStatus: false,
        msg: "New password is required",
        data: null,
      });
    }

    // 2. Verify Token & Get User
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.username;

    if (!username) {
      return res.status(403).json({
        isStatus: false,
        msg: "Invalid Token payload",
      });
    }

    // 3. Perform Reset
    await userServices.reset(username, password);

    return res.status(200).json({
      isStatus: true,
      msg: "Password updated successfully",
      data: null,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        isStatus: false,
        msg: "Session or link has expired. Please login or request a new link.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        isStatus: false,
        msg: "Invalid token.",
      });
    }

    return res.status(500).json({
      isStatus: false,
      msg: error.message || "Internal Server Error",
      data: null,
    });
  }
};

// controller for logging in a user
const getUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        isStatus: false,
        msg: "Please provide email and password",
        data: null,
      });
    const result = await userServices.getUser(email, password);

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      // If in production (HTTPS), use Secure. In dev (HTTP), do not.
      secure: process.env.NODE_ENV === "production",

      // FIX: dynamic sameSite. 'Lax' allows localhost cookies. 'None' is for cross-site prod.
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(200)
      .json({ isStatus: true, msg: "Login successfully", data: result.user });
  } catch (error) {
    if (error.message === "User not found") {
      return res
        .status(404)
        .json({ isStatus: false, msg: error.message, data: null });
    }
    if (error.message === "Invalid credentials") {
      return res
        .status(401)
        .json({ isStatus: false, msg: error.message, data: null });
    }
    if (error.message === "Please verify your Email first") {
      return res.status(403).json({
        isStatus: false,
        msg: error.message,
      });
    }
    res.status(500).json({
      isStatus: false,
      msg: error.message || "Internal Server Error",
      data: null,
    });
  }
};

// controller for logging out a user
const logoutController = (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ isStatus: true, msg: "Logged out successfully", data: null });
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ isStatus: false, msg: "Email required" });

    const result = await userServices.forgotPassword(email);

    // In production, send the token via email
    res.status(200).json({
      isStatus: true,
      msg: "Reset token generated. (Send via email )",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ isStatus: false, msg: error.message });
  }
};
const changePasswordController = async (req, res) => {
  try {
    const { password } = req.body;
    const username = req.user.username;
    if (!username)
      return res
        .status(400)
        .json({ isStatus: false, msg: "username is missing" });
    if (!password)
      return res
        .status(400)
        .json({ isStatus: false, msg: "password is missing" });

    const result = await userServices.reset(username, password);

    // In production, send the token via email
    res.status(200).json({
      isStatus: true,
      msg: "password is sucessfully changed",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ isStatus: false, msg: error.message });
  }
};

const getProfileController = async (req, res) => {
  try {
    // fetch full user data to ensure we have latest fields
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ isStatus: false, msg: "User not found" });
    }

    res.status(200).json({
      isStatus: true,
      msg: "User is authenticated",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ isStatus: false, msg: error.message });
  }
};

// controller for verification Email

const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token)
      return res.status(400).json({ isStatus: false, msg: "token is missing" });
    const user = await userServices.verifyEmail(token);
    res.status(201).json({
      isStatus: true,
      message: "user Sucessfully Verified",
      data: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ isStatus: false, msg: error.message });
  }
};

// upload user controoler
const updateProfileImageController = async (req, res) => {
  try {
    const { username } = req.params;

    const { profileImageUrl } = req.body; 
    if (!profileImageUrl) {
          return res.status(400).json({ isStatus: false, msg: "Image URL is required" });
        }

    const user = await userServices.updateProfileImage(username, profileImageUrl);

    res.status(200).json({
      isStatus: true,
      msg: "Profile image updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      isStatus: false,
      msg: error.message || "Internal Server Error",
    });
  }
};

const signImageController = async (req, res) => {
  try {
    // Generating  a current Unix timestamp (seconds)
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate the signature 
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'taskmaster_profile_images',
      },
      process.env.CLOUDINARY_API_SECRET
    );

    //  Returning  everything the client needs to talk to Cloudinary
    res.status(200).json({
      isStatus: true,
      msg: "Signature generated successfully",
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
      },
    });
  } catch (error) {
    res.status(500).json({
      isStatus: false,
      msg: "Failed to generate signature",
      error: error.message
    });
  }
};

module.exports = {
  createUserController,
  updateUserController,
  resetPasswordUserController,
  getUserController,
  logoutController,
  forgotPasswordController,
  getProfileController,
  changePasswordController,
  verifyEmailController,
  updateProfileImageController,
  signImageController
};
