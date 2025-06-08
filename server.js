const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/learngen', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user by email
app.get('/api/users/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Add achievement
app.post('/api/users/:email/achievements', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.achievements.push(req.body);
  await user.save();
  res.json(user);
});

// Add record
app.post('/api/users/:email/records', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.records.push(req.body);
  await user.save();
  res.json(user);
});

app.listen(3000, () => console.log('Server running on port 3000'));