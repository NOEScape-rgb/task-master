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
  getProfileController,
  changePasswordController,
  verifyEmailController
} = require("../controllers/userControllers");



// for users
// for users
router.post("/signup", createUserController);
router.post("/login", getUserController);
router.post("/logout", logoutController);
router.patch("/password", resetPasswordUserController);
router.post("/forgot-password", forgotPasswordController);

router.get("/me", verifyUser, getProfileController);
router.patch("/change-password", verifyUser, changePasswordController);
router.get("/verify-email", verifyEmailController)

router.patch("/:username", verifyUser, updateUserController);

module.exports = router;


