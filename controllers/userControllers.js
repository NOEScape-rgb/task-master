const userServices = require("../services/userServices");

// controller for signUp a user
const createUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(400)
        .json({
          isStatus: false,
          msg: "Please provide all required fields",
          data: null,
        });
    const result = await userServices.createUser({ username, email, password });

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "none",
      // domain : "frontenddomaim.com"
    });

    res
      .status(201)
      .json({
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
    res
      .status(500)
      .json({
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
const resetPasswordUserController = async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({
          isStatus: false,
          msg: "Please provide new password",
          data: null,
        });
    await userServices.reset(username, password);
    res
      .status(200)
      .json({
        isStatus: true,
        msg: "Password reset Successfully ",
        data: null,
      });
  } catch (error) {
    res
      .status(500)
      .json({
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
      return res
        .status(400)
        .json({
          isStatus: false,
          msg: "Please provide email and password",
          data: null,
        });
    const result = await userServices.getUser(email, password);

    // Set HTTP-only cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
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
    res
      .status(500)
      .json({
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
      data: null,
    });
  } catch (error) {
    res.status(500).json({ isStatus: false, msg: error.message });
  }
};

module.exports = {
  createUserController,
  updateUserController,
  resetPasswordUserController,
  getUserController,
  logoutController,
  forgotPasswordController,
};
