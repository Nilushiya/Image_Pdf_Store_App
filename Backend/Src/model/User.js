const db = require('../config/db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_address: {
      type: String,
      required: true
  },
  phone_no: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true ,
    lowercase : true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  profile_image: {
    type: String, 
    required: false 
  },
  registered_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
