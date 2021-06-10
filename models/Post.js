const mongoose = require('mongoose');

// Define schema
const postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: {
      when: { type: Date, required: true },
      user: { type: String, required: true, trim: true }
    },
    required: true,
    trim: true
  },
  updated: {
    type: {
      when: { type: Date, required: true },
      user: { type: String, required: true, trim: true }
    },
    required: false,
    trim: true
  },
  deleted: {
    type: {
      when: { type: Date, required: true },
      user: { type: String, required: true, trim: true }
    },
    required: false,
    trim: true
  },
});

module.exports = mongoose.model('Post', postSchema);