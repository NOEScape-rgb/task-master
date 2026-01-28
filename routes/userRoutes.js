const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  getUserController,
  createUserController,
  updateUserController,
  resetPasswordUserController,
  logoutController,
  forgotPasswordController,
} = require("../controllers/userControllers");

// for users
router.post("/signup", createUserController);
router.post("/login", getUserController);
router.post("/logout", logoutController);
router.patch("/:username", verifyUser, updateUserController);
router.patch("/:username/password", verifyUser, resetPasswordUserController);
router.post("/forgot-password", forgotPasswordController);

module.exports = router;
