const db = require('../config/db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  user_address:{
    type: String,
    required: true
  },
//   user_address: {
//     street: {
//       type: String,
//       required: true
//     },
//     no: {
//       type: String,
//       required: true
//     },
//     city: {
//       type: String,
//       required: true
//     }
//   },
  phone_no: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  registered_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
