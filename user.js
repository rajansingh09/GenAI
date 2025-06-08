const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date
});

const recordSchema = new mongoose.Schema({
  type: String, // e.g., "quiz", "course"
  details: Object,
  date: Date
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hash in production!
  grade: String,
  avatar: String,
  isNewUser: { type: Boolean, default: true },
  achievements: [achievementSchema],
  records: [recordSchema]
});

module.exports = mongoose.model('User', userSchema);