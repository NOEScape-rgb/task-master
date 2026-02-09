  const bcrypt = require("bcryptjs");
  const { signToken, tempToken } = require("../utils/jwt");
  const User = require("../models/Users");
  const SECRET_KEY = process.env.SECRET_KEY;
  const { sendMail, sendVerificationMail } = require('../utils/email')
  const crypto = require("crypto");
  
  
  // Signin  user
  const getUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) throw new Error("User not found");
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    if(!user.isVerified) throw new Error("Please verify your Email first")
  
    const token = signToken({
      username: user.username,
      email : user.email,
      id: user._id,
      role: user.role,
    });
  
    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  };
  
  // resetting user password
  const reset = async (username, password) => {
    const newhashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { username },
      { password: newhashedPassword },
      { new: true },
    );
    if (!user) throw new Error("User not found");
    return user;
  };
  
  // create new user
  const createUser = async ({ username, email, password }) => {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
  
    // Checking if a user exists!
    if (existingUser) throw new Error("User already exists");
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
    const user = await User.create({
      username,
      email,
      role: "user",
      password: hashedPassword,
      verificationToken : hashedToken,
      verificationTokenExpires : Date.now() + 24*60*60*1000 // 1 day
    });
    
    const subject = "Email verification Link";
    const verificationLink = process.env.FRONT_END_URL + `/verify-email?token=${verificationToken}`
    const message = `
      Email verification.
    
        Click the link below to verify your Email:
        ${verificationLink}
    
        This link will expire in less than 1 day.
      `;
    // send token via email
    try {
      await sendVerificationMail(email, subject, message, verificationLink);
    } catch (err) {
      console.error("Verification email failed:", err.message);
    }
    
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  };
  
  const updateUser = async (username, newEmail) => {
    const user = await User.findOneAndUpdate(
      { username },
      { email: newEmail },
      { new: true },
    );
  
    if (!user) throw new Error("User not found");
    return user;
  };
  
  // generate temp reset token
  const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
  
    // generate JWT token, expires in 15 minutes
    const token = tempToken({ id: user._id, username: user.username, role: user.role });
    const subject = "Password reset link";;
    const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${token}`;
    const message = `
        You requested a password reset.
    
        Click the link below to reset your password:
        ${resetLink}
    
        This link will expire in 15 minutes.
      `;
    // send token via email
    try {
      await sendMail(email, subject, message, resetLink);
    } catch (err) {
      console.error("password reset email failed:", err.message);
    }

    return true;
  };
 
  
  
const verifyEmail = async (token) => {
  const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOneAndUpdate(  {
        verificationToken: hashedToken,
        verificationTokenExpires: { $gt: Date.now() },
        isVerified: false
       },
       {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null
          },
      {new : true},);
    if (!user) throw new Error("Invalid or expired verification token");
    
    return user;
    
  }
  module.exports = {
    getUser,
    reset,
    createUser,
    updateUser,
    forgotPassword,
    verifyEmail
  };
