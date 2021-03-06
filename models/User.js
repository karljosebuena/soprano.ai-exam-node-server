const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: {
      data: Buffer,
      contentType: String,
    },
    required: false,
    trim: true
  }
}, { timestamps: true });


// Hash password before save in DB
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
};


// Compare password
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
};


module.exports = mongoose.model('User', userSchema);