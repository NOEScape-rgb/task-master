const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: [true, "username is require"],
    trim: true,
    minlength: 3,
    unique: true,
  },
  email: {
    type: String,
    require: [true, "email is require"],
    lowercase: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength : 6,
      select: false 
  },
  isVerified: {
    type: Boolean,
    default : false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  }, {
    
  timestamps: true
    });

const User = mongoose.model('User', userSchema);

module.exports = User;
