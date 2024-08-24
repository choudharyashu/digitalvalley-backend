
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'VIEWER'],
    default: 'VIEWER',
  },
  mobile: {
    type: String,
    required: true,
    maxlength: 10, // Ensure the mobile number is at most 10 digits
  },
  resetToken: {
    type: String
  },
  resetTokenExpires: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
